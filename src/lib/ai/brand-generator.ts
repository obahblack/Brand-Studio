import { openai } from '@/lib/openai'
import { ScrapedData } from '@/lib/scraper'
import { brandAnalysisPrompt } from './prompts/brand-analysis'
import { designSystemPrompt, brandColorSystemPrompt } from './prompts/design-system'
import { brandGuidelinesPrompt } from './prompts/brand-guidelines'
import { AI_MODEL } from './config'
import { generateFallbackDesignSystem, generateFallbackBrandAnalysis, generateFallbackGuidelines } from './fallback'
import { generateFallbackColorSystem, buildColorSystem } from './color-system-generator'
import type { BrandAnalysis, DesignSystem, ColorSystem } from '@/types/database'

interface GenerateBrandKitInput {
  brandName: string
  websiteUrl: string | null
  brandDescription: string | null
  scrapedData: ScrapedData | null
}

interface GenerateBrandKitOutput {
  brandAnalysis: BrandAnalysis
  designSystem: DesignSystem
  colorSystem: ColorSystem
  guidelines: Record<string, unknown>
}

function hasValidColors(obj: unknown): obj is { colors: Record<string, Record<string, string>> } {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'colors' in obj &&
    typeof (obj as Record<string, unknown>).colors === 'object' &&
    (obj as Record<string, unknown>).colors !== null
  )
}

export async function generateBrandKit(input: GenerateBrandKitInput): Promise<GenerateBrandKitOutput> {
  const { brandName, websiteUrl, brandDescription, scrapedData } = input

  // Step 1: Generate brand analysis
  const analysisPrompt = brandAnalysisPrompt
    .replace('{url}', websiteUrl || 'Not provided')
    .replace('{brandName}', brandName)
    .replace('{description}', brandDescription || 'Not provided')
    .replace('{colors}', JSON.stringify(scrapedData?.colors || {}))
    .replace('{fonts}', JSON.stringify(scrapedData?.fonts || {}))
    .replace('{pageTitle}', scrapedData?.title || 'Not available')
    .replace('{pageDescription}', scrapedData?.description || 'Not available')

  const analysisResponse = await openai.chat.completions.create({
    model: AI_MODEL,
    messages: [
      { role: 'system', content: 'You are a brand identity expert. Always respond with valid JSON.' },
      { role: 'user', content: analysisPrompt }
    ],
    temperature: 0.7,
    max_tokens: 2000
  })

  const analysisContent = analysisResponse.choices?.[0]?.message?.content || '{}'
  let brandAnalysis: BrandAnalysis
  try {
    const jsonMatch = analysisContent.match(/```(?:json)?\s*([\s\S]*?)```/)
    const jsonString = jsonMatch ? jsonMatch[1] : analysisContent
    brandAnalysis = JSON.parse(jsonString.trim())
  } catch {
    brandAnalysis = generateFallbackBrandAnalysis(brandName)
  }

  // Step 1.5: Determine the 3 foundational brand colors
  let brandColors = { primary: '#6366F1', secondary: '#22C55E', accent: '#F59E0B', rationale: 'Default colors' }
  try {
    const colorPrompt = brandColorSystemPrompt
      .replace('{brandAnalysis}', JSON.stringify(brandAnalysis, null, 2))
      .replace('{extractedColors}', JSON.stringify(scrapedData?.colors || {}, null, 2))

    const colorResponse = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        { role: 'system', content: 'You are a color scientist. Always respond with valid JSON containing hex color values.' },
        { role: 'user', content: colorPrompt }
      ],
      temperature: 0.7,
      max_tokens: 500
    })

    const colorContent = colorResponse.choices?.[0]?.message?.content || '{}'
    const colorJsonMatch = colorContent.match(/```(?:json)?\s*([\s\S]*?)```/)
    const colorJsonString = colorJsonMatch ? colorJsonMatch[1] : colorContent
    const parsed = JSON.parse(colorJsonString.trim())
    if (parsed.primary && parsed.secondary && parsed.accent) {
      brandColors = parsed
    }
  } catch {
    // Use defaults
  }

  // Step 2: Generate design system
  const extractedColorsSummary = scrapedData?.colors ? JSON.stringify({
    primary: scrapedData.colors.primary,
    secondary: scrapedData.colors.secondary,
    accent: scrapedData.colors.accent,
    backgrounds: scrapedData.colors.backgrounds,
    texts: scrapedData.colors.texts,
    evidence: scrapedData.colors.evidence?.slice(0, 10),
  }) : 'No website colors available'

  const designSystemPromptFilled = designSystemPrompt
    .replace('{brandAnalysis}', JSON.stringify(brandAnalysis, null, 2))
    .replace('{extractedColors}', extractedColorsSummary)

  const designSystemResponse = await openai.chat.completions.create({
    model: AI_MODEL,
    messages: [
      { role: 'system', content: 'You are a design system expert. Always respond with valid JSON containing exact hex values and measurements.' },
      { role: 'user', content: designSystemPromptFilled }
    ],
    temperature: 0.7,
    max_tokens: 6000
  })

  const designSystemContent = designSystemResponse.choices?.[0]?.message?.content || '{}'
  let designSystem: DesignSystem

  try {
    const jsonMatch = designSystemContent.match(/```(?:json)?\s*([\s\S]*?)```/)
    const jsonString = jsonMatch ? jsonMatch[1] : designSystemContent
    const parsed = JSON.parse(jsonString.trim())
    if (!hasValidColors(parsed)) throw new Error('Invalid design system structure')
    designSystem = parsed as unknown as DesignSystem
  } catch {
    designSystem = generateFallbackDesignSystem(brandName)
  }

  // Step 3: Build the comprehensive color system
  let colorSystem: ColorSystem
  try {
    const semanticFromAI = (designSystem as unknown as Record<string, unknown>).colorSystem as Record<string, unknown> | undefined
    const aiRationale = (designSystem as unknown as Record<string, unknown>).colorRationale as string | undefined

    if (semanticFromAI?.semantic) {
      // AI provided a full semantic color system - use it
      colorSystem = {
        status: 'ready',
        sourceType: scrapedData ? 'website' : 'generated',
        version: 1,
        primitive: Object.fromEntries(
          Object.entries(designSystem.colors).map(([name, shades]) => [
            name,
            Object.fromEntries(
              Object.entries(shades).map(([shade, hex]) => [
                shade,
                { value: hex as string, source: scrapedData ? 'extracted' : 'generated', confidence: 0.85 }
              ])
            )
          ])
        ),
        semantic: semanticFromAI.semantic as ColorSystem['semantic'],
        component: (semanticFromAI.component || buildColorSystem(brandColors.primary, brandColors.secondary, brandColors.accent, scrapedData ? 'website' : 'generated').component) as ColorSystem['component'],
        social: (semanticFromAI.social || buildColorSystem(brandColors.primary, brandColors.secondary, brandColors.accent, scrapedData ? 'website' : 'generated').social) as ColorSystem['social'],
        pairings: (semanticFromAI.pairings || []) as ColorSystem['pairings'],
        extractionEvidence: scrapedData?.colors?.evidence?.map(e => ({
          page: e.page, selector: e.selector, property: e.property, value: e.value, role: 'extracted'
        })),
        generatedRationale: aiRationale || `Color system for ${brandName}`,
        lastAnalyzedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    } else {
      // AI didn't provide semantic system - build from primitives
      colorSystem = buildColorSystem(
        brandColors.primary,
        brandColors.secondary,
        brandColors.accent,
        scrapedData ? 'website' : 'generated',
        scrapedData?.colors?.evidence?.map(e => ({
          page: e.page, selector: e.selector, property: e.property, value: e.value, role: 'extracted'
        })),
        brandColors.rationale
      )
    }
  } catch {
    colorSystem = generateFallbackColorSystem(brandName)
  }

  // Step 4: Generate brand guidelines
  const guidelinesPrompt = brandGuidelinesPrompt
    .replace('{brandAnalysis}', JSON.stringify(brandAnalysis, null, 2))
    .replace('{designSystem}', JSON.stringify(designSystem, null, 2))

  const guidelinesResponse = await openai.chat.completions.create({
    model: AI_MODEL,
    messages: [
      { role: 'system', content: 'You are a brand strategist. Always respond with valid JSON containing comprehensive brand guidelines.' },
      { role: 'user', content: guidelinesPrompt }
    ],
    temperature: 0.7,
    max_tokens: 3000
  })

  const guidelinesContent = guidelinesResponse.choices?.[0]?.message?.content || '{}'
  let guidelines: Record<string, unknown>
  try {
    const jsonMatch = guidelinesContent.match(/```(?:json)?\s*([\s\S]*?)```/)
    const jsonString = jsonMatch ? jsonMatch[1] : guidelinesContent
    guidelines = JSON.parse(jsonString.trim())
  } catch {
    guidelines = generateFallbackGuidelines(brandName)
  }

  return { brandAnalysis, designSystem, colorSystem, guidelines }
}

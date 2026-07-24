import { openai } from '@/lib/openai'
import { ScrapedData } from '@/lib/scraper'
import { brandAnalysisPrompt } from './prompts/brand-analysis'
import { designSystemPrompt } from './prompts/design-system'
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

function parseJsonFromAI(content: string): unknown {
  const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/)
  const jsonString = jsonMatch ? jsonMatch[1] : content
  return JSON.parse(jsonString.trim())
}

export async function generateBrandKit(input: GenerateBrandKitInput): Promise<GenerateBrandKitOutput> {
  const { brandName, websiteUrl, brandDescription, scrapedData } = input

  const extractedColorsSummary = scrapedData?.colors ? JSON.stringify({
    primary: scrapedData.colors.primary,
    secondary: scrapedData.colors.secondary,
    accent: scrapedData.colors.accent,
    backgrounds: scrapedData.colors.backgrounds,
    texts: scrapedData.colors.texts,
    evidence: scrapedData.colors.evidence?.slice(0, 10),
  }) : 'No website colors available'

  // Batch 1 (parallel): Brand Analysis + Design System (with colors)
  const analysisPrompt = brandAnalysisPrompt
    .replace('{url}', websiteUrl || 'Not provided')
    .replace('{brandName}', brandName)
    .replace('{description}', brandDescription || 'Not provided')
    .replace('{colors}', JSON.stringify(scrapedData?.colors || {}))
    .replace('{fonts}', JSON.stringify(scrapedData?.fonts || {}))
    .replace('{pageTitle}', scrapedData?.title || 'Not available')
    .replace('{pageDescription}', scrapedData?.description || 'Not available')

  const designSystemPromptFilled = designSystemPrompt
    .replace('{brandAnalysis}', '{}')
    .replace('{extractedColors}', extractedColorsSummary)

  const [analysisResponse, designSystemResponse] = await Promise.all([
    openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        { role: 'system', content: 'You are a brand identity expert. Always respond with valid JSON.' },
        { role: 'user', content: analysisPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    }),
    openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        { role: 'system', content: 'You are a design system expert. Always respond with valid JSON containing exact hex values, semantic color tokens, component tokens, social media colors, and color pairings.' },
        { role: 'user', content: designSystemPromptFilled }
      ],
      temperature: 0.7,
      max_tokens: 6000
    })
  ])

  // Parse brand analysis
  let brandAnalysis: BrandAnalysis
  try {
    const content = analysisResponse.choices?.[0]?.message?.content || '{}'
    brandAnalysis = parseJsonFromAI(content) as BrandAnalysis
  } catch {
    brandAnalysis = generateFallbackBrandAnalysis(brandName)
  }

  // Parse design system
  let designSystem: DesignSystem
  try {
    const content = designSystemResponse.choices?.[0]?.message?.content || '{}'
    const parsed = parseJsonFromAI(content)
    if (!hasValidColors(parsed)) throw new Error('Invalid design system structure')
    designSystem = parsed as unknown as DesignSystem
  } catch {
    designSystem = generateFallbackDesignSystem(brandName)
  }

  // Derive brand colors from the generated design system
  const primaryColor = designSystem.colors?.primary?.['500'] || '#6366F1'
  const secondaryColor = designSystem.colors?.secondary?.['500'] || '#22C55E'
  const accentColor = designSystem.colors?.accent?.['500'] || '#F59E0B'

  // Build comprehensive color system from primitives
  let colorSystem: ColorSystem
  try {
    colorSystem = buildColorSystem(
      primaryColor,
      secondaryColor,
      accentColor,
      scrapedData ? 'website' : 'generated',
      scrapedData?.colors?.evidence?.map(e => ({
        page: e.page, selector: e.selector, property: e.property, value: e.value, role: 'extracted'
      })),
      `Color system derived from ${scrapedData ? 'website analysis' : 'AI generation'} for ${brandName}`
    )
  } catch {
    colorSystem = generateFallbackColorSystem(brandName)
  }

  // Generate guidelines from existing data (no extra AI call needed)
  const guidelines = generateFallbackGuidelines(brandName)

  return { brandAnalysis, designSystem, colorSystem, guidelines }
}

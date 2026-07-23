import { openai } from '@/lib/openai'
import { ScrapedData } from '@/lib/scraper'
import { brandAnalysisPrompt } from './prompts/brand-analysis'
import { designSystemPrompt } from './prompts/design-system'
import { brandGuidelinesPrompt } from './prompts/brand-guidelines'
import { AI_MODEL } from './config'
import { generateFallbackDesignSystem, generateFallbackBrandAnalysis, generateFallbackGuidelines } from './fallback'
import type { BrandAnalysis, DesignSystem } from '@/types/database'

interface GenerateBrandKitInput {
  brandName: string
  websiteUrl: string | null
  brandDescription: string | null
  scrapedData: ScrapedData | null
}

interface GenerateBrandKitOutput {
  brandAnalysis: BrandAnalysis
  designSystem: DesignSystem
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
      {
        role: 'system',
        content: 'You are a brand identity expert. Always respond with valid JSON.'
      },
      {
        role: 'user',
        content: analysisPrompt
      }
    ],
    temperature: 0.7,
    max_tokens: 2000
  })

  const analysisContent = analysisResponse.choices?.[0]?.message?.content || '{}'
  let brandAnalysis: BrandAnalysis
  
  try {
    // Try to extract JSON from markdown code block
    const jsonMatch = analysisContent.match(/```(?:json)?\s*([\s\S]*?)```/)
    const jsonString = jsonMatch ? jsonMatch[1] : analysisContent
    brandAnalysis = JSON.parse(jsonString.trim())
  } catch {
    brandAnalysis = generateFallbackBrandAnalysis(brandName)
  }

  // Step 2: Generate design system
  const designSystemPromptFilled = designSystemPrompt
    .replace('{brandAnalysis}', JSON.stringify(brandAnalysis, null, 2))

  const designSystemResponse = await openai.chat.completions.create({
    model: AI_MODEL,
    messages: [
      {
        role: 'system',
        content: 'You are a design system expert. Always respond with valid JSON containing exact hex values and measurements.'
      },
      {
        role: 'user',
        content: designSystemPromptFilled
      }
    ],
    temperature: 0.7,
    max_tokens: 4000
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

  // Step 3: Generate brand guidelines
  const guidelinesPrompt = brandGuidelinesPrompt
    .replace('{brandAnalysis}', JSON.stringify(brandAnalysis, null, 2))
    .replace('{designSystem}', JSON.stringify(designSystem, null, 2))

  const guidelinesResponse = await openai.chat.completions.create({
    model: AI_MODEL,
    messages: [
      {
        role: 'system',
        content: 'You are a brand strategist. Always respond with valid JSON containing comprehensive brand guidelines.'
      },
      {
        role: 'user',
        content: guidelinesPrompt
      }
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

  return {
    brandAnalysis,
    designSystem,
    guidelines
  }
}

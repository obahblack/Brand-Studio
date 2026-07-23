import { createPage } from '@/lib/scraper/puppeteer-init'
import { templateGenerators } from './html-templates'
import type { DesignSystem } from '@/types/database'

interface RenderOptions {
  width: number
  height: number
}

const templateDimensions: Record<string, RenderOptions> = {
  'linkedin-post': { width: 1200, height: 627 },
  'instagram-post': { width: 1080, height: 1080 },
  'instagram-story': { width: 1080, height: 1920 },
  'twitter-card': { width: 1200, height: 675 },
  'youtube-thumbnail': { width: 1280, height: 720 },
  'facebook-post': { width: 1200, height: 630 },
  'tiktok-post': { width: 1080, height: 1080 },
}

export async function renderTemplate(
  templateType: string,
  designSystem: DesignSystem,
  data: {
    brandName: string
    headline: string
    subheadline?: string
    cta?: string
  }
): Promise<Buffer> {
  const generator = templateGenerators[templateType as keyof typeof templateGenerators]
  if (!generator) {
    throw new Error(`Unknown template type: ${templateType}`)
  }

  const html = generator(designSystem, data)
  const dimensions = templateDimensions[templateType] || { width: 1200, height: 630 }

  const page = await createPage()
  
  try {
    await page.setViewport({
      width: dimensions.width,
      height: dimensions.height,
      deviceScaleFactor: 2
    })

    await page.setContent(html, { waitUntil: 'load' })
    
    await page.evaluateHandle('document.fonts.ready')
    
    const screenshot = await page.screenshot({
      type: 'png',
      clip: {
        x: 0,
        y: 0,
        width: dimensions.width,
        height: dimensions.height
      }
    })

    return Buffer.from(screenshot)
  } finally {
    await page.close()
  }
}

export async function renderAllTemplates(
  designSystem: DesignSystem,
  brandName: string,
  templateNames?: string[],
  description?: string,
  websiteUrl?: string
): Promise<Map<string, Buffer>> {
  const results = new Map<string, Buffer>()

  const headline = description || `Welcome to ${brandName}`
  const subheadline = description ? undefined : 'Building the future of innovation'

  const templateData = {
    brandName,
    headline,
    subheadline,
    websiteUrl,
  }

  const templatesToRender = templateNames || Object.keys(templateGenerators)

  for (const templateType of templatesToRender) {
    try {
      const buffer = await renderTemplate(templateType, designSystem, templateData)
      results.set(templateType, buffer)
    } catch (error) {
      console.error(`Error rendering ${templateType}:`, error)
    }
  }

  return results
}

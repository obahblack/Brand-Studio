import sharp from 'sharp'
import type { DesignSystem } from '@/types/database'

const templateDimensions: Record<string, { width: number; height: number }> = {
  'linkedin-post': { width: 1200, height: 627 },
  'instagram-post': { width: 1080, height: 1080 },
  'twitter-card': { width: 1200, height: 675 },
  'youtube-thumbnail': { width: 1280, height: 720 },
  'facebook-post': { width: 1200, height: 630 },
  'tiktok-post': { width: 1080, height: 1080 },
}

function getColors(designSystem: DesignSystem) {
  const c = designSystem.colors || {}
  return {
    primary500: (c.primary && c.primary['500']) || '#7C3AED',
    primary600: (c.primary && c.primary['600']) || '#6D28D9',
    primary50: (c.primary && c.primary['50']) || '#F5F3FF',
    neutral900: (c.neutral && c.neutral['900']) || '#111827',
    neutral600: (c.neutral && c.neutral['600']) || '#4B5563',
    neutral50: (c.neutral && c.neutral['50']) || '#F9FAFB',
  }
}

function generateGradientSVG(w: number, h: number, c: ReturnType<typeof getColors>, isVertical: boolean): string {
  const dir = isVertical ? 'to bottom' : 'to right'
  return `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="${isVertical ? 0 : 1}" y2="${isVertical ? 1 : 0}">
        <stop offset="0%" stop-color="${c.neutral50}"/>
        <stop offset="100%" stop-color="${c.primary50}"/>
      </linearGradient>
      <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${c.primary500}"/>
        <stop offset="100%" stop-color="${c.primary600}"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#bg)"/>
    <circle cx="${w * 0.85}" cy="${h * 0.15}" r="${Math.min(w, h) * 0.35}" fill="${c.primary500}" opacity="0.06"/>
    <circle cx="${w * 0.1}" cy="${h * 0.9}" r="${Math.min(w, h) * 0.25}" fill="${c.primary600}" opacity="0.04"/>
  </svg>`
}

function generateTextOverlay(w: number, h: number, brandName: string, headline: string, subheadline: string | undefined, websiteUrl: string | undefined, c: ReturnType<typeof getColors>): string {
  const isVertical = h >= w
  const padding = isVertical ? 40 : 48
  const logoSize = 40
  const logoRadius = 10
  const titleSize = isVertical ? 36 : 42

  return `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${c.primary500}"/>
        <stop offset="100%" stop-color="${c.primary600}"/>
      </linearGradient>
    </defs>

    <g transform="translate(${padding}, ${padding})">
      <rect x="0" y="0" width="${logoSize}" height="${logoSize}" rx="${logoRadius}" fill="url(#accent)"/>
      <text x="${logoSize / 2}" y="${logoSize / 2 + 6}" text-anchor="middle" fill="white" font-size="20" font-weight="700" font-family="system-ui, sans-serif">${brandName.charAt(0)}</text>
      <text x="${logoSize + 12}" y="${logoSize / 2 + 6}" fill="${c.neutral900}" font-size="16" font-weight="700" font-family="system-ui, sans-serif">${brandName}</text>
    </g>

    <g transform="translate(${padding}, ${h * 0.45})">
      <rect x="0" y="0" width="80" height="26" rx="13" fill="${c.primary50}"/>
      <text x="40" y="17" text-anchor="middle" fill="${c.primary500}" font-size="11" font-weight="700" font-family="system-ui, sans-serif" letter-spacing="0.5">FEATURED</text>
      <text x="0" y="52" fill="${c.neutral900}" font-size="${titleSize}" font-weight="800" font-family="system-ui, sans-serif">${wrapText(headline, 25)}</text>
      ${subheadline ? `<text x="0" y="${52 + titleSize + 20}" fill="${c.neutral600}" font-size="16" font-family="system-ui, sans-serif">${wrapText(subheadline, 35)}</text>` : ''}
    </g>

    <g transform="translate(${padding}, ${h - padding - 30})">
      ${websiteUrl ? `<rect x="0" y="0" width="${websiteUrl.replace(/^https?:\/\//, '').length * 8 + 40}" height="32" rx="16" fill="white" opacity="0.9"/>
        <text x="14" y="20" fill="${c.neutral600}" font-size="12" font-weight="500" font-family="system-ui, sans-serif">${websiteUrl.replace(/^https?:\/\//, '')}</text>` : ''}
    </g>
  </svg>`
}

function wrapText(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text
  const truncated = text.slice(0, maxChars - 3)
  return truncated + '...'
}

export async function renderTemplate(
  templateType: string,
  designSystem: DesignSystem,
  data: {
    brandName: string
    headline: string
    subheadline?: string
    websiteUrl?: string
  }
): Promise<Buffer> {
  const dims = templateDimensions[templateType]
  if (!dims) {
    throw new Error(`Unknown template type: ${templateType}`)
  }

  const { width, height } = dims
  const c = getColors(designSystem)
  const isVertical = height >= width

  const gradientSvg = generateGradientSVG(width, height, c, isVertical)
  const textSvg = generateTextOverlay(width, height, data.brandName, data.headline, data.subheadline, data.websiteUrl, c)

  const image = await sharp(Buffer.from(gradientSvg))
    .resize(width, height)
    .composite([
      {
        input: Buffer.from(textSvg),
        top: 0,
        left: 0,
      },
    ])
    .png()
    .toBuffer()

  return image
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

  const templatesToRender = templateNames || Object.keys(templateDimensions)

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

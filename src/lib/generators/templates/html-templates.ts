import type { DesignSystem } from '@/types/database'

interface TemplateData {
  brandName: string
  headline: string
  subheadline?: string
  imageUrl?: string
  websiteUrl?: string
}

const GOOGLE_FONTS = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'

function brandStyles(colors: DesignSystem['colors']) {
  const p = colors.primary || {}
  const s = colors.secondary || {}
  const a = colors.accent || {}
  const n = colors.neutral || {}
  return { p, s, a, n }
}

function unsplashUrl(keywords: string, w: number, h: number): string {
  const q = keywords.split(' ').filter(Boolean).join(',') || 'abstract'
  return `https://images.unsplash.com/photo-${Date.now() % 1000}?w=${w}&h=${h}&fit=crop&q=80`
}

function buildLayout(
  templateType: string,
  w: number,
  h: number,
  colors: DesignSystem['colors'],
  data: TemplateData,
  options: {
    textPosition: 'top' | 'bottom' | 'left' | 'right' | 'center'
    overlay?: boolean
    showLogo?: boolean
    showWebsite?: boolean
  }
): string {
  const { p, n } = brandStyles(colors)
  const p500 = p['500'] || '#7C3AED'
  const p600 = p['600'] || '#6D28D9'
  const p50 = p['50'] || '#F5F3FF'
  const n900 = n['900'] || '#111827'
  const n600 = n['600'] || '#4B5563'
  const n50 = n['50'] || '#F9FAFB'
  const isSquare = Math.abs(w - h) < 100
  const isVertical = h > w
  const kw = (data.headline + ' ' + (data.subheadline || '')).slice(0, 50)
  const seed = hashCode(kw) || 1
  const imgUrl = data.imageUrl || `https://picsum.photos/seed/${seed}/${Math.round(w * 1.5)}/${Math.round(h * 1.5)}`

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><link href="${GOOGLE_FONTS}" rel="stylesheet">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { width: ${w}px; height: ${h}px; font-family: 'Inter', sans-serif; overflow: hidden; }
.container {
  width: 100%; height: 100%; display: flex;
  flex-direction: ${isSquare ? 'column' : isVertical ? 'column' : 'row'};
  position: relative; background: ${n50};
}
.image-section {
  flex: ${isSquare ? '0 0 55%' : isVertical ? '0 0 50%' : '0 0 50%'};
  position: relative; overflow: hidden;
}
.image-section img {
  width: 100%; height: 100%; object-fit: cover;
}
.overlay {
  position: absolute; inset: 0;
  background: linear-gradient(${isSquare ? 'to bottom' : 'to right'}, transparent 50%, ${n50} 100%);
}
.text-section {
  flex: 1; display: flex; flex-direction: column;
  justify-content: center; padding: ${isSquare ? '32px 40px' : '40px 48px'};
  ${!isSquare && !isVertical ? 'padding-left: 32px;' : ''}
}
.badge {
  display: inline-flex; align-items: center; gap: 6px;
  background: ${p50}; color: ${p500};
  padding: 6px 14px; border-radius: 20px;
  font-size: 12px; font-weight: 600; margin-bottom: 16px;
  width: fit-content; text-transform: uppercase; letter-spacing: 0.5px;
}
h1 {
  font-size: ${isSquare ? '32px' : isVertical ? '42px' : '36px'};
  font-weight: 800; color: ${n900}; line-height: 1.15;
  margin-bottom: 12px; letter-spacing: -0.02em;
}
p {
  font-size: ${isSquare ? '15px' : '17px'};
  color: ${n600}; line-height: 1.6; max-width: 80%;
}
.footer {
  position: absolute; bottom: 0; left: 0; right: 0;
  display: flex; justify-content: space-between; align-items: center;
  padding: 20px 32px;
}
.logo {
  display: flex; align-items: center; gap: 10px;
}
.logo-mark {
  width: 32px; height: 32px; border-radius: 8px;
  background: linear-gradient(135deg, ${p500}, ${p600});
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; font-weight: 700; color: white;
}
.logo-text { font-size: 15px; font-weight: 700; color: ${n900}; }
.website-pill {
  display: inline-flex; align-items: center; gap: 6px;
  background: rgba(255,255,255,0.9); backdrop-filter: blur(8px);
  padding: 8px 16px; border-radius: 100px;
  font-size: 12px; font-weight: 500; color: ${n600};
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
</style></head><body>
<div class="container">
  <div class="image-section">
    <img src="${imgUrl}" alt="" />
    <div class="overlay"></div>
  </div>
  <div class="text-section">
    <div class="badge"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2l2 7h7l-5 4 2 7-6-4-6 4 2-7-5-4h7z"/></svg> Featured</div>
    <h1>${data.headline}</h1>
    ${data.subheadline ? `<p>${data.subheadline}</p>` : ''}
  </div>
  <div class="footer">
    <div class="logo">
      <div class="logo-mark">${data.brandName.charAt(0)}</div>
      <span class="logo-text">${data.brandName}</span>
    </div>
    ${data.websiteUrl ? `<div class="website-pill"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z"/></svg> ${data.websiteUrl.replace(/^https?:\/\//, '')}</div>` : ''}
  </div>
</div>
</body></html>`
}

function hashCode(s: string): number {
  return Math.abs(s.split('').reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 0))
}

function buildSquarePost(colors: DesignSystem['colors'], data: TemplateData, w: number, h: number): string {
  return buildLayout('square', w, h, colors, data, { textPosition: 'bottom', showLogo: true, showWebsite: true })
}

function buildHorizontalPost(colors: DesignSystem['colors'], data: TemplateData, w: number, h: number): string {
  return buildLayout('horizontal', w, h, colors, data, { textPosition: 'right', showLogo: true, showWebsite: true })
}

export function generateLinkedInPost(designSystem: DesignSystem, data: TemplateData): string {
  return buildHorizontalPost(designSystem.colors, data, 1200, 627)
}

export function generateInstagramPost(designSystem: DesignSystem, data: TemplateData): string {
  return buildSquarePost(designSystem.colors, data, 1080, 1080)
}

export function generateTwitterCard(designSystem: DesignSystem, data: TemplateData): string {
  return buildHorizontalPost(designSystem.colors, data, 1200, 675)
}

export function generateYouTubeThumbnail(designSystem: DesignSystem, data: TemplateData): string {
  return buildHorizontalPost(designSystem.colors, data, 1280, 720)
}

export function generateFacebookPost(designSystem: DesignSystem, data: TemplateData): string {
  return buildSquarePost(designSystem.colors, data, 1200, 1200)
}

export function generateTikTokPost(designSystem: DesignSystem, data: TemplateData): string {
  return buildLayout('tiktok', 1080, 1080, designSystem.colors, data, { textPosition: 'bottom', showLogo: true, showWebsite: true })
}

export const templateGenerators = {
  'linkedin-post': generateLinkedInPost,
  'instagram-post': generateInstagramPost,
  'twitter-card': generateTwitterCard,
  'youtube-thumbnail': generateYouTubeThumbnail,
  'facebook-post': generateFacebookPost,
  'tiktok-post': generateTikTokPost,
}

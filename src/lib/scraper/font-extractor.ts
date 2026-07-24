import { Page } from 'puppeteer'

const GOOGLE_FONTS_API = 'https://fonts.google.com'

const POPULAR_GOOGLE_FONTS = [
  'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 'Source Sans Pro',
  'Nunito', 'Raleway', 'Ubuntu', 'Playfair Display', 'Merriweather', 'PT Serif',
  'Work Sans', 'DM Sans', 'Noto Sans', 'Space Grotesk', 'Plus Jakarta Sans',
  'Figtree', 'Sora', 'Clash Display', 'Cabinet Grotesk', 'General Sans',
  'Jakarta Sans', 'Instrument Sans', 'Public Sans', 'Outfit', 'Onest',
]

export interface ExtractedFonts {
  headings: string[]
  body: string[]
  all: string[]
  weights: string[]
  isGoogleFont: boolean
  googleFontSuggestions: string[]
}

function suggestGoogleFont(rawName: string): string | null {
  const cleaned = rawName.replace(/['"]/g, '').trim()
  if (!cleaned) return null

  const lower = cleaned.toLowerCase()
  
  const exact = POPULAR_GOOGLE_FONTS.find(f => f.toLowerCase() === lower)
  if (exact) return exact

  const partial = POPULAR_GOOGLE_FONTS.find(f => f.toLowerCase().includes(lower) || lower.includes(f.toLowerCase()))
  if (partial) return partial

  const systemFonts = ['system-ui', 'sans-serif', 'serif', 'monospace', 'arial', 'helvetica', 'times new roman', 'georgia', 'verdana', 'tahoma', 'trebuchet ms', 'courier new', 'impact']
  if (systemFonts.includes(cleaned.toLowerCase())) return null

  return null
}

export async function extractFonts(page: Page): Promise<ExtractedFonts> {
  const fonts = await page.evaluate(() => {
    const fontSet = new Set<string>()
    const weights = new Set<string>()
    const headings: string[] = []
    const body: string[] = []

    const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, span, div, button')
    
    elements.forEach(el => {
      const computed = window.getComputedStyle(el)
      const fontFamily = computed.fontFamily
      const fontWeight = computed.fontWeight
      
      const fonts = fontFamily.split(',').map(f => {
        return f.trim().replace(/['"]/g, '')
      })
      
      fonts.forEach(font => {
        if (font && !font.includes('system-ui') && !font.includes('sans-serif') && !font.includes('serif')) {
          fontSet.add(font)
        }
      })
      
      const tagName = el.tagName.toLowerCase()
      if (tagName.match(/^h[1-6]$/)) {
        fonts.forEach(font => {
          if (font && !headings.includes(font)) {
            headings.push(font)
          }
        })
      } else if (tagName === 'p' || tagName === 'span' || tagName === 'a') {
        fonts.forEach(font => {
          if (font && !body.includes(font)) {
            body.push(font)
          }
        })
      }
      
      weights.add(fontWeight)
    })

    const allStyles = document.styleSheets
    for (let i = 0; i < allStyles.length; i++) {
      try {
        const rules = allStyles[i].cssRules
        for (let j = 0; j < rules.length; j++) {
          const rule = rules[j]
          if (rule instanceof CSSStyleRule) {
            const style = rule.style
            for (let k = 0; k < style.length; k++) {
              const prop = style[k]
              if (prop === 'font-family') {
                const value = style.getPropertyValue(prop)
                const fonts = value.split(',').map(f => f.trim().replace(/['"]/g, ''))
                fonts.forEach(font => {
                  if (font && !font.includes('system-ui') && !font.includes('sans-serif') && !font.includes('serif')) {
                    fontSet.add(font)
                  }
                })
              }
            }
          }
        }
      } catch {
      }
    }

    return {
      headings: headings.slice(0, 3),
      body: body.slice(0, 3),
      all: Array.from(fontSet).slice(0, 10),
      weights: Array.from(weights).slice(0, 5)
    }
  })

  const googleFontSuggestions: string[] = []
  for (const font of fonts.all) {
    const suggestion = suggestGoogleFont(font)
    if (suggestion && !googleFontSuggestions.includes(suggestion)) {
      googleFontSuggestions.push(suggestion)
    }
  }

  return {
    ...fonts,
    isGoogleFont: fonts.all.some(f => POPULAR_GOOGLE_FONTS.some(gf => gf.toLowerCase() === f.toLowerCase().replace(/['"]/g, '').trim())),
    googleFontSuggestions: googleFontSuggestions.slice(0, 5),
  }
}

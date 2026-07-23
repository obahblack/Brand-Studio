import { Page } from 'puppeteer'

export interface ExtractedFonts {
  headings: string[]
  body: string[]
  all: string[]
  weights: string[]
}

export async function extractFonts(page: Page): Promise<ExtractedFonts> {
  const fonts = await page.evaluate(() => {
    const fontSet = new Set<string>()
    const weights = new Set<string>()
    const headings: string[] = []
    const body: string[] = []

    // Extract fonts from computed styles
    const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, span, div, button')
    
    elements.forEach(el => {
      const computed = window.getComputedStyle(el)
      const fontFamily = computed.fontFamily
      const fontWeight = computed.fontWeight
      
      // Parse font family
      const fonts = fontFamily.split(',').map(f => {
        return f.trim().replace(/['"]/g, '')
      })
      
      fonts.forEach(font => {
        if (font && !font.includes('system-ui') && !font.includes('sans-serif') && !font.includes('serif')) {
          fontSet.add(font)
        }
      })
      
      // Check if heading
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
      
      // Collect weights
      weights.add(fontWeight)
    })

    // Extract from CSS custom properties
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
        // Cross-origin stylesheets
      }
    }

    return {
      headings: headings.slice(0, 3),
      body: body.slice(0, 3),
      all: Array.from(fontSet).slice(0, 10),
      weights: Array.from(weights).slice(0, 5)
    }
  })

  return fonts
}

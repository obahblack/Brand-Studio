import { Page } from 'puppeteer'

export interface ExtractedColors {
  primary: string[]
  secondary: string[]
  accent: string[]
  backgrounds: string[]
  texts: string[]
  borders: string[]
  all: string[]
}

export async function extractColors(page: Page): Promise<ExtractedColors> {
  const colors = await page.evaluate(() => {
    const colorSet = new Set<string>()
    const primary: string[] = []
    const secondary: string[] = []
    const accent: string[] = []
    const backgrounds: string[] = []
    const texts: string[] = []
    const borders: string[] = []

    // Helper to convert RGB to hex
    const rgbToHex = (r: number, g: number, b: number): string => {
      return '#' + [r, g, b].map(x => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
      }).join('')
    }

    // Helper to parse color string
    const parseColor = (color: string): string | null => {
      if (!color || color === 'transparent' || color === 'inherit' || color === 'initial') {
        return null
      }
      
      // Handle rgb/rgba
      const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
      if (rgbMatch) {
        const [, r, g, b] = rgbMatch.map(Number)
        return rgbToHex(r, g, b)
      }
      
      // Handle hex
      if (color.startsWith('#')) {
        if (color.length === 4) {
          return '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3]
        }
        return color.slice(0, 7)
      }
      
      return null
    }

    // Extract colors from computed styles
    const elements = document.querySelectorAll('*')
    elements.forEach(el => {
      const computed = window.getComputedStyle(el)
      const properties = ['color', 'background-color', 'border-color', 'border-top-color', 'border-bottom-color']
      
      properties.forEach(prop => {
        const value = computed.getPropertyValue(prop)
        const hex = parseColor(value)
        if (hex && hex !== '#000000' && hex !== '#ffffff' && hex !== '#000') {
          colorSet.add(hex)
        }
      })
    })

    // Extract CSS custom properties
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
              if (prop.startsWith('--') && (prop.includes('color') || prop.includes('primary') || prop.includes('secondary'))) {
                const value = style.getPropertyValue(prop)
                const hex = parseColor(value)
                if (hex) {
                  colorSet.add(hex)
                }
              }
            }
          }
        }
      } catch {
        // Cross-origin stylesheets
      }
    }

    // Convert set to array and categorize
    const allColors = Array.from(colorSet)
    
    // Simple categorization based on position and usage
    allColors.forEach(color => {
      const r = parseInt(color.slice(1, 3), 16)
      const g = parseInt(color.slice(3, 5), 16)
      const b = parseInt(color.slice(5, 7), 16)
      const brightness = (r * 299 + g * 587 + b * 114) / 1000
      
      if (brightness > 200) {
        backgrounds.push(color)
      } else if (brightness < 50) {
        texts.push(color)
      } else if (r > 150 || g > 150 || b > 150) {
        accent.push(color)
      } else {
        secondary.push(color)
      }
    })

    // Get most common colors
    const colorCounts = new Map<string, number>()
    allColors.forEach(color => {
      colorCounts.set(color, (colorCounts.get(color) || 0) + 1)
    })
    
    const sortedColors = Array.from(colorCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([color]) => color)
    
    primary.push(...sortedColors.slice(0, 3))
    
    return {
      primary: [...new Set(primary)].slice(0, 5),
      secondary: [...new Set(secondary)].slice(0, 5),
      accent: [...new Set(accent)].slice(0, 5),
      backgrounds: [...new Set(backgrounds)].slice(0, 5),
      texts: [...new Set(texts)].slice(0, 5),
      borders: [...new Set(borders)].slice(0, 5),
      all: allColors.slice(0, 20)
    }
  })

  return colors
}

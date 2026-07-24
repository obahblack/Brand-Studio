import { Page } from 'puppeteer'

export interface ExtractedColors {
  primary: string[]
  secondary: string[]
  accent: string[]
  backgrounds: string[]
  texts: string[]
  borders: string[]
  all: string[]
  classification: {
    warm: string[]
    cool: string[]
    neutral: string[]
    vibrant: string[]
    muted: string[]
    pastel: string[]
  }
  accessibility: {
    pair: string
    contrastRatio: number
    passesAA: boolean
    passesAAA: boolean
  }[]
}

function luminance(r: number, g: number, b: number): number {
  const [rl, gl, bl] = [r, g, b].map(c => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl
}

function contrastRatio(hex1: string, hex2: string): number {
  const parse = (hex: string) => {
    const h = hex.replace('#', '')
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
    }
  }
  const c1 = parse(hex1)
  const c2 = parse(hex2)
  const l1 = luminance(c1.r, c1.g, c1.b)
  const l2 = luminance(c2.r, c2.g, c2.b)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

function classifyColor(r: number, g: number, b: number): { warm: boolean; cool: boolean; vibrant: boolean; muted: boolean; pastel: boolean } {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const saturation = max === 0 ? 0 : (max - min) / max
  
  const isPastel = saturation < 0.3 && max > 180
  const isVibrant = saturation > 0.6 && max > 100
  const isMuted = saturation < 0.4 && !isPastel
  const isWarm = r > g && r > b
  const isCool = b > r && b > g

  return { warm: isWarm, cool: isCool, vibrant: isVibrant, muted: isMuted, pastel: isPastel }
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

    const rgbToHex = (r: number, g: number, b: number): string => {
      return '#' + [r, g, b].map(x => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
      }).join('')
    }

    const parseColor = (color: string): string | null => {
      if (!color || color === 'transparent' || color === 'inherit' || color === 'initial') {
        return null
      }
      
      const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
      if (rgbMatch) {
        const [, r, g, b] = rgbMatch.map(Number)
        return rgbToHex(r, g, b)
      }
      
      if (color.startsWith('#')) {
        if (color.length === 4) {
          return '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3]
        }
        return color.slice(0, 7)
      }
      
      return null
    }

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
      }
    }

    const allColors = Array.from(colorSet)
    
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

  const classification = { warm: [] as string[], cool: [] as string[], neutral: [] as string[], vibrant: [] as string[], muted: [] as string[], pastel: [] as string[] }
  
  for (const color of colors.all) {
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)
    const cat = classifyColor(r, g, b)
    if (cat.warm) classification.warm.push(color)
    if (cat.cool) classification.cool.push(color)
    if (!cat.warm && !cat.cool) classification.neutral.push(color)
    if (cat.vibrant) classification.vibrant.push(color)
    if (cat.muted) classification.muted.push(color)
    if (cat.pastel) classification.pastel.push(color)
  }

  const textColors = colors.texts.length > 0 ? colors.texts : ['#111827']
  const bgColors = colors.backgrounds.length > 0 ? colors.backgrounds : ['#FFFFFF']
  
  const accessibility: { pair: string; contrastRatio: number; passesAA: boolean; passesAAA: boolean }[] = []
  
  for (const text of textColors.slice(0, 3)) {
    for (const bg of bgColors.slice(0, 3)) {
      const ratio = contrastRatio(text, bg)
      accessibility.push({
        pair: `${text} on ${bg}`,
        contrastRatio: Math.round(ratio * 100) / 100,
        passesAA: ratio >= 4.5,
        passesAAA: ratio >= 7,
      })
    }
  }

  return {
    ...colors,
    classification,
    accessibility,
  }
}

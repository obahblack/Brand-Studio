import type { DesignSystem, BrandAnalysis } from '@/types/database'

function hashString(s: string): number {
  return s.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
}

function hsl(h: number, s: number, l: number): string {
  return `hsl(${h}, ${s}%, ${l}%)`
}

export function generateFallbackPalette(brandName: string) {
  const hash = hashString(brandName)
  const hue = hash % 360
  const primary = hsl(hue, 70, 40)
  const primaryLight = hsl(hue, 70, 55)
  const primaryDark = hsl(hue, 70, 25)
  const secondaryHue = (hue + 180) % 360
  const secondary = hsl(secondaryHue, 65, 45)
  const secondaryLight = hsl(secondaryHue, 65, 60)
  const accentHue = (hue + 60) % 360
  const accent = hsl(accentHue, 80, 50)

  return {
    primary: {
      '50': hsl(hue, 70, 95),
      '100': hsl(hue, 70, 85),
      '200': hsl(hue, 70, 75),
      '300': hsl(hue, 70, 65),
      '400': primaryLight,
      '500': primary,
      '600': primaryDark,
      '700': hsl(hue, 70, 18),
      '800': hsl(hue, 70, 12),
      '900': hsl(hue, 70, 6),
    },
    secondary: {
      '50': hsl(secondaryHue, 65, 95),
      '100': hsl(secondaryHue, 65, 85),
      '200': hsl(secondaryHue, 65, 75),
      '300': hsl(secondaryHue, 65, 65),
      '400': secondaryLight,
      '500': secondary,
      '600': hsl(secondaryHue, 65, 30),
      '700': hsl(secondaryHue, 65, 20),
      '800': hsl(secondaryHue, 65, 12),
      '900': hsl(secondaryHue, 65, 6),
    },
    accent: {
      '50': hsl(accentHue, 80, 95),
      '100': hsl(accentHue, 80, 85),
      '200': hsl(accentHue, 80, 75),
      '300': hsl(accentHue, 80, 65),
      '400': hsl(accentHue, 80, 58),
      '500': accent,
      '600': hsl(accentHue, 80, 35),
      '700': hsl(accentHue, 80, 25),
      '800': hsl(accentHue, 80, 15),
      '900': hsl(accentHue, 80, 8),
    },
    neutral: {
      '50': '#F9FAFB',
      '100': '#F3F4F6',
      '200': '#E5E7EB',
      '300': '#D1D5DB',
      '400': '#9CA3AF',
      '500': '#6B7280',
      '600': '#4B5563',
      '700': '#374151',
      '800': '#1F2937',
      '900': '#111827',
    },
    background: {
      light: '#F9FAFB',
      DEFAULT: '#FFFFFF',
      dark: '#111827',
    },
  }
}

export function generateFallbackDesignSystem(brandName: string): DesignSystem {
  const palette = generateFallbackPalette(brandName)
  const p500 = palette.primary['500']
  const p600 = palette.primary['600']
  const p50 = palette.primary['50']
  const s500 = palette.secondary['500']
  const s600 = palette.secondary['600']
  const n100 = palette.neutral['100']
  const n200 = palette.neutral['200']
  const n300 = palette.neutral['300']
  const n700 = palette.neutral['700']

  return {
    colors: palette,
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
      scale: {
        h1: { size: '48px', weight: '700', lineHeight: '1.2' },
        h2: { size: '36px', weight: '600', lineHeight: '1.3' },
        h3: { size: '24px', weight: '600', lineHeight: '1.4' },
        h4: { size: '20px', weight: '600', lineHeight: '1.4' },
        body: { size: '16px', weight: '400', lineHeight: '1.6' },
        small: { size: '14px', weight: '400', lineHeight: '1.5' },
      },
    },
    spacing: {
      xs: '4px', sm: '8px', md: '16px', lg: '24px',
      xl: '32px', '2xl': '48px', '3xl': '64px',
    },
    borderRadius: {
      none: '0px', sm: '4px', md: '8px', lg: '12px',
      xl: '16px', '2xl': '24px', full: '9999px',
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    },
    buttons: {
      primary: { bg: p500, text: '#FFFFFF', radius: '12px', padding: '12px 24px', fontSize: '16px', fontWeight: '600' },
      secondary: { bg: s500, text: '#FFFFFF', radius: '12px', padding: '12px 24px', fontSize: '16px', fontWeight: '600' },
      ghost: { bg: 'transparent', text: n700, radius: '12px', padding: '12px 24px', fontSize: '16px', fontWeight: '500' },
      destructive: { bg: '#EF4444', text: '#FFFFFF', radius: '12px', padding: '12px 24px', fontSize: '16px', fontWeight: '600' },
    },
    cards: { bg: '#FFFFFF', border: `1px solid ${n200}`, radius: '16px', shadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', padding: '24px' },
    forms: {
      input: { bg: '#FFFFFF', border: `1px solid ${n300}`, radius: '8px', padding: '12px 16px', focusBorder: p500 },
      label: { fontSize: '14px', fontWeight: '500', color: n700 },
    },
  }
}

export function generateFallbackBrandAnalysis(brandName: string): BrandAnalysis {
  return {
    personality: ['modern', 'professional'],
    audience: 'General audience',
    tone: 'Professional',
    visualStyle: 'Clean and minimal',
    industry: 'Technology',
    keywords: [brandName.toLowerCase()],
  }
}

export function generateFallbackGuidelines(brandName: string): Record<string, unknown> {
  return {
    overview: {
      mission: `To provide innovative solutions through ${brandName}`,
      vision: 'Leading the industry with quality and innovation',
      values: ['Innovation', 'Quality', 'Integrity'],
    },
  }
}

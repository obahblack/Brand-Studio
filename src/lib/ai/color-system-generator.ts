import type { ColorSystem, ColorToken, SemanticColors, ComponentColors, SocialColors, ColorPairing } from '@/types/database'
import {
  hexToRgb, hexToHsl, hslToHex, lighten, darken, desaturate,
  blendWithWhite, contrastRatio, bestTextColor, generateShades, isValidHex
} from '@/lib/colors'

function t(value: string, source: ColorToken['source'], confidence?: number, description?: string): ColorToken {
  return { value, source, confidence, description }
}

function deriveHover(base: string): string {
  const hsl = hexToHsl(base)
  if (!hsl) return darken(base, 6)
  return hslToHex(hsl.h, Math.min(100, hsl.s + 5), Math.max(0, hsl.l - 6))
}

function deriveActive(base: string): string {
  const hsl = hexToHsl(base)
  if (!hsl) return darken(base, 12)
  return hslToHex(hsl.h, Math.min(100, hsl.s + 8), Math.max(0, hsl.l - 12))
}

function deriveSubtle(base: string): string {
  return blendWithWhite(base, 0.92)
}

function buildSemantic(primary: string, secondary: string, accent: string, neutral: string): SemanticColors {
  const n = (shade: string) => neutral || '#6B7280'
  return {
    brand: {
      primary: t(primary, 'extracted', 0.9, 'Main brand color'),
      'primary-hover': t(deriveHover(primary), 'inferred', 0.85, 'Hover state for primary actions'),
      'primary-active': t(deriveActive(primary), 'inferred', 0.85, 'Active/pressed state'),
      secondary: t(secondary, 'extracted', 0.85, 'Secondary brand color'),
      'secondary-hover': t(deriveHover(secondary), 'inferred', 0.8, 'Hover state for secondary'),
      accent: t(accent, 'extracted', 0.8, 'Accent highlight color'),
      'accent-subtle': t(deriveSubtle(accent), 'inferred', 0.75, 'Subtle accent background'),
    },
    background: {
      canvas: t('#F9FAFB', 'generated', 1, 'Page background'),
      surface: t('#FFFFFF', 'generated', 1, 'Card and surface background'),
      'surface-alt': t('#F3F4F6', 'generated', 0.95, 'Alternate section background'),
      subtle: t(deriveSubtle(primary), 'inferred', 0.8, 'Subtle tinted background'),
      inverse: t('#111827', 'generated', 1, 'Dark/inverted background'),
      overlay: t('rgba(0,0,0,0.5)', 'generated', 1, 'Modal overlay'),
    },
    text: {
      primary: t('#111827', 'generated', 1, 'Primary body text'),
      secondary: t('#4B5563', 'generated', 0.95, 'Secondary/supporting text'),
      muted: t('#9CA3AF', 'generated', 0.9, 'Muted/placeholder text'),
      inverse: t('#FFFFFF', 'generated', 1, 'Text on dark backgrounds'),
      'on-brand': t(bestTextColor(primary), 'inferred', 0.9, 'Text on brand primary'),
      link: t(primary, 'inferred', 0.85, 'Link color'),
      'link-hover': t(deriveHover(primary), 'inferred', 0.8, 'Link hover state'),
      disabled: t('#D1D5DB', 'generated', 0.9, 'Disabled text'),
    },
    border: {
      default: t('#E5E7EB', 'generated', 0.95, 'Default border'),
      subtle: t('#F3F4F6', 'generated', 0.9, 'Subtle separator'),
      strong: t('#9CA3AF', 'generated', 0.85, 'Strong emphasis border'),
      focus: t(primary, 'inferred', 0.9, 'Focus ring color'),
      inverse: t('#374151', 'generated', 0.85, 'Border on dark backgrounds'),
      disabled: t('#E5E7EB', 'generated', 0.9, 'Disabled border'),
    },
    status: {
      info: t('#3B82F6', 'generated', 0.9, 'Informational'),
      'info-background': t('#EFF6FF', 'generated', 0.9, 'Info background'),
      'info-border': t('#BFDBFE', 'generated', 0.9, 'Info border'),
      success: t('#10B981', 'generated', 0.9, 'Success'),
      'success-background': t('#ECFDF5', 'generated', 0.9, 'Success background'),
      'success-border': t('#A7F3D0', 'generated', 0.9, 'Success border'),
      warning: t('#F59E0B', 'generated', 0.9, 'Warning'),
      'warning-background': t('#FFFBEB', 'generated', 0.9, 'Warning background'),
      'warning-border': t('#FDE68A', 'generated', 0.9, 'Warning border'),
      error: t('#EF4444', 'generated', 0.9, 'Error'),
      'error-background': t('#FEF2F2', 'generated', 0.9, 'Error background'),
      'error-border': t('#FECACA', 'generated', 0.9, 'Error border'),
    },
  }
}

function buildComponent(semantic: SemanticColors, primary: string, secondary: string): ComponentColors {
  return {
    'button-primary': {
      background: t(primary, 'extracted', 0.9, 'Primary button background'),
      'background-hover': t(semantic.brand['primary-hover'].value, 'inferred', 0.85, 'Hover'),
      'background-active': t(semantic.brand['primary-active'].value, 'inferred', 0.85, 'Active'),
      'background-disabled': t('#D1D5DB', 'generated', 0.9, 'Disabled'),
      text: t('#FFFFFF', 'generated', 1, 'Primary button text'),
      'text-disabled': t('#9CA3AF', 'generated', 0.9, 'Disabled text'),
      border: t('transparent', 'generated', 1, 'Border'),
      'focus-ring': t(semantic.brand.primary.value, 'inferred', 0.9, 'Focus ring'),
    },
    'button-secondary': {
      background: t(secondary, 'extracted', 0.85, 'Secondary button background'),
      'background-hover': t(deriveHover(secondary), 'inferred', 0.8, 'Hover'),
      'background-active': t(deriveActive(secondary), 'inferred', 0.8, 'Active'),
      'background-disabled': t('#E5E7EB', 'generated', 0.9, 'Disabled'),
      text: t('#FFFFFF', 'generated', 1, 'Secondary button text'),
      'text-disabled': t('#9CA3AF', 'generated', 0.9, 'Disabled text'),
      border: t('transparent', 'generated', 1, 'Border'),
      'focus-ring': t(secondary, 'inferred', 0.85, 'Focus ring'),
    },
    'button-destructive': {
      background: t('#EF4444', 'generated', 0.9, 'Destructive button background'),
      'background-hover': t('#DC2626', 'generated', 0.9, 'Hover'),
      'background-active': t('#B91C1C', 'generated', 0.9, 'Active'),
      'background-disabled': t('#F3F4F6', 'generated', 0.9, 'Disabled'),
      text: t('#FFFFFF', 'generated', 1, 'Destructive button text'),
      border: t('transparent', 'generated', 1, 'Border'),
      'focus-ring': t('#EF4444', 'generated', 0.9, 'Focus ring'),
    },
    input: {
      background: t('#FFFFFF', 'generated', 1, 'Input background'),
      text: t('#111827', 'generated', 1, 'Input text'),
      placeholder: t('#9CA3AF', 'generated', 0.9, 'Placeholder'),
      border: t('#D1D5DB', 'generated', 0.9, 'Input border'),
      'border-focus': t(primary, 'inferred', 0.9, 'Focus border'),
      'background-disabled': t('#F9FAFB', 'generated', 0.9, 'Disabled input'),
    },
    card: {
      background: t('#FFFFFF', 'generated', 1, 'Card background'),
      border: t('#E5E7EB', 'generated', 0.9, 'Card border'),
      'shadow-color': t('rgba(0,0,0,0.08)', 'generated', 0.9, 'Card shadow'),
    },
    badge: {
      'default-background': t(deriveSubtle(primary), 'inferred', 0.85, 'Default badge bg'),
      'default-text': t(primary, 'inferred', 0.85, 'Default badge text'),
      'success-background': t('#ECFDF5', 'generated', 0.9, 'Success badge bg'),
      'success-text': t('#065F46', 'generated', 0.9, 'Success badge text'),
      'warning-background': t('#FFFBEB', 'generated', 0.9, 'Warning badge bg'),
      'warning-text': t('#92400E', 'generated', 0.9, 'Warning badge text'),
      'error-background': t('#FEF2F2', 'generated', 0.9, 'Error badge bg'),
      'error-text': t('#991B1B', 'generated', 0.9, 'Error badge text'),
    },
    navigation: {
      background: t('#FFFFFF', 'generated', 1, 'Nav background'),
      'active-background': t(deriveSubtle(primary), 'inferred', 0.85, 'Active nav bg'),
      text: t('#374151', 'generated', 0.95, 'Nav text'),
      'active-text': t(primary, 'inferred', 0.9, 'Active nav text'),
    },
    divider: { default: t('#E5E7EB', 'generated', 0.9, 'Default divider') },
    icon: {
      default: t('#374151', 'generated', 0.95, 'Default icon'),
      muted: t('#9CA3AF', 'generated', 0.9, 'Muted icon'),
      inverse: t('#FFFFFF', 'generated', 1, 'Inverse icon'),
    },
  }
}

function buildSocial(primary: string, secondary: string, accent: string): SocialColors {
  return {
    'background-primary': t(primary, 'extracted', 0.9, 'Main social asset background'),
    'background-secondary': t(secondary, 'extracted', 0.85, 'Secondary social background'),
    'background-dark': t(darken(primary, 25), 'inferred', 0.85, 'Dark social background'),
    headline: t(bestTextColor(primary), 'inferred', 0.9, 'Social headline text'),
    'body-text': t(bestTextColor(primary) === '#FFFFFF' ? '#E5E7EB' : '#374151', 'inferred', 0.85, 'Social body text'),
    'muted-text': t(bestTextColor(primary) === '#FFFFFF' ? '#9CA3AF' : '#6B7280', 'inferred', 0.8, 'Social muted text'),
    'cta-background': t(accent, 'extracted', 0.8, 'CTA button on social'),
    'cta-text': t(bestTextColor(accent), 'inferred', 0.85, 'CTA text on social'),
    highlight: t(accent, 'extracted', 0.8, 'Highlight/accent'),
    'decorative-accent': t(secondary, 'extracted', 0.8, 'Decorative accent'),
    'border-frame': t(lighten(primary, 40), 'inferred', 0.75, 'Frame/border on social'),
    'photo-overlay': t('rgba(0,0,0,0.3)', 'generated', 0.85, 'Photo overlay'),
    'gradient-start': t(primary, 'extracted', 0.9, 'Gradient start'),
    'gradient-end': t(darken(primary, 20), 'inferred', 0.85, 'Gradient end'),
  }
}

function buildPairings(semantic: SemanticColors, primary: string, secondary: string, accent: string): ColorPairing[] {
  const pairs: [string, string, string, string?][] = [
    [primary, '#FFFFFF', 'Primary CTA on light background', 'social-post'],
    ['#FFFFFF', primary, 'Light card with brand primary', 'social-post'],
    [semantic.background.surface.value, semantic.text.primary.value, 'Body text on surface', 'social-post'],
    [semantic.background.inverse.value, semantic.text.inverse.value, 'Inverse surface text', 'social-post'],
    [accent, bestTextColor(accent), 'Accent CTA', 'social-post'],
    [primary, '#FFFFFF', 'Primary button', 'button'],
    [secondary, '#FFFFFF', 'Secondary button', 'button'],
    [semantic.status.success.value, '#FFFFFF', 'Success action', 'status'],
    [semantic.status.error.value, '#FFFFFF', 'Error action', 'status'],
    ['#111827', '#FFFFFF', 'Dark headline', 'heading'],
  ]
  return pairs.map(([bg, fg, usage, assetType]) => {
    const ratio = contrastRatio(bg, fg)
    return {
      background: bg,
      foreground: fg,
      usage,
      contrastRatio: Math.round(ratio * 100) / 100,
      passesAA: ratio >= 4.5,
      passesAAA: ratio >= 7,
      recommendedAssetType: assetType,
    }
  })
}

export function buildColorSystem(
  primary: string,
  secondary: string,
  accent: string,
  sourceType: ColorSystem['sourceType'],
  evidence?: ColorSystem['extractionEvidence'],
  rationale?: string,
): ColorSystem {
  const neutralBase = '#6B7280'

  const primitive: ColorSystem['primitive'] = {
    primary: Object.fromEntries(
      Object.entries(generateShades(primary)).map(([k, v]) => [k, t(v, sourceType === 'website' ? 'extracted' : 'generated', 0.9)])
    ),
    secondary: Object.fromEntries(
      Object.entries(generateShades(secondary)).map(([k, v]) => [k, t(v, sourceType === 'website' ? 'extracted' : 'generated', 0.85)])
    ),
    accent: Object.fromEntries(
      Object.entries(generateShades(accent)).map(([k, v]) => [k, t(v, sourceType === 'website' ? 'extracted' : 'generated', 0.8)])
    ),
    neutral: Object.fromEntries(
      Object.entries(generateShades(neutralBase)).map(([k, v]) => [k, t(v, 'generated', 0.9)])
    ),
  }

  const semantic = buildSemantic(primary, secondary, accent, neutralBase)
  const component = buildComponent(semantic, primary, secondary)
  const social = buildSocial(primary, secondary, accent)
  const pairings = buildPairings(semantic, primary, secondary, accent)

  return {
    status: 'ready',
    sourceType,
    version: 1,
    primitive,
    semantic,
    component,
    social,
    pairings,
    extractionEvidence: evidence,
    generatedRationale: rationale,
    lastAnalyzedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export function generateFallbackColorSystem(brandName: string): ColorSystem {
  const hash = brandName.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const hue = hash % 360
  const primary = hslToHex(hue, 70, 40)
  const secondary = hslToHex((hue + 180) % 360, 65, 45)
  const accent = hslToHex((hue + 60) % 360, 80, 50)

  return buildColorSystem(primary, secondary, accent, 'generated', undefined,
    `Generated from brand name "${brandName}" using deterministic color derivation. Primary hue: ${hue}°, secondary: ${(hue + 180) % 360}°, accent: ${(hue + 60) % 360}°.`
  )
}

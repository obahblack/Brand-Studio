export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const h = hex.replace('#', '')
  if (h.length !== 6 && h.length !== 3) return null
  const full = h.length === 3 ? h[0] + h[0] + h[1] + h[1] + h[2] + h[2] : h
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  }
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

export function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const rgb = hexToRgb(hex)
  if (!rgb) return null
  const r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) }
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

export function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs((h / 60) % 2 - 1))
  const m = l - c / 2
  let r = 0, g = 0, b = 0
  if (h < 60) { r = c; g = x }
  else if (h < 120) { r = x; g = c }
  else if (h < 180) { g = c; b = x }
  else if (h < 240) { g = x; b = c }
  else if (h < 300) { r = x; b = c }
  else { r = c; b = x }
  return rgbToHex(Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255))
}

export function luminance(hex: string): number {
  const rgb = hexToRgb(hex)
  if (!rgb) return 0
  const [rl, gl, bl] = [rgb.r, rgb.g, rgb.b].map(c => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl
}

export function contrastRatio(hex1: string, hex2: string): number {
  const l1 = luminance(hex1)
  const l2 = luminance(hex2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

export function meetsAA(fg: string, bg: string): boolean {
  return contrastRatio(fg, bg) >= 4.5
}

export function meetsAAA(fg: string, bg: string): boolean {
  return contrastRatio(fg, bg) >= 7
}

export function lighten(hex: string, amount: number): string {
  const hsl = hexToHsl(hex)
  if (!hsl) return hex
  return hslToHex(hsl.h, hsl.s, Math.min(100, hsl.l + amount))
}

export function darken(hex: string, amount: number): string {
  const hsl = hexToHsl(hex)
  if (!hsl) return hex
  return hslToHex(hsl.h, hsl.s, Math.max(0, hsl.l - amount))
}

export function desaturate(hex: string, amount: number): string {
  const hsl = hexToHsl(hex)
  if (!hsl) return hex
  return hslToHex(hsl.h, Math.max(0, hsl.s - amount), hsl.l)
}

export function saturate(hex: string, amount: number): string {
  const hsl = hexToHsl(hex)
  if (!hsl) return hex
  return hslToHex(hsl.h, Math.min(100, hsl.s + amount), hsl.l)
}

export function blendWithWhite(hex: string, ratio: number): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  return rgbToHex(
    Math.round(rgb.r + (255 - rgb.r) * ratio),
    Math.round(rgb.g + (255 - rgb.g) * ratio),
    Math.round(rgb.b + (255 - rgb.b) * ratio),
  )
}

export function generateShades(baseHex: string): Record<string, string> {
  const hsl = hexToHsl(baseHex)
  if (!hsl) return {}
  return {
    '50': hslToHex(hsl.h, Math.min(100, hsl.s + 10), 97),
    '100': hslToHex(hsl.h, Math.min(100, hsl.s + 5), 93),
    '200': hslToHex(hsl.h, hsl.s, 86),
    '300': hslToHex(hsl.h, hsl.s, 74),
    '400': hslToHex(hsl.h, hsl.s, 62),
    '500': baseHex,
    '600': hslToHex(hsl.h, hsl.s, Math.max(0, hsl.l - 8)),
    '700': hslToHex(hsl.h, hsl.s, Math.max(0, hsl.l - 16)),
    '800': hslToHex(hsl.h, hsl.s, Math.max(0, hsl.l - 24)),
    '900': hslToHex(hsl.h, hsl.s, Math.max(0, hsl.l - 32)),
  }
}

export function bestTextColor(bgHex: string): string {
  return luminance(bgHex) > 0.4 ? '#111827' : '#FFFFFF'
}

export function isValidHex(hex: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(hex)
}

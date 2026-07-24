export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface BrandKit {
  id: string
  user_id: string
  brand_name: string
  website_url: string | null
  brand_description: string | null
  logo_url: string | null
  brand_analysis: BrandAnalysis | null
  design_system: DesignSystem | null
  color_palette: ColorPalette | null
  color_system: ColorSystem | null
  typography: Typography | null
  design_tokens: DesignTokens | null
  status: 'pending' | 'processing' | 'completed' | 'failed'
  error_message: string | null
  created_at: string
  updated_at: string
}

export interface BrandVoice {
  style: string
  personality: string[]
  dos: string[]
  donts: string[]
  examples: {
    formal: string
    casual: string
    social: string
  }
  adjectives: string[]
  communicationValues: string[]
}

export interface BrandAnalysis {
  personality: string[]
  audience: string
  tone: string
  visualStyle: string
  industry: string
  keywords: string[]
  brandVoice?: BrandVoice
  competitors?: string[]
  uniqueSellingPoints?: string[]
}

export interface ColorPalette {
  primary: Record<string, string>
  secondary: Record<string, string>
  accent: Record<string, string>
  neutral: Record<string, string>
  background: Record<string, string>
}

export interface ColorToken {
  value: string
  source: 'extracted' | 'inferred' | 'generated' | 'manually_overridden'
  confidence?: number
  description?: string
  evidence?: { page: string; selector: string; property: string }[]
  isOverridden?: boolean
}

export interface SemanticColors {
  brand: {
    primary: ColorToken
    'primary-hover': ColorToken
    'primary-active': ColorToken
    secondary: ColorToken
    'secondary-hover': ColorToken
    accent: ColorToken
    'accent-subtle': ColorToken
  }
  background: {
    canvas: ColorToken
    surface: ColorToken
    'surface-alt': ColorToken
    subtle: ColorToken
    inverse: ColorToken
    overlay: ColorToken
  }
  text: {
    primary: ColorToken
    secondary: ColorToken
    muted: ColorToken
    inverse: ColorToken
    'on-brand': ColorToken
    link: ColorToken
    'link-hover': ColorToken
    disabled: ColorToken
  }
  border: {
    default: ColorToken
    subtle: ColorToken
    strong: ColorToken
    focus: ColorToken
    inverse: ColorToken
    disabled: ColorToken
  }
  status: {
    info: ColorToken
    'info-background': ColorToken
    'info-border': ColorToken
    success: ColorToken
    'success-background': ColorToken
    'success-border': ColorToken
    warning: ColorToken
    'warning-background': ColorToken
    'warning-border': ColorToken
    error: ColorToken
    'error-background': ColorToken
    'error-border': ColorToken
  }
}

export interface ComponentColors {
  'button-primary': {
    background: ColorToken
    'background-hover': ColorToken
    'background-active': ColorToken
    'background-disabled': ColorToken
    text: ColorToken
    'text-disabled': ColorToken
    border: ColorToken
    'focus-ring': ColorToken
  }
  'button-secondary': {
    background: ColorToken
    'background-hover': ColorToken
    'background-active': ColorToken
    'background-disabled': ColorToken
    text: ColorToken
    'text-disabled': ColorToken
    border: ColorToken
    'focus-ring': ColorToken
  }
  'button-destructive': {
    background: ColorToken
    'background-hover': ColorToken
    'background-active': ColorToken
    'background-disabled': ColorToken
    text: ColorToken
    border: ColorToken
    'focus-ring': ColorToken
  }
  input: {
    background: ColorToken
    text: ColorToken
    placeholder: ColorToken
    border: ColorToken
    'border-focus': ColorToken
    'background-disabled': ColorToken
  }
  card: {
    background: ColorToken
    border: ColorToken
    'shadow-color': ColorToken
  }
  badge: {
    'default-background': ColorToken
    'default-text': ColorToken
    'success-background': ColorToken
    'success-text': ColorToken
    'warning-background': ColorToken
    'warning-text': ColorToken
    'error-background': ColorToken
    'error-text': ColorToken
  }
  navigation: {
    background: ColorToken
    'active-background': ColorToken
    text: ColorToken
    'active-text': ColorToken
  }
  divider: { default: ColorToken }
  icon: { default: ColorToken; muted: ColorToken; inverse: ColorToken }
}

export interface SocialColors {
  'background-primary': ColorToken
  'background-secondary': ColorToken
  'background-dark': ColorToken
  headline: ColorToken
  'body-text': ColorToken
  'muted-text': ColorToken
  'cta-background': ColorToken
  'cta-text': ColorToken
  highlight: ColorToken
  'decorative-accent': ColorToken
  'border-frame': ColorToken
  'photo-overlay': ColorToken
  'gradient-start': ColorToken
  'gradient-end': ColorToken
}

export interface ColorPairing {
  background: string
  foreground: string
  usage: string
  contrastRatio: number
  passesAA: boolean
  passesAAA: boolean
  recommendedAssetType?: string
}

export interface ColorSystem {
  status: 'queued' | 'extracting' | 'classifying' | 'generating' | 'partially_ready' | 'ready' | 'failed'
  sourceType: 'website' | 'generated' | 'partially_extracted'
  version: number
  primitive: Record<string, Record<string, ColorToken>>
  semantic: SemanticColors
  component: ComponentColors
  social: SocialColors
  pairings: ColorPairing[]
  extractionEvidence?: { page: string; selector: string; property: string; value: string; role: string }[]
  generatedRationale?: string
  lastAnalyzedAt?: string
  updatedAt: string
}

export interface Typography {
  headingFont: string
  bodyFont: string
  scale: {
    h1: FontSize
    h2: FontSize
    h3: FontSize
    h4: FontSize
    body: FontSize
    small: FontSize
  }
}

export interface FontSize {
  size: string
  weight: string
  lineHeight: string
}

export interface DesignSystem {
  colors: ColorPalette
  typography: Typography
  spacing: Record<string, string>
  borderRadius: Record<string, string>
  shadows: Record<string, string>
  buttons: ButtonStyles
  cards: CardStyles
  forms: FormStyles
}

export interface ButtonStyles {
  primary: ButtonStyle & { hoverBg?: string }
  secondary: ButtonStyle & { hoverBg?: string }
  outline?: ButtonStyle & { border?: string; hoverBg?: string }
  ghost: ButtonStyle & { hoverBg?: string }
  destructive: ButtonStyle
}

export interface ButtonStyle {
  bg: string
  text: string
  radius: string
  padding: string
  fontSize: string
  fontWeight: string
}

export interface CardStyles {
  bg: string
  border: string
  radius: string
  shadow: string
  padding: string
}

export interface FormStyles {
  input: InputStyle
  label: LabelStyle
}

export interface InputStyle {
  bg: string
  border: string
  radius: string
  padding: string
  focusBorder: string
}

export interface LabelStyle {
  fontSize: string
  fontWeight: string
  color: string
}

export interface DesignTokens {
  colors: Record<string, string>
  typography: Record<string, string>
  spacing: Record<string, string>
  borderRadius: Record<string, string>
  shadows: Record<string, string>
}

export interface Asset {
  id: string
  brand_kit_id: string
  asset_type: string
  asset_name: string
  file_url: string | null
  file_type: string | null
  metadata: Record<string, unknown> | null
  created_at: string
}

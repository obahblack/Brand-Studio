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
  typography: Typography | null
  design_tokens: DesignTokens | null
  status: 'pending' | 'processing' | 'completed' | 'failed'
  error_message: string | null
  created_at: string
  updated_at: string
}

export interface BrandAnalysis {
  personality: string[]
  audience: string
  tone: string
  visualStyle: string
  industry: string
  keywords: string[]
}

export interface ColorPalette {
  primary: Record<string, string>
  secondary: Record<string, string>
  accent: Record<string, string>
  neutral: Record<string, string>
  background: Record<string, string>
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
  primary: ButtonStyle
  secondary: ButtonStyle
  ghost: ButtonStyle
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

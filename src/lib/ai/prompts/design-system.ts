export const designSystemPrompt = `You are a design system expert and color scientist. Based on the brand analysis and extracted website colors below, generate a complete, cohesive design system with a full 3-layer color token architecture.

Brand Analysis:
{brandAnalysis}

Extracted Website Colors:
{extractedColors}

Generate a comprehensive design system. Return as JSON with this exact structure:

{
  "colors": {
    "primary": { "50": "#hex", "100": "#hex", "200": "#hex", "300": "#hex", "400": "#hex", "500": "#hex", "600": "#hex", "700": "#hex", "800": "#hex", "900": "#hex" },
    "secondary": { "50": "#hex", "100": "#hex", "200": "#hex", "300": "#hex", "400": "#hex", "500": "#hex", "600": "#hex", "700": "#hex", "800": "#hex", "900": "#hex" },
    "accent": { "50": "#hex", "100": "#hex", "200": "#hex", "300": "#hex", "400": "#hex", "500": "#hex", "600": "#hex", "700": "#hex", "800": "#hex", "900": "#hex" },
    "neutral": { "50": "#hex", "100": "#hex", "200": "#hex", "300": "#hex", "400": "#hex", "500": "#hex", "600": "#hex", "700": "#hex", "800": "#hex", "900": "#hex" },
    "background": { "light": "#hex", "DEFAULT": "#hex", "dark": "#hex" }
  },
  "colorSystem": {
    "semantic": {
      "brand": {
        "primary": { "value": "#hex", "description": "Main brand color for primary actions and key brand elements" },
        "primary-hover": { "value": "#hex", "description": "Hover state for primary elements" },
        "primary-active": { "value": "#hex", "description": "Active/pressed state for primary elements" },
        "secondary": { "value": "#hex", "description": "Secondary brand color" },
        "secondary-hover": { "value": "#hex", "description": "Hover state for secondary elements" },
        "accent": { "value": "#hex", "description": "Accent highlight color for emphasis" },
        "accent-subtle": { "value": "#hex", "description": "Subtle accent for backgrounds and highlights" }
      },
      "background": {
        "canvas": { "value": "#hex", "description": "Page background" },
        "surface": { "value": "#hex", "description": "Card and surface background" },
        "surface-alt": { "value": "#hex", "description": "Alternate section background" },
        "subtle": { "value": "#hex", "description": "Subtle tinted background" },
        "inverse": { "value": "#hex", "description": "Dark/inverted background" }
      },
      "text": {
        "primary": { "value": "#hex", "description": "Primary body text color" },
        "secondary": { "value": "#hex", "description": "Secondary/supporting text" },
        "muted": { "value": "#hex", "description": "Muted/placeholder text" },
        "inverse": { "value": "#hex", "description": "Text on dark backgrounds" },
        "on-brand": { "value": "#hex", "description": "Text color on brand primary background" },
        "link": { "value": "#hex", "description": "Link color" },
        "link-hover": { "value": "#hex", "description": "Link hover state" },
        "disabled": { "value": "#hex", "description": "Disabled text" }
      },
      "border": {
        "default": { "value": "#hex", "description": "Default border color" },
        "subtle": { "value": "#hex", "description": "Subtle separator" },
        "strong": { "value": "#hex", "description": "Strong emphasis border" },
        "focus": { "value": "#hex", "description": "Focus ring color" },
        "disabled": { "value": "#hex", "description": "Disabled border" }
      },
      "status": {
        "info": { "value": "#hex", "description": "Informational color" },
        "info-background": { "value": "#hex", "description": "Info background" },
        "success": { "value": "#hex", "description": "Success color" },
        "success-background": { "value": "#hex", "description": "Success background" },
        "warning": { "value": "#hex", "description": "Warning color" },
        "warning-background": { "value": "#hex", "description": "Warning background" },
        "error": { "value": "#hex", "description": "Error color" },
        "error-background": { "value": "#hex", "description": "Error background" }
      }
    },
    "component": {
      "button-primary": {
        "background": { "value": "#hex", "description": "Primary button background" },
        "background-hover": { "value": "#hex", "description": "Primary button hover" },
        "background-active": { "value": "#hex", "description": "Primary button active" },
        "background-disabled": { "value": "#hex", "description": "Primary button disabled" },
        "text": { "value": "#hex", "description": "Primary button text" },
        "text-disabled": { "value": "#hex", "description": "Primary button disabled text" },
        "focus-ring": { "value": "#hex", "description": "Primary button focus ring" }
      },
      "button-secondary": {
        "background": { "value": "#hex", "description": "Secondary button background" },
        "background-hover": { "value": "#hex", "description": "Secondary button hover" },
        "text": { "value": "#hex", "description": "Secondary button text" },
        "focus-ring": { "value": "#hex", "description": "Secondary button focus ring" }
      },
      "button-destructive": {
        "background": { "value": "#EF4444", "description": "Destructive button background" },
        "background-hover": { "value": "#DC2626", "description": "Destructive button hover" },
        "text": { "value": "#FFFFFF", "description": "Destructive button text" },
        "focus-ring": { "value": "#EF4444", "description": "Destructive button focus ring" }
      },
      "input": {
        "background": { "value": "#hex", "description": "Input background" },
        "border": { "value": "#hex", "description": "Input border" },
        "border-focus": { "value": "#hex", "description": "Input focus border" },
        "text": { "value": "#hex", "description": "Input text" },
        "placeholder": { "value": "#hex", "description": "Input placeholder" }
      },
      "card": {
        "background": { "value": "#hex", "description": "Card background" },
        "border": { "value": "#hex", "description": "Card border" }
      }
    },
    "social": {
      "background-primary": { "value": "#hex", "description": "Main social media asset background" },
      "background-secondary": { "value": "#hex", "description": "Secondary social background" },
      "background-dark": { "value": "#hex", "description": "Dark social asset background" },
      "headline": { "value": "#hex", "description": "Social headline text" },
      "body-text": { "value": "#hex", "description": "Social body text" },
      "muted-text": { "value": "#hex", "description": "Social muted text" },
      "cta-background": { "value": "#hex", "description": "Social CTA button background" },
      "cta-text": { "value": "#hex", "description": "Social CTA text" },
      "highlight": { "value": "#hex", "description": "Highlight/accent color" },
      "decorative-accent": { "value": "#hex", "description": "Decorative accent" },
      "border-frame": { "value": "#hex", "description": "Frame/border on social assets" },
      "gradient-start": { "value": "#hex", "description": "Gradient start color" },
      "gradient-end": { "value": "#hex", "description": "Gradient end color" }
    },
    "pairings": [
      { "background": "#hex", "foreground": "#hex", "usage": "Description of use", "contrastRatio": 7.5, "passesAA": true, "passesAAA": true },
      { "background": "#hex", "foreground": "#hex", "usage": "Description of use", "contrastRatio": 4.8, "passesAA": true, "passesAAA": false }
    ]
  },
  "typography": { ... },
  "spacing": { ... },
  "borderRadius": { ... },
  "shadows": { ... },
  "buttons": { ... },
  "cards": { ... },
  "forms": { ... }
}

Color System Requirements:
1. The primary color should be the dominant brand color (use from extracted colors if available)
2. The secondary color should complement the primary (use from extracted if available)
3. The accent color should be distinctive and eye-catching for highlights
4. Generate proper shade scales (50-900) for each color using perceptual color transforms
5. Semantic tokens must reference or derive from brand colors where appropriate
6. Status colors (info, success, warning, error) should be professional and accessible
7. All foreground/background pairs must meet WCAG AA contrast (4.5:1 minimum)
8. Social media colors should create compelling visual hierarchy
9. Button states (hover, active, disabled) must be perceptually distinct
10. Use the extracted website colors as the foundation - do not ignore them
11. Backgrounds should be light and clean unless the brand is dark-themed
12. Generate at least 6 meaningful color pairings for the pairings array

Design Guidelines:
1. Colors should be harmonious and reflect the brand personality
2. Ensure sufficient contrast for accessibility (WCAG AA minimum)
3. Create a cohesive visual language across all elements
4. Derive hover, active, and disabled states from base colors using HSL transforms
5. Status colors should be distinct from brand colors
6. Social media palette should work across light and dark asset backgrounds`


export const brandColorSystemPrompt = `You are a brand color system architect. Given the brand analysis and extracted website colors, determine the 3 foundational brand colors:

1. PRIMARY: The dominant brand color used for key actions, headers, and primary brand elements
2. SECONDARY: A complementary color used for secondary actions and supporting elements
3. ACCENT: A distinctive highlight color for emphasis, badges, and decorative elements

Brand Analysis:
{brandAnalysis}

Extracted Website Colors:
{extractedColors}

Rules:
- If the website has clear brand colors, use them directly
- If the website colors are generic (white/black/gray), generate colors based on brand personality and industry
- The three colors must be visually distinct and harmonious
- Consider color psychology for the industry
- The primary color should have the highest visual prominence
- Return ONLY a JSON object:
{
  "primary": "#hex",
  "secondary": "#hex",
  "accent": "#hex",
  "rationale": "Brief explanation of color choices"
}`

export const designSystemPrompt = `You are a design system expert. Based on the brand analysis below, generate a complete, cohesive design system.

Brand Analysis:
{brandAnalysis}

Generate a comprehensive design system with the following structure. Be specific with exact hex values, pixel sizes, and font names.

Return as JSON with this exact structure:
{
  "colors": {
    "primary": {
      "50": "#hex",
      "100": "#hex",
      "200": "#hex",
      "300": "#hex",
      "400": "#hex",
      "500": "#hex",
      "600": "#hex",
      "700": "#hex",
      "800": "#hex",
      "900": "#hex"
    },
    "secondary": {
      "50": "#hex",
      "100": "#hex",
      "200": "#hex",
      "300": "#hex",
      "400": "#hex",
      "500": "#hex",
      "600": "#hex",
      "700": "#hex",
      "800": "#hex",
      "900": "#hex"
    },
    "accent": {
      "50": "#hex",
      "100": "#hex",
      "200": "#hex",
      "300": "#hex",
      "400": "#hex",
      "500": "#hex",
      "600": "#hex",
      "700": "#hex",
      "800": "#hex",
      "900": "#hex"
    },
    "neutral": {
      "50": "#hex",
      "100": "#hex",
      "200": "#hex",
      "300": "#hex",
      "400": "#hex",
      "500": "#hex",
      "600": "#hex",
      "700": "#hex",
      "800": "#hex",
      "900": "#hex"
    },
    "background": {
      "light": "#hex",
      "DEFAULT": "#hex",
      "dark": "#hex"
    }
  },
  "typography": {
    "headingFont": "Font Name",
    "bodyFont": "Font Name",
    "scale": {
      "h1": {
        "size": "48px",
        "weight": "700",
        "lineHeight": "1.2",
        "letterSpacing": "-0.02em"
      },
      "h2": {
        "size": "36px",
        "weight": "600",
        "lineHeight": "1.3",
        "letterSpacing": "-0.01em"
      },
      "h3": {
        "size": "24px",
        "weight": "600",
        "lineHeight": "1.4"
      },
      "h4": {
        "size": "20px",
        "weight": "600",
        "lineHeight": "1.4"
      },
      "body": {
        "size": "16px",
        "weight": "400",
        "lineHeight": "1.6"
      },
      "small": {
        "size": "14px",
        "weight": "400",
        "lineHeight": "1.5"
      }
    }
  },
  "spacing": {
    "xs": "4px",
    "sm": "8px",
    "md": "16px",
    "lg": "24px",
    "xl": "32px",
    "2xl": "48px",
    "3xl": "64px"
  },
  "borderRadius": {
    "none": "0px",
    "sm": "4px",
    "md": "8px",
    "lg": "12px",
    "xl": "16px",
    "2xl": "24px",
    "full": "9999px"
  },
  "shadows": {
    "sm": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    "DEFAULT": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    "md": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    "lg": "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    "xl": "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
  },
  "buttons": {
    "primary": {
      "bg": "(use the 500 shade of your primary palette e.g. #2563EB)",
      "text": "#ffffff",
      "hoverBg": "(use the 600 shade of your primary palette e.g. #1D4ED8)",
      "radius": "12px",
      "padding": "12px 24px",
      "fontSize": "16px",
      "fontWeight": "600"
    },
    "secondary": {
      "bg": "(use the 500 shade of your secondary palette)",
      "text": "#ffffff",
      "hoverBg": "(use the 600 shade of your secondary palette)",
      "radius": "12px",
      "padding": "12px 24px",
      "fontSize": "16px",
      "fontWeight": "600"
    },
    "outline": {
      "bg": "transparent",
      "text": "(use the 500 shade of your primary palette)",
      "border": "2px solid (use the 500 shade of your primary palette)",
      "hoverBg": "(use the 50 shade of your primary palette)",
      "radius": "12px",
      "padding": "10px 22px",
      "fontSize": "16px",
      "fontWeight": "600"
    },
    "ghost": {
      "bg": "transparent",
      "text": "(use the 700 shade of your neutral palette)",
      "hoverBg": "(use the 100 shade of your neutral palette)",
      "radius": "12px",
      "padding": "12px 24px",
      "fontSize": "16px",
      "fontWeight": "500"
    }
  },
  "cards": {
    "bg": "#ffffff",
    "border": "1px solid (use the 200 shade of your neutral palette)",
    "radius": "16px",
    "shadow": "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    "padding": "24px"
  },
  "forms": {
    "input": {
      "bg": "#ffffff",
      "border": "1px solid (use the 300 shade of your neutral palette)",
      "radius": "8px",
      "padding": "12px 16px",
      "focusBorder": "(use the 500 shade of your primary palette)",
      "focusShadow": "0 0 0 3px rgba(37, 99, 235, 0.1)"
    },
    "label": {
      "fontSize": "14px",
      "fontWeight": "500",
      "color": "(use the 700 shade of your neutral palette)"
    }
  }
}

Design Guidelines:
1. Colors should be harmonious and reflect the brand personality
2. Typography should be readable and professional
3. Spacing should be consistent and create visual rhythm
4. Components should feel modern and clean
5. Use Google Fonts that are widely available
6. Ensure sufficient contrast for accessibility
7. Create a cohesive visual language across all elements`

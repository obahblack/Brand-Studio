export const brandGuidelinesPrompt = `You are a brand strategist. Based on the brand analysis and design system below, create comprehensive brand guidelines.

Brand Analysis:
{brandAnalysis}

Design System:
{designSystem}

Generate detailed brand guidelines that include:

1. Brand Overview
   - Mission statement
   - Vision statement
   - Core values

2. Brand Voice & Tone
   - Communication style
   - Do's and Don'ts
   - Example copy

3. Visual Identity
   - Logo usage guidelines
   - Color usage rules
   - Typography hierarchy
   - Imagery style

4. Application Guidelines
   - Business cards
   - Letterhead
   - Social media
   - Presentations

Return as JSON with this exact structure:
{
  "overview": {
    "mission": "Mission statement",
    "vision": "Vision statement",
    "values": ["value1", "value2", "value3"],
    "tagline": "Brand tagline"
  },
  "voice": {
    "style": "Communication style description",
    "personality": "Brand personality in words",
    "dos": ["Do 1", "Do 2", "Do 3"],
    "donts": ["Don't 1", "Don't 2", "Don't 3"],
    "examples": {
      "formal": "Example formal copy",
      "casual": "Example casual copy",
      "social": "Example social media copy"
    }
  },
  "visualIdentity": {
    "logoRules": {
      "minimumSize": "24px height",
      "clearSpace": "1x logo height",
      "versions": ["Full color", "Monochrome", "Reversed"],
      "usage": "Logo usage guidelines"
    },
    "colorUsage": {
      "primaryUsage": "When to use primary colors",
      "secondaryUsage": "When to use secondary colors",
      "accentUsage": "When to use accent colors",
      "backgrounds": "Background color guidelines"
    },
    "typographyRules": {
      "hierarchy": "How to use type hierarchy",
      "pairing": "Font pairing guidelines",
      "readability": "Readability guidelines"
    },
    "imagery": {
      "style": "Image style description",
      "treatment": "How to treat images",
      "filters": "Filter guidelines"
    }
  },
  "applications": {
    "businessCard": {
      "dimensions": "3.5 x 2 inches",
      "layout": "Layout description",
      "notes": "Additional notes"
    },
    "letterhead": {
      "dimensions": "8.5 x 11 inches",
      "layout": "Layout description",
      "notes": "Additional notes"
    },
    "socialMedia": {
      "profile": "Profile image guidelines",
      "cover": "Cover image guidelines",
      "posts": "Post design guidelines",
      "stories": "Story design guidelines"
    },
    "presentations": {
      "slideSize": "16:9 ratio",
      "layout": "Slide layout guidelines",
      "notes": "Additional notes"
    }
  }
}

Make the guidelines practical and actionable. Include specific measurements and rules where possible.`

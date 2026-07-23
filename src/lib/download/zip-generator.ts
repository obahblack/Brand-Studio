import JSZip from 'jszip'
import { generateBrandGuidelinesPDF } from '@/lib/generators/pdf/brand-guidelines'
import { selectMany } from '@/lib/neon'
import type { BrandKit, Asset } from '@/types/database'

function generateCSSVariables(brandKit: BrandKit): string {
  const colors = brandKit.design_system?.colors || brandKit.color_palette
  const typography = brandKit.design_system?.typography || brandKit.typography
  const spacing = brandKit.design_system?.spacing
  const borderRadius = brandKit.design_system?.borderRadius

  return `
:root {
  /* Colors */
  --color-primary: ${colors?.primary?.['500'] || '#2563EB'};
  --color-primary-light: ${colors?.primary?.['100'] || '#DBEAFE'};
  --color-primary-dark: ${colors?.primary?.['700'] || '#1D4ED8'};
  --color-secondary: ${colors?.secondary?.['500'] || '#10B981'};
  --color-accent: ${colors?.accent?.['500'] || '#F59E0B'};
  
  /* Neutrals */
  --color-neutral-50: ${colors?.neutral?.['50'] || '#F9FAFB'};
  --color-neutral-100: ${colors?.neutral?.['100'] || '#F3F4F6'};
  --color-neutral-200: ${colors?.neutral?.['200'] || '#E5E7EB'};
  --color-neutral-300: ${colors?.neutral?.['300'] || '#D1D5DB'};
  --color-neutral-400: ${colors?.neutral?.['400'] || '#9CA3AF'};
  --color-neutral-500: ${colors?.neutral?.['500'] || '#6B7280'};
  --color-neutral-600: ${colors?.neutral?.['600'] || '#4B5563'};
  --color-neutral-700: ${colors?.neutral?.['700'] || '#374151'};
  --color-neutral-800: ${colors?.neutral?.['800'] || '#1F2937'};
  --color-neutral-900: ${colors?.neutral?.['900'] || '#111827'};
  
  /* Typography */
  --font-heading: ${typography?.headingFont || 'Inter'}, sans-serif;
  --font-body: ${typography?.bodyFont || 'Inter'}, sans-serif;
  
  /* Spacing */
  --spacing-xs: ${spacing?.xs || '4px'};
  --spacing-sm: ${spacing?.sm || '8px'};
  --spacing-md: ${spacing?.md || '16px'};
  --spacing-lg: ${spacing?.lg || '24px'};
  --spacing-xl: ${spacing?.xl || '32px'};
  --spacing-2xl: ${spacing?.['2xl'] || '48px'};
  --spacing-3xl: ${spacing?.['3xl'] || '64px'};
  
  /* Border Radius */
  --radius-sm: ${borderRadius?.sm || '4px'};
  --radius-md: ${borderRadius?.md || '8px'};
  --radius-lg: ${borderRadius?.lg || '12px'};
  --radius-xl: ${borderRadius?.xl || '16px'};
  --radius-full: ${borderRadius?.full || '9999px'};
}
`
}

function generateJSONFile(data: Record<string, unknown>, pretty: boolean = true): string {
  return JSON.stringify(data, null, pretty ? 2 : undefined)
}

export async function generateBrandKitZIP(brandKit: BrandKit): Promise<Buffer> {
  const zip = new JSZip()

  // Add Brand Guidelines PDF
  try {
    const pdf = await generateBrandGuidelinesPDF(brandKit)
    zip.file('Brand-Guidelines.pdf', pdf)
  } catch (error) {
    console.error('Error generating PDF:', error)
  }

  // Add Color Palette JSON
  if (brandKit.color_palette) {
    zip.file('Colors.json', generateJSONFile(brandKit.color_palette as unknown as Record<string, unknown>))
  }

  // Add Design System JSON
  if (brandKit.design_system) {
    zip.file('Design-System.json', generateJSONFile(brandKit.design_system as unknown as Record<string, unknown>))
  }

  // Add Typography JSON
  if (brandKit.typography) {
    zip.file('Typography.json', generateJSONFile(brandKit.typography as unknown as Record<string, unknown>))
  }

  // Add Design Tokens JSON
  if (brandKit.design_tokens) {
    zip.file('Design-Tokens.json', generateJSONFile(brandKit.design_tokens as unknown as Record<string, unknown>))
  }

  // Add CSS Variables
  const cssVars = generateCSSVariables(brandKit)
  zip.file('design-tokens.css', cssVars)

  // Add Social Assets
  const assetsFolder = zip.folder('Social-Assets')
  
  const { data: assets } = await selectMany<Asset>(
    'assets',
    { brand_kit_id: brandKit.id },
    '*'
  )

  if (assets) {
    for (const asset of assets) {
      if (asset.file_url) {
        try {
          const response = await fetch(asset.file_url)
          if (response.ok) {
            const buffer = await response.arrayBuffer()
            const extension = asset.file_type?.split('/')[1] || 'png'
            assetsFolder?.file(`${asset.asset_name}.${extension}`, buffer)
          }
        } catch (error) {
          console.error(`Error downloading asset ${asset.asset_name}:`, error)
        }
      }
    }
  }

  // Add Brand Analysis JSON
  if (brandKit.brand_analysis) {
    zip.file('Brand-Analysis.json', generateJSONFile(brandKit.brand_analysis as unknown as Record<string, unknown>))
  }

  // Generate ZIP buffer
  return zip.generateAsync({ type: 'nodebuffer' }) as Promise<Buffer>
}

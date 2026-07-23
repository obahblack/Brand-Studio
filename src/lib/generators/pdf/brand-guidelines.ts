import { createPage } from '@/lib/scraper/puppeteer-init'
import type { BrandKit } from '@/types/database'

function generateGuidelinesHTML(brandKit: BrandKit): string {
  const { brand_name, brand_analysis, design_system } = brandKit
  const colors = design_system?.colors || brandKit.color_palette
  const typography = design_system?.typography || brandKit.typography

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; color: #1f2937; line-height: 1.6; }
    .page { padding: 60px; min-height: 100vh; }
    .cover { 
      display: flex; flex-direction: column; justify-content: center; align-items: center;
      background: linear-gradient(135deg, ${colors?.primary?.['500'] || '#2563EB'} 0%, ${colors?.primary?.['700'] || '#1D4ED8'} 100%);
      color: white; text-align: center;
    }
    .cover h1 { font-size: 48px; font-weight: 700; margin-bottom: 16px; }
    .cover p { font-size: 20px; opacity: 0.9; }
    .section { margin-bottom: 48px; page-break-inside: avoid; }
    .section-title { 
      font-size: 24px; font-weight: 600; margin-bottom: 24px;
      padding-bottom: 12px; border-bottom: 2px solid ${colors?.primary?.['500'] || '#2563EB'};
    }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
    .card { background: #f9fafb; border-radius: 12px; padding: 24px; }
    .card-title { font-size: 14px; font-weight: 500; color: #6b7280; margin-bottom: 8px; }
    .card-value { font-size: 18px; font-weight: 600; }
    .color-swatch { 
      width: 60px; height: 60px; border-radius: 8px; 
      display: inline-block; margin-right: 12px; vertical-align: middle;
    }
    .color-row { margin-bottom: 16px; }
    .color-name { font-weight: 500; }
    .color-hex { font-family: monospace; color: #6b7280; }
    .type-sample { margin-bottom: 16px; padding: 16px; background: white; border-radius: 8px; border: 1px solid #e5e7eb; }
    .type-label { font-size: 12px; color: #6b7280; margin-bottom: 4px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
    th { font-weight: 500; color: #6b7280; font-size: 12px; text-transform: uppercase; }
  </style>
</head>
<body>
  <div class="page cover">
    <h1>${brand_name}</h1>
    <p>Brand Guidelines</p>
  </div>

  <div class="page">
    <div class="section">
      <h2 class="section-title">Brand Overview</h2>
      <div class="grid">
        <div class="card">
          <div class="card-title">Mission</div>
          <div class="card-value">${brand_analysis?.audience ? `Serving ${brand_analysis.audience}` : 'To provide exceptional value'}</div>
        </div>
        <div class="card">
          <div class="card-title">Tone</div>
          <div class="card-value">${brand_analysis?.tone || 'Professional'}</div>
        </div>
        <div class="card">
          <div class="card-title">Visual Style</div>
          <div class="card-value">${brand_analysis?.visualStyle || 'Modern'}</div>
        </div>
        <div class="card">
          <div class="card-title">Personality</div>
          <div class="card-value">${brand_analysis?.personality?.join(', ') || 'Professional'}</div>
        </div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">Color Palette</h2>
      <div class="grid">
        ${colors?.primary ? `
        <div class="card">
          <div class="card-title">Primary Colors</div>
          ${Object.entries(colors.primary).slice(0, 5).map(([shade, hex]) => `
            <div class="color-row">
              <span class="color-swatch" style="background-color: ${hex}"></span>
              <span class="color-name">${shade}</span>
              <span class="color-hex">${hex}</span>
            </div>
          `).join('')}
        </div>
        ` : ''}
        ${colors?.secondary ? `
        <div class="card">
          <div class="card-title">Secondary Colors</div>
          ${Object.entries(colors.secondary).slice(0, 5).map(([shade, hex]) => `
            <div class="color-row">
              <span class="color-swatch" style="background-color: ${hex}"></span>
              <span class="color-name">${shade}</span>
              <span class="color-hex">${hex}</span>
            </div>
          `).join('')}
        </div>
        ` : ''}
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">Typography</h2>
      <div class="type-sample">
        <div class="type-label">Heading Font</div>
        <div style="font-size: 24px; font-weight: 600;">${typography?.headingFont || 'Inter'}</div>
      </div>
      <div class="type-sample">
        <div class="type-label">Body Font</div>
        <div style="font-size: 16px;">${typography?.bodyFont || 'Inter'}</div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Element</th>
            <th>Size</th>
            <th>Weight</th>
            <th>Line Height</th>
          </tr>
        </thead>
        <tbody>
          ${typography?.scale ? Object.entries(typography.scale).map(([key, value]) => `
            <tr>
              <td>${key.toUpperCase()}</td>
              <td>${value.size}</td>
              <td>${value.weight}</td>
              <td>${value.lineHeight}</td>
            </tr>
          `).join('') : ''}
        </tbody>
      </table>
    </div>

    <div class="section">
      <h2 class="section-title">Design System</h2>
      <div class="grid">
        <div class="card">
          <div class="card-title">Border Radius</div>
          ${design_system?.borderRadius ? Object.entries(design_system.borderRadius).slice(0, 4).map(([key, value]) => `
            <div style="margin-bottom: 8px;">
              <div style="width: 60px; height: 40px; background: ${colors?.primary?.['500'] || '#2563EB'}; border-radius: ${value};"></div>
              <span class="color-hex">${key}: ${value}</span>
            </div>
          `).join('') : ''}
        </div>
        <div class="card">
          <div class="card-title">Shadows</div>
          ${design_system?.shadows ? Object.entries(design_system.shadows).slice(0, 4).map(([key, value]) => `
            <div style="margin-bottom: 12px;">
              <div style="width: 100%; height: 40px; background: white; border-radius: 8px; box-shadow: ${value};"></div>
              <span class="color-hex">${key}</span>
            </div>
          `).join('') : ''}
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `
}

export async function generateBrandGuidelinesPDF(brandKit: BrandKit): Promise<Buffer> {
  const page = await createPage()
  
  try {
    const html = generateGuidelinesHTML(brandKit)
    
    await page.setContent(html, { waitUntil: 'load' })
    await page.evaluateHandle('document.fonts.ready')
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '40px',
        right: '40px',
        bottom: '40px',
        left: '40px'
      }
    })

    return Buffer.from(pdf)
  } finally {
    await page.close()
  }
}

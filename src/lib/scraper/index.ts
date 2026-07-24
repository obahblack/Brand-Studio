import { createPage, closeBrowser } from './puppeteer-init'
import { extractColors, ExtractedColors } from './color-extractor'
import { extractFonts, ExtractedFonts } from './font-extractor'

export interface ScrapedData {
  url: string
  title: string
  description: string
  colors: ExtractedColors
  fonts: ExtractedFonts
  favicon: string | null
  logo: string | null
  images: string[]
}

export async function scrapeWebsite(url: string): Promise<ScrapedData> {
  let page = null
  
  try {
    page = await createPage()
    
    // Navigate to URL
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    })
    
    // Wait for page to be interactive
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Extract metadata
    const metadata = await page.evaluate(() => {
      const title = document.title || ''
      const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || ''
      const favicon = document.querySelector('link[rel="icon"]')?.getAttribute('href') || 
                     document.querySelector('link[rel="shortcut icon"]')?.getAttribute('href') || null
      
      // Find logo
      let logo: string | null = null
      const logoSelectors = [
        'header img',
        'nav img',
        '[class*="logo"] img',
        '[class*="brand"] img',
        'a[href="/"] img',
        'a[href="https://' + window.location.hostname + '"] img'
      ]
      
      for (const selector of logoSelectors) {
        const img = document.querySelector(selector) as HTMLImageElement
        if (img && img.src) {
          logo = img.src
          break
        }
      }
      
      // Get all images
      const images = Array.from(document.querySelectorAll('img'))
        .map(img => img.src)
        .filter(src => src && !src.includes('data:'))
        .slice(0, 10)
      
      return {
        title,
        description,
        favicon,
        logo,
        images
      }
    })
    
    // Extract colors
    const colors = await extractColors(page)
    
    // Extract fonts
    const fonts = await extractFonts(page)
    
    return {
      url,
      title: metadata.title,
      description: metadata.description,
      colors,
      fonts,
      favicon: metadata.favicon,
      logo: metadata.logo,
      images: metadata.images
    }
  } catch (error) {
    console.error('Error scraping website:', error)
    throw error
  } finally {
    if (page) {
      await page.close()
    }
  }
}

export async function cleanupScraper(): Promise<void> {
  await closeBrowser()
}

import puppeteer, { Browser, Page } from 'puppeteer'

let browser: Browser | null = null

export async function getBrowser(): Promise<Browser> {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu',
        '--disable-extensions',
        '--disable-background-networking',
      ]
    })
  }
  return browser
}

export async function closeBrowser(): Promise<void> {
  if (browser) {
    await browser.close()
    browser = null
  }
}

export async function createPage(): Promise<Page> {
  const b = await getBrowser()
  const page = await b.newPage()

  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')

  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 2
  })

  // Block heavy resources for faster loading (keep stylesheets and fonts for color/font extraction)
  await page.setRequestInterception(true)
  page.on('request', (req) => {
    const type = req.resourceType()
    if (['image', 'media'].includes(type)) {
      req.abort()
    } else {
      req.continue()
    }
  })

  return page
}

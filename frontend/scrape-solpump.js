const { chromium } = require('playwright');
const fs = require('fs');

async function scrapeSolPump() {
  console.log('Starting Cloudflare bypass with Playwright...');

  const browser = await chromium.launch({
    headless: true,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--disable-features=IsolateOrigins,site-per-process',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ]
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1920, height: 1080 },
    locale: 'en-US',
    timezoneId: 'America/New_York',
    extraHTTPHeaders: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Cache-Control': 'max-age=0'
    }
  });

  // Override navigator properties to avoid detection
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
    Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
    window.chrome = { runtime: {} };
  });

  const page = await context.newPage();

  try {
    console.log('Navigating to solpump.io...');

    // Navigate and wait for Cloudflare challenge if any
    await page.goto('https://solpump.io/', {
      waitUntil: 'networkidle',
      timeout: 60000
    });

    // Wait for potential Cloudflare challenge
    console.log('Waiting for page to fully load...');
    await page.waitForTimeout(8000);

    // Check if we hit Cloudflare challenge
    const pageContent = await page.content();
    if (pageContent.includes('cf-browser-verification') || pageContent.includes('challenge-platform')) {
      console.log('Cloudflare challenge detected, waiting longer...');
      await page.waitForTimeout(15000);
    }

    // Get the page content
    const html = await page.content();
    const title = await page.title();

    console.log('Page title:', title);
    console.log('HTML length:', html.length);

    // Save full HTML
    fs.writeFileSync('/tmp/solpump-full.html', html);
    console.log('Saved full HTML to /tmp/solpump-full.html');

    // Take screenshot
    await page.screenshot({ path: '/tmp/solpump-screenshot.png', fullPage: true });
    console.log('Saved screenshot to /tmp/solpump-screenshot.png');

    // Extract all CSS
    const styles = await page.evaluate(() => {
      const allStyles = [];
      document.querySelectorAll('style').forEach(style => {
        allStyles.push(style.textContent);
      });
      const links = document.querySelectorAll('link[rel="stylesheet"]');
      links.forEach(link => {
        allStyles.push('/* External: ' + link.href + ' */');
      });
      return allStyles.join('\n\n');
    });

    fs.writeFileSync('/tmp/solpump-styles.css', styles);
    console.log('Saved styles to /tmp/solpump-styles.css');

    // Get all unique class names
    const classNames = await page.evaluate(() => {
      const allClasses = new Set();
      document.querySelectorAll('*').forEach(el => {
        el.classList.forEach(cls => allClasses.add(cls));
      });
      return Array.from(allClasses).sort();
    });

    fs.writeFileSync('/tmp/solpump-classes.json', JSON.stringify(classNames, null, 2));
    console.log('Saved class names to /tmp/solpump-classes.json');

    // Get page structure
    const structure = await page.evaluate(() => {
      const getStructure = (element, depth = 0) => {
        if (depth > 4) return null;
        const children = Array.from(element.children).slice(0, 10).map(child => ({
          tag: child.tagName.toLowerCase(),
          classes: Array.from(child.classList),
          id: child.id || null,
          text: child.textContent ? child.textContent.substring(0, 50) : null,
          children: getStructure(child, depth + 1)
        }));
        return children.length > 0 ? children : null;
      };
      return {
        tag: 'body',
        classes: Array.from(document.body.classList),
        children: getStructure(document.body)
      };
    });

    fs.writeFileSync('/tmp/solpump-structure.json', JSON.stringify(structure, null, 2));
    console.log('Saved DOM structure to /tmp/solpump-structure.json');

    // Navigate to coinflip page
    console.log('\nNavigating to /coinflip...');
    try {
      await page.goto('https://solpump.io/coinflip', {
        waitUntil: 'networkidle',
        timeout: 30000
      });
      await page.waitForTimeout(5000);

      const coinflipHtml = await page.content();
      fs.writeFileSync('/tmp/solpump-coinflip.html', coinflipHtml);
      await page.screenshot({ path: '/tmp/solpump-coinflip.png', fullPage: true });
      console.log('Saved coinflip page');
    } catch (e) {
      console.log('Failed to fetch coinflip:', e.message);
    }

    console.log('\nScraping complete!');

  } catch (error) {
    console.error('Error:', error.message);
    try {
      const html = await page.content();
      fs.writeFileSync('/tmp/solpump-error.html', html);
      await page.screenshot({ path: '/tmp/solpump-error.png' });
      console.log('Saved error state');
    } catch (e) {
      console.log('Could not save error state');
    }
  } finally {
    await browser.close();
  }
}

scrapeSolPump().catch(console.error);

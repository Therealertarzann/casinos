const { chromium } = require('playwright');
const fs = require('fs');

async function scrapeSolpump() {
    console.log('Launching browser...');
    
    const browser = await chromium.launch({ 
        headless: true,
        args: ['--disable-blink-features=AutomationControlled']
    });
    
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        viewport: { width: 1920, height: 1080 }
    });
    
    const page = await context.newPage();
    
    // Block unnecessary resources for faster loading
    await page.route('**/*', route => {
        const type = route.request().resourceType();
        if (['image', 'media', 'font'].includes(type)) {
            route.abort();
        } else {
            route.continue();
        }
    });
    
    try {
        console.log('Navigating to solpump.io...');
        await page.goto('https://solpump.io/', { 
            waitUntil: 'networkidle',
            timeout: 60000 
        });
        
        // Wait for React to render
        await page.waitForTimeout(5000);
        
        // Get the rendered HTML
        const html = await page.content();
        fs.writeFileSync('/tmp/solpump-rendered.html', html);
        console.log('Saved rendered HTML to /tmp/solpump-rendered.html');
        
        // Extract computed styles from key elements
        const styles = await page.evaluate(() => {
            const results = {};
            
            // Get body styles
            const body = document.body;
            const bodyStyles = window.getComputedStyle(body);
            results.body = {
                backgroundColor: bodyStyles.backgroundColor,
                color: bodyStyles.color,
                fontFamily: bodyStyles.fontFamily,
            };
            
            // Find all unique class names and their computed styles
            const allElements = document.querySelectorAll('*');
            const classStyles = {};
            
            allElements.forEach(el => {
                if (el.className && typeof el.className === 'string') {
                    const classes = el.className.split(' ').filter(c => c);
                    classes.forEach(cls => {
                        if (!classStyles[cls] && !cls.startsWith('__')) {
                            const computed = window.getComputedStyle(el);
                            classStyles[cls] = {
                                backgroundColor: computed.backgroundColor,
                                color: computed.color,
                                fontFamily: computed.fontFamily,
                                fontSize: computed.fontSize,
                                fontWeight: computed.fontWeight,
                                borderRadius: computed.borderRadius,
                                padding: computed.padding,
                                margin: computed.margin,
                                display: computed.display,
                            };
                        }
                    });
                }
            });
            
            results.classes = classStyles;
            
            // Get nav structure
            const nav = document.querySelector('nav');
            if (nav) {
                results.nav = nav.outerHTML;
            }
            
            // Get main content structure
            const main = document.querySelector('main') || document.querySelector('#root > div');
            if (main) {
                results.mainStructure = main.innerHTML.slice(0, 10000);
            }
            
            return results;
        });
        
        fs.writeFileSync('/tmp/solpump-styles.json', JSON.stringify(styles, null, 2));
        console.log('Saved extracted styles to /tmp/solpump-styles.json');
        
        // Take a screenshot
        await page.screenshot({ path: '/tmp/solpump-screenshot.png', fullPage: true });
        console.log('Saved screenshot to /tmp/solpump-screenshot.png');
        
        // Extract the crash game page
        console.log('Navigating to crash game page...');
        await page.goto('https://solpump.io/crash', { 
            waitUntil: 'networkidle',
            timeout: 60000 
        });
        await page.waitForTimeout(5000);
        
        const crashHtml = await page.content();
        fs.writeFileSync('/tmp/solpump-crash.html', crashHtml);
        console.log('Saved crash page HTML to /tmp/solpump-crash.html');
        
        await page.screenshot({ path: '/tmp/solpump-crash-screenshot.png', fullPage: true });
        console.log('Saved crash screenshot');
        
    } catch (error) {
        console.error('Error:', error.message);
        
        // Take a screenshot of whatever we got
        try {
            await page.screenshot({ path: '/tmp/solpump-error.png' });
            console.log('Saved error screenshot');
            const html = await page.content();
            fs.writeFileSync('/tmp/solpump-error.html', html);
        } catch (e) {}
    }
    
    await browser.close();
}

scrapeSolpump();

const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 1080 });

    try {
        await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
        
        // Ensure Tailwind config is parsed and fonts are loaded
        await new Promise(r => setTimeout(r, 2000));
        
        // 1. Screenshot Grid View
        await page.screenshot({ path: 'grid_view.png', fullPage: true });

        // 2. Click the first item to enter Details View
        await page.click('#card-rec1');
        await new Promise(r => setTimeout(r, 1000));
        
        // 3. Screenshot Details View
        await page.screenshot({ path: 'details_view.png', fullPage: true });
        
        console.log("Screenshots captured successfully.");
    } catch (err) {
        console.error("Error capturing screenshot:", err);
    } finally {
        await browser.close();
    }
})();

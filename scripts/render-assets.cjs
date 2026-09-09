const { chromium } = require(process.env.PLAYWRIGHT_PACKAGE || 'playwright');
const fs = require('node:fs');
const path = require('node:path');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await page.goto('http://127.0.0.1:5187/', { waitUntil: 'networkidle' });
    const output = path.resolve(__dirname, '../public/images');
    fs.mkdirSync(output, { recursive: true });
    for (const [name, finish, clear] of [
        ['glasses-fallback', 'navy', false], ['glasses-grau', 'navy', true],
        ['glasses-solar', 'honey', false], ['glasses-lentes', 'graphite', true],
    ]) {
        const data = await page.evaluate(async ({ finish, clear }) => {
            const { createStudio } = await import('/src/glasses.js');
            const canvas = document.createElement('canvas');
            const studio = createStudio(canvas, { finish, clear, capture: true });
            studio.renderer.setPixelRatio(1);
            studio.resize(1000, 700);
            studio.model.rotation.set(.16, -.3, -.12);
            studio.render();
            const image = canvas.toDataURL('image/png');
            studio.dispose();
            return image.split(',')[1];
        }, { finish, clear });
        fs.writeFileSync(path.join(output, `${name}.png`), Buffer.from(data, 'base64'));
    }
    await browser.close();
    console.log('Four original 3D renders saved.');
})().catch(error => { console.error(error); process.exitCode = 1; });

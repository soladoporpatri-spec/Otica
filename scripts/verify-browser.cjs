const { chromium } = require(process.env.PLAYWRIGHT_PACKAGE || 'playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
let browser;

(async () => {
    browser = await chromium.launch({ headless: true });
    const output = path.resolve(__dirname, '../output');
    fs.mkdirSync(output, { recursive: true });
    fs.writeFileSync(path.join(output, 'verification.json'), JSON.stringify({ status: 'running' }));
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await page.goto('http://127.0.0.1:5187/', { waitUntil: 'networkidle' });
    await page.waitForSelector('.product-stage.ready');
    await page.getByRole('button', { name: 'Pausar animação', exact: true }).click();
    assert.equal(await page.locator('.visit-flow li').count(), 3, 'Visit flow must explain its three real steps');
    assert.equal(await page.locator('#perguntas details').count(), 5, 'FAQ must cover the five requested topics');
    assert.match(await page.locator('#perguntas').textContent(), /confirme.*WhatsApp/i, 'FAQ must tell visitors to confirm availability');
    assert.equal(await page.locator('.whatsapp-float').isVisible(), false, 'Floating WhatsApp must stay hidden on desktop');
    assert.equal(await page.locator('button').evaluateAll(buttons => buttons.every(button => button.getAttribute('aria-label') || button.textContent.trim())), true, 'Every button must have an accessible name');
    assert.equal(await page.locator('a[target="_blank"]').evaluateAll(links => links.every(link => link.relList.contains('noopener') && link.relList.contains('noreferrer'))), true, 'External new-tab links must isolate the opener');
    assert.equal(await page.locator('img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0)), true);
    await page.getByRole('button', { name: 'Âmbar', exact: true }).click();
    assert.equal(await page.locator('#product-stage').getAttribute('data-finish-changing'), 'true', 'Finish change must expose visual feedback');
    await page.waitForTimeout(500);
    assert.equal(await page.locator('#product-stage').getAttribute('data-finish-changing'), null, 'Finish transition must finish cleanly');
    assert.equal(await page.locator('#finish-name').textContent(), 'Âmbar');
    assert.equal(await page.getByRole('button', { name: 'Âmbar', exact: true }).getAttribute('aria-pressed'), 'true');
    const canvas = page.locator('#glasses');
    const beforeKeyboard = await canvas.screenshot();
    await canvas.focus(); await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(100);
    const afterKeyboard = await canvas.screenshot();
    assert.equal(beforeKeyboard.equals(afterKeyboard), false, 'Keyboard must visibly rotate the model');
    await page.keyboard.press('Home'); await page.waitForTimeout(100);
    const beforePointerFollow = await canvas.screenshot();
    const pointerRect = await canvas.boundingBox();
    await page.mouse.move(pointerRect.x + pointerRect.width * .78, pointerRect.y + pointerRect.height * .28);
    await page.waitForTimeout(260);
    assert.equal(beforePointerFollow.equals(await canvas.screenshot()), false, 'Pointer proximity must subtly move the model');
    await page.mouse.move(20, 20); await page.waitForTimeout(260);
    const beforeScrollLight = await canvas.screenshot();
    await page.mouse.wheel(0, 140); await page.waitForTimeout(260);
    const afterScrollLight = await canvas.screenshot();
    assert.equal(beforeScrollLight.equals(afterScrollLight), false, 'Scroll must visibly change the studio light');
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    const rect = await canvas.boundingBox();
    await page.evaluate(() => {
        window.pointerEvidence = [];
        ['pointerdown', 'pointermove', 'pointerup'].forEach(type => document.querySelector('#glasses').addEventListener(type, event => window.pointerEvidence.push([type, event.clientX, event.clientY])));
    });
    await page.mouse.move(rect.x + rect.width * .4, rect.y + rect.height * .5);
    await page.mouse.down();
    await page.mouse.move(rect.x + rect.width * .7, rect.y + rect.height * .5, { steps: 8 });
    await page.mouse.up(); await page.waitForTimeout(100);
    const afterDrag = await canvas.screenshot();
    if (afterKeyboard.equals(afterDrag)) {
        console.log('Pointer evidence', await page.evaluate(() => window.pointerEvidence), rect);
        await page.screenshot({ path: path.join(output, 'drag-diagnostic.png') });
    }
    assert.equal(afterKeyboard.equals(afterDrag), false, 'Drag must visibly rotate model');
    const beforeButton = await canvas.screenshot();
    await page.getByRole('button', { name: 'Girar para a esquerda', exact: true }).click();
    await page.waitForTimeout(100);
    assert.equal(beforeButton.equals(await canvas.screenshot()), false, 'Rotation button must offer an alternative to dragging');
    assert.match(await page.locator('.header-contact').getAttribute('href'), /^https:\/\/wa.me\/556291535619\?text=/);
    assert.match(await page.locator('[data-maps]').first().getAttribute('href'), /361/);
    for (const reveal of await page.locator('[data-reveal]').all()) {
        await reveal.scrollIntoViewIfNeeded(); await page.waitForTimeout(90);
    }
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    await canvas.focus(); await page.keyboard.press('Home');
    await page.getByRole('button', { name: 'Azul profundo', exact: true }).click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(output, 'desktop.png'), fullPage: true });
    for (const width of [320, 390, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `No overflow at ${width}px`);
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await canvas.focus(); await page.keyboard.press('Home');
    await page.getByRole('button', { name: 'Azul profundo', exact: true }).click();
    await page.getByRole('button', { name: 'Menu' }).click();
    assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'true');
    await page.getByRole('navigation').getByRole('link', { name: 'Nossa loja' }).click();
    assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
    assert.equal(await page.locator('.whatsapp-float').isVisible(), true, 'Floating WhatsApp must be visible on mobile');
    assert.match(await page.locator('.whatsapp-float').getAttribute('href'), /^https:\/\/wa.me\/556291535619\?text=/);
    await page.locator('#perguntas').scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    assert.equal(await page.locator('nav a[href="#perguntas"]').getAttribute('aria-current'), 'location', 'Navigation must identify the current section');
    const faqQuestion = page.getByText('Preciso levar minha receita?', { exact: true });
    await faqQuestion.click();
    assert.equal(await faqQuestion.locator('..').getAttribute('open'), '', 'FAQ answer must expand');
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    await page.screenshot({ path: path.join(output, 'mobile.png'), fullPage: true });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    assert.equal(await page.locator('#motion-toggle').getAttribute('aria-pressed'), 'true');
    assert.equal(await page.locator('[data-reveal]:not(.is-visible)').count(), 0, 'Reduced motion must keep reveal content visible');
    await page.getByRole('button', { name: 'Grafite', exact: true }).click();
    assert.equal(await page.locator('#product-stage').getAttribute('data-finish-changing'), null, 'Reduced motion must apply finish changes without animation');
    const reducedBefore = await canvas.screenshot();
    await page.waitForTimeout(300);
    assert.equal(reducedBefore.equals(await canvas.screenshot()), true, 'Reduced motion must produce a still frame');
    const fallback = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await fallback.addInitScript(() => {
        const original = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function(type, ...args) {
            if (type.includes('webgl')) return null;
            return original.call(this, type, ...args);
        };
    });
    await fallback.goto('http://127.0.0.1:5187/', { waitUntil: 'networkidle' });
    await fallback.waitForSelector('.product-stage.fallback');
    assert.equal(await fallback.locator('#model-fallback').isVisible(), true);
    assert.equal(await fallback.locator('#model-fallback').evaluate(image => image.naturalWidth > 0), true);
    await fallback.screenshot({ path: path.join(output, 'fallback.png'), fullPage: false });
    const noScriptContext = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const noScript = await noScriptContext.newPage();
    await noScript.goto('http://127.0.0.1:5187/', { waitUntil: 'networkidle' });
    assert.equal(await noScript.getByRole('heading', { name: 'Perguntas frequentes.' }).isVisible(), true, 'Content must remain readable if JavaScript fails');
    await noScriptContext.close();
    assert.deepEqual(errors, [], 'Page and console must have no errors');
    fs.writeFileSync(path.join(output, 'verification.json'), JSON.stringify({
        status: 'passed', viewportWidths: [320, 390, 768, 1024, 1440],
        checks: ['visit flow', 'FAQ', 'mobile WhatsApp action', 'accessible control names', 'safe external links', 'WebGL rendered', 'images loaded', 'animated finish change', 'keyboard rotation', 'pointer reaction', 'scroll lighting', 'pointer rotation', 'rotation buttons', 'WhatsApp link', 'Maps link', 'active navigation', 'mobile navigation', 'no horizontal overflow', 'reduced motion still frame', 'reveal accessibility', 'WebGL unavailable fallback', 'readable without JavaScript'],
        errors,
    }, null, 2));
    console.log('Browser checks passed; screenshots saved.');
    await browser.close();
})().catch(async error => { console.error(error); await browser?.close(); process.exitCode = 1; });

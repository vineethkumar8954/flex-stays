const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Collect ALL console messages and errors
    const logs = [];
    const errors = [];
    page.on('console', msg => {
        logs.push(msg.text());
        console.log('LOG:', msg.text());
    });
    page.on('pageerror', err => {
        errors.push(err.toString());
        console.log('PAGE ERROR:', err.toString());
    });
    
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 10000 });
    
    // Wait a moment for scripts to finish
    await new Promise(r => setTimeout(r, 2000));
    
    console.log('\n=== ERRORS FOUND: ' + errors.length + ' ===');
    errors.forEach(e => console.log('  ERROR:', e));
    
    console.log('\n=== Checking button exists ===');
    const btnExists = await page.$('#openDiningReservationBtn');
    console.log('Button found:', !!btnExists);
    
    console.log('\n=== Checking modal exists ===');
    const modalExists = await page.$('#diningReservationModal');
    console.log('Modal found:', !!modalExists);
    
    console.log('\n=== Checking global function exists ===');
    const fnExists = await page.evaluate(() => typeof window.openLuxuryDiningModal);
    console.log('openLuxuryDiningModal type:', fnExists);
    
    console.log('\n=== Clicking button ===');
    await page.click('#openDiningReservationBtn');
    await new Promise(r => setTimeout(r, 500));
    
    const isActive = await page.$eval('#diningReservationModal', el => el.classList.contains('active'));
    console.log('Modal has .active class:', isActive);
    
    const computedStyle = await page.$eval('#diningReservationModal', el => {
        const s = window.getComputedStyle(el);
        return { display: s.display, visibility: s.visibility, opacity: s.opacity };
    });
    console.log('Modal computed style:', JSON.stringify(computedStyle));
    
    console.log('\n=== FINAL RESULT ===');
    if (isActive && errors.length === 0) {
        console.log('SUCCESS: Modal opens correctly with no JS errors!');
    } else if (isActive) {
        console.log('PARTIAL: Modal opens but there were JS errors');
    } else {
        console.log('FAIL: Modal did not open');
    }
    
    await browser.close();
})();

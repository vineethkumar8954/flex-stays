const puppeteer = require('puppeteer');

(async () => {
    console.log('Launching browser...');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Collect all console logs and page errors
    const logs = [];
    const errors = [];
    page.on('console', msg => {
        logs.push(msg.text());
        console.log('BROWSER LOG:', msg.text());
    });
    page.on('pageerror', err => {
        errors.push(err.toString());
        console.log('BROWSER ERROR:', err.toString());
    });
    
    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 10000 });
    
    // Wait for initial JS load and page animations
    await new Promise(r => setTimeout(r, 2000));
    
    const categories = ['dining', 'spa', 'pool', 'fitness', 'transfers', 'tours'];
    const results = {};

    for (const cat of categories) {
        console.log(`\n=== Testing Curated Experience: ${cat} ===`);
        
        // Find and click the experience card
        const cardSelector = `.exp-card[data-exp-type="${cat}"]`;
        const card = await page.$(cardSelector);
        if (!card) {
            console.error(`ERROR: Card for ${cat} not found!`);
            results[cat] = 'CARD_NOT_FOUND';
            continue;
        }
        
        // Ensure overlay has completely disappeared before clicking
        await new Promise(r => setTimeout(r, 1000));
        
        console.log(`Clicking ${cat} card...`);
        await page.click(cardSelector);
        await new Promise(r => setTimeout(r, 1000)); // Increased wait time to ensure DOM fully updates
        
        // Verify modal is active
        const modalIsActive = await page.$eval('#experiencesModal', el => el.classList.contains('active'));
        console.log(`Modal active state: ${modalIsActive}`);
        if (!modalIsActive) {
            console.error(`ERROR: Modal did not activate for ${cat}`);
            results[cat] = 'MODAL_NOT_ACTIVE';
            continue;
        }
        
        // Extract modal text details using textContent for robust evaluation
        const details = await page.evaluate(() => {
            const title = document.getElementById('expModalTitle')?.textContent;
            const subtitle = document.getElementById('expModalSubtitle')?.textContent;
            const sectionHeader = document.getElementById('expSectionHeader')?.textContent;
            const primaryBtn = document.getElementById('expPrimaryBtn')?.textContent;
            const secondaryBtn = document.getElementById('expSecondaryBtn')?.textContent;
            const secondaryVisible = document.getElementById('expSecondaryBtn')?.style.display !== 'none';
            
            const detailItems = [];
            document.querySelectorAll('#expDetailsContainer > div').forEach(div => {
                const label = div.querySelector('h4')?.textContent;
                const val = div.querySelector('p')?.textContent;
                detailItems.push({ label, value: val });
            });
            
            return { title, subtitle, sectionHeader, primaryBtn, secondaryBtn, secondaryVisible, detailItems };
        });
        
        console.log(`Modal Title: "${details.title}"`);
        console.log(`Section Header: "${details.sectionHeader}"`);
        console.log(`Primary Button Text: "${details.primaryBtn}"`);
        if (details.secondaryVisible) {
            console.log(`Secondary Button Text: "${details.secondaryBtn}"`);
        }
        console.log(`Details List:`, JSON.stringify(details.detailItems));
        
        // Verify specific values match the request (case-insensitive for text-transformed titles)
        let catPassed = true;
        const checkEqual = (a, b) => (a || '').toString().toLowerCase().trim() === (b || '').toString().toLowerCase().trim();
        
        if (cat === 'dining') {
            if (!checkEqual(details.title, 'Fine Dining')) catPassed = false;
            if (!checkEqual(details.sectionHeader, 'Dining Experience Page')) catPassed = false;
            if (!checkEqual(details.primaryBtn, 'Reserve Table')) catPassed = false;
            if (!details.secondaryVisible || !checkEqual(details.secondaryBtn, 'View Menu')) catPassed = false;
            const tasting = details.detailItems.find(i => checkEqual(i.value, "Chef's Signature Tasting"));
            if (!tasting) catPassed = false;
        } else if (cat === 'spa') {
            if (!checkEqual(details.title, 'Spa & Wellness')) catPassed = false;
            if (!checkEqual(details.sectionHeader, 'Spa Packages')) catPassed = false;
            if (!checkEqual(details.primaryBtn, 'Book Appointment')) catPassed = false;
            const item1 = details.detailItems.find(i => checkEqual(i.value, "60 Min Massage"));
            const item2 = details.detailItems.find(i => checkEqual(i.value, "90 Min Luxury Therapy"));
            const item3 = details.detailItems.find(i => checkEqual(i.value, "Couple Spa Package"));
            if (!item1 || !item2 || !item3) catPassed = false;
        } else if (cat === 'pool') {
            if (!checkEqual(details.title, 'Infinity Pool')) catPassed = false;
            if (!checkEqual(details.sectionHeader, 'Pool Information')) catPassed = false;
            if (!checkEqual(details.primaryBtn, 'Reserve Cabana')) catPassed = false;
            const item1 = details.detailItems.find(i => checkEqual(i.value, "Opening Hours"));
            const item2 = details.detailItems.find(i => checkEqual(i.value, "Poolside Dining"));
            const item3 = details.detailItems.find(i => checkEqual(i.value, "Private Cabanas"));
            if (!item1 || !item2 || !item3) catPassed = false;
        } else if (cat === 'fitness') {
            if (!checkEqual(details.title, 'Fitness Center')) catPassed = false;
            if (!checkEqual(details.sectionHeader, 'Gym Facilities')) catPassed = false;
            if (!checkEqual(details.primaryBtn, 'Book Trainer')) catPassed = false;
            const item1 = details.detailItems.find(i => checkEqual(i.value, "Personal Trainer"));
            const item2 = details.detailItems.find(i => checkEqual(i.value, "Yoga Sessions"));
            if (!item1 || !item2) catPassed = false;
        } else if (cat === 'transfers') {
            if (!checkEqual(details.title, 'Airport Transfers')) catPassed = false;
            if (!checkEqual(details.sectionHeader, 'Vehicle Selection')) catPassed = false;
            if (!checkEqual(details.primaryBtn, 'Schedule Pickup')) catPassed = false;
            const item1 = details.detailItems.find(i => checkEqual(i.value, "Sedan"));
            const item2 = details.detailItems.find(i => checkEqual(i.value, "SUV"));
            const item3 = details.detailItems.find(i => checkEqual(i.value, "Luxury Car"));
            if (!item1 || !item2 || !item3) catPassed = false;
        } else if (cat === 'tours') {
            if (!checkEqual(details.title, 'Private Tours')) catPassed = false;
            if (!checkEqual(details.sectionHeader, 'Private Tours')) catPassed = false;
            if (!checkEqual(details.primaryBtn, 'Book Tour')) catPassed = false;
            const item1 = details.detailItems.find(i => checkEqual(i.value, "City Tour"));
            const item2 = details.detailItems.find(i => checkEqual(i.value, "Nature Tour"));
            const item3 = details.detailItems.find(i => checkEqual(i.value, "Adventure Tour"));
            if (!item1 || !item2 || !item3) catPassed = false;
        }
        
        console.log(`Validation Check for ${cat}: ${catPassed ? 'PASS' : 'FAIL'}`);
        
        // Click action button to trigger success toast / secondary modal
        console.log(`Clicking primary action button...`);
        await page.click('#expPrimaryBtn');
        await new Promise(r => setTimeout(r, 800)); // wait for toast/modal transition
        
        if (cat === 'dining') {
            // Verify that the luxury dining reservation modal opens
            const diningModalActive = await page.$eval('#diningReservationModal', el => el.classList.contains('active'));
            console.log(`Bridge to Luxury Dining Reservation Modal active: ${diningModalActive}`);
            if (diningModalActive) {
                console.log(`SUCCESS: Bridge to dining reservation modal verified.`);
                // Close the dining reservation modal for the next iteration
                await page.click('#closeDiningModalBtn');
                await new Promise(r => setTimeout(r, 500));
            } else {
                console.error(`ERROR: Luxury Dining Reservation Modal did not open.`);
                catPassed = false;
            }
        } else {
            // Verify that the success toast appears
            const toastExists = await page.evaluate(() => {
                const toast = document.getElementById('experiencesSuccessToast');
                return !!toast && toast.textContent.length > 0;
            });
            console.log(`Success toast displays: ${toastExists}`);
            if (toastExists) {
                const toastText = await page.evaluate(() => document.getElementById('experiencesSuccessToast').textContent);
                console.log(`Toast text: "${toastText}"`);
            } else {
                console.error(`ERROR: Toast not shown for ${cat}`);
                catPassed = false;
            }
        }
        
        results[cat] = catPassed ? 'PASS' : 'FAIL';
        
        // Wait a bit and ensure experience modal is closed
        const modalIsClosed = await page.evaluate(() => {
            const el = document.getElementById('experiencesModal');
            return !el.classList.contains('active');
        });
        if (!modalIsClosed) {
            console.log('Modal still active, clicking close button...');
            await page.click('#closeExpModalBtn');
            await new Promise(r => setTimeout(r, 500));
        }
    }
    
    console.log('\n=== FINAL VERIFICATION SUMMARY ===');
    console.log(JSON.stringify(results, null, 2));
    
    console.log(`\n=== CONSOLE/PAGE ERRORS: ${errors.length} ===`);
    if (errors.length > 0) {
        errors.forEach(e => console.error(`  - ${e}`));
    }
    
    const allPassed = Object.values(results).every(r => r === 'PASS') && errors.length === 0;
    if (allPassed) {
        console.log('\nSUCCESS: All curated experiences verified perfectly with zero JS errors!');
    } else {
        console.error('\nFAILURE: One or more validations failed.');
        process.exit(1);
    }
    
    await browser.close();
})();

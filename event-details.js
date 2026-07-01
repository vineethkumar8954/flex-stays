let currentEvent = null;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Parse URL Parameter
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get('id') || 'birthday';

    // 2. Resolve Event Data
    currentEvent = eventsData.find(e => e.id === eventId);

    if (!currentEvent) {
        document.querySelector('.room-details-layout').innerHTML = `
            <div style="text-align:center; padding:100px 20px; width:100%;">
                <h2 style="font-family: var(--font-heading); color: var(--forest);">Event type not found</h2>
                <p style="color: var(--text-muted); margin-bottom: 24px;">Please go back and select from our list of luxury event configurations.</p>
                <a href="index.html#events" class="btn btn-primary">Back to Events</a>
            </div>
        `;
        return;
    }

    // 3. Populate Basic Info
    document.title = `${currentEvent.name} | Exclusive Events | Flex-Stays`;
    document.getElementById('bcEventName').textContent = currentEvent.name;
    document.getElementById('evtTitle').textContent = currentEvent.name;
    document.getElementById('evtAvailability').textContent = currentEvent.availability;
    document.getElementById('evtCapacity').textContent = currentEvent.capacity;
    document.getElementById('evtStartingPrice').textContent = currentEvent.startingPrice;
    document.getElementById('evtDesc').textContent = currentEvent.description;

    // Images
    document.getElementById('evtMainImg').src = currentEvent.image;
    
    // Thumbnail strip
    const thumbsStrip = document.getElementById('evtThumbs');
    const mockThumbnails = [
        currentEvent.image,
        "images/executive_sky_suite_1781945245772.png",
        "images/executive_lounge_suite_1781945266318.png",
        "images/standard_garden_room_1781945287542.png"
    ];
    thumbsStrip.innerHTML = mockThumbnails.map(src => `<img src="${src}" alt="Venue Preview" class="rd-thumb">`).join('');

    // Highlights list
    const highlightsContainer = document.getElementById('evtHighlights');
    highlightsContainer.innerHTML = currentEvent.highlights.map(h => `
        <div class="highlight-item-details">
            <i data-lucide="check-circle-2"></i>
            <span>${h}</span>
        </div>
    `).join('');

    // Render Pricing Packages
    const pricingContainer = document.getElementById('evtPricingPackages');
    pricingContainer.innerHTML = currentEvent.pricingPackages.map((pkg, idx) => `
        <div class="pricing-package-card">
            <h3>${pkg.name}</h3>
            <div class="price">$${pkg.price} <span>/ guest</span></div>
            <ul>
                ${pkg.features.map(f => `<li><i data-lucide="check"></i><span>${f}</span></li>`).join('')}
            </ul>
            <button onclick="selectPackageTier(${idx})" class="btn btn-outline-forest btn-sm" style="margin-top:auto; justify-content:center;">Select Package</button>
        </div>
    `).join('');

    // Render Catering Options
    const cateringContainer = document.getElementById('evtCatering');
    cateringContainer.innerHTML = currentEvent.cateringOptions.map(cat => `
        <div class="catering-card">
            <h4>${cat.name}</h4>
            <p>${cat.desc}</p>
        </div>
    `).join('');

    // Render Decor Themes
    const decorContainer = document.getElementById('evtThemes');
    decorContainer.innerHTML = currentEvent.decorThemes.map(theme => `
        <div class="theme-card">
            <h4>${theme.name}</h4>
            <p>${theme.desc}</p>
        </div>
    `).join('');

    // Available Dates Chips Generation
    const dateChipsContainer = document.getElementById('evtDateChips');
    const dates = [];
    const today = new Date();
    let count = 0;
    for (let i = 1; i <= 30; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        // Show weekends (Friday/Saturday/Sunday)
        if (d.getDay() === 5 || d.getDay() === 6 || d.getDay() === 0) {
            dates.push(d);
            count++;
            if (count >= 4) break;
        }
    }
    
    document.getElementById('evtAvailableDatesText').textContent = currentEvent.availableDatesText;
    dateChipsContainer.innerHTML = dates.map(d => {
        const formatStr = d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
        const valStr = d.toISOString().split('T')[0];
        return `<span class="chip date-chip" data-val="${valStr}" style="background:var(--cream-light); color:var(--forest); padding:6px 12px; border-radius:16px; font-size:12px; font-weight:600; cursor:pointer; border:1px solid rgba(13,42,42,0.1); transition:all 0.2s;" onclick="selectDateChip(this, '${valStr}')">${formatStr}</span>`;
    }).join('');

    // Setup Cost Estimator Defaults
    const slider = document.getElementById('estGuests');
    slider.min = currentEvent.minGuests;
    slider.max = currentEvent.maxGuests;
    slider.value = Math.round((currentEvent.minGuests + currentEvent.maxGuests) / 2);
    document.getElementById('estGuestLabel').textContent = `${slider.value} Guests`;

    // Cost Estimator Event Listeners
    slider.addEventListener('input', (e) => {
        document.getElementById('estGuestLabel').textContent = `${e.target.value} Guests`;
        calculateEstimatorPrice();
    });
    document.getElementById('estTier').addEventListener('change', calculateEstimatorPrice);
    document.getElementById('estCatering').addEventListener('change', calculateEstimatorPrice);
    document.getElementById('estDecor').addEventListener('change', calculateEstimatorPrice);

    // Initial estimation run
    calculateEstimatorPrice();

    // Render Reviews
    const reviewsContainer = document.getElementById('evtReviews');
    reviewsContainer.innerHTML = currentEvent.reviews.map(rev => `
        <div class="review-card-details">
            <div class="header">
                <span class="author">${rev.author}</span>
                <span class="date">${rev.date}</span>
            </div>
            <div class="stars" style="margin-bottom: 8px;">
                ${Array(rev.rating).fill('<i data-lucide="star" style="width:14px; height:14px; fill:var(--gold);"></i>').join('')}
            </div>
            <p>${rev.text}</p>
        </div>
    `).join('');

    // Render Similar Celebrations
    const similarContainer = document.getElementById('evtSimilar');
    const similarEvents = eventsData.filter(e => e.id !== eventId).slice(0, 3);
    similarContainer.innerHTML = similarEvents.map(se => `
        <div class="similar-event-card">
            <img src="${se.image}" alt="${se.name}">
            <div class="content">
                <h4>${se.name}</h4>
                <div class="price">${se.startingPrice}</div>
                <a href="event-details?id=${se.id}" class="btn btn-outline-forest btn-sm" style="margin-top:12px; font-size:11px; padding:6px 12px;">View Venue</a>
            </div>
        </div>
    `).join('');

    // Pre-fill date with tomorrow as a helpful default
    const dateInput = document.getElementById('evtPropDate');
    if (dateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.value = tomorrow.toISOString().split('T')[0];
    }

    // Re-render Lucide icons
    if (window.lucide) {
        lucide.createIcons();
    }
});

// Interactive cost estimator calculator
function calculateEstimatorPrice() {
    if (!currentEvent) return;

    const guests = parseInt(document.getElementById('estGuests').value, 10);
    const tierIdx = parseInt(document.getElementById('estTier').value, 10);
    const cateringType = document.getElementById('estCatering').value;
    const decorType = document.getElementById('estDecor').value;

    const pkg = currentEvent.pricingPackages[tierIdx];
    const baseRate = pkg ? pkg.price : currentEvent.baseRate;

    let cateringAdd = 0;
    if (cateringType === 'premium') cateringAdd = 20;
    if (cateringType === 'luxury') cateringAdd = 40;

    let decorAdd = 0;
    if (decorType === 'luxury') decorAdd = 15;
    if (decorType === 'royal') decorAdd = 30;

    const totalPerGuest = baseRate + cateringAdd + decorAdd;
    const estimatedCost = (guests * totalPerGuest) + currentEvent.venueFee;

    document.getElementById('estTotalPrice').textContent = `$${estimatedCost.toLocaleString()}`;
}

// Select packages directly
window.selectPackageTier = function(idx) {
    const select = document.getElementById('estTier');
    if (select) {
        select.value = idx;
        calculateEstimatorPrice();
        // Scroll estimator into view
        const estimator = document.querySelector('.estimator-panel');
        if (estimator) {
            estimator.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
};

// Date picker chips click handler
window.selectDateChip = function(el, val) {
    document.querySelectorAll('.date-chip').forEach(c => {
        c.style.background = 'var(--cream-light)';
        c.style.color = 'var(--forest)';
        c.style.borderColor = 'rgba(13,42,42,0.1)';
    });
    el.style.background = 'var(--gold)';
    el.style.color = 'var(--forest)';
    el.style.borderColor = 'var(--gold)';
    
    const input = document.getElementById('evtPropDate');
    if (input) {
        input.value = val;
    }
};

// Apply Cost Estimator to proposal sidebar
window.applyEstToProposal = function() {
    const guests = document.getElementById('estGuests').value;
    const tierIdx = document.getElementById('estTier').value;
    
    // Copy guests count
    const propGuests = document.getElementById('evtPropGuests');
    if (propGuests) propGuests.value = guests;
    
    // Map tier value (0, 1, 2) to budget select
    const propBudget = document.getElementById('evtPropBudget');
    if (propBudget) {
        if (tierIdx === "0") propBudget.value = "economy";
        else if (tierIdx === "1") propBudget.value = "standard";
        else if (tierIdx === "2") propBudget.value = "premium";
    }
    
    // Scroll and focus sidebar proposal card
    const card = document.getElementById('proposalFormCard');
    if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Add temporary border glow effect
        card.style.transition = 'all 0.4s ease';
        card.style.boxShadow = '0 0 25px rgba(212,175,55,0.7)';
        card.style.borderColor = 'var(--gold)';
        setTimeout(() => {
            card.style.boxShadow = '';
            card.style.borderColor = '';
        }, 2000);
        
        // Focus name field
        setTimeout(() => {
            const nameField = document.getElementById('evtPropName');
            if (nameField) nameField.focus();
        }, 800);
    }
};

// Navigate back to home page & plan event via AI concierge
window.planMyEventClick = function() {
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get('id') || 'birthday';
    window.location.href = `./?plan=${eventId}`;
};

// Direct Form proposal inquiry submission
window.submitEventProposal = function(e) {
    e.preventDefault();
    console.log('Submitting direct proposal inquiry...');

    const params = new URLSearchParams(window.location.search);
    const eventId = params.get('id') || 'birthday';
    const evt = eventsData.find(ev => ev.id === eventId);

    const name = document.getElementById('evtPropName').value.trim();
    const email = document.getElementById('evtPropEmail').value.trim();
    const phone = document.getElementById('evtPropPhone').value.trim();
    const date = document.getElementById('evtPropDate').value;
    const guests = document.getElementById('evtPropGuests').value;
    const budget = document.getElementById('evtPropBudget').value;

    if (!name || !email || !phone || !date || !guests || !budget) {
        alert('Please fill in all fields.');
        return;
    }

    // Estimate costs matching currentEvent properties or Cost Estimator
    const estGuestsVal = document.getElementById('estGuests')?.value;
    const estTierIdx = document.getElementById('estTier')?.value;
    const estBudgetMapped = estTierIdx === "0" ? "economy" : estTierIdx === "1" ? "standard" : "premium";
    
    let estimatedCost = '';
    if (estGuestsVal === guests && estBudgetMapped === budget) {
        estimatedCost = document.getElementById('estTotalPrice').textContent;
    } else {
        let baseRate = 40;
        let venueFee = 500;
        if (evt) {
            baseRate = evt.baseRate;
            venueFee = evt.venueFee;
        }
        estimatedCost = `$${Math.round(parseInt(guests, 10) * baseRate * (budget === 'luxury' ? 2 : 1) + venueFee).toLocaleString()}`;
    }

    const inquiry = {
        id: 'EVQ-' + Math.floor(100000 + Math.random() * 900000),
        name: name,
        email: email,
        phone: phone,
        date: date,
        venue: evt ? evt.name + ' Space' : 'Resort Event Spaces',
        cost: estimatedCost,
        packageTier: `Direct Details proposal (${budget.toUpperCase()})`,
        createdAt: new Date().toISOString()
    };

    // Intercept if logged out
    if (typeof window.isLoggedIn === 'function' && !window.isLoggedIn()) {
        window.showAuthModal({ type: 'submit-proposal', data: inquiry });
        return;
    }

    // Save to user-scoped inquiries list
    const user = window.getCurrentUser();
    const userEmail = user ? user.email.toLowerCase() : '';
    const key = `events_${userEmail}`;

    let eventInquiries = JSON.parse(localStorage.getItem(key) || '[]');
    eventInquiries.push(inquiry);
    localStorage.setItem(key, JSON.stringify(eventInquiries));

    // Show success view state
    document.getElementById('proposalFormState').style.display = 'none';
    document.getElementById('proposalSuccessState').style.display = 'block';

    if (window.lucide) {
        lucide.createIcons();
    }
};

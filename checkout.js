document.addEventListener('DOMContentLoaded', () => {
    console.log("checkout.js loaded");

    // 1. Fetch Booking Data from LocalStorage
    let bookingData = null;
    try {
        bookingData = JSON.parse(localStorage.getItem('bookingData'));
    } catch (e) {
        console.error("Error parsing bookingData from localStorage:", e);
    }
    
    // Check if we should load fallback mock data during development
    const urlParams = new URLSearchParams(window.location.search);
    const isDevMode = urlParams.get('dev') === 'true' || urlParams.get('mock') === 'true' || 
                      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname === '::1');

    if (!bookingData && isDevMode && urlParams.get('empty') !== 'true') {
        console.log("No bookingData found. Loading fallback sample booking data for development...");
        bookingData = {
            roomId: "EXEC-001",
            roomName: "Executive Ocean Suite",
            roomCategory: "Executive Suites",
            roomImage: "images/executive_sky_suite_1781945245772.png",
            roomPrice: 850,
            checkinDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
            checkoutDate: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0], // 3 nights later
            guests: 2,
            nights: 3,
            roomTotal: 2550,
            taxes: 306,
            grandTotal: 2856,
            addons: [],
            addonsTotal: 0,
            promoCode: null,
            promoDiscount: 0
        };
        localStorage.setItem('bookingData', JSON.stringify(bookingData));
    }

    if (!bookingData) {
        // Show luxury empty state (Requirement 2)
        const emptyState = document.getElementById('checkoutEmptyState');
        const checkoutLayout = document.querySelector('.checkout-layout');
        const progressContainer = document.querySelector('.progress-container');
        
        if (emptyState) emptyState.style.display = 'block';
        if (checkoutLayout) checkoutLayout.style.display = 'none';
        if (progressContainer) progressContainer.style.display = 'none';
        
        if (window.lucide) lucide.createIcons();
        return;
    }

    // Save as pendingBooking since checkout is started/resumed (Requirement 3)
    localStorage.setItem('pendingBooking', JSON.stringify(bookingData));

    // Wrap rendering in a try-catch block for safety (Requirement 9)
    try {
        renderCheckout(bookingData);
    } catch (error) {
        console.error("Failed to render checkout:", error);
        showErrorCard(error);
    }
});

function renderCheckout(bookingData) {
    // 2. Populate Booking Summary
    const roomImg = document.getElementById('summaryRoomImg');
    const roomName = document.getElementById('summaryRoomName');
    const roomCat = document.getElementById('summaryRoomCat');
    const checkin = document.getElementById('summaryCheckin');
    const checkout = document.getElementById('summaryCheckout');
    const guests = document.getElementById('summaryGuests');
    const nights = document.getElementById('summaryNights');
    
    const priceRoomTotal = document.getElementById('priceRoomTotal');
    const priceAddonsTotal = document.getElementById('priceAddonsTotal');
    const priceTaxes = document.getElementById('priceTaxes');
    const priceGrandTotal = document.getElementById('priceGrandTotal');
    
    // Set text contents with default fallbacks
    if (roomImg) roomImg.src = bookingData.roomImage || 'images/default-room.jpg';
    if (roomName) roomName.innerText = bookingData.roomName || 'Luxury Room';
    if (roomCat) roomCat.innerText = bookingData.roomCategory || 'Suites';
    if (checkin) checkin.innerText = bookingData.checkinDate || '--';
    if (checkout) checkout.innerText = bookingData.checkoutDate || '--';
    
    const guestNum = bookingData.guests || 1;
    if (guests) guests.innerText = `${guestNum} Guest${guestNum > 1 ? 's' : ''}`;
    
    const nightNum = bookingData.nights || 1;
    if (nights) nights.innerText = `${nightNum} Night${nightNum > 1 ? 's' : ''}`;
    
    // Initialize addons arrays
    bookingData.addons = bookingData.addons || [];
    bookingData.addonsTotal = bookingData.addonsTotal || 0;
    bookingData.promoCode = bookingData.promoCode || null;
    bookingData.promoDiscount = bookingData.promoDiscount || 0;
    bookingData.roomTotal = bookingData.roomTotal || (bookingData.roomPrice ? (bookingData.roomPrice * nightNum) : 0);
    
    // 3. Auto-Save Guest Details on every input change
    const guestFields = ['firstName', 'lastName', 'email', 'phone', 'country', 'arrivalTime', 'specialRequests'];
    
    // Load pre-existing guest details if saved
    const savedGuestInfo = JSON.parse(localStorage.getItem('guestInfo'));
    if (savedGuestInfo) {
        guestFields.forEach(field => {
            const el = document.getElementById(field);
            if (el && savedGuestInfo[field] !== undefined) {
                el.value = savedGuestInfo[field];
            }
        });
    }
    
    // Save to localStorage on input changes
    guestFields.forEach(field => {
        const el = document.getElementById(field);
        if (el) {
            el.addEventListener('input', saveGuestDetails);
            el.addEventListener('change', saveGuestDetails);
        }
    });

    function saveGuestDetails() {
        const guestInfo = {};
        guestFields.forEach(field => {
            const el = document.getElementById(field);
            if (el) {
                guestInfo[field] = el.value;
            }
        });
        localStorage.setItem('guestInfo', JSON.stringify(guestInfo));
    }
    
    // 4. Add-ons Toggles
    const addonCards = document.querySelectorAll('.addon-card');
    addonCards.forEach(card => {
        const addonId = card.getAttribute('data-addon-id');
        const addonPrice = parseInt(card.getAttribute('data-price')) || 0;
        
        const addonNameEl = card.querySelector('.addon-name');
        const addonName = addonNameEl ? addonNameEl.innerText : 'Extra Service';
        
        // Restore active state from bookingData
        const exists = bookingData.addons.find(a => a.id === addonId);
        if (exists) {
            card.classList.add('selected');
        }
        
        card.addEventListener('click', () => {
            card.classList.toggle('selected');
            const isSelected = card.classList.contains('selected');
            
            if (isSelected) {
                // Prevent duplicate additions
                if (!bookingData.addons.some(a => a.id === addonId)) {
                    bookingData.addons.push({
                        id: addonId,
                        name: addonName,
                        price: addonPrice
                    });
                }
            } else {
                bookingData.addons = bookingData.addons.filter(a => a.id !== addonId);
            }
            
            recalculateTotals();
        });
    });

    // 5. Promo Code implementation
    const promoInput = document.getElementById('promoCodeInput');
    const applyPromoBtn = document.getElementById('applyPromoBtn');
    const promoMessage = document.getElementById('promoMessage');
    const promoDiscountRow = document.getElementById('promoDiscountRow');
    const promoDiscountPercentage = document.getElementById('promoDiscountPercentage');
    const pricePromoDiscount = document.getElementById('pricePromoDiscount');

    // Valid promo codes and percentages
    const PROMO_CODES = {
        'WELCOME10': 10,
        'SUMMER25': 25,
        'VIP50': 50
    };

    // Restore promo code if already applied in bookingData
    if (bookingData.promoCode && PROMO_CODES[bookingData.promoCode]) {
        if (promoInput) promoInput.value = bookingData.promoCode;
        applyPromo(bookingData.promoCode, false);
    }

    if (applyPromoBtn) {
        applyPromoBtn.addEventListener('click', () => {
            if (promoInput) {
                const code = promoInput.value.trim().toUpperCase();
                applyPromo(code, true);
            }
        });
    }

    function applyPromo(code, showSuccessMsg) {
        if (!code) {
            if (promoMessage) {
                promoMessage.innerText = "Please enter a promo code.";
                promoMessage.className = "promo-message error";
            }
            clearPromo();
            return;
        }

        if (PROMO_CODES[code]) {
            const percentage = PROMO_CODES[code];
            bookingData.promoCode = code;
            
            if (promoDiscountPercentage) promoDiscountPercentage.innerText = `${percentage}%`;
            if (promoDiscountRow) promoDiscountRow.style.display = 'flex';
            
            if (showSuccessMsg && promoMessage) {
                promoMessage.innerText = `Success! Code "${code}" applied. You got ${percentage}% off the room cost!`;
                promoMessage.className = "promo-message success";
            }
            
            recalculateTotals();
        } else {
            if (promoMessage) {
                promoMessage.innerText = "Invalid promo code. Please try WELCOME10, SUMMER25, or VIP50.";
                promoMessage.className = "promo-message error";
            }
            clearPromo();
        }
    }

    function clearPromo() {
        bookingData.promoCode = null;
        bookingData.promoDiscount = 0;
        if (promoDiscountRow) promoDiscountRow.style.display = 'none';
        recalculateTotals();
    }

    // Recalculate totals
    function recalculateTotals() {
        // Addons total
        bookingData.addonsTotal = bookingData.addons.reduce((sum, item) => sum + item.price, 0);
        
        // Promo discount (applies to roomTotal only)
        if (bookingData.promoCode && PROMO_CODES[bookingData.promoCode]) {
            const discountPercent = PROMO_CODES[bookingData.promoCode];
            bookingData.promoDiscount = Math.floor(bookingData.roomTotal * (discountPercent / 100));
        } else {
            bookingData.promoDiscount = 0;
        }
        
        // Recalculate taxes on subtotal (roomTotal - discount)
        const taxableAmount = Math.max(0, bookingData.roomTotal - bookingData.promoDiscount);
        bookingData.taxes = Math.floor(taxableAmount * 0.12);
        
        // Grand total
        bookingData.grandTotal = taxableAmount + bookingData.addonsTotal + bookingData.taxes;
        
        // Update summary elements with defensive checks
        if (priceRoomTotal) priceRoomTotal.innerText = `$${bookingData.roomTotal.toLocaleString()}`;
        if (priceAddonsTotal) priceAddonsTotal.innerText = `$${bookingData.addonsTotal.toLocaleString()}`;
        if (priceTaxes) priceTaxes.innerText = `$${bookingData.taxes.toLocaleString()}`;
        
        if (bookingData.promoDiscount > 0) {
            if (pricePromoDiscount) pricePromoDiscount.innerText = `-$${bookingData.promoDiscount.toLocaleString()}`;
            if (promoDiscountRow) promoDiscountRow.style.display = 'flex';
        } else {
            if (promoDiscountRow) promoDiscountRow.style.display = 'none';
        }
        
        if (priceGrandTotal) priceGrandTotal.innerText = `$${bookingData.grandTotal.toLocaleString()}`;
        
        // Save live calculation to localStorage (Requirement 3)
        localStorage.setItem('bookingData', JSON.stringify(bookingData));
        localStorage.setItem('pendingBooking', JSON.stringify(bookingData));
    }

    // Run initial calculation
    recalculateTotals();

    // 6. Continue to Payment Validation & Navigation
    const continueToPaymentBtn = document.getElementById('continueToPaymentBtn');
    
    if (continueToPaymentBtn) {
        continueToPaymentBtn.addEventListener('click', () => {
            // Select elements
            const fNameEl = document.getElementById('firstName');
            const lNameEl = document.getElementById('lastName');
            const emailEl = document.getElementById('email');
            const phoneEl = document.getElementById('phone');
            const countryEl = document.getElementById('country');
            
            // Validate required fields
            if (!fNameEl || !lNameEl || !emailEl || !phoneEl || !countryEl ||
                !fNameEl.value.trim() || !lNameEl.value.trim() || !emailEl.value.trim() || !phoneEl.value.trim() || !countryEl.value) {
                showToast('Please fill out all required fields marked with *');
                return;
            }

            // Save final guest data to bookingData
            bookingData.guest = {
                firstName: fNameEl.value.trim(),
                lastName: lNameEl.value.trim(),
                email: emailEl.value.trim(),
                phone: phoneEl.value.trim(),
                country: countryEl.value,
                arrivalTime: document.getElementById('arrivalTime') ? document.getElementById('arrivalTime').value : '14:00',
                specialRequests: document.getElementById('specialRequests') ? document.getElementById('specialRequests').value.trim() : ''
            };

            // Save bookingData to localStorage (Requirement 3)
            localStorage.setItem('bookingData', JSON.stringify(bookingData));
            localStorage.setItem('pendingBooking', JSON.stringify(bookingData));
            
            // Save guestInfo permanently
            saveGuestDetails();

            // If user is not logged in, offer account creation
            if (typeof window.isLoggedIn === 'function' && !window.isLoggedIn()) {
                showOfferAccountModal();
            } else {
                // Redirect to payment.html
                window.location.href = 'payment.html';
            }
        });
    }

    // Pre-Payment "Offer Account Creation" Modal
    function showOfferAccountModal() {
        if (!document.getElementById('offer-modal-styles')) {
            const style = document.createElement('style');
            style.id = 'offer-modal-styles';
            style.textContent = `
                .offer-modal-overlay {
                    position: fixed;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(8px);
                    z-index: 9999999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'Inter', sans-serif;
                }
                .offer-modal-card {
                    background: linear-gradient(135deg, #0d2a2a 0%, #051a1a 100%);
                    border: 1.5px solid #d4af37;
                    border-radius: 16px;
                    padding: 40px;
                    max-width: 480px;
                    width: 90%;
                    color: #fff;
                    box-shadow: 0 24px 64px rgba(0, 0, 0, 0.7);
                    text-align: center;
                    box-sizing: border-box;
                }
                .offer-modal-title {
                    font-family: 'Playfair Display', serif;
                    color: #d4af37;
                    font-size: 24px;
                    margin: 0 0 12px;
                    font-weight: 600;
                }
                .offer-modal-subtitle {
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 14px;
                    margin: 0 0 20px;
                    line-height: 1.5;
                }
                .offer-modal-perks {
                    text-align: left;
                    list-style: none;
                    padding: 0;
                    margin: 0 auto 24px;
                    max-width: 320px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    font-size: 13.5px;
                    background: rgba(255,255,255,0.03);
                    padding: 20px;
                    border-radius: 8px;
                    border: 1px solid rgba(212,175,55,0.15);
                }
                .offer-modal-perks li {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: rgba(255, 255, 255, 0.9);
                }
                .offer-modal-perks li span {
                    color: #d4af37;
                    font-weight: bold;
                }
                .offer-modal-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .offer-modal-actions button {
                    padding: 12px 24px;
                    border-radius: 24px;
                    font-weight: 700;
                    font-size: 13.5px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    border: none;
                    text-align: center;
                    width: 100%;
                    box-sizing: border-box;
                }
                .offer-modal-actions .btn-signup {
                    background: #d4af37;
                    color: #0d2a2a;
                }
                .offer-modal-actions .btn-signup:hover {
                    background: #f7d050;
                    box-shadow: 0 4px 14px rgba(212, 175, 55, 0.3);
                }
                .offer-modal-actions .btn-skip {
                    background: transparent;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    color: rgba(255, 255, 255, 0.8);
                }
                .offer-modal-actions .btn-skip:hover {
                    background: rgba(255, 255, 255, 0.08);
                    color: #fff;
                    border-color: rgba(255, 255, 255, 0.5);
                }
            `;
            document.head.appendChild(style);
        }

        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'offerAccountModal';
        modalOverlay.className = 'offer-modal-overlay';
        modalOverlay.innerHTML = `
            <div class="offer-modal-card">
                <h3 class="offer-modal-title">Unlock Elite Guest Benefits</h3>
                <p class="offer-modal-subtitle">Save this booking to your account in just 10 seconds to receive:</p>
                <ul class="offer-modal-perks">
                    <li><span>✓</span> <strong>${(bookingData.grandTotal || 2856).toLocaleString()} Reward Points</strong></li>
                    <li><span>✓</span> Instant booking confirmation save</li>
                    <li><span>✓</span> Mobile check-in & digital key access</li>
                    <li><span>✓</span> Member-only spa & dining vouchers</li>
                </ul>
                <div class="offer-modal-actions">
                    <button class="btn-signup" id="offerModalSignupBtn">Save Booking & Create Account</button>
                    <button class="btn-skip" id="offerModalSkipBtn">Skip & Continue to Payment</button>
                </div>
            </div>
        `;
        document.body.appendChild(modalOverlay);

        document.getElementById('offerModalSignupBtn').addEventListener('click', () => {
            localStorage.setItem('intendedAction', JSON.stringify({
                type: 'reserve-room',
                data: bookingData
            }));
            window.location.href = 'signup.html';
        });

        document.getElementById('offerModalSkipBtn').addEventListener('click', () => {
            window.location.href = 'payment.html';
        });
    }

    // Custom Toast for Validation
    function showToast(message) {
        const existing = document.getElementById('checkoutToast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = 'checkoutToast';
        toast.style.cssText = 'position:fixed; bottom:30px; left:50%; transform:translateX(-50%); background:var(--forest); color:#fff; padding:16px 28px; border-radius:12px; font-size:14px; font-family:var(--font-body); z-index:9999; box-shadow:0 8px 32px rgba(0,0,0,0.3); display:flex; align-items:center; gap:12px; animation:slideUpToast 0.4s ease;';
        toast.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>' + message;
        document.body.appendChild(toast);

        if (!document.getElementById('toastAnimStyle')) {
            const style = document.createElement('style');
            style.id = 'toastAnimStyle';
            style.textContent = '@keyframes slideUpToast { from { opacity:0; transform:translateX(-50%) translateY(20px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }';
            document.head.appendChild(style);
        }

        setTimeout(() => { toast.remove(); }, 4000);
    }

    // Initialize Lucide Icons
    if (window.lucide) lucide.createIcons();

    // Intersection Observer for scroll animations (fixes invisible/blank cards)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.05
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.observe(element);
    });
}

function showErrorCard(error) {
    const container = document.querySelector('.container');
    if (!container) return;
    
    container.innerHTML = `
        <div id="checkoutErrorState" style="text-align:center; padding: 60px 20px; max-width: 600px; margin: 40px auto; background: #fff; border-radius: var(--radius-lg); box-shadow: var(--shadow-md); border: 1px solid rgba(239, 68, 68, 0.2); font-family: var(--font-body);">
            <div style="font-size: 48px; margin-bottom: 16px;">⚠️</div>
            <h3 style="color: #ef4444; font-family: var(--font-heading); font-size: 20px; font-weight: 600; margin-bottom: 12px;">Booking Render Error</h3>
            <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 24px; line-height: 1.5;">An error occurred while loading your booking details: <br><strong style="color: var(--text-main);">${error.message}</strong></p>
            <button onclick="window.location.reload();" class="btn btn-outline-forest" style="padding: 10px 20px; font-size: 14px; font-weight: 600; cursor: pointer; border-radius: 6px; background:#fff; border:1px solid var(--forest); color:var(--forest);">Reload Page</button>
        </div>
    `;
}

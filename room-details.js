document.addEventListener('DOMContentLoaded', () => {
    // 1. Parse URL Parameter
    const params = new URLSearchParams(window.location.search);
    const roomId = params.get('id');

    // 2. Fetch Room Data
    const room = roomsData.find(r => r.id === roomId);
    
    // 10. Invalid Room Protection
    if (!room) {
        const layout = document.querySelector('.room-details-layout');
        if (layout) {
            layout.innerHTML = `
                <div style="text-align:center; padding:100px 20px; width:100%; max-width: 600px; margin: 0 auto; background: var(--white); border-radius: 16px; box-shadow: var(--shadow-sm);">
                    <i data-lucide="alert-triangle" style="width: 64px; height: 64px; color: var(--gold); margin-bottom: 24px;"></i>
                    <h2 style="font-family: var(--font-heading); color: var(--forest); margin-bottom: 16px; font-size: 28px;">Room Not Found</h2>
                    <p style="color: var(--text-muted); margin-bottom: 30px; line-height: 1.6;">We could not find the luxury accommodation you were looking for. Please browse our exclusive collections.</p>
                    <a href="search-results.html" class="btn btn-primary" style="padding: 12px 30px; font-size: 15px;">Return to Rooms</a>
                </div>
            `;
            if (window.lucide) lucide.createIcons();
        }
        return;
    }

    // 3. Populate Breadcrumbs & Basic Info
    document.title = `${room.name} | Flex-Stays`;
    const bcCategory = document.getElementById('bcCategory');
    const bcRoomName = document.getElementById('bcRoomName');
    
    if (bcCategory) bcCategory.innerText = room.category;
    if (bcRoomName) bcRoomName.innerText = room.name;
    
    document.getElementById('rdTitle').innerText = room.name;
    document.getElementById('rdRatingScore').innerText = room.rating;
    document.getElementById('rdReviewCount').innerText = room.reviews;
    document.getElementById('rdSize').innerText = room.roomSize;
    document.getElementById('rdGuests').innerText = `Up to ${room.maxGuests} Guests`;
    document.getElementById('rdBed').innerText = room.bedType;
    document.getElementById('rdDesc').innerText = room.description;
    document.getElementById('rdPrice').innerText = room.price.toLocaleString();
    
    // View fallback
    const view = room.amenities.find(a => a.toLowerCase().includes('view')) || 'City View';
    document.getElementById('rdView').innerText = view;

    // 7. Availability Status
    const availBadge = document.getElementById('rdAvailabilityBadge');
    if (availBadge) {
        if (room.availability !== "Available") {
            availBadge.innerText = room.availability;
            availBadge.style.display = 'inline-block';
        } else {
            availBadge.innerText = "Available";
            availBadge.style.display = 'inline-block';
            availBadge.style.background = 'rgba(10, 191, 172, 0.1)';
            availBadge.style.color = '#0abfac';
        }
    }

    // 2. Interactive Gallery
    document.getElementById('rdMainImg').src = room.image;
    const thumbsContainer = document.getElementById('rdThumbs');
    
    // Gather gallery images (main room image + diverse room images)
    const galleryImages = [
        room.image,
        allImagesPool[0],
        allImagesPool[1],
        allImagesPool[2],
        allImagesPool[3]
    ].filter((v, i, a) => a.indexOf(v) === i); // unique list

    let thumbsHTML = '';
    galleryImages.forEach((imgSrc, idx) => {
        const activeClass = idx === 0 ? 'active' : '';
        thumbsHTML += `<img src="${imgSrc}" alt="Gallery Image" class="rd-thumb ${activeClass}" style="cursor: pointer; border-radius: 8px; border: 2px solid ${idx === 0 ? '#d4af37' : 'transparent'}; width: 100px; height: 70px; object-fit: cover; transition: var(--transition);">`;
    });
    thumbsContainer.innerHTML = thumbsHTML;

    // Gallery switching handlers
    const thumbs = thumbsContainer.querySelectorAll('.rd-thumb');
    thumbs.forEach((thumb, idx) => {
        thumb.addEventListener('click', () => {
            document.getElementById('rdMainImg').src = galleryImages[idx];
            thumbs.forEach(t => t.style.borderColor = 'transparent');
            thumb.style.borderColor = '#d4af37';
        });
    });

    // 8. Wishlist Support
    const wishlistBtn = document.querySelector('.rd-wishlist');
    
    function getWishlist() {
        const user = typeof window.getCurrentUser === 'function' ? window.getCurrentUser() : null;
        const userEmail = user ? user.email.toLowerCase() : '';
        return JSON.parse(localStorage.getItem(userEmail ? `wishlist_${userEmail}` : 'roomWishlist') || '[]');
    }
    
    function updateWishlistBtn() {
        const list = getWishlist();
        if (list.includes(room.id)) {
            wishlistBtn.innerHTML = `<i data-lucide="heart" style="fill:#ef4444; stroke:#ef4444; width:18px; height:18px;"></i> Saved`;
        } else {
            wishlistBtn.innerHTML = `<i data-lucide="heart" style="width:18px; height:18px;"></i> Save`;
        }
        if (window.lucide) lucide.createIcons();
    }
    
    if (wishlistBtn) {
        updateWishlistBtn();
        wishlistBtn.addEventListener('click', () => {
            if (typeof window.isLoggedIn === 'function' && !window.isLoggedIn()) {
                window.showAuthModal({ type: 'wishlist', roomId: room.id });
                return;
            }
            const user = window.getCurrentUser();
            const userEmail = user ? user.email.toLowerCase() : '';
            const key = `wishlist_${userEmail}`;
            let userWishlist = JSON.parse(localStorage.getItem(key) || '[]');
            if (userWishlist.includes(room.id)) {
                userWishlist = userWishlist.filter(id => id !== room.id);
                showBookingToast('Room removed from your wishlist.');
            } else {
                userWishlist.push(room.id);
                showBookingToast('Room added to your wishlist!');
            }
            localStorage.setItem(key, JSON.stringify(userWishlist));
            localStorage.setItem('roomWishlist', JSON.stringify(userWishlist)); // backward compatibility
            updateWishlistBtn();
        });
    }

    // 5. Populate AI Recommendation match reason
    const matchPct = Math.min(99, Math.floor(90 + (room.rating)));
    document.getElementById('rdMatchBadge').innerText = `${matchPct}% Match`;
    
    let reasonsHTML = `<div style="display:flex; flex-direction:column; gap:8px;">`;
    reasonsHTML += `<div><i data-lucide="check" class="text-forest"></i> Highly rated by previous guests (${room.rating} / 5.0)</div>`;
    reasonsHTML += `<div><i data-lucide="check" class="text-forest"></i> Matches your preference for ${view}</div>`;
    if(room.amenities.includes("Breakfast Included")) {
        reasonsHTML += `<div><i data-lucide="check" class="text-forest"></i> Includes complimentary gourmet breakfast</div>`;
    } else {
        reasonsHTML += `<div><i data-lucide="check" class="text-forest"></i> Nespresso & premium tea selection in-room</div>`;
    }
    reasonsHTML += `</div>`;
    document.getElementById('rdAiReasons').innerHTML = reasonsHTML;

    // Populate Highlights
    const highlights = [
        "Spacious " + room.roomSize + " Layout",
        room.bedType + " Premium Comfort",
        "Deep Soaking Tub & Rain Shower",
        "High-Speed Wi-Fi & Smart TV",
        view + " Panoramic Vistas"
    ];
    let hiHTML = '';
    highlights.forEach(h => {
        hiHTML += `<div class="highlight-item"><i data-lucide="check-circle-2"></i> ${h}</div>`;
    });
    document.getElementById('rdHighlights').innerHTML = hiHTML;

    // 3. Enhanced Amenities
    // All rooms display these standard luxury items plus category specifics
    const standardLuxuryAmenities = [
        "Smart TV",
        "Nespresso Machine",
        "Luxury Robes",
        "Air Conditioning",
        "Digital Safe",
        "Premium Toiletries",
        "High-Speed WiFi",
        "Room Service"
    ];
    
    // Merge standard items with the room's unique amenities (removing duplicates)
    const allAmenities = [...new Set([...standardLuxuryAmenities, ...room.amenities])];

    const amenitiesHTML = allAmenities.map(am => {
        let icon = 'check';
        const lowerAm = am.toLowerCase();
        if (lowerAm.includes('wi-fi') || lowerAm.includes('wifi')) icon = 'wifi';
        else if (lowerAm.includes('breakfast')) icon = 'coffee';
        else if (lowerAm.includes('coffee') || lowerAm.includes('nespresso')) icon = 'coffee';
        else if (lowerAm.includes('view') || lowerAm.includes('vistas')) icon = 'image';
        else if (lowerAm.includes('pool')) icon = 'waves';
        else if (lowerAm.includes('lounge') || lowerAm.includes('butler')) icon = 'user-check';
        else if (lowerAm.includes('bed')) icon = 'bed-double';
        else if (lowerAm.includes('tv')) icon = 'tv';
        else if (lowerAm.includes('robe') || lowerAm.includes('clothing')) icon = 'shirt';
        else if (lowerAm.includes('conditioning') || lowerAm.includes('ac')) icon = 'wind';
        else if (lowerAm.includes('safe')) icon = 'shield';
        else if (lowerAm.includes('toiletries') || lowerAm.includes('bath')) icon = 'sparkles';
        else if (lowerAm.includes('service')) icon = 'concierge-bell';
        
        return `<div class="amenity-item"><i data-lucide="${icon}"></i> <span>${am}</span></div>`;
    }).join('');
    document.getElementById('rdAmenitiesList').innerHTML = amenitiesHTML;

    // Populate Experience Add-ons
    const addons = [
        { id: "airport", name: "Airport Transfer", price: 120, icon: "car" },
        { id: "spa", name: "Couples Spa Package", price: 250, icon: "flower" },
        { id: "vip", name: "Champagne on Arrival", price: 85, icon: "glass-water" },
        { id: "late", name: "Late Checkout (2 PM)", price: 50, icon: "clock" }
    ];
    
    const selectedAddons = new Set();
    const addonsContainer = document.getElementById('rdAddons');
    
    addonsContainer.innerHTML = addons.map((a, idx) => `
        <div class="addon-card" data-idx="${idx}">
            <div class="addon-icon"><i data-lucide="${a.icon}"></i></div>
            <div class="addon-info">
                <h4>${a.name}</h4>
                <div class="addon-price">+$${a.price}</div>
            </div>
            <button class="btn btn-outline-forest btn-sm addon-btn" data-idx="${idx}">Add</button>
        </div>
    `).join('');

    addonsContainer.querySelectorAll('.addon-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-idx'));
            const addon = addons[idx];
            if (selectedAddons.has(addon)) {
                selectedAddons.delete(addon);
                btn.innerText = 'Add';
                btn.className = 'btn btn-outline-forest btn-sm addon-btn';
            } else {
                selectedAddons.add(addon);
                btn.innerText = 'Added';
                btn.className = 'btn btn-primary btn-sm addon-btn';
            }
            window.selectedAddonsList = Array.from(selectedAddons);
        });
    });

    // Guest Reviews
    document.getElementById('rdOverallScore').innerText = room.rating;
    document.getElementById('rdOverallCount').innerText = `${room.reviews} Reviews`;
    
    // Mock review photos
    let revPhotosHTML = '';
    for(let i=0; i<4; i++) {
        revPhotosHTML += `<img src="${allImagesPool[(hashString(room.name) + i) % allImagesPool.length]}" alt="Guest Photo">`;
    }
    document.getElementById('rdReviewPhotos').innerHTML = revPhotosHTML;

    const mockReviews = [
        { name: "Sarah M.", date: "2 weeks ago", rating: 5, text: "Absolutely incredible stay. The views were breathtaking and the bed was so comfortable. Will definitely return!" },
        { name: "James T.", date: "1 month ago", rating: room.rating > 4.5 ? 5 : 4, text: "Great experience overall. The amenities were top notch and the service was impeccable." },
        { name: "Elena R.", date: "2 months ago", rating: 5, text: "Exceeded all expectations. The room size was perfect and we loved the attention to detail." }
    ];
    document.getElementById('rdReviewsList').innerHTML = mockReviews.map(r => `
        <div class="review-card">
            <div class="review-header">
                <div class="reviewer-info">
                    <div class="reviewer-avatar">${r.name.charAt(0)}</div>
                    <div>
                        <div class="reviewer-name">${r.name}</div>
                        <div class="review-date">${r.date}</div>
                    </div>
                </div>
                <div class="review-stars">
                    ${Array(r.rating).fill('<i data-lucide="star" class="star-fill text-gold"></i>').join('')}
                </div>
            </div>
            <p class="review-text">${r.text}</p>
        </div>
    `).join('');

    // Similar Rooms
    const similar = roomsData.filter(r => r.category === room.category && r.id !== room.id).slice(0, 3);
    document.getElementById('rdSimilarRooms').innerHTML = similar.map(sr => `
        <div class="similar-card" style="border:1px solid rgba(0,0,0,0.1); border-radius:12px; overflow:hidden;">
            <img src="${sr.image}" style="width:100%; height:180px; object-fit:cover;">
            <div style="padding:16px;">
                <h4 style="margin:0 0 8px;">${sr.name}</h4>
                <div style="color:var(--text-muted); font-size:14px; margin-bottom:12px;"><i data-lucide="star" class="text-gold star-fill" style="width:14px;height:14px;"></i> ${sr.rating}</div>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div style="font-weight:700; color:var(--forest);">$${sr.price.toLocaleString()}</div>
                    <a href="room-details?id=${sr.id}" class="btn btn-outline-forest btn-sm">View</a>
                </div>
            </div>
        </div>
    `).join('');

    // 4. Dynamic Guest Limits
    const guestSelect = document.getElementById('guestCountSelect');
    if (guestSelect) {
        guestSelect.innerHTML = '';
        for (let i = 1; i <= room.maxGuests; i++) {
            const opt = document.createElement('option');
            opt.value = i;
            opt.innerText = `${i} Guest${i > 1 ? 's' : ''}`;
            // Set 2 guests as default if allowed, else 1
            if (i === 2 && room.maxGuests >= 2) {
                opt.selected = true;
            } else if (i === 1 && room.maxGuests === 1) {
                opt.selected = true;
            }
            guestSelect.appendChild(opt);
        }
        guestSelect.addEventListener('change', calculatePrice);
    }

    // 5. Date Validation & Flatpickr Sync
    let checkinDate = null;
    let checkoutDate = null;

    const checkinInstance = flatpickr("#checkinDate", {
        minDate: "today",
        dateFormat: "Y-m-d",
        onChange: function(selectedDates, dateStr, instance) {
            checkinDate = selectedDates[0];
            if (checkinDate) {
                // Check-out date must always be after Check-in date
                const nextDay = new Date(checkinDate);
                nextDay.setDate(nextDay.getDate() + 1);
                
                checkoutInstance.set('minDate', nextDay);
                
                // Reset check-out date if it's now invalid
                if (checkoutDate && checkoutDate <= checkinDate) {
                    checkoutInstance.clear();
                    checkoutDate = null;
                }
            }
            calculatePrice();
        }
    });

    const checkoutInstance = flatpickr("#checkoutDate", {
        minDate: "today",
        dateFormat: "Y-m-d",
        onChange: function(selectedDates, dateStr, instance) {
            checkoutDate = selectedDates[0];
            calculatePrice();
        }
    });

    // 6. Live Price Breakdown Update
    function calculatePrice() {
        if (checkinDate && checkoutDate) {
            const diffTime = Math.abs(checkoutDate - checkinDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            
            if (diffDays > 0) {
                const roomTotal = diffDays * room.price;
                const taxes = Math.floor(roomTotal * 0.12); // 12% luxury tax
                const total = roomTotal + taxes;

                document.getElementById('pbCalculation').innerText = `$${room.price.toLocaleString()} x ${diffDays} Night${diffDays > 1 ? 's' : ''}`;
                document.getElementById('pbRoomTotal').innerText = `$${roomTotal.toLocaleString()}`;
                document.getElementById('pbTaxes').innerText = `$${taxes.toLocaleString()}`;
                document.getElementById('pbTotal').innerText = `$${total.toLocaleString()}`;
                
                document.getElementById('priceBreakdown').style.display = 'block';
            } else {
                document.getElementById('priceBreakdown').style.display = 'none';
            }
        } else {
            document.getElementById('priceBreakdown').style.display = 'none';
        }
    }

    if(window.lucide) lucide.createIcons();
});

// 11. Reserve Now — validates input, compiles booking payload, saves to localStorage, and navigates
function proceedToCheckout() {
    const params = new URLSearchParams(window.location.search);
    const roomId = params.get('id');
    const room = roomsData.find(r => r.id === roomId);

    if (!room) {
        alert('Room data is missing. Returning to room selection.');
        window.location.href = 'search-results.html';
        return;
    }

    const checkinEl = document.getElementById('checkinDate');
    const checkoutEl = document.getElementById('checkoutDate');
    const checkinVal = checkinEl ? checkinEl.value : '';
    const checkoutVal = checkoutEl ? checkoutEl.value : '';

    if (!checkinVal || !checkoutVal) {
        showBookingToast('Please specify Check-In and Check-Out dates before reserving.');
        return;
    }

    const checkin = new Date(checkinVal);
    const checkout = new Date(checkoutVal);
    const diffTime = Math.abs(checkout - checkin);
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (nights <= 0) {
        showBookingToast('Check-Out date must be at least 1 day after Check-In.');
        return;
    }

    const guestSelect = document.getElementById('guestCountSelect');
    const guests = guestSelect ? parseInt(guestSelect.value) : 2;

    const roomTotal = nights * room.price;
    const taxes = Math.floor(roomTotal * 0.12);


    const selectedAddons = window.selectedAddonsList || [];
    const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
    const grandTotal = roomTotal + taxes + addonsTotal;

    const bookingData = {
        roomId: room.id,
        roomName: room.name,
        roomImage: room.image,
        roomCategory: room.category,
        price: room.price,
        checkinDate: checkinVal,
        checkoutDate: checkoutVal,
        nights: nights,
        guests: guests,
        roomTotal: roomTotal,
        taxes: taxes,
        addons: selectedAddons,
        addonsTotal: addonsTotal,
        promoCode: null,
        promoDiscount: 0,
        grandTotal: grandTotal
    };

    // Save to localStorage
    localStorage.setItem('bookingData', JSON.stringify(bookingData));

    // Intercept checkout redirect if not logged in & not guest checkout
    if (typeof window.isLoggedIn === 'function' && !window.isLoggedIn() && localStorage.getItem('guestCheckout') !== 'true') {
        window.showAuthModal({ type: 'reserve-room', data: bookingData });
    } else {
        window.location.href = 'checkout.html';
    }
}

// Toast notification display helper
function showBookingToast(message) {
    const existing = document.getElementById('bookingValidationToast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'bookingValidationToast';
    toast.style.cssText = 'position:fixed; bottom:30px; left:50%; transform:translateX(-50%); background:var(--forest); color:#fff; padding:16px 28px; border-radius:12px; font-size:14px; font-family:var(--font-body); z-index:9999; box-shadow:0 8px 32px rgba(0,0,0,0.3); display:flex; align-items:center; gap:12px; animation:slideUpToast 0.4s ease;';
    toast.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>' + message;
    document.body.appendChild(toast);

    if (!document.getElementById('toastAnimStyle')) {
        const style = document.createElement('style');
        style.id = 'toastAnimStyle';
        style.textContent = '@keyframes slideUpToast { from { opacity:0; transform:translateX(-50%) translateY(20px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }';
        document.head.appendChild(style);
    }

    setTimeout(() => { toast.remove(); }, 4000);
}

// Helper
function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
}

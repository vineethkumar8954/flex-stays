
document.addEventListener('DOMContentLoaded', () => {
    // 1. Parse URL parameters
    const params = new URLSearchParams(window.location.search);
    const packageId = params.get('id');
    const autoBook = params.get('booking') === 'true' || params.get('book') === 'true';

    // 2. Resolve package data
    const pkg = packagesData.find(p => p.id === packageId);

    if (!pkg) {
        document.querySelector('.room-details-layout').innerHTML = `
            <div style="text-align:center; padding:100px 20px; width:100%;">
                <h2 style="font-family: var(--font-heading); color: var(--forest);">Package not found</h2>
                <p style="color: var(--text-muted); margin-bottom: 24px;">Please go back and select one of our curated exclusive packages.</p>
                <a href="index.html#packages" class="btn btn-primary">Back to Packages</a>
            </div>
        `;
        return;
    }

    // 3. Populate DOM Elements
    document.title = `${pkg.name} | Exclusive Packages | Flex-Stays`;
    document.getElementById('bcPackageName').textContent = pkg.name;
    document.getElementById('pkgTitle').textContent = pkg.name;
    document.getElementById('pkgBadge').textContent = pkg.badge;
    document.getElementById('pkgDurationText').innerHTML = `<i data-lucide="clock" style="width:14px;height:14px;display:inline-block;vertical-align:middle;margin-right:4px;"></i> ${pkg.duration}`;
    document.getElementById('pkgWorthPrice').textContent = `$${pkg.worthPrice.toLocaleString()}`;
    document.getElementById('pkgSavingsPct').textContent = pkg.savingsPct;
    document.getElementById('pkgDesc').textContent = pkg.description;
    
    // Set pricing
    document.getElementById('pkgPrice').textContent = pkg.price.toLocaleString();
    document.getElementById('pbBasePrice').textContent = `$${pkg.price.toLocaleString()}`;
    const taxes = Math.floor(pkg.price * 0.12);
    document.getElementById('pbTaxes').textContent = `$${taxes.toLocaleString()}`;
    document.getElementById('pbTotal').textContent = `$${(pkg.price + taxes).toLocaleString()}`;

    // Images
    document.getElementById('pkgMainImg').src = pkg.image;
    
    // Thumbnail strip
    const thumbsStrip = document.getElementById('pkgThumbs');
    const mockThumbnails = [
        pkg.image,
        "images/executive_sky_suite_1781945245772.png",
        "images/executive_lounge_suite_1781945266318.png",
        "images/standard_garden_room_1781945287542.png"
    ];
    thumbsStrip.innerHTML = mockThumbnails.map(src => `<img src="${src}" alt="Package Preview" class="rd-thumb">`).join('');

    // Inclusions
    const inclusionsGrid = document.getElementById('pkgInclusions');
    inclusionsGrid.innerHTML = pkg.inclusions.map(inc => `
        <div class="inclusion-item-details">
            <div class="icon-wrap">${inc.icon}</div>
            <span>${inc.text}</span>
        </div>
    `).join('');

    // Guests selector adjustment based on package limitations
    const guestSelect = document.getElementById('guestCountSelect');
    guestSelect.innerHTML = '';
    for (let i = 1; i <= pkg.maxGuests; i++) {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = `${i} Guest${i > 1 ? 's' : ''}`;
        if (i === 2) opt.selected = true;
        guestSelect.appendChild(opt);
    }

    // 4. Initialize Datepicker with Flatpickr
    let flatpickrCheckin, flatpickrCheckout;
    
    flatpickrCheckin = flatpickr('#checkinDate', {
        minDate: "today",
        dateFormat: "Y-m-d",
        onChange: function(selectedDates, dateStr) {
            if (flatpickrCheckout) {
                flatpickrCheckout.set('minDate', dateStr);
            }
        }
    });

    flatpickrCheckout = flatpickr('#checkoutDate', {
        minDate: "today",
        dateFormat: "Y-m-d"
    });

    // Re-render lucide icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // 5. Autoplay flow if user selected "Book Package" on homepage
    if (autoBook) {
        const bookingCard = document.querySelector('.sticky-booking-card');
        if (bookingCard) {
            bookingCard.classList.add('booking-active-glow');
        }
        setTimeout(() => {
            const sidebar = document.getElementById('bookingSidebar');
            if (sidebar) {
                sidebar.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Focus check-in date
                setTimeout(() => {
                    const checkinBox = document.getElementById('checkinDate');
                    if (checkinBox && flatpickrCheckin) {
                        flatpickrCheckin.open();
                    }
                }, 800);
            }
        }, 500);
    }
});

// Book Package logic
window.bookPackage = function() {
    // Get the current package id
    const params = new URLSearchParams(window.location.search);
    const packageId = params.get('id');
    const pkg = packagesData.find(p => p.id === packageId);

    if (!pkg) {
        alert('Package data not resolved.');
        return;
    }

    const checkinVal = document.getElementById('checkinDate').value;
    const checkoutVal = document.getElementById('checkoutDate').value;

    if (!checkinVal || !checkoutVal) {
        showToast('Please select Check-In and Check-Out dates before booking.');
        return;
    }

    const checkin = new Date(checkinVal);
    const checkout = new Date(checkoutVal);
    const diffTime = Math.abs(checkout - checkin);
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (nights <= 0) {
        showToast('Check-Out date must be after Check-In date.');
        return;
    }

    const guests = parseInt(document.getElementById('guestCountSelect').value);

    // Save package stayed price flat
    const basePrice = pkg.price;
    const taxes = Math.floor(basePrice * 0.12);
    const grandTotal = basePrice + taxes;

    const bookingData = {
        roomId: pkg.id,
        roomName: pkg.name,
        roomImage: pkg.image,
        roomCategory: "Exclusive Packages",
        price: basePrice,
        checkinDate: checkinVal,
        checkoutDate: checkoutVal,
        nights: nights,
        guests: guests,
        roomTotal: basePrice, // flat price stays flat!
        taxes: taxes,
        addons: [],
        addonsTotal: 0,
        promoCode: null,
        promoDiscount: 0,
        grandTotal: grandTotal
    };

    localStorage.setItem('bookingData', JSON.stringify(bookingData));

    // Intercept checkout redirect if not logged in & not guest checkout
    if (typeof window.isLoggedIn === 'function' && !window.isLoggedIn() && localStorage.getItem('guestCheckout') !== 'true') {
        window.showAuthModal({ type: 'reserve-room', data: bookingData });
    } else {
        window.location.href = 'checkout.html';
    }
};

// Toast notification helper
function showToast(message) {
    const toast = document.getElementById('bookingToast');
    const toastMsg = document.getElementById('toastMsg');
    if (toast && toastMsg) {
        toastMsg.textContent = message;
        toast.style.display = 'flex';
        setTimeout(() => {
            toast.style.display = 'none';
        }, 4000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Fetch Booking Data from LocalStorage
    let bookingData = JSON.parse(localStorage.getItem('bookingData'));
    
    if (!bookingData) {
        // Redirect to index.html if no booking data exists
        window.location.href = 'index.html';
        return;
    }

    // 2. Populate Fields
    document.getElementById('bookingId').innerText = bookingData.bookingId;
    document.getElementById('printInvoiceDate').innerText = new Date(bookingData.bookingDate).toLocaleDateString();
    
    // Room info
    const roomImg = document.getElementById('roomImg');
    if (roomImg) roomImg.src = bookingData.roomImage || 'images/default-room.jpg';
    document.getElementById('roomName').innerText = bookingData.roomName;
    document.getElementById('roomCat').innerText = bookingData.roomCategory;
    
    // Stay grid
    document.getElementById('checkinDate').innerText = bookingData.checkinDate;
    document.getElementById('checkoutDate').innerText = bookingData.checkoutDate;
    document.getElementById('guestsCount').innerText = `${bookingData.guests} Guest${bookingData.guests > 1 ? 's' : ''}`;
    document.getElementById('nightsCount').innerText = `${bookingData.nights} Night${bookingData.nights > 1 ? 's' : ''}`;
    
    // Itemized costs
    document.getElementById('priceRoomTotal').innerText = `$${bookingData.roomTotal.toLocaleString()}`;
    document.getElementById('priceTaxes').innerText = `$${bookingData.taxes.toLocaleString()}`;
    document.getElementById('priceGrandTotal').innerText = `$${bookingData.grandTotal.toLocaleString()}`;
    document.getElementById('paymentMethod').innerText = bookingData.paymentMethod;

    // Add-ons Summary Row
    const addonsSummaryRow = document.getElementById('addonsSummaryRow');
    if (bookingData.addons && bookingData.addons.length > 0) {
        if (addonsSummaryRow) {
            addonsSummaryRow.style.display = 'flex';
            document.getElementById('priceAddonsTotal').innerText = `$${bookingData.addonsTotal.toLocaleString()}`;
        }
    } else {
        if (addonsSummaryRow) addonsSummaryRow.style.display = 'none';
    }

    // Promo code discount row
    const promoDiscountRow = document.getElementById('promoDiscountRow');
    if (bookingData.promoCode && bookingData.promoDiscount > 0) {
        if (promoDiscountRow) {
            promoDiscountRow.style.display = 'flex';
            document.getElementById('promoCodeLabel').innerText = bookingData.promoCode;
            document.getElementById('pricePromoDiscount').innerText = `-$${bookingData.promoDiscount.toLocaleString()}`;
        }
    } else {
        if (promoDiscountRow) promoDiscountRow.style.display = 'none';
    }

    // Guest Info block
    const guest = bookingData.guest || {};
    const guestFullName = `${guest.firstName || ''} ${guest.lastName || ''}`;
    document.getElementById('guestName').innerText = guestFullName;
    
    const guestContact = `${guest.email || ''}\n${guest.phone || ''}`;
    document.getElementById('guestContact').innerText = guestContact;
    document.getElementById('confirmEmail').innerText = guest.email || '';

    // Special Requests block
    const specialRequestsBlock = document.getElementById('specialRequestsBlock');
    const specialRequests = document.getElementById('specialRequests');
    if (guest.specialRequests && guest.specialRequests.trim() !== '') {
        if (specialRequestsBlock && specialRequests) {
            specialRequestsBlock.style.display = 'block';
            specialRequests.innerText = guest.specialRequests;
        }
    } else {
        if (specialRequestsBlock) specialRequestsBlock.style.display = 'none';
    }

    // 3. Calendar Links Setup
    setupCalendarLinks(bookingData);

    // 4. Confetti Animation
    startConfetti();

    // 5. Download Invoice functionality (Print)
    const printInvoiceBtn = document.getElementById('printInvoiceBtn');
    if (printInvoiceBtn) {
        printInvoiceBtn.addEventListener('click', () => {
            window.print();
        });
    }

    // 6. Clear current bookingData from localStorage (but keep bookingHistory)
    localStorage.removeItem('bookingData');

    // Initialize Lucide Icons
    if (window.lucide) lucide.createIcons();
});

// Setup Calendar Synchronization Links
function setupCalendarLinks(booking) {
    const checkinStr = booking.checkinDate; // YYYY-MM-DD
    const checkoutStr = booking.checkoutDate; // YYYY-MM-DD

    // Format dates to YYYYMMDD for calendar integrations
    const formatCalDate = (dateStr, isEnd = false) => {
        const parts = dateStr.split('-');
        if (parts.length !== 3) return '';
        let year = parts[0];
        let month = parts[1];
        let day = parts[2];
        
        // Google calendar expects dates in format YYYYMMDD
        return `${year}${month}${day}`;
    };

    const gStartDate = formatCalDate(checkinStr);
    const gEndDate = formatCalDate(checkoutStr);

    if (gStartDate && gEndDate) {
        // Google Calendar link
        const eventTitle = encodeURIComponent(`Stay at Flex-Stays: ${booking.roomName}`);
        const eventDetails = encodeURIComponent(`Reservation ID: ${booking.bookingId}\nStay details: ${booking.nights} nights for ${booking.guests} guests.`);
        const eventLocation = encodeURIComponent('712 Coastal Drive, Melbourne');
        const googleUrl = `https://calendar.google.com/calendar/event?action=TEMPLATE&text=${eventTitle}&dates=${gStartDate}/${gEndDate}&details=${eventDetails}&location=${eventLocation}`;
        
        const googleCalendarBtn = document.getElementById('googleCalendarBtn');
        if (googleCalendarBtn) googleCalendarBtn.href = googleUrl;

        // Outlook / Apple (.ics) File Generation
        const outlookCalendarBtn = document.getElementById('outlookCalendarBtn');
        if (outlookCalendarBtn) {
            outlookCalendarBtn.addEventListener('click', () => {
                const icsContent = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Flex-Stays//NONSGML Booking Confirmation//EN
BEGIN:VEVENT
UID:${booking.bookingId}@flexstays.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART;VALUE=DATE:${gStartDate}
DTEND;VALUE=DATE:${gEndDate}
SUMMARY:Stay at Flex-Stays - ${booking.roomName}
DESCRIPTION:Reservation ID: ${booking.bookingId}\\nRoom Name: ${booking.roomName}\\nNights: ${booking.nights}\\nGuests: ${booking.guests}
LOCATION:712 Coastal Drive, Melbourne
END:VEVENT
END:VCALENDAR`;

                const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.setAttribute('download', `flex_stays_${booking.bookingId}.ics`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        }
    }
}

// Confetti Physics Animation
function startConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Resize canvas
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const colors = ['#0ABFAC', '#0d2a2a', '#e8faf9', '#f59e0b', '#3b82f6', '#ec4899', '#10b981'];
    const particleCount = 120;
    const particles = [];

    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height - 20,
            size: Math.random() * 8 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            speed: Math.random() * 3 + 2,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 4 - 2,
            opacity: 1,
            wind: Math.random() * 1.5 - 0.75
        });
    }

    let animationActive = true;
    let startTime = Date.now();

    function draw() {
        if (!animationActive) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            ctx.save();
            ctx.translate(p.x + p.size / 2, p.y + p.size / 2);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.opacity;
            
            // Draw a tiny rectangle
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();

            // Physics update
            p.y += p.speed;
            p.x += p.wind;
            p.rotation += p.rotationSpeed;

            // Loop / Fall
            if (p.y > canvas.height) {
                p.y = -20;
                p.x = Math.random() * canvas.width;
            }
        });

        // Decay opacity slowly after 3 seconds
        const elapsed = Date.now() - startTime;
        if (elapsed > 3000) {
            particles.forEach(p => {
                p.opacity = Math.max(0, 1 - (elapsed - 3000) / 2000);
            });
        }

        // Stop animation completely after 5 seconds
        if (elapsed > 5000) {
            animationActive = false;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            return;
        }

        requestAnimationFrame(draw);
    }

    draw();
}

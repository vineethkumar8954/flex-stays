document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (window.lucide) lucide.createIcons();

    // 1. Sidebar Tab Switching
    const menuLinks = document.querySelectorAll('.menu-link');
    const panels = document.querySelectorAll('.dashboard-panel');

    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Remove active class from links and panels
            menuLinks.forEach(l => l.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));

            // Set current active
            link.classList.add('active');
            const targetId = link.getAttribute('data-target');
            const activePanel = document.getElementById(targetId);
            if (activePanel) activePanel.classList.add('active');
        });
    });

    // 2. Load LocalStorage Data
    loadDashboardData();

    function loadDashboardData() {
        // A. Load Active User Profile details
        const currentUser = window.getCurrentUser();
        if (!currentUser) {
            window.location.href = 'login.html';
            return;
        }

        const userEmail = currentUser.email.toLowerCase();
        const sidebarName = document.getElementById('sidebarGuestName');
        const sidebarEmail = document.getElementById('sidebarGuestEmail');
        const greetingName = document.getElementById('guestGreetingName');
        const avatarBadge = document.getElementById('avatarBadge');

        const firstName = currentUser.firstName || '';
        const lastName = currentUser.lastName || '';
        const email = currentUser.email || '';
        const phone = currentUser.mobile || '';
        const country = currentUser.country || '';

        if (sidebarName) sidebarName.innerText = (firstName || lastName) ? `${firstName} ${lastName}`.trim() : 'Valued Guest';
        if (sidebarEmail) sidebarEmail.innerText = email;
        if (greetingName) greetingName.innerText = firstName ? firstName : 'Guest';
        if (avatarBadge && firstName) avatarBadge.innerText = firstName.charAt(0).toUpperCase();

        // Populate Profile inputs
        const inputFname = document.getElementById('profileFirstName');
        const inputLname = document.getElementById('profileLastName');
        const inputEmail = document.getElementById('profileEmail');
        const inputPhone = document.getElementById('profilePhone');
        const inputCountry = document.getElementById('profileCountry');

        if (inputFname) inputFname.value = firstName;
        if (inputLname) inputLname.value = lastName;
        if (inputEmail) inputEmail.value = email;
        if (inputPhone) inputPhone.value = phone;
        if (inputCountry) inputCountry.value = country;

        // B. Load Bookings History (Stays)
        const bookingHistory = JSON.parse(localStorage.getItem(`bookings_${userEmail}`)) || [];
        const bookingsTableBody = document.getElementById('bookingsTableBody');
        const activeStaysCount = document.getElementById('activeStaysCount');
        const rewardPoints = document.getElementById('rewardPoints');
        const badgeStays = document.getElementById('badgeStays');
        
        let totalSpent = 0;
        let confirmedStaysCount = 0;

        if (bookingHistory.length > 0) {
            if (bookingsTableBody) {
                bookingsTableBody.innerHTML = '';
                bookingHistory.forEach(booking => {
                    if (booking.status === 'Confirmed') {
                        confirmedStaysCount++;
                        totalSpent += booking.grandTotal || 0;
                    }

                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td><strong>${booking.bookingId}</strong></td>
                        <td>${booking.roomName}</td>
                        <td>${booking.checkinDate}</td>
                        <td>${booking.checkoutDate}</td>
                        <td>${booking.nights}</td>
                        <td style="font-weight: 600;">$${(booking.grandTotal || 0).toLocaleString()}</td>
                        <td><span class="status-badge ${booking.status.toLowerCase()}">${booking.status}</span></td>
                    `;
                    bookingsTableBody.appendChild(tr);
                });
            }
        } else {
            if (bookingsTableBody) {
                bookingsTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 30px; color: var(--text-muted);">No stay bookings confirmed yet.</td></tr>`;
            }
        }
        
        if (activeStaysCount) activeStaysCount.innerText = confirmedStaysCount;
        if (badgeStays) badgeStays.innerText = bookingHistory.length;
        if (rewardPoints) rewardPoints.innerText = totalSpent.toLocaleString(); // $1 = 1 point

        // C. Populate Upcoming Stay details card
        const upcomingStayCard = document.getElementById('upcomingStayCard');
        const upcomingStays = bookingHistory.filter(b => b.status === 'Confirmed');
        
        if (upcomingStays.length > 0) {
            const nextStay = upcomingStays[upcomingStays.length - 1]; // Load newest confirmed stay
            if (upcomingStayCard) {
                upcomingStayCard.style.display = 'block';
                const upcomingRoomImg = document.getElementById('upcomingRoomImg');
                const upcomingRoomName = document.getElementById('upcomingRoomName');
                const upcomingStayDates = document.getElementById('upcomingStayDates');
                const upcomingGuestsCount = document.getElementById('upcomingGuestsCount');
                const upcomingTotalPaid = document.getElementById('upcomingTotalPaid');

                if (upcomingRoomImg) upcomingRoomImg.src = nextStay.roomImage || 'images/default-room.jpg';
                if (upcomingRoomName) upcomingRoomName.innerText = nextStay.roomName;
                if (upcomingStayDates) upcomingStayDates.innerHTML = `<i data-lucide="calendar" style="width:16px; height:16px; display:inline-block; vertical-align:text-bottom; margin-right:4px;"></i> ${nextStay.checkinDate} → ${nextStay.checkoutDate} (${nextStay.nights} Night${nextStay.nights > 1 ? 's' : ''})`;
                if (upcomingGuestsCount) upcomingGuestsCount.innerHTML = `<i data-lucide="users" style="width:16px; height:16px; display:inline-block; vertical-align:text-bottom; margin-right:4px;"></i> ${nextStay.guests} Guest${nextStay.guests > 1 ? 's' : ''}`;
                if (upcomingTotalPaid) upcomingTotalPaid.innerText = `$${(nextStay.grandTotal || 0).toLocaleString()}`;
                
                if (window.lucide) lucide.createIcons();
            }
        } else {
            if (upcomingStayCard) upcomingStayCard.style.display = 'none';
        }

        // D. Load Dining Reservations
        const diningReservations = JSON.parse(localStorage.getItem(`dining_${userEmail}`)) || [];
        const diningTableBody = document.getElementById('diningTableBody');
        const activeDiningCount = document.getElementById('activeDiningCount');
        const badgeDining = document.getElementById('badgeDining');

        let confirmedDiningCount = 0;

        if (diningReservations.length > 0) {
            if (diningTableBody) {
                diningTableBody.innerHTML = '';
                diningReservations.forEach((res, index) => {
                    if (res.status === 'Confirmed') confirmedDiningCount++;
                    
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td><strong>${res.id}</strong></td>
                        <td>${res.restaurant}</td>
                        <td>${res.date}</td>
                        <td>${res.time}</td>
                        <td>${res.guests}</td>
                        <td><span class="status-badge ${res.status.toLowerCase()}">${res.status}</span></td>
                        <td>
                            ${res.status === 'Confirmed' ? `<button class="btn btn-outline-forest btn-sm cancel-dining-btn" data-index="${index}">Cancel</button>` : '-'}
                        </td>
                    `;
                    diningTableBody.appendChild(tr);
                });
            }
        } else {
            if (diningTableBody) {
                diningTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 30px; color: var(--text-muted);">No dining table reservations booked.</td></tr>`;
            }
        }
        
        if (activeDiningCount) activeDiningCount.innerText = confirmedDiningCount;
        
        // D.2 Load Wine Reservations
        const wineReservations = JSON.parse(localStorage.getItem(`wine_${userEmail}`)) || [];
        const wineTableBody = document.getElementById('wineTableBody');
        
        if (wineReservations.length > 0) {
            if (wineTableBody) {
                wineTableBody.innerHTML = '';
                wineReservations.forEach(wine => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td><strong>${wine.id}</strong></td>
                        <td>${wine.name}</td>
                        <td>${wine.brand || 'Luxury Estate'}</td>
                        <td style="font-weight: 600;">₹${wine.price.toLocaleString('en-IN')}</td>
                        <td>${wine.reservedAt ? new Date(wine.reservedAt).toLocaleDateString() : '--'}</td>
                        <td><span class="status-badge confirmed">Confirmed</span></td>
                    `;
                    wineTableBody.appendChild(tr);
                });
            }
        } else {
            if (wineTableBody) {
                wineTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 30px; color: var(--text-muted);">No wine bottle reservations found.</td></tr>`;
            }
        }
        
        // Combined dining count badge (tables + wines)
        if (badgeDining) badgeDining.innerText = diningReservations.length + wineReservations.length;

        // E. Load Event Requests
        const eventInquiries = JSON.parse(localStorage.getItem(`events_${userEmail}`)) || [];
        const eventsTableBody = document.getElementById('eventsTableBody');
        const badgeEvents = document.getElementById('badgeEvents');

        if (eventInquiries.length > 0) {
            if (eventsTableBody) {
                eventsTableBody.innerHTML = '';
                eventInquiries.forEach(inq => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td><strong>${inq.id}</strong></td>
                        <td>${inq.venue}</td>
                        <td>${inq.date}</td>
                        <td>${inq.guests || inq.name}</td>
                        <td style="font-weight: 500;">${inq.cost || 'Reviewing'}</td>
                        <td><span class="status-badge pending">Pending Coordinator</span></td>
                    `;
                    eventsTableBody.appendChild(tr);
                });
            }
        } else {
            if (eventsTableBody) {
                eventsTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 30px; color: var(--text-muted);">No event proposals submitted.</td></tr>`;
            }
        }
        if (badgeEvents) badgeEvents.innerText = eventInquiries.length;

        // F. Load Saved Rooms (Wishlist)
        const wishlist = JSON.parse(localStorage.getItem(`wishlist_${userEmail}`)) || [];
        const wishlistGrid = document.getElementById('wishlistGrid');
        const wishlistEmptyState = document.getElementById('wishlistEmptyState');
        const badgeWishlist = document.getElementById('badgeWishlist');

        if (wishlist.length > 0) {
            if (wishlistEmptyState) wishlistEmptyState.style.display = 'none';
            if (wishlistGrid) {
                wishlistGrid.style.display = 'grid';
                wishlistGrid.innerHTML = '';
                
                wishlist.forEach(roomId => {
                    const room = roomsData.find(r => r.id === roomId);
                    if (room) {
                        const card = document.createElement('div');
                        card.className = 'wishlist-card';
                        card.innerHTML = `
                            <div class="wishlist-img-wrapper">
                                <button class="wishlist-remove-btn" data-room-id="${room.id}" title="Remove from Wishlist"><i data-lucide="trash-2" style="width: 16px; height: 16px;"></i></button>
                                <img src="${room.image}" alt="${room.name}">
                            </div>
                            <div class="wishlist-info">
                                <div class="wishlist-cat">${room.category}</div>
                                <h4 class="wishlist-name">${room.name}</h4>
                                <div class="wishlist-price">$${room.price}/night</div>
                                <div style="display:flex; gap:8px;">
                                    <a href="room-details.html?id=${room.id}" class="btn btn-outline-forest btn-sm" style="flex:1; text-align:center;">Details</a>
                                    <button class="btn btn-primary btn-sm reserve-btn" data-room-id="${room.id}" style="flex:1.5;">Book Now</button>
                                </div>
                            </div>
                        `;
                        wishlistGrid.appendChild(card);
                    }
                });
                
                if (window.lucide) lucide.createIcons();
            }
        } else {
            if (wishlistGrid) wishlistGrid.style.display = 'none';
            if (wishlistEmptyState) wishlistEmptyState.style.display = 'block';
        }
        if (badgeWishlist) badgeWishlist.innerText = wishlist.length;

        // G. Load Invoices Table
        const invoicesTableBody = document.getElementById('invoicesTableBody');
        if (bookingHistory.length > 0) {
            if (invoicesTableBody) {
                invoicesTableBody.innerHTML = '';
                bookingHistory.forEach((booking, index) => {
                    const tr = document.createElement('tr');
                    // Create formatted invoice ID based on booking reference
                    const invId = `INV-${booking.bookingId.split('-')[1]}`;
                    const invDate = booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : new Date().toLocaleDateString();
                    
                    tr.innerHTML = `
                        <td><strong>${invId}</strong></td>
                        <td>${booking.bookingId}</td>
                        <td>${invDate}</td>
                        <td style="font-weight:600;">$${(booking.grandTotal || 0).toLocaleString()}</td>
                        <td>${firstName || lastName ? `${firstName} ${lastName}`.trim() : 'Valued Guest'}</td>
                        <td>
                            <button class="btn btn-outline-forest btn-sm print-inv-btn" data-booking-id="${booking.bookingId}">Print Invoice</button>
                        </td>
                    `;
                    invoicesTableBody.appendChild(tr);
                });
            }
        } else {
            if (invoicesTableBody) {
                invoicesTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 30px; color: var(--text-muted);">No stay invoices compiled.</td></tr>`;
            }
        }

        // H. Compile Activity Feed logs
        const activityTableBody = document.getElementById('activityTableBody');
        if (activityTableBody) {
            activityTableBody.innerHTML = '';
            
            const logs = [];
            // Add stay stays to logs
            bookingHistory.forEach(b => {
                logs.push({
                    id: b.bookingId,
                    service: `Suite Booking: ${b.roomName}`,
                    date: b.checkinDate,
                    cost: `$${(b.grandTotal || 0).toLocaleString()}`,
                    status: b.status,
                    timestamp: b.bookingDate ? new Date(b.bookingDate).getTime() : 0
                });
            });

            // Add dining bookings to logs
            diningReservations.forEach(d => {
                logs.push({
                    id: d.id,
                    service: `Dining Reservation: ${d.restaurant} (${d.guests})`,
                    date: d.date,
                    cost: d.totalCost > 0 ? `$${d.totalCost}` : 'Free Booking',
                    status: d.status,
                    timestamp: d.createdAt ? new Date(d.createdAt).getTime() : 0
                });
            });

            // Add event bookings to logs
            eventInquiries.forEach(e => {
                logs.push({
                    id: e.id,
                    service: `Event Inquiry: ${e.venue}`,
                    date: e.date,
                    cost: e.cost || 'Evaluating',
                    status: 'Pending',
                    timestamp: e.createdAt ? new Date(e.createdAt).getTime() : 0
                });
            });

            // Sort newest first
            logs.sort((a,b) => b.timestamp - a.timestamp);

            if (logs.length > 0) {
                logs.forEach(log => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td><strong>${log.id}</strong></td>
                        <td>${log.service}</td>
                        <td>${log.date}</td>
                        <td style="font-weight: 500;">${log.cost}</td>
                        <td><span class="status-badge ${log.status.toLowerCase()}">${log.status}</span></td>
                    `;
                    activityTableBody.appendChild(tr);
                });
            } else {
                activityTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 20px; color: var(--text-muted);">No activity logged in dashboard.</td></tr>`;
            }
        }
    }

    // 3. Profile Form Submission
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fname = document.getElementById('profileFirstName').value.trim();
            const lname = document.getElementById('profileLastName').value.trim();
            const email = document.getElementById('profileEmail').value.trim();
            const phone = document.getElementById('profilePhone').value.trim();
            const country = document.getElementById('profileCountry').value.trim();

            const currentUser = window.getCurrentUser();
            if (currentUser) {
                currentUser.firstName = fname;
                currentUser.lastName = lname;
                currentUser.mobile = phone;
                currentUser.country = country;

                // Save back to currentUser session
                localStorage.setItem('currentUser', JSON.stringify(currentUser));

                // Save back to users database
                let users = JSON.parse(localStorage.getItem('users') || '[]');
                const idx = users.findIndex(u => u.email.toLowerCase() === currentUser.email.toLowerCase());
                if (idx !== -1) {
                    users[idx].firstName = fname;
                    users[idx].lastName = lname;
                    users[idx].mobile = phone;
                    users[idx].country = country;
                    localStorage.setItem('users', JSON.stringify(users));
                }
            }

            // Sync guestInfo for backward compatibility
            const guestInfo = { firstName: fname, lastName: lname, email, phone, country };
            localStorage.setItem('guestInfo', JSON.stringify(guestInfo));
            
            // Reload & Show Toast
            loadDashboardData();
            showDashboardToast("Profile successfully updated!", "success");
        });
    }

    // 4. Support Form Submission
    const supportForm = document.getElementById('supportForm');
    if (supportForm) {
        supportForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const descField = document.getElementById('supportDesc');
            descField.value = '';
            
            showDashboardToast("Support ticket sent. A hospitality manager will contact you shortly.", "success");
        });
    }

    // 5. Dining Cancellations (Interactive)
    document.addEventListener('click', (e) => {
        const cancelBtn = e.target.closest('.cancel-dining-btn');
        if (cancelBtn) {
            const index = parseInt(cancelBtn.getAttribute('data-index'), 10);
            if (confirm("Are you sure you want to cancel this dining reservation?")) {
                const currentUser = window.getCurrentUser();
                const userEmail = currentUser ? currentUser.email.toLowerCase() : '';
                const key = `dining_${userEmail}`;
                
                let diningReservations = JSON.parse(localStorage.getItem(key)) || [];
                if (diningReservations[index]) {
                    diningReservations[index].status = 'Cancelled';
                    localStorage.setItem(key, JSON.stringify(diningReservations));
                }
                
                loadDashboardData();
                showDashboardToast("Dining reservation cancelled successfully.", "info");
            }
        }
    });

    // 6. Wishlist Removals
    document.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('.wishlist-remove-btn');
        if (removeBtn) {
            const roomId = removeBtn.getAttribute('data-room-id');
            const currentUser = window.getCurrentUser();
            const userEmail = currentUser ? currentUser.email.toLowerCase() : '';
            const key = `wishlist_${userEmail}`;
            
            let wishlist = JSON.parse(localStorage.getItem(key)) || [];
            wishlist = wishlist.filter(id => id !== roomId);
            localStorage.setItem(key, JSON.stringify(wishlist));
            
            loadDashboardData();
            showDashboardToast("Removed room from Wishlist.", "info");
        }
    });

    // 7. Invoice Printing Actions
    document.addEventListener('click', (e) => {
        const printBtn = e.target.closest('.print-inv-btn');
        if (printBtn) {
            const bookingId = printBtn.getAttribute('data-booking-id');
            // Mock print action: open print view
            showDashboardToast(`Opening print view for stay ${bookingId}...`, "success");
            setTimeout(() => {
                window.print();
            }, 1000);
        }
    });

    // Delegated Reserve button for wishlist cards
    document.addEventListener('click', function(e) {
        const reserveBtn = e.target.closest('.reserve-btn');
        if (reserveBtn && window.location.pathname.includes('guest-dashboard')) {
            e.preventDefault();
            const roomId = reserveBtn.getAttribute('data-room-id');
            const room = roomsData.find(r => r.id === roomId);
            if (!room) return;
            
            // Set default dates: tomorrow to 3 days after
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            const threeDaysAfter = new Date(tomorrow);
            threeDaysAfter.setDate(tomorrow.getDate() + 3);
            
            const checkinVal = tomorrow.toISOString().split('T')[0];
            const checkoutVal = threeDaysAfter.toISOString().split('T')[0];
            const nightsCount = 3;
            
            const bookingData = {
                roomId: room.id,
                roomName: room.name,
                roomCategory: room.category,
                roomImage: room.image,
                roomPrice: room.price,
                checkinDate: checkinVal,
                checkoutDate: checkoutVal,
                guests: 2,
                nights: nightsCount,
                roomTotal: room.price * nightsCount,
                taxes: Math.floor((room.price * nightsCount) * 0.12),
                grandTotal: room.price * nightsCount + Math.floor((room.price * nightsCount) * 0.12),
                addons: [],
                addonsTotal: 0,
                promoCode: null,
                promoDiscount: 0
            };
            
            localStorage.setItem('bookingData', JSON.stringify(bookingData));
            window.location.href = 'checkout.html';
        }
    });

    // 8. Custom Dashboard Toast Helper
    function showDashboardToast(message, type = 'info') {
        const existing = document.getElementById('dashboardToast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = 'dashboardToast';
        
        let iconHtml = '<i data-lucide="info" style="color:var(--gold);"></i>';
        if (type === 'success') {
            iconHtml = '<i data-lucide="check-circle" style="color:#2e7d32;"></i>';
        }
        
        toast.style.cssText = 'position:fixed; bottom:30px; left:50%; transform:translateX(-50%); background:#0d2a2a; border: 1px solid var(--gold); color:#fff; padding:14px 24px; border-radius:12px; font-size:14px; font-family:var(--font-body); z-index:9999; box-shadow:0 8px 32px rgba(0,0,0,0.3); display:flex; align-items:center; gap:12px; animation:slideUpToast 0.4s ease;';
        toast.innerHTML = `${iconHtml} <span>${message}</span>`;
        document.body.appendChild(toast);

        if (window.lucide) lucide.createIcons();

        if (!document.getElementById('toastAnimStyle')) {
            const style = document.createElement('style');
            style.id = 'toastAnimStyle';
            style.textContent = '@keyframes slideUpToast { from { opacity:0; transform:translateX(-50%) translateY(20px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }';
            document.head.appendChild(style);
        }

        setTimeout(() => { toast.remove(); }, 3500);
    }
});

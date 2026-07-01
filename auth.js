/**
 * auth.js — Flex-Stays Authentication & Session Manager
 * Handles: Login checks, navbar user dropdown menus, protected booking modals,
 * and pending bookings restoration.
 */

'use strict';

(function() {
    // 1. Inject Stylesheets dynamically for modal and dropdown
    const style = document.createElement('style');
    style.id = 'auth-shared-styles';
    style.textContent = `
        /* Auth Modal Overlay */
        .auth-modal-overlay {
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.65);
            backdrop-filter: blur(6px);
            z-index: 999999;
            display: none;
            align-items: center;
            justify-content: center;
            font-family: 'Inter', sans-serif;
            box-sizing: border-box;
        }
        .auth-modal-overlay.show {
            display: flex;
        }
        .auth-modal-card {
            background: linear-gradient(135deg, #0d2a2a 0%, #051a1a 100%);
            border: 1.5px solid #0ABFAC;
            border-radius: 16px;
            padding: 36px 32px;
            max-width: 420px;
            width: 90%;
            color: #fff;
            box-shadow: 0 24px 64px rgba(0, 0, 0, 0.6);
            text-align: center;
            animation: authScaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            box-sizing: border-box;
        }
        .auth-modal-title {
            font-family: 'Playfair Display', serif;
            color: #0ABFAC;
            font-size: 24px;
            margin: 0 0 12px;
            font-weight: 600;
        }
        .auth-modal-subtitle {
            color: rgba(255, 255, 255, 0.7);
            font-size: 14px;
            margin: 0 0 20px;
        }
        .auth-modal-features {
            text-align: left;
            list-style: none;
            padding: 0;
            margin: 0 auto 28px;
            max-width: 260px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            font-size: 13.5px;
        }
        .auth-modal-features li {
            color: rgba(255, 255, 255, 0.85);
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .auth-modal-features li span {
            color: #0ABFAC;
            font-weight: bold;
        }
        .auth-modal-actions {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .auth-modal-actions button {
            padding: 12px 20px;
            border-radius: 24px;
            font-weight: 600;
            font-size: 13.5px;
            cursor: pointer;
            transition: all 0.2s ease;
            box-sizing: border-box;
            border: none;
            text-align: center;
        }
        .auth-modal-actions .btn-primary {
            background: #0ABFAC;
            color: #0d2a2a;
            border: 1px solid #0ABFAC;
        }
        .auth-modal-actions .btn-primary:hover {
            background: #09a898;
            box-shadow: 0 4px 14px rgba(10, 191, 172, 0.3);
        }
        .auth-modal-actions .btn-outline {
            background: transparent;
            border: 1px solid rgba(10, 191, 172, 0.5);
            color: #0ABFAC;
        }
        .auth-modal-actions .btn-outline:hover {
            background: rgba(10, 191, 172, 0.1);
            border-color: #0ABFAC;
        }
        .auth-modal-actions .btn-guest {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #fff;
        }
        .auth-modal-actions .btn-guest:hover {
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(255, 255, 255, 0.4);
        }
        .auth-modal-actions .btn-underline {
            background: transparent;
            color: rgba(255, 255, 255, 0.5);
            text-decoration: underline;
            padding: 4px;
            font-size: 12px;
        }
        .auth-modal-actions .btn-underline:hover {
            color: #fff;
        }

        /* User Menu Dropdown */
        .nav-user-dropdown {
            position: relative;
            display: inline-block;
        }
        .nav-user-trigger {
            background: transparent;
            border: none;
            color: #0ABFAC;
            font-weight: 600;
            font-size: 13.5px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 8px 16px;
            border-radius: 20px;
            transition: background 0.2s;
            font-family: 'Inter', sans-serif;
            outline: none;
        }
        .nav-user-trigger:hover {
            background: rgba(10, 191, 172, 0.1);
        }
        .nav-user-menu {
            position: absolute;
            top: calc(100% + 8px);
            right: 0;
            background: #0d2a2a;
            border: 1.5px solid rgba(10, 191, 172, 0.3);
            border-radius: 8px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.4);
            min-width: 160px;
            display: none;
            flex-direction: column;
            overflow: hidden;
            z-index: 99999;
            animation: authFadeDropdown 0.2s ease;
        }
        .nav-user-menu.show {
            display: flex;
        }
        .nav-user-item {
            color: rgba(255, 255, 255, 0.85);
            padding: 10px 18px;
            text-decoration: none;
            font-size: 13px;
            transition: all 0.2s;
            text-align: left;
            font-family: 'Inter', sans-serif;
            font-weight: 500;
        }
        .nav-user-item:hover {
            background: rgba(10, 191, 172, 0.12);
            color: #0ABFAC;
        }
        .nav-user-item.border-top {
            border-top: 1.5px solid rgba(255, 255, 255, 0.08);
        }

        /* Welcome Back Banner */
        .welcome-back-banner {
            background: linear-gradient(90deg, #0d2a2a, #051a1a);
            border-bottom: 1.5px solid #0ABFAC;
            color: #fff;
            padding: 12px 24px;
            text-align: center;
            font-size: 13.5px;
            font-family: 'Inter', sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 16px;
            position: relative;
            z-index: 999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: authSlideDown 0.4s ease;
            flex-wrap: wrap;
        }
        .welcome-back-banner .btn-banner {
            background: #0ABFAC;
            color: #0d2a2a;
            font-weight: 700;
            border: none;
            padding: 5px 16px;
            border-radius: 12px;
            cursor: pointer;
            font-size: 12.5px;
            transition: all 0.2s;
        }
        .welcome-back-banner .btn-banner:hover {
            background: #09a898;
        }
        .welcome-back-banner .btn-dismiss {
            background: transparent;
            color: rgba(255,255,255,0.6);
            border: none;
            cursor: pointer;
            font-size: 12.5px;
            text-decoration: underline;
        }
        .welcome-back-banner .btn-dismiss:hover {
            color: #fff;
        }

        @keyframes authScaleIn {
            from { transform: scale(0.92); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        @keyframes authFadeDropdown {
            from { transform: translateY(6px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        @keyframes authSlideDown {
            from { transform: translateY(-100%); }
            to { transform: translateY(0); }
        }

        /* Global Toast Alert */
        .auth-toast {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: #ef4444;
            color: #fff;
            padding: 14px 24px;
            border-radius: 8px;
            font-size: 13.5px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 1000000;
            animation: authToastIn 0.3s ease;
            display: none;
        }
        .auth-toast.show {
            display: flex;
        }
        @keyframes authToastIn {
            from { transform: translateY(12px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    // 2. Dynamic Seeding and Sync Hooks
    function initializeHotelData() {
        // A. Seed Hotel Config
        if (!localStorage.getItem('hotelData')) {
            const hotelData = {
                totalRooms: 40,
                totalStaff: 15,
                totalFloors: 4,
                roomCategories: ["Standard Rooms", "Deluxe Rooms", "Executive Suites", "Presidential Suites"]
            };
            localStorage.setItem('hotelData', JSON.stringify(hotelData));
        }

        // B. Seed Staff Users
        if (!localStorage.getItem('staffUsers')) {
            const defaultStaff = [
                { id: "ADM001", firstName: "System", lastName: "Admin", email: "admin@flexstays.com", password: "admin123", role: "admin", status: "Active" },
                { id: "REC001", firstName: "Front", lastName: "Desk", email: "reception@flexstays.com", password: "reception123", role: "reception", status: "Active" },
                { id: "HKP001", firstName: "Chief", lastName: "Housekeeper", email: "housekeeping@flexstays.com", password: "housekeeping123", role: "housekeeping", status: "Active" },
                { id: "MNT001", firstName: "Lead", lastName: "Maintenance", email: "maintenance@flexstays.com", password: "maintenance123", role: "maintenance", status: "Active" },
                { id: "MGR001", firstName: "General", lastName: "Manager", email: "manager@flexstays.com", password: "manager123", role: "manager", status: "Active" }
            ];
            localStorage.setItem('staffUsers', JSON.stringify(defaultStaff));
        }

        // C. Seed Room Registry
        if (!localStorage.getItem('roomRegistry')) {
            const seedRooms = {};
            // 12 Standard Rooms: 101 to 112
            for (let i = 1; i <= 12; i++) {
                const roomNum = (100 + i).toString();
                seedRooms[roomNum] = { roomId: `STD-${String(i).padStart(3, '0')}`, roomNumber: roomNum, floor: 1, category: "Standard Rooms", status: "Available", housekeeping: "Clean", maintenanceIssue: null };
            }
            // 12 Deluxe Rooms: 201 to 212
            for (let i = 1; i <= 12; i++) {
                const roomNum = (200 + i).toString();
                seedRooms[roomNum] = { roomId: `DLX-${String(i).padStart(3, '0')}`, roomNumber: roomNum, floor: 2, category: "Deluxe Rooms", status: "Available", housekeeping: "Clean", maintenanceIssue: null };
            }
            // 10 Executive Suites: 301 to 310
            for (let i = 1; i <= 10; i++) {
                const roomNum = (300 + i).toString();
                seedRooms[roomNum] = { roomId: `EXEC-${String(i).padStart(3, '0')}`, roomNumber: roomNum, floor: 3, category: "Executive Suites", status: "Available", housekeeping: "Clean", maintenanceIssue: null };
            }
            // 6 Presidential Suites: 401 to 406
            for (let i = 1; i <= 6; i++) {
                const roomNum = (400 + i).toString();
                seedRooms[roomNum] = { roomId: `PRES-${String(i).padStart(3, '0')}`, roomNumber: roomNum, floor: 4, category: "Presidential Suites", status: "Available", housekeeping: "Clean", maintenanceIssue: null };
            }
            localStorage.setItem('roomRegistry', JSON.stringify(seedRooms));
        }

        // D. Seed empty arrays if missing
        if (!localStorage.getItem('notifications'))      localStorage.setItem('notifications',      JSON.stringify([]));
        if (!localStorage.getItem('auditLogs'))          localStorage.setItem('auditLogs',          JSON.stringify([]));
        if (!localStorage.getItem('maintenanceRequests'))localStorage.setItem('maintenanceRequests', JSON.stringify([]));
        if (!localStorage.getItem('eventRequests'))      localStorage.setItem('eventRequests',      JSON.stringify([]));
        if (!localStorage.getItem('bookings'))           localStorage.setItem('bookings',           JSON.stringify([]));
        if (!localStorage.getItem('diningReservations')) localStorage.setItem('diningReservations', JSON.stringify([]));

        // E. Trigger Sync Hooks
        window.syncGlobalBookings();
        window.syncGlobalEvents();
    }

    window.syncGlobalBookings = function() {
        let globalBookings = [];
        let modified = false;
        try {
            globalBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        } catch(e) {}

        const globalIds = new Set(globalBookings.map(b => b.id));

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('bookings_')) {
                try {
                    const userBookings = JSON.parse(localStorage.getItem(key) || '[]');
                    userBookings.forEach(booking => {
                        if (!globalIds.has(booking.id)) {
                            globalBookings.push(booking);
                            globalIds.add(booking.id);
                            modified = true;
                        }
                    });
                } catch(e) {}
            }
        }

        if (modified) {
            localStorage.setItem('bookings', JSON.stringify(globalBookings));
        }
    };

    window.syncGlobalEvents = function() {
        let globalEvents = [];
        let modified = false;
        try {
            globalEvents = JSON.parse(localStorage.getItem('eventRequests') || '[]');
        } catch(e) {}

        const globalIds = new Set(globalEvents.map(evt => evt.id || evt.requestedAt));

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('events_')) {
                try {
                    const userEvents = JSON.parse(localStorage.getItem(key) || '[]');
                    userEvents.forEach(evt => {
                        const id = evt.id || evt.requestedAt;
                        if (!globalIds.has(id)) {
                            if (!evt.id) evt.id = 'EVT' + Math.floor(1000 + Math.random() * 9000);
                            globalEvents.push(evt);
                            globalIds.add(id);
                            modified = true;
                        }
                    });
                } catch(e) {}
            }
        }

        if (modified) {
            localStorage.setItem('eventRequests', JSON.stringify(globalEvents));
        }
    };

    // 3. Shared Alerts and Audit Log System
    window.addNotification = function(text, targetRoles) {
        let notifications = [];
        try {
            notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        } catch (e) {}

        const newNotif = {
            id: 'NT' + Math.floor(1000 + Math.random() * 9000),
            timestamp: new Date().toISOString(),
            text: text,
            unreadBy: targetRoles || ['admin', 'reception', 'housekeeping', 'maintenance', 'manager']
        };

        notifications.unshift(newNotif);
        if (notifications.length > 50) notifications = notifications.slice(0, 50);
        localStorage.setItem('notifications', JSON.stringify(notifications));

        window.dispatchEvent(new Event('storage'));
    };

    window.addAuditLog = function(operator, action) {
        let logs = [];
        try {
            logs = JSON.parse(localStorage.getItem('auditLogs') || '[]');
        } catch (e) {}

        const newLog = {
            id: 'LOG' + Math.floor(1000 + Math.random() * 9000),
            timestamp: new Date().toISOString(),
            operator: operator || 'System',
            action: action
        };

        logs.unshift(newLog);
        if (logs.length > 100) logs = logs.slice(0, 100);
        localStorage.setItem('auditLogs', JSON.stringify(logs));

        window.dispatchEvent(new Event('storage'));
    };

    window.renderNotificationCenter = function() {
        const navActions = document.querySelector('.nav-actions');
        if (!navActions) return;

        const user = window.getCurrentUser();
        if (!user) return;
        const role = user.role || 'guest';

        let notifications = [];
        try {
            notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        } catch (e) {}

        const unreadCount = notifications.filter(n => n.unreadBy.includes(role)).length;

        let btn = document.getElementById('navNotificationBtn');
        if (btn) {
            btn.remove();
        }

        const container = document.createElement('div');
        container.className = 'nav-user-dropdown';
        container.id = 'navNotificationBtn';
        container.style.marginRight = '12px';
        container.style.position = 'relative';

        container.innerHTML = `
            <button class="nav-user-trigger" id="notifDropdownBtn" style="position:relative; padding: 8px 12px; height: 38px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: rgba(255,255,255,0.05); color:#0ABFAC; border:none; cursor:pointer;">
                <i data-lucide="bell" style="width:18px;height:18px;"></i>
                ${unreadCount > 0 ? `<span class="notif-badge" style="position:absolute; top:-2px; right:-2px; background:#ef4444; color:#fff; border-radius:50%; width:16px; height:16px; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:700;">${unreadCount}</span>` : ''}
            </button>
            <div class="nav-user-menu" id="notifDropdownMenu" style="width: 320px; max-height: 400px; overflow-y: auto; padding: 10px 0; right: 0; background:#0d2a2a; border: 1.5px solid rgba(10,191,172,0.3); border-radius:8px; display:none; flex-direction:column; position:absolute; top:calc(100% + 8px); box-shadow:0 8px 32px rgba(0,0,0,0.4); z-index:99999;">
                <div style="padding: 10px 16px; border-bottom: 1px solid rgba(255,255,255,0.08); display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-weight:600; font-size:14px; color:#fff;">Notifications</span>
                    ${unreadCount > 0 ? `<a href="#" id="markAllReadBtn" style="font-size:11px; color:#0ABFAC; text-decoration:none;">Mark all read</a>` : ''}
                </div>
                <div id="notifListContainer" style="display:flex; flex-direction:column; max-height:300px; overflow-y:auto;">
                    ${notifications.length === 0 ? `
                        <div style="padding: 20px 16px; text-align:center; color:rgba(255,255,255,0.4); font-size:13px;">No notifications yet</div>
                    ` : notifications.map(n => {
                        const isUnread = n.unreadBy.includes(role);
                        return `
                            <div style="padding:12px 16px; border-bottom:1px solid rgba(255,255,255,0.04); font-size:12px; color: ${isUnread ? '#fff' : 'rgba(255,255,255,0.6)'}; background: ${isUnread ? 'rgba(10,191,172,0.05)' : 'transparent'}; transition:background 0.2s;">
                                <div style="display:flex; justify-content:space-between; margin-bottom:4px; font-size:10px; color:rgba(255,255,255,0.4);">
                                    <span>${new Date(n.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    ${isUnread ? `<span style="color:#0ABFAC; font-weight:700;">●</span>` : ''}
                                </div>
                                <div>${n.text}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;

        navActions.insertBefore(container, navActions.firstChild);

        const notifBtn = document.getElementById('notifDropdownBtn');
        const notifMenu = document.getElementById('notifDropdownMenu');

        if (notifBtn && notifMenu) {
            notifBtn.addEventListener('click', (e) => {
                const userMenu = document.getElementById('navUserMenu');
                if (userMenu) userMenu.classList.remove('show');
                notifMenu.style.display = notifMenu.style.display === 'flex' ? 'none' : 'flex';
                e.stopPropagation();
            });
            window.addEventListener('click', () => {
                notifMenu.style.display = 'none';
            });
        }

        const markReadBtn = document.getElementById('markAllReadBtn');
        if (markReadBtn) {
            markReadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                notifications.forEach(n => {
                    n.unreadBy = n.unreadBy.filter(r => r !== role);
                });
                localStorage.setItem('notifications', JSON.stringify(notifications));
                window.renderNotificationCenter();
                window.dispatchEvent(new Event('storage'));
            });
        }

        if (window.lucide) {
            lucide.createIcons();
        }
    };

    // 4. Initial DOM Setup
    document.addEventListener('DOMContentLoaded', () => {
        // Initialize structures
        initializeHotelData();

        const modalContainer = document.createElement('div');
        modalContainer.id = 'authRequiredModal';
        modalContainer.className = 'auth-modal-overlay';
        modalContainer.innerHTML = `
            <div class="auth-modal-card">
                <h3 class="auth-modal-title">Create Your Flex-Stays Account</h3>
                <p class="auth-modal-subtitle">Sign in or create an account to:</p>
                <ul class="auth-modal-features">
                    <li><span>✓</span> Manage bookings</li>
                    <li><span>✓</span> Save favorite rooms</li>
                    <li><span>✓</span> Track reservations</li>
                    <li><span>✓</span> Access exclusive offers</li>
                </ul>
                <div class="auth-modal-actions">
                    <button class="btn btn-primary" id="authModalSignIn">Sign In</button>
                    <button class="btn btn-outline" id="authModalSignUp">Create Account</button>
                    <button class="btn btn-guest" id="authModalGuest">Continue as Guest</button>
                    <button class="btn btn-underline" id="authModalClose">Continue Browsing</button>
                </div>
            </div>
        `;
        document.body.appendChild(modalContainer);

        // Bind Modal Button Listeners
        document.getElementById('authModalSignIn').addEventListener('click', () => {
            window.location.href = 'login.html';
        });
        document.getElementById('authModalSignUp').addEventListener('click', () => {
            window.location.href = 'signup.html';
        });
        document.getElementById('authModalGuest').addEventListener('click', () => {
            localStorage.setItem('guestCheckout', 'true');
            closeAuthModal();
            window.resumeIntendedAction();
        });
        document.getElementById('authModalClose').addEventListener('click', closeAuthModal);

        // Inject Toast HTML if not present
        if (!document.getElementById('errorToast')) {
            const toastDiv = document.createElement('div');
            toastDiv.id = 'errorToast';
            toastDiv.className = 'auth-toast';
            toastDiv.innerHTML = `
                <i data-lucide="alert-circle" style="width:18px;height:18px;"></i>
                <span id="toastMsg">Something went wrong!</span>
            `;
            document.body.appendChild(toastDiv);
        }

        // Show warning toast if present in localStorage
        const authWarning = localStorage.getItem('authWarning');
        if (authWarning) {
            localStorage.removeItem('authWarning');
            setTimeout(() => {
                window.showToast(authWarning);
            }, 300);
        }

        // Initialize Navbar
        updateNavbarUI();

        // Enforce route restrictions
        enforceRouteRestrictions();

        // Check for pending booking restoration banner
        showWelcomeBackBanner();
    });

    // 5. Expose Auth functions globally
    window.showToast = function(msg) {
        const toast = document.getElementById('errorToast');
        const msgSpan = document.getElementById('toastMsg');
        if (toast && msgSpan) {
            msgSpan.textContent = msg;
            toast.classList.add('show');
            setTimeout(() => { toast.classList.remove('show'); }, 4000);
        } else {
            console.log('Toast Fallback:', msg);
        }
    };

    // === GOOGLE OAUTH CLIENT CONFIGURATION ===
    // If you see "Error 401: invalid_client", you need to replace this value with a valid Google Client ID
    // generated for your own Google Cloud Console project, with "http://localhost:3000" registered 
    // as an Authorized JavaScript Origin.
    window.GOOGLE_CLIENT_ID = '942145545567-9i0je902e5ul0vhm0rl0qf85frsfq76j.apps.googleusercontent.com';

    function decodeJwt(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error('Failed to decode JWT:', e);
            return null;
        }
    }

    function handleCredentialResponse(response) {
        try {
            const idToken = response.credential;
            if (!idToken) {
                window.showToast('Login failed: No credential received from Google.');
                return;
            }

            const payload = decodeJwt(idToken);
            if (!payload) {
                window.showToast('Login failed: Invalid credential token.');
                return;
            }

            // Security Validation (aud, exp, iss)
            if (payload.aud !== window.GOOGLE_CLIENT_ID) {
                window.showToast('Security Error: Google credential client ID mismatch.');
                return;
            }
            const currentTime = Math.floor(Date.now() / 1000);
            if (payload.exp < currentTime) {
                window.showToast('Security Error: Google credential token has expired.');
                return;
            }
            if (payload.iss !== 'accounts.google.com' && payload.iss !== 'https://accounts.google.com') {
                window.showToast('Security Error: Invalid token issuer.');
                return;
            }

            const googleId = payload.sub;
            const name = payload.name || (payload.given_name + ' ' + (payload.family_name || ''));
            const email = payload.email;
            const avatar = payload.picture || '';

            // Create or update user
            let users = [];
            try {
                users = JSON.parse(localStorage.getItem('users') || '[]');
            } catch (e) {}

            let existingIdx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
            let userObj;
            if (existingIdx >= 0) {
                userObj = users[existingIdx];
                userObj.googleId = googleId;
                userObj.name = name;
                userObj.firstName = payload.given_name || name.split(' ')[0];
                userObj.lastName = payload.family_name || name.split(' ').slice(1).join(' ') || '';
                userObj.avatar = avatar;
                userObj.provider = 'google';
                users[existingIdx] = userObj;
            } else {
                userObj = {
                    id: "USR" + String(users.length + 1).padStart(3, '0'),
                    googleId: googleId,
                    name: name,
                    firstName: payload.given_name || name.split(' ')[0],
                    lastName: payload.family_name || name.split(' ').slice(1).join(' ') || '',
                    email: email,
                    avatar: avatar,
                    role: "guest",
                    provider: "google"
                };
                users.push(userObj);
            }

            // ✅ Safety check: Google users must NEVER get a staff role.
            // If an old record had role='admin'/'reception'/etc., reset it to 'guest'
            // unless this email belongs to an actual staff account in staffUsers.
            const staffUsers = JSON.parse(localStorage.getItem('staffUsers') || '[]');
            const isStaffEmail = staffUsers.some(s => s.email.toLowerCase() === email.toLowerCase());
            if (!isStaffEmail) {
                userObj.role = 'guest'; // Always guest for Google login
                localStorage.removeItem('staffCurrentUser'); // Clear any stale staff session
            }

            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(userObj));
            localStorage.removeItem('guestCheckout');

            if (window.addAuditLog) {
                window.addAuditLog(email, `Logged in via Google Authentication`);
            }

            window.showToast('Successfully signed in with Google!');
            
            setTimeout(() => {
                if (window.resumeIntendedAction) {
                    window.resumeIntendedAction();
                } else {
                    window.location.href = 'index.html';
                }
            }, 1000);

        } catch (err) {
            console.error('Error in Google credential verification:', err);
            window.showToast('Login failed: Token verification failed.');
        }
    }

    window.mockGoogleSignInFallback = function() {
        console.warn('GIS library offline or failed to load. Falling back to sandbox authentication.');
        const email = 'vineeth@gmail.com';
        const name = 'Vineeth Kumar';
        const googleId = 'google_mock_12345';
        const avatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80';

        let users = [];
        try {
            users = JSON.parse(localStorage.getItem('users') || '[]');
        } catch(e) {}

        let existingIdx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
        let userObj;
        if (existingIdx >= 0) {
            userObj = users[existingIdx];
            userObj.googleId = googleId;
            userObj.name = name;
            userObj.firstName = 'Vineeth';
            userObj.lastName = 'Kumar';
            userObj.avatar = avatar;
            userObj.provider = 'google';
            users[existingIdx] = userObj;
        } else {
            userObj = {
                id: "USR" + String(users.length + 1).padStart(3, '0'),
                googleId: googleId,
                name: name,
                firstName: 'Vineeth',
                lastName: 'Kumar',
                email: email,
                avatar: avatar,
                role: "guest",
                provider: "google"
            };
            users.push(userObj);
        }

        // ✅ Safety check: Google mock users must NEVER get a staff role.
        const staffUsersMock = JSON.parse(localStorage.getItem('staffUsers') || '[]');
        const isStaffMock = staffUsersMock.some(s => s.email.toLowerCase() === email.toLowerCase());
        if (!isStaffMock) {
            userObj.role = 'guest';
            localStorage.removeItem('staffCurrentUser');
        }

        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(userObj));
        localStorage.removeItem('guestCheckout');

        if (window.addAuditLog) {
            window.addAuditLog(email, `Logged in via Google (Sandbox Fallback)`);
        }

        window.showToast('Successfully signed in with Google (Sandbox Fallback)!');

        setTimeout(() => {
            if (window.resumeIntendedAction) {
                window.resumeIntendedAction();
            } else {
                window.location.href = 'index.html';
            }
        }, 1000);
    };

    window.initGoogleSignIn = function() {
        const container = document.getElementById('googleBtnContainer');
        const customBtn = document.getElementById('customGoogleBtn');
        if (!container) return;

        if (customBtn) {
            customBtn.addEventListener('click', () => {
                if (!window.google || !window.google.accounts) {
                    window.mockGoogleSignInFallback();
                }
            });
        }

        if (!document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            script.onload = () => { initializeGIS(); };
            script.onerror = () => {
                console.error('Failed to load Google Identity Services script.');
                window.showToast('Network issue: Failed to load Google authentication client.');
            };
            document.head.appendChild(script);
        } else if (window.google && window.google.accounts) {
            initializeGIS();
        } else {
            let attempts = 0;
            const interval = setInterval(() => {
                attempts++;
                if (window.google && window.google.accounts) {
                    clearInterval(interval);
                    initializeGIS();
                } else if (attempts > 50) {
                    clearInterval(interval);
                }
            }, 100);
        }

        function initializeGIS() {
            try {
                google.accounts.id.initialize({
                    client_id: window.GOOGLE_CLIENT_ID,
                    callback: handleCredentialResponse,
                    auto_select: false
                });

                const parentW = container.parentElement ? container.parentElement.offsetWidth : 380;
                google.accounts.id.renderButton(
                    container,
                    {
                        type: "standard",
                        theme: "outline",
                        size: "large",
                        shape: "pill",
                        width: parentW > 400 ? 400 : parentW
                    }
                );
            } catch (err) {
                console.error('GIS initialization failed:', err);
                window.showToast('Login failed: Initialization of Google client failed.');
            }
        }
    };

    window.getCurrentUser = function() {
        try {
            return JSON.parse(localStorage.getItem('currentUser'));
        } catch (e) {
            return null;
        }
    };

    window.isLoggedIn = function() {
        return window.getCurrentUser() !== null;
    };

    window.logout = function() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('staffCurrentUser');
        localStorage.removeItem('guestCheckout');
        window.location.href = 'index.html';
    };

    window.showAuthModal = function(intendedAction) {
        if (intendedAction) {
            localStorage.setItem('intendedAction', JSON.stringify(intendedAction));
        }
        const modal = document.getElementById('authRequiredModal');
        if (modal) {
            const guestBtn = document.getElementById('authModalGuest');
            if (guestBtn) {
                if (intendedAction && (intendedAction.type === 'reserve-room' || intendedAction.type === 'checkout')) {
                    guestBtn.style.display = 'block';
                } else {
                    guestBtn.style.display = 'none';
                }
            }
            modal.classList.add('show');
        }
    };

    window.closeAuthModal = function() {
        const modal = document.getElementById('authRequiredModal');
        if (modal) modal.classList.remove('show');
    };

    // 6. Resume Intended Action logic
    window.resumeIntendedAction = function() {
        let action = null;
        try {
            action = JSON.parse(localStorage.getItem('intendedAction'));
        } catch (e) {}

        localStorage.removeItem('intendedAction');

        if (!action) {
            const redir = localStorage.getItem('redirectUrl');
            localStorage.removeItem('redirectUrl');
            if (redir) {
                window.location.href = redir;
            } else {
                window.location.href = 'index.html';
            }
            return;
        }

        const user = window.getCurrentUser();
        const userEmail = user ? user.email.toLowerCase() : '';

        if (action.type === 'reserve-room') {
            localStorage.setItem('bookingData', JSON.stringify(action.data));
            window.location.href = 'checkout.html';
        } else if (action.type === 'wishlist') {
            let wishlist = JSON.parse(localStorage.getItem(userEmail ? `wishlist_${userEmail}` : 'roomWishlist') || '[]');
            if (!wishlist.includes(action.roomId)) {
                wishlist.push(action.roomId);
                localStorage.setItem(userEmail ? `wishlist_${userEmail}` : 'roomWishlist', JSON.stringify(wishlist));
            }
            window.location.reload();
        } else if (action.type === 'reserve-table') {
            const key = userEmail ? `dining_${userEmail}` : 'diningReservations';
            let reservations = JSON.parse(localStorage.getItem(key) || '[]');
            reservations.push(action.data);
            localStorage.setItem(key, JSON.stringify(reservations));
            
            const globalDining = JSON.parse(localStorage.getItem('diningReservations') || '[]');
            globalDining.push(action.data);
            localStorage.setItem('diningReservations', JSON.stringify(globalDining));
            
            window.location.href = 'guest-dashboard.html';
        } else if (action.type === 'reserve-wine') {
            const key = userEmail ? `wine_${userEmail}` : 'wineReservations';
            let reservations = JSON.parse(localStorage.getItem(key) || '[]');
            const wineObj = {
                id: action.data.id,
                name: action.data.name,
                brand: action.data.brand,
                price: action.data.price,
                reservedAt: new Date().toISOString(),
                status: 'Confirmed'
            };
            reservations.push(wineObj);
            localStorage.setItem(key, JSON.stringify(reservations));
            
            const globalWine = JSON.parse(localStorage.getItem('wineReservations') || '[]');
            globalWine.push(wineObj);
            localStorage.setItem('wineReservations', JSON.stringify(globalWine));

            window.location.href = 'guest-dashboard.html';
        } else if (action.type === 'submit-proposal') {
            const key = userEmail ? `events_${userEmail}` : 'eventInquiries';
            let proposals = JSON.parse(localStorage.getItem(key) || '[]');
            proposals.push(action.data);
            localStorage.setItem(key, JSON.stringify(proposals));
            
            window.syncGlobalEvents();
            window.addNotification(`New Event Proposal submitted for ${action.data.eventDate} by ${userEmail}`, ['admin', 'manager']);
            window.addAuditLog(userEmail, `Submitted event proposal for ${action.data.eventDate}`);

            window.location.href = 'guest-dashboard.html';
        } else if (action.type === 'dashboard') {
            // Route to the correct dashboard for the current user
            const dashUser = window.getCurrentUser();
            const dashRole = dashUser ? (dashUser.role || 'guest') : 'guest';
            if (typeof window.redirectToRoleDashboard === 'function') {
                window.redirectToRoleDashboard(dashRole);
            } else {
                window.location.href = 'guest-dashboard.html';
            }
        } else {
            window.location.href = 'index.html';
        }
    };

    // 7. Dynamic Navbar Rendering
    function updateNavbarUI() {
        const navActions = document.querySelector('.nav-actions');
        if (!navActions) return;

        const user = window.getCurrentUser();
        if (user) {
            const role = user.role || 'guest';
            let dashboardLink = 'guest-dashboard.html';
            if (role === 'admin') dashboardLink = 'admin-dashboard.html';
            else if (role === 'reception') dashboardLink = 'reception-dashboard.html';
            else if (role === 'housekeeping') dashboardLink = 'housekeeping-dashboard.html';
            else if (role === 'maintenance') dashboardLink = 'maintenance-dashboard.html';
            else if (role === 'manager') dashboardLink = 'manager-dashboard.html';

            const isGuest = role === 'guest';

            // Welcome message: guests show first name, staff show role label
            let displayName;
            if (isGuest) {
                const firstName = user.firstName || (user.name ? user.name.split(' ')[0] : 'Guest');
                displayName = `${firstName} (Guest)`;
            } else {
                const roleLabels = {
                    admin:        'Admin',
                    reception:    'Reception',
                    housekeeping: 'Housekeeping',
                    maintenance:  'Maintenance',
                    manager:      'Manager'
                };
                displayName = roleLabels[role] || (role.charAt(0).toUpperCase() + role.slice(1));
            }
            const avatarUrl = isGuest ? (user.avatar || '') : '';

            navActions.innerHTML = `
                <div class="nav-user-dropdown">
                    <button class="nav-user-trigger" id="navUserBtn" style="display: flex; align-items: center; gap: 8px;">
                        ${isGuest && avatarUrl ? `
                            <img src="${avatarUrl}" alt="${displayName}" style="width: 24px; height: 24px; border-radius: 50%; border: 1.5px solid #0ABFAC; object-fit: cover;">
                        ` : `
                            <div style="width: 24px; height: 24px; border-radius: 50%; border: 1.5px solid #0ABFAC; background: rgba(10, 191, 172, 0.1); display: flex; align-items: center; justify-content: center; color: #0ABFAC;">
                                <i data-lucide="user" style="width: 12px; height: 12px;"></i>
                            </div>
                        `}
                        <span>Welcome, ${displayName}</span> <i data-lucide="chevron-down" style="width:14px; height:14px; stroke-width:3;"></i>
                    </button>
                    <div class="nav-user-menu" id="navUserMenu">
                        ${isGuest ? `
                            <a href="guest-dashboard.html" class="nav-user-item">Dashboard</a>
                            <a href="guest-dashboard.html#bookings" class="nav-user-item">My Bookings</a>
                            <a href="guest-dashboard.html#wishlist" class="nav-user-item">Wishlist</a>
                        ` : `
                            <a href="${dashboardLink}" class="nav-user-item">Staff Dashboard</a>
                        `}
                        <a href="#" class="nav-user-item border-top" id="navLogoutBtn">Logout</a>
                    </div>
                </div>
            `;

            const btn = document.getElementById('navUserBtn');
            const menu = document.getElementById('navUserMenu');
            
            if (btn && menu) {
                btn.addEventListener('click', (e) => {
                    const notifMenu = document.getElementById('notifDropdownMenu');
                    if (notifMenu) notifMenu.style.display = 'none';
                    menu.classList.toggle('show');
                    e.stopPropagation();
                });
                window.addEventListener('click', () => {
                    menu.classList.remove('show');
                });
            }

            const logoutBtn = document.getElementById('navLogoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.logout();
                });
            }

            window.renderNotificationCenter();
        } else {
            navActions.innerHTML = `
                <a href="login.html" class="btn btn-text">Sign In</a>
                <a href="search-results.html" class="btn btn-primary btn-icon">
                    <span>Book Now</span>
                    <i data-lucide="arrow-right"></i>
                </a>
            `;
        }

        if (window.lucide) {
            lucide.createIcons();
        }
    }

    // 8. Route protections and security guards
    function enforceRouteRestrictions() {
        const path = window.location.pathname.toLowerCase();
        const user = window.getCurrentUser();
        const isLoggedIn = user !== null;
        const role = user ? (user.role || 'guest') : null;
        const isGuestCheckout = localStorage.getItem('guestCheckout') === 'true';

        if (path.includes('guest-dashboard.html')) {
            if (!isLoggedIn) {
                localStorage.setItem('intendedAction', JSON.stringify({ type: 'dashboard' }));
                window.location.href = 'login.html';
            } else if (role !== 'guest') {
                window.redirectToRoleDashboard(role);
            }
        }

        if (path.includes('checkout.html') || path.includes('payment.html')) {
            if (!isLoggedIn && !isGuestCheckout) {
                localStorage.setItem('intendedAction', JSON.stringify({ type: 'dashboard' }));
                window.location.href = 'login.html';
            } else if (isLoggedIn && role !== 'guest') {
                window.redirectToRoleDashboard(role);
            }
        }

        const staffPortals = {
            'admin-dashboard.html': 'admin',
            'reception-dashboard.html': 'reception',
            'housekeeping-dashboard.html': 'housekeeping',
            'maintenance-dashboard.html': 'maintenance',
            'manager-dashboard.html': 'manager'
        };

        for (const [page, requiredRole] of Object.entries(staffPortals)) {
            if (path.includes(page)) {
                if (!isLoggedIn) {
                    // Unified: unauthenticated visitors go to the single login page
                    window.location.href = 'login.html';
                } else if (role !== requiredRole) {
                    if (role === 'guest') {
                        localStorage.setItem('authWarning', 'You do not have permission to access staff portals.');
                        window.location.href = 'index.html';
                    } else {
                        // Staff member trying wrong portal → their own dashboard
                        window.redirectToRoleDashboard(role);
                    }
                }
            }
        }
    }

    window.redirectToRoleDashboard = function(role) {
        if (role === 'guest') {
            window.location.href = 'guest-dashboard.html';
        } else if (role === 'admin') {
            window.location.href = 'admin-dashboard.html';
        } else if (role === 'reception') {
            window.location.href = 'reception-dashboard.html';
        } else if (role === 'housekeeping') {
            window.location.href = 'housekeeping-dashboard.html';
        } else if (role === 'maintenance') {
            window.location.href = 'maintenance-dashboard.html';
        } else if (role === 'manager') {
            window.location.href = 'manager-dashboard.html';
        } else {
            window.location.href = 'index.html';
        }
    };

    window.addEventListener('storage', (e) => {
        if (e.key === 'notifications' || e.key === 'auditLogs') {
            const user = window.getCurrentUser();
            if (user) {
                window.renderNotificationCenter();
            }
        }

        if (e.key && e.key.startsWith('bookings_')) {
            window.syncGlobalBookings();
        }
        if (e.key && e.key.startsWith('events_')) {
            window.syncGlobalEvents();
        }
    });

    function showWelcomeBackBanner() {
        const path = window.location.pathname.toLowerCase();
        if (path.endsWith('index.html') || path === '/' || path.endsWith('/')) {
            const pending = localStorage.getItem('pendingBooking');
            if (pending) {
                let data = null;
                try { data = JSON.parse(pending); } catch (e) {}

                if (data && data.roomName) {
                    const banner = document.createElement('div');
                    banner.className = 'welcome-back-banner';
                    banner.innerHTML = `
                        <span>✨ Welcome back! Would you like to resume your booking for <strong>${data.roomName}</strong> (${data.checkinDate} to ${data.checkoutDate})?</span>
                        <div style="display:flex; gap:12px; align-items:center;">
                            <button class="btn-banner" id="bannerResumeBtn">Continue Booking</button>
                            <button class="btn-dismiss" id="bannerDismissBtn">Dismiss</button>
                        </div>
                    `;
                    document.body.insertBefore(banner, document.body.firstChild);

                    document.getElementById('bannerResumeBtn').addEventListener('click', () => {
                        localStorage.setItem('bookingData', JSON.stringify(data));
                        window.location.href = 'checkout.html';
                    });

                    document.getElementById('bannerDismissBtn').addEventListener('click', () => {
                        localStorage.removeItem('pendingBooking');
                        banner.remove();
                    });
                }
            }
        }
    }
})();

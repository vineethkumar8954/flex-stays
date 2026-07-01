document.addEventListener('DOMContentLoaded', () => {
    
    // Elements
    const menuGrid = document.getElementById('menuGrid');
    const searchInput = document.getElementById('menuSearch');
    const sortSelect = document.getElementById('menuSort');
    const catBtns = document.querySelectorAll('.cat-btn');
    const filterCheckboxes = document.querySelectorAll('.filter-chip input[type="checkbox"]');
    
    const cartCountEl = document.getElementById('cartCount');
    const cartTotalEl = document.getElementById('cartTotal');
    const floatingCart = document.getElementById('floatingCart');
    const toast = document.getElementById('toastNotification');
    const toastDesc = document.getElementById('toastDesc');
    const aiRecommendations = document.getElementById('aiRecommendations');

    // Cart State
    let cart = [];

    // Parse URL for category and search
    const params = new URLSearchParams(window.location.search);
    const initialCategory = params.get('category') || 'all';
    const initialSearch = params.get('search') || '';

    // State
    let currentCategory = initialCategory;
    let currentSearch = initialSearch;
    let currentSort = 'popular';
    let currentFilters = [];

    // Pre-fill Search Input
    if (currentSearch) {
        searchInput.value = currentSearch;
    }

    // Auto-scroll if navigated from homepage with params
    if (initialCategory !== 'all' || initialSearch !== '') {
        setTimeout(() => {
            const controls = document.getElementById('menuSearch');
            if (controls) {
                const y = controls.getBoundingClientRect().top + window.scrollY - 150;
                window.scrollTo({top: y, behavior: 'smooth'});
            }
        }, 100);
    }

    // Initialize AI Recommendations
    function initAI() {
        const aiChoices = [
            { title: "Chef's Signature Tasting", desc: "A 7-course culinary journey with exclusive wine pairings." },
            { title: "Romantic Sunset Dinner", desc: "Perfect for couples, ocean views, and chef's tasting menu." },
            { title: "Seafood Experience", desc: "Freshly caught local seafood, grilled to perfection by the pool." },
            { title: "Wine Pairing Evening", desc: "Discover our private cellar with expert sommelier guidance." }
        ];

        // Pick 2 random for variety
        const shuffled = aiChoices.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 2);

        selected.forEach(rec => {
            const card = document.createElement('a');
            card.href = "#";
            card.style.cssText = "display:block; text-decoration:none; cursor:pointer; background:#faf9f6; border:1px solid rgba(0,0,0,0.05); border-radius:8px; padding:12px 16px; flex:1; min-width:200px; transition:all 0.2s ease;";
            
            // Hover effect
            card.addEventListener('mouseover', () => { card.style.transform = 'translateY(-2px)'; card.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)'; });
            card.addEventListener('mouseout', () => { card.style.transform = 'none'; card.style.boxShadow = 'none'; });

            // Click Logic
            card.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Clear existing filters
                currentSearch = '';
                searchInput.value = '';
                filterCheckboxes.forEach(cb => cb.checked = false);
                currentFilters = [];
                catBtns.forEach(b => b.classList.remove('active'));

                // Set new state based on recommendation
                if(rec.title.includes('Wine')) {
                    document.querySelector('[data-cat="wine"]').classList.add('active');
                    currentCategory = 'wine';
                } else if(rec.title.includes('Seafood')) {
                    document.querySelector('[data-cat="all"]').classList.add('active');
                    currentCategory = 'all';
                    currentSearch = 'lobster';
                    searchInput.value = 'lobster';
                } else if(rec.title.includes('Romantic')) {
                    document.querySelector('[data-cat="all"]').classList.add('active');
                    currentCategory = 'all';
                    currentSearch = 'truffle';
                    searchInput.value = 'truffle';
                } else if(rec.title.includes('Chef')) {
                    document.querySelector('[data-cat="all"]').classList.add('active');
                    currentCategory = 'all';
                    filterCheckboxes.forEach(cb => {
                        if(cb.value === 'chef') cb.checked = true;
                    });
                    currentFilters = ['chef'];
                }
                
                renderMenu();
                
                // Auto scroll to menu
                setTimeout(() => {
                    const controls = document.getElementById('menuSearch');
                    if (controls) {
                        const y = controls.getBoundingClientRect().top + window.scrollY - 150;
                        window.scrollTo({top: y, behavior: 'smooth'});
                    }
                }, 100);
            });

            card.innerHTML = `
                <h5 style="color:var(--forest); margin:0 0 4px; font-size:15px;"><i data-lucide="sparkles" style="width:14px; color:var(--gold);"></i> ${rec.title}</h5>
                <p style="margin:0; font-size:13px; color:var(--text-muted);">${rec.desc}</p>
            `;
            aiRecommendations.appendChild(card);
        });
        if(window.lucide) lucide.createIcons();
    }

    // Set Initial Category Tab
    function initCategoryTab() {
        catBtns.forEach(btn => {
            if (btn.getAttribute('data-cat') === currentCategory) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // Event Listeners
    catBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            catBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentCategory = e.target.getAttribute('data-cat');
            renderMenu();
        });
    });

    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value.toLowerCase();
        renderMenu();
    });

    // Custom Select Logic for Sorting
    const customSortSelect = document.getElementById('menuSortSelect');
    if (customSortSelect) {
        const trigger = customSortSelect.querySelector('.custom-select-trigger');
        const options = customSortSelect.querySelectorAll('.custom-option');

        trigger.addEventListener('click', (e) => {
            customSortSelect.classList.toggle('open');
            e.stopPropagation();
        });

        options.forEach(option => {
            option.addEventListener('click', function(e) {
                trigger.textContent = this.textContent;
                
                // Remove selected class from all options and add to clicked
                options.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                
                customSortSelect.classList.remove('open');
                
                currentSort = this.getAttribute('data-value');
                renderMenu();
                
                e.stopPropagation();
            });
        });

        // Close dropdown when clicking outside
        window.addEventListener('click', () => {
            customSortSelect.classList.remove('open');
        });
    }

    filterCheckboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            currentFilters = Array.from(filterCheckboxes)
                .filter(i => i.checked)
                .map(i => i.value);
            renderMenu();
        });
    });

    // Render Logic
    function renderMenu() {
        // Build combined data: food for normal categories, wine/spirit for wine tab
        const isWineTab = currentCategory === 'wine';
        let filtered = isWineTab
            ? (typeof wineData !== 'undefined' ? wineData : [])
            : menuData.filter(item => item.category !== 'wine');

        // Filter Category (food only)
        if (!isWineTab && currentCategory !== 'all') {
            filtered = filtered.filter(item => item.category === currentCategory);
        }

        // Filter Search
        if (currentSearch) {
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(currentSearch) ||
                item.description.toLowerCase().includes(currentSearch) ||
                (item.brand && item.brand.toLowerCase().includes(currentSearch)) ||
                (item.origin && item.origin.toLowerCase().includes(currentSearch))
            );
        }

        // Filter Dietary Flags (food only, skip for wine)
        if (!isWineTab && currentFilters.length > 0) {
            filtered = filtered.filter(item => {
                return currentFilters.every(filter => item.tags.includes(filter));
            });
        }

        // Sort
        if (currentSort === 'price-low') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (currentSort === 'price-high') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (currentSort === 'rating') {
            filtered.sort((a, b) => b.rating - a.rating);
        } else {
            filtered.sort((a, b) => b.reviews - a.reviews);
        }

        menuGrid.innerHTML = '';

        if (filtered.length === 0) {
            menuGrid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; padding: 40px; color:var(--text-muted);">No items found matching your criteria.</p>';
            return;
        }

        filtered.forEach(item => {
            const card = document.createElement('div');

            if (isWineTab || item.category === 'wine' || item.category === 'vodka') {
                // ── PREMIUM WINE / SPIRIT CARD ──
                card.className = 'food-card';
                card.style.cssText = 'overflow:hidden; border:1px solid rgba(212,175,55,0.2);';

                const catColor = item.category === 'red' ? '#7b1a2e' :
                                 item.category === 'white' ? '#8b6914' : '#1e40af';
                const catLabel = item.category === 'red' ? '🍷 Red Wine' :
                                 item.category === 'white' ? '🥂 White Wine' : `🍸 ${item.type || 'Spirits'}`;

                const premTag = item.tags.includes('chef-pick') ? "Chef's Pick" :
                                item.tags.includes('bestseller') ? 'Bestseller' :
                                item.tags.includes('limited') ? 'Limited' : '';

                const availDot = item.availability === 'available'
                    ? '<span style="width:6px;height:6px;border-radius:50%;background:#22c55e;display:inline-block;"></span> In Stock'
                    : '<span style="width:6px;height:6px;border-radius:50%;background:#f59e0b;display:inline-block;animation:blink 1.5s infinite;"></span> Limited';

                const pairings = (item.pairings || []).slice(0, 2).map(p =>
                    `<span style="font-size:10px;background:rgba(13,42,42,0.07);border:1px solid rgba(13,42,42,0.12);color:#0d2a2a;padding:2px 7px;border-radius:20px;font-weight:600;">${p}</span>`
                ).join('');

                card.innerHTML = `
                    <div class="food-img-wrapper" style="position:relative;">
                        <img src="${item.image}" alt="${item.name}" onerror="this.onerror=null;this.src='${item.fallbackImage||'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80'}'">
                        <div style="position:absolute;top:10px;left:10px;background:${catColor};color:#fff;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;padding:3px 9px;border-radius:20px;">${catLabel}</div>
                        ${premTag ? `<div style="position:absolute;top:10px;right:10px;background:rgba(212,175,55,0.95);color:#000;font-size:9px;font-weight:800;padding:3px 8px;border-radius:20px;">${premTag}</div>` : ''}
                        <div style="position:absolute;bottom:10px;right:10px;display:flex;align-items:center;gap:5px;background:rgba(0,0,0,0.6);backdrop-filter:blur(4px);border-radius:20px;padding:3px 10px;font-size:10px;color:#fff;font-weight:600;">${availDot}</div>
                    </div>
                    <div class="food-info">
                        <div style="font-size:10px;color:#d4af37;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:3px;">${item.flag || ''} ${item.brand}</div>
                        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
                            <h3 class="food-name">${item.name}</h3>
                            <span class="food-price">₹${item.price.toLocaleString('en-IN')}</span>
                        </div>
                        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;">
                            ${item.origin ? `<span style="font-size:11px;color:#64748b;background:#f8fafc;border:1px solid rgba(0,0,0,0.07);padding:2px 8px;border-radius:20px;">📍 ${item.origin}</span>` : ''}
                            ${item.alcohol ? `<span style="font-size:11px;color:#64748b;background:#f8fafc;border:1px solid rgba(0,0,0,0.07);padding:2px 8px;border-radius:20px;">💧 ${item.alcohol}</span>` : ''}
                            ${item.vintage ? `<span style="font-size:11px;color:#64748b;background:#f8fafc;border:1px solid rgba(0,0,0,0.07);padding:2px 8px;border-radius:20px;">📅 ${item.vintage}</span>` : ''}
                        </div>
                        <p class="food-desc">${item.description.substring(0,80)}${item.description.length>80?'…':''}</p>
                        ${pairings ? `<div style="display:flex;gap:5px;flex-wrap:wrap;margin-top:6px;margin-bottom:4px;">${pairings}</div>` : ''}
                        <div style="display:flex;align-items:center;gap:6px;margin:8px 0;font-size:12px;color:#64748b;">
                            <span style="color:#f59e0b;">★</span>
                            <strong style="color:#0f172a;">${item.rating}</strong>
                            <span>(${item.reviews} reviews)</span>
                        </div>
                        <div style="display:flex;gap:8px;margin-top:10px;">
                            <button class="btn btn-outline-forest add-to-order-btn" style="flex:1;border-radius:24px;font-weight:600;font-size:12px;" data-id="${item.id}" data-type="wine">🍾 Reserve Bottle</button>
                        </div>
                    </div>`;

            } else {
                // ── STANDARD FOOD CARD ──
                card.className = 'food-card';

                let iconHtml = '';
                if (item.isVeg) {
                    iconHtml += `<span title="Vegetarian" style="display:inline-block; width:12px; height:12px; border:1px solid #2e7d32; border-radius:2px; position:relative; margin-right:6px;"><span style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:6px; height:6px; background:#2e7d32; border-radius:50%;"></span></span>`;
                } else {
                    iconHtml += `<span title="Non-Vegetarian" style="display:inline-block; width:12px; height:12px; border:1px solid #c62828; border-radius:2px; position:relative; margin-right:6px;"><span style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:6px; height:6px; background:#c62828; border-radius:50%;"></span></span>`;
                }
                if (item.spicyLevel > 0) {
                    let peppers = '';
                    for(let i=0; i<item.spicyLevel; i++) peppers += '🌶️';
                    iconHtml += `<span style="font-size:12px;" title="Spicy Level ${item.spicyLevel}">${peppers}</span>`;
                }
                let tagsHtml = '';
                if(item.tags.includes('chef')) {
                    tagsHtml = `<div style="position:absolute; top:12px; left:12px; background:var(--gold); color:#fff; font-size:10px; font-weight:700; text-transform:uppercase; padding:4px 8px; border-radius:4px;">Chef's Special</div>`;
                }
                card.innerHTML = `
                    <div class="food-img-wrapper">
                        <img src="${item.image}" alt="${item.name}" onerror="this.onerror=null; this.src='${item.fallbackImage || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80'}'">
                        ${tagsHtml}
                    </div>
                    <div class="food-info">
                        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                            <h3 class="food-name">${item.name}</h3>
                            <span class="food-price">₹${item.price.toLocaleString('en-IN')}</span>
                        </div>
                        <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px; font-size:13px; color:var(--text-muted);">
                            ${iconHtml}
                            <span style="display:flex; align-items:center; color:#f59e0b;"><i data-lucide="star" style="width:12px; height:12px; fill:currentColor; margin-right:2px;"></i> ${item.rating}</span>
                        </div>
                        <p class="food-desc">${item.description}</p>
                        <button class="btn btn-outline-forest add-to-order-btn" style="width:100%; margin-top:16px; border-radius: 24px; font-weight: 600;" data-id="${item.id}">Add To Order</button>
                    </div>`;
            }

            menuGrid.appendChild(card);
        });

        if(window.lucide) lucide.createIcons();

        // Attach listeners
        document.querySelectorAll('.add-to-order-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                const type = e.currentTarget.getAttribute('data-type');
                if (type === 'wine') {
                    reserveWineBottle(id);
                } else {
                    addToCart(id);
                }
            });
        });
    }

    // Reserve wine bottle (saves to localStorage)
    function reserveWineBottle(id) {
        const item = (typeof wineData !== 'undefined' ? wineData : []).find(w => w.id === id);
        if (!item) return;
        const reservations = JSON.parse(localStorage.getItem('wineReservations') || '[]');
        reservations.push({ id: item.id, name: item.name, brand: item.brand, price: item.price, reservedAt: new Date().toISOString() });
        localStorage.setItem('wineReservations', JSON.stringify(reservations));
        if (toastDesc) toastDesc.innerHTML = `<strong>${item.name}</strong> bottle reserved! Our team will confirm shortly.`;
        if (toast) { toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 3500); }
    }

    // Cart Logic
    function addToCart(id) {
        const item = menuData.find(i => i.id === id);
        if(!item) return;

        cart.push(item);
        updateCartUI();
        
        // Show Toast
        toastDesc.innerHTML = `<strong>${item.name}</strong> has been added to your order.`;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    function updateCartUI() {
        if(cart.length > 0) {
            floatingCart.classList.remove('hidden');
        } else {
            floatingCart.classList.add('hidden');
        }

        cartCountEl.innerText = cart.length;
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        cartTotalEl.innerText = `₹${total.toLocaleString('en-IN')}`;
    }

    // Navbar Scroll Logic
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Dining Modal & Reservation Logic
    const diningModal = document.getElementById('diningModal');
    const closeDiningModalBtn = document.getElementById('closeDiningModalBtn');
    const diningReserveForm = document.getElementById('diningReserveForm');
    const viewCartBtn = document.getElementById('viewCartBtn');
    
    // Set default reservation date to tomorrow
    const tomorrowStr = new Date(new Date().getTime() + 86400000).toISOString().split('T')[0];
    const diningDateInput = document.getElementById('diningDate');
    if (diningDateInput) {
        diningDateInput.value = tomorrowStr;
        diningDateInput.min = tomorrowStr;
    }

    if (viewCartBtn) {
        viewCartBtn.addEventListener('click', () => {
            if (diningModal) {
                diningModal.style.display = 'flex';
            }
        });
    }

    if (closeDiningModalBtn) {
        closeDiningModalBtn.addEventListener('click', () => {
            if (diningModal) {
                diningModal.style.display = 'none';
            }
        });
    }

    // Close on overlay click
    if (diningModal) {
        diningModal.addEventListener('click', (e) => {
            if (e.target === diningModal) {
                diningModal.style.display = 'none';
            }
        });
    }

    if (diningReserveForm) {
        diningReserveForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const dateVal = document.getElementById('diningDate').value;
            const timeVal = document.getElementById('diningTime').value;
            const guestsVal = document.getElementById('diningGuests').value;

            if (!dateVal || !timeVal || !guestsVal) {
                alert('Please fill out all reservation fields.');
                return;
            }

            const reservation = {
                id: 'DIN-' + Math.floor(100000 + Math.random() * 900000),
                restaurant: 'The Culinary Atelier',
                date: dateVal,
                time: timeVal,
                guests: guestsVal,
                status: 'Confirmed',
                totalCost: cart.reduce((sum, item) => sum + item.price, 0),
                itemsCount: cart.length,
                createdAt: new Date().toISOString()
            };

            // Intercept if logged out
            if (typeof window.isLoggedIn === 'function' && !window.isLoggedIn()) {
                window.showAuthModal({ type: 'reserve-table', data: reservation });
                diningModal.style.display = 'none';
                return;
            }

            // Save reservation to user-scoped list
            const user = window.getCurrentUser();
            const userEmail = user ? user.email.toLowerCase() : '';
            const key = `dining_${userEmail}`;

            let diningReservations = JSON.parse(localStorage.getItem(key) || '[]');
            diningReservations.push(reservation);
            localStorage.setItem(key, JSON.stringify(diningReservations));

            // Clear Cart State
            cart = [];
            updateCartUI();
            
            // Hide Modal
            diningModal.style.display = 'none';

            // Redirect to guest dashboard
            window.location.href = 'guest-dashboard.html';
        });
    }

    // Init
    initAI();
    initCategoryTab();
    renderMenu();
});

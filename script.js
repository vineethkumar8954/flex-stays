// Initialize Lucide Icons
if (window.lucide) {
    lucide.createIcons();
}

// Navbar scroll effect
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
const mobileBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const navActions = document.querySelector('.nav-actions');

mobileBtn.addEventListener('click', () => {
    // Basic toggle implementation - in a real app this would have smooth transitions
    const isExpanded = navLinks.style.display === 'flex';
    
    if (isExpanded) {
        navLinks.style.display = 'none';
        navActions.style.display = 'none';
    } else {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = 'rgba(13, 42, 42, 0.95)';
        navLinks.style.padding = '20px';
        
        navActions.style.display = 'flex';
        navActions.style.flexDirection = 'column';
        navActions.style.position = 'absolute';
        navActions.style.top = 'calc(100% + 200px)';
        navActions.style.left = '0';
        navActions.style.right = '0';
        navActions.style.background = 'rgba(13, 42, 42, 0.95)';
        navActions.style.padding = '20px';
    }
});

// Intersection Observer for scroll animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Optional: unobserve after animating to only animate once
            // observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all elements with .animate-on-scroll class
document.querySelectorAll('.animate-on-scroll').forEach(element => {
    observer.observe(element);
});

// Custom Select Dropdown Logic
document.querySelectorAll('.custom-select-wrapper').forEach(wrapper => {
    const select = wrapper.querySelector('.custom-select');
    const trigger = wrapper.querySelector('.custom-select-trigger');
    const options = wrapper.querySelectorAll('.custom-option');

    // Toggle dropdown
    trigger.addEventListener('click', function(e) {
        // Close all other open dropdowns first
        document.querySelectorAll('.custom-select').forEach(s => {
            if (s !== select) s.classList.remove('open');
        });
        
        select.classList.toggle('open');
        e.stopPropagation();
    });

    // Handle option click
    options.forEach(option => {
        option.addEventListener('click', function(e) {
            trigger.textContent = this.textContent;
            
            // Remove selected class from all options and add to clicked
            options.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            
            select.classList.remove('open');
            e.stopPropagation();
        });
    });
});

// Close dropdowns when clicking outside
window.addEventListener('click', function() {
    document.querySelectorAll('.custom-select').forEach(select => {
        select.classList.remove('open');
    });
});

// Initialize Flatpickr Datepicker
if (typeof flatpickr !== 'undefined') {
    // Select date inputs, excluding homepage specific inputs
    const standardDateInputs = Array.from(document.querySelectorAll('input[type="date"]')).filter(el => el.id !== 'homeCheckin' && el.id !== 'homeCheckout');
    if (standardDateInputs.length > 0) {
        flatpickr(standardDateInputs, {
            minDate: "today",
            dateFormat: "Y-m-d",
            altInput: true,
            altFormat: "d M Y",
            disableMobile: true,
            position: "above"
        });
    }

    // Homepage specific Check-In / Check-Out linked Flatpickrs
    const homeCheckinEl = document.getElementById('homeCheckin');
    const homeCheckoutEl = document.getElementById('homeCheckout');
    if (homeCheckinEl && homeCheckoutEl) {
        let checkinPicker, checkoutPicker;
        
        checkinPicker = flatpickr(homeCheckinEl, {
            minDate: "today",
            dateFormat: "Y-m-d",
            altInput: true,
            altFormat: "d M Y",
            disableMobile: true,
            position: "above",
            onChange: function(selectedDates, dateStr) {
                if (checkoutPicker) {
                    checkoutPicker.set('minDate', dateStr ? new Date(new Date(dateStr).getTime() + 86400000) : 'today');
                    const currentCheckout = checkoutPicker.selectedDates[0];
                    const newCheckin = selectedDates[0];
                    if (currentCheckout && newCheckin && currentCheckout <= newCheckin) {
                        checkoutPicker.clear();
                    }
                }
            }
        });

        checkoutPicker = flatpickr(homeCheckoutEl, {
            minDate: "today",
            dateFormat: "Y-m-d",
            altInput: true,
            altFormat: "d M Y",
            disableMobile: true,
            position: "above"
        });
    }
}

/* ==========================================
   Search Results Page Interactions
   ========================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Only run on search page
    const applyBtn = document.getElementById('applyFiltersBtn');
    if (!applyBtn) return;

    const resetBtn = document.getElementById('resetFiltersBtn');
    const checkboxes = document.querySelectorAll('.filter-checkbox');
    const activeChipsContainer = document.getElementById('activeChips');
    const activeFiltersContainer = document.getElementById('activeFiltersContainer');
    const resultsCountEl = document.getElementById('resultsCount');
    
    // AI Banner Elements
    const aiBannerText = document.getElementById('aiBannerText');

    // Compare Elements
    const compareCheckboxes = document.querySelectorAll('.compare-checkbox');
    const compareBar = document.getElementById('compareBar');
    const compareCountEl = document.getElementById('compareCount');
    const clearCompareBtn = document.getElementById('clearCompareBtn');

    // Create Toast Element
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = '<i data-lucide="info"></i> <span>You can compare up to 3 rooms at a time.</span>';
    document.body.appendChild(toast);
    
    // Re-initialize lucide icons for dynamic content
    if (window.lucide) {
        lucide.createIcons();
    }

    // Filter Logic & State
    let filteredRooms = [...roomsData];
    let currentPage = 1;
    const itemsPerPage = 10;

    function applyFilters() {
        let activeFilters = [];
        const priceRangeInput = document.getElementById('priceRange');
        const maxPrice = priceRangeInput ? parseInt(priceRangeInput.value, 10) : 5000;

        let selectedTypes = [];
        let selectedAmenities = [];

        checkboxes.forEach(cb => {
            if (cb.checked) {
                activeFilters.push(cb.value);
                if (cb.classList.contains('filter-type')) {
                    selectedTypes.push(cb.value);
                } else if (cb.classList.contains('filter-amenity')) {
                    selectedAmenities.push(cb.value);
                }
            }
        });

        // Update Chips
        activeChipsContainer.innerHTML = '';
        if (activeFilters.length > 0) {
            activeFiltersContainer.style.display = 'flex';
            activeFilters.forEach(filter => {
                const chip = document.createElement('div');
                chip.className = 'active-chip';
                chip.innerHTML = `${filter} <i data-lucide="x"></i>`;
                chip.addEventListener('click', () => {
                    checkboxes.forEach(cb => {
                        if (cb.value === filter) cb.checked = false;
                    });
                    applyFilters();
                });
                activeChipsContainer.appendChild(chip);
            });
            if (window.lucide) lucide.createIcons();
        } else {
            activeFiltersContainer.style.display = 'none';
        }

        // Filter the roomsData array
        filteredRooms = roomsData.filter(room => {
            if (room.price > maxPrice) return false;
            
            if (selectedTypes.length > 0) {
                // Because categories in roomsData are "Standard Rooms", etc. we can directly check
                // but let's be safe and do partial matching if needed, or direct match
                let typeMatch = false;
                selectedTypes.forEach(type => {
                    if (room.category.includes(type) || type.includes(room.category)) typeMatch = true;
                    // Handle edge cases like "Presidential Suites" vs "Presidential"
                    if (type.includes("Presidential") && room.category.includes("Presidential")) typeMatch = true;
                    if (type.includes("Executive") && room.category.includes("Executive")) typeMatch = true;
                    if (type.includes("Deluxe") && room.category.includes("Deluxe")) typeMatch = true;
                    if (type.includes("Standard") && room.category.includes("Standard")) typeMatch = true;
                });
                if (!typeMatch) return false;
            }
            
            if (selectedAmenities.length > 0) {
                let hasAllAmenities = true;
                selectedAmenities.forEach(amenity => {
                    // check if the room's amenities array includes this string or similar
                    let amenityFound = room.amenities.some(roomAm => roomAm.includes(amenity) || amenity.includes(roomAm));
                    if (!amenityFound) hasAllAmenities = false;
                });
                if (!hasAllAmenities) return false;
            }
            
            return true;
        });

        resultsCountEl.innerText = `${filteredRooms.length} Rooms Available`;

        updateAIBanner();
        currentPage = 1;
        sortRooms();
    }

    function updateAIBanner() {
        if (filteredRooms.length === 0) {
            aiBannerText.innerHTML = `We couldn't find a perfect match. Please adjust your filters.`;
            return;
        }
        
        // Find highest rated room from filtered results
        const topRoom = [...filteredRooms].sort((a, b) => b.rating - a.rating)[0];
        const matchPct = Math.min(99, Math.floor(90 + (topRoom.rating))); 
        
        aiBannerText.innerHTML = `Based on your preferences, we highly recommend the <strong>${topRoom.name}</strong>. <span style="color:var(--gold); font-weight:bold; margin-left:8px;">${matchPct}% Match</span>`;
    }

    // Filter Buttons
    applyBtn.addEventListener('click', applyFilters);
    resetBtn.addEventListener('click', () => {
        checkboxes.forEach(cb => cb.checked = false);
        const priceRange = document.getElementById('priceRange');
        if (priceRange) {
            priceRange.value = 1500;
            document.getElementById('priceValue').innerText = '$1,500';
        }
        applyFilters();
    });

    const sortSelect = document.querySelector('.sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', sortRooms);
    }

    function sortRooms() {
        const sortBy = sortSelect ? sortSelect.value : 'recommended';
        
        filteredRooms.sort((a, b) => {
            if (sortBy === 'price-asc') {
                return a.price - b.price;
            } else if (sortBy === 'price-desc' || sortBy === 'luxury') {
                return b.price - a.price;
            } else if (sortBy === 'rating' || sortBy === 'popular') {
                return b.rating - a.rating;
            } else {
                return 0; 
            }
        });
        
        currentPage = 1;
        paginateAndRender();
    }

    function paginateAndRender() {
        const roomList = document.getElementById('roomListContainer');
        const paginationContainer = document.getElementById('paginationContainer');
        roomList.innerHTML = '';
        paginationContainer.innerHTML = '';
        
        const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);
        if (totalPages === 0) {
            roomList.innerHTML = '<p class="no-results" style="padding: 40px; text-align: center; color: var(--text-muted);">No rooms match your filters. Try clearing some selections.</p>';
            clearCompareBtn.click();
            return;
        }
        
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageRooms = filteredRooms.slice(startIndex, endIndex);
        
        pageRooms.forEach(room => {
            const card = document.createElement('div');
            card.className = 'room-card-horizontal';
            
            const isScarcity = room.availability !== "Available";
            const scarcityHTML = isScarcity ? `<div class="scarcity-badge">${room.availability}</div>` : '';
            const aiBadgeHTML = room.featured ? `<span class="badge-tag">FEATURED</span>` : '';
            
            let amenitiesHTML = '';
            room.amenities.slice(0, 4).forEach(am => {
                let icon = 'check';
                if(am.toLowerCase().includes('ocean') || am.toLowerCase().includes('pool') || am.toLowerCase().includes('bath') || am.toLowerCase().includes('tub')) icon = 'waves';
                if(am.toLowerCase().includes('bed')) icon = 'bed-double';
                if(am.toLowerCase().includes('breakfast')) icon = 'coffee';
                if(am.toLowerCase().includes('wi-fi')) icon = 'wifi';
                if(am.toLowerCase().includes('lounge') || am.toLowerCase().includes('butler') || am.toLowerCase().includes('family')) icon = 'user';
                amenitiesHTML += `<span><i data-lucide="${icon}"></i> ${am}</span>`;
            });
            
            card.innerHTML = `
                <div class="room-card-img">
                    ${aiBadgeHTML}
                    <button class="wishlist-btn"><i data-lucide="heart"></i></button>
                    <img src="${room.image}" alt="${room.name}">
                    <div class="quick-view-overlay">
                        <button class="btn btn-outline-cream btn-sm quick-view-btn" data-room-id="${room.id}">Quick View</button>
                    </div>
                </div>
                <div class="room-card-content">
                    <div class="room-card-header">
                        <div>
                            <h3>${room.name}</h3>
                            <div class="room-rating"><i data-lucide="star" class="text-gold star-fill"></i> ${room.rating} (${room.reviews} Reviews)</div>
                        </div>
                        <div class="room-card-price">
                            ${scarcityHTML}
                            <div class="price-amount">$${room.price.toLocaleString()}</div>
                            <div class="price-period">/ night</div>
                        </div>
                    </div>
                    
                    <p class="room-desc">${room.description}</p>
                    
                    <div class="room-amenities-list">
                        ${amenitiesHTML}
                    </div>
                    
                    <div class="room-card-actions">
                        <label class="custom-checkbox compare-checkbox-wrapper">
                            <input type="checkbox" class="compare-checkbox" data-room-id="${room.id}">
                            <span class="checkmark"></span> Compare
                        </label>
                        <a href="room-details?id=${room.id}" class="btn btn-outline-forest">View Details</a>
                        <button class="btn btn-primary reserve-btn" data-room-id="${room.id}">Reserve Now</button>
                    </div>
                </div>
            `;
            roomList.appendChild(card);
        });
        
        // Render Pagination Controls
        if (totalPages > 1) {
            for (let i = 1; i <= totalPages; i++) {
                const btn = document.createElement('button');
                btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
                btn.innerText = i;
                btn.addEventListener('click', () => {
                    currentPage = i;
                    paginateAndRender();
                    window.scrollTo({ top: document.querySelector('.results-area').offsetTop - 100, behavior: 'smooth' });
                });
                paginationContainer.appendChild(btn);
            }
        }
        
        if(window.lucide) lucide.createIcons();
        bindDynamicEvents();
    }

    // Dynamic Events for injected HTML
    function updateCompare() {
        const dynamicCheckboxes = document.querySelectorAll('.compare-checkbox');
        let checkedCount = 0;
        dynamicCheckboxes.forEach(cb => { if(cb.checked) checkedCount++; });
        
        if(checkedCount > 0) {
            compareBar.style.display = 'flex';
            compareCountEl.innerText = checkedCount;
            if(checkedCount >= 2) {
                compareRoomsBtn.disabled = false;
                compareRoomsBtn.innerText = `Compare Rooms (${checkedCount})`;
                compareRoomsBtn.style.opacity = '1';
                compareRoomsBtn.style.cursor = 'pointer';
            } else {
                compareRoomsBtn.disabled = true;
                compareRoomsBtn.innerText = `Compare Rooms (Disabled)`;
                compareRoomsBtn.style.opacity = '0.5';
                compareRoomsBtn.style.cursor = 'not-allowed';
            }
        } else {
            compareBar.style.display = 'none';
        }
    }

    clearCompareBtn.addEventListener('click', () => {
        document.querySelectorAll('.compare-checkbox').forEach(cb => cb.checked = false);
        updateCompare();
    });

    document.getElementById('closeQuickView').addEventListener('click', () => {
        quickViewModal.classList.remove('open');
    });
    document.getElementById('closeCompare').addEventListener('click', () => {
        compareModal.classList.remove('open');
    });

    compareRoomsBtn.addEventListener('click', () => {
        const compareGrid = document.getElementById('compareGrid');
        const summaryContainer = document.getElementById('aiComparisonSummary');
        const summaryList = document.getElementById('summaryList');
        
        compareGrid.innerHTML = '';
        if (summaryList) summaryList.innerHTML = '';
        
        let selectedRooms = [];
        document.querySelectorAll('.compare-checkbox:checked').forEach(cb => {
            const roomId = cb.getAttribute('data-room-id');
            const room = roomsData.find(r => r.id === roomId);
            if(room) selectedRooms.push(room);
        });
        
        if(selectedRooms.length < 2) return;

        // Generate AI Summary
        if (summaryContainer && summaryList) {
            summaryContainer.style.display = 'block';
            
            // Sort by price to find cheapest
            const sortedByPrice = [...selectedRooms].sort((a, b) => a.price - b.price);
            const cheapest = sortedByPrice[0];
            const mostExpensive = sortedByPrice[sortedByPrice.length - 1];
            
            // Sort by rating
            const sortedByRating = [...selectedRooms].sort((a, b) => b.rating - a.rating);
            const highestRated = sortedByRating[0];
            
            if (cheapest.price < mostExpensive.price) {
                summaryList.innerHTML += `<li><i data-lucide="check-circle-2"></i> <span><strong>${cheapest.name}</strong> is $${(mostExpensive.price - cheapest.price).toLocaleString()} cheaper per night.</span></li>`;
            }
            
            if (highestRated.rating > sortedByRating[sortedByRating.length - 1].rating) {
                summaryList.innerHTML += `<li><i data-lucide="check-circle-2"></i> <span><strong>${highestRated.name}</strong> has a higher guest rating (${highestRated.rating}).</span></li>`;
            }
            
            // Find exclusive amenities
            const allAmenitiesList = ["Butler Service", "Plunge Pool", "Private Cinema", "Rooftop Terrace", "Spa Bath", "Ocean View", "Breakfast Included", "Lounge Access"];
            allAmenitiesList.forEach(am => {
                const roomsWithAm = selectedRooms.filter(r => r.amenities.some(a => a.includes(am)));
                if (roomsWithAm.length > 0 && roomsWithAm.length < selectedRooms.length) {
                    summaryList.innerHTML += `<li><i data-lucide="check-circle-2"></i> <span><strong>${roomsWithAm[0].name}</strong> includes exclusive ${am}.</span></li>`;
                }
            });
            
            // Cap to 3 summary items so it doesn't get too long
            const summaryItems = summaryList.querySelectorAll('li');
            if (summaryItems.length > 3) {
                for (let i = 3; i < summaryItems.length; i++) {
                    summaryItems[i].remove();
                }
            }
        }

        // Sort by rating to define Best Match
        const highestRated = [...selectedRooms].sort((a, b) => b.rating - a.rating)[0];

        // Build Columns
        selectedRooms.forEach(room => {
            const isBestMatch = room.id === highestRated.id;
            const badgeHTML = isBestMatch ? `<div class="compare-badge">⭐ BEST MATCH</div>` : '';
            
            const col = document.createElement('div');
            col.className = 'compare-col';
            
            // Build amenity checks
            const amenitiesToCheck = [
                { id: "Wi-Fi", match: "Wi-Fi" },
                { id: "Breakfast", match: "Breakfast" },
                { id: "Minibar", match: "Bar" },
                { id: "Smart TV", match: "Tech" },
                { id: "Room Service", match: "Service" },
                { id: "Spa Access", match: "Spa" },
                { id: "Butler", match: "Butler" }
            ];
            
            let amenitiesHTML = '';
            amenitiesToCheck.forEach(am => {
                const hasAm = room.amenities.some(a => a.toLowerCase().includes(am.match.toLowerCase()));
                const icon = hasAm ? '<i data-lucide="check" class="text-forest"></i>' : '<i data-lucide="x" class="text-muted"></i>';
                amenitiesHTML += `
                    <div class="compare-stat">
                        <span class="compare-stat-label">${am.id}</span>
                        <span>${icon}</span>
                    </div>
                `;
            });
            
            col.innerHTML = `
                <div style="position:relative;">
                    ${badgeHTML}
                    <img src="${room.image}" class="compare-img">
                </div>
                <div class="compare-title">${room.name}</div>
                <div class="compare-stat price" style="border-bottom:1px solid rgba(0,0,0,0.05); padding-bottom:16px;">
                    <div>$${room.price.toLocaleString()}<span style="font-size:13px;color:var(--text-muted);font-weight:400;margin-left:4px;">/ night</span></div>
                </div>
                
                <div class="compare-stat">
                    <span class="compare-stat-label">Availability</span>
                    <span style="color:#b8860b;font-weight:600;">${room.availability}</span>
                </div>
                <div class="compare-stat">
                    <span class="compare-stat-label">Rating</span>
                    <span>${room.rating} (${room.reviews})</span>
                </div>
                
                <h4 style="margin: 20px 0 8px; font-size: 15px; color: var(--forest); border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 8px;">Room Features</h4>
                <div class="compare-stat">
                    <span class="compare-stat-label">Guests</span>
                    <span>Up to ${room.maxGuests}</span>
                </div>
                <div class="compare-stat">
                    <span class="compare-stat-label">Size</span>
                    <span>${room.roomSize}</span>
                </div>
                <div class="compare-stat">
                    <span class="compare-stat-label">Bed Type</span>
                    <span>${room.bedType}</span>
                </div>
                <div class="compare-stat">
                    <span class="compare-stat-label">View</span>
                    <span>${room.amenities.find(a => a.toLowerCase().includes('view')) || 'City View'}</span>
                </div>
                
                <h4 style="margin: 20px 0 8px; font-size: 15px; color: var(--forest); border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 8px;">Amenities</h4>
                ${amenitiesHTML}
                
                <div class="compare-actions-row">
                    <a href="room-details?id=${room.id}" class="btn btn-outline-forest">View Details</a>
                    <button class="btn btn-primary reserve-btn" data-room-id="${room.id}">Reserve Now</button>
                </div>
            `;
            compareGrid.appendChild(col);
        });
        
        compareModal.classList.add('open');
        if(window.lucide) lucide.createIcons();
    });

    function showToastMsg(msg) {
        toast.innerHTML = `<i data-lucide="info"></i> <span>${msg}</span>`;
        if(window.lucide) lucide.createIcons();
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    function bindDynamicEvents() {
        const dynamicCheckboxes = document.querySelectorAll('.compare-checkbox');
        dynamicCheckboxes.forEach(cb => {
            cb.addEventListener('change', function() {
                let checkedCount = 0;
                dynamicCheckboxes.forEach(c => { if (c.checked) checkedCount++; });
                if (checkedCount > 3) {
                    this.checked = false;
                    showToastMsg('You can compare up to 3 rooms at a time.');
                    return;
                }
                updateCompare();
            });
        });

        const wishlistBtns = document.querySelectorAll('.wishlist-btn');
        wishlistBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                this.classList.toggle('active');
                if(this.classList.contains('active')) {
                    this.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#d32f2f" stroke="#d32f2f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>';
                    showToastMsg('Added to Wishlist');
                } else {
                    this.innerHTML = '<i data-lucide="heart"></i>';
                    if(window.lucide) lucide.createIcons();
                }
            });
        });

        const qvBtns = document.querySelectorAll('.quick-view-btn');
        qvBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const roomId = this.getAttribute('data-room-id');
                const room = roomsData.find(r => r.id === roomId);
                if(!room) return;
                
                document.getElementById('qvTitle').innerText = room.name;
                document.getElementById('qvImage').src = room.image;
                document.getElementById('qvPrice').innerText = `$${room.price.toLocaleString()}`;
                document.getElementById('qvRating').innerText = `${room.rating} (${room.reviews} Reviews)`;
                document.getElementById('qvDesc').innerText = room.description;
                
                let amenitiesHTML = '';
                room.amenities.forEach(am => {
                    amenitiesHTML += `<span><i data-lucide="check"></i> ${am}</span>`;
                });
                document.getElementById('qvAmenities').innerHTML = amenitiesHTML;
                if(window.lucide) lucide.createIcons();
                
                quickViewModal.classList.add('open');
            });
        });
    }

    // Initial load - Parse URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const checkinParam = urlParams.get('checkin');
    const checkoutParam = urlParams.get('checkout');
    const guestsParam = urlParams.get('guests');
    const roomTypeParam = urlParams.get('roomType');

    function formatShortDate(dateStr) {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[date.getMonth()]} ${date.getDate()}`;
    }

    if (checkinParam && checkoutParam) {
        const detailItems = document.querySelectorAll('.search-summary-details .detail-item');
        if (detailItems.length >= 3) {
            detailItems[0].innerHTML = `<i data-lucide="calendar"></i> ${formatShortDate(checkinParam)} - ${formatShortDate(checkoutParam)}`;
            
            if (guestsParam) {
                detailItems[1].innerHTML = `<i data-lucide="users"></i> ${guestsParam} Guest${parseInt(guestsParam) > 1 ? 's' : ''}`;
            }
            
            if (roomTypeParam && roomTypeParam !== 'Any Room') {
                detailItems[2].innerHTML = `<i data-lucide="bed-double"></i> ${roomTypeParam}`;
                
                // Uncheck all room type checkboxes first
                checkboxes.forEach(cb => {
                    if (cb.classList.contains('filter-type')) {
                        cb.checked = false;
                    }
                });
                
                // Check the matching checkbox
                checkboxes.forEach(cb => {
                    if (cb.classList.contains('filter-type')) {
                        const val = cb.value.toLowerCase();
                        const param = roomTypeParam.toLowerCase();
                        if (val.includes(param) || param.includes(val) || 
                            (param.includes('standard') && val.includes('standard')) ||
                            (param.includes('deluxe') && val.includes('deluxe')) ||
                            (param.includes('executive') && val.includes('executive')) ||
                            (param.includes('presidential') && val.includes('presidential'))) {
                            cb.checked = true;
                        }
                    }
                });
            }
        }
    }

    // Delegated event listener for "Reserve Now" buttons across card lists & comparison grid
    document.addEventListener('click', function(e) {
        console.log('Document click registered on:', e.target.tagName, e.target.className);
        const reserveBtn = e.target.closest('.reserve-btn');
        if (reserveBtn) {
            console.log('Reserve button click detected! Room ID:', reserveBtn.getAttribute('data-room-id'));
            e.preventDefault();
            const roomId = reserveBtn.getAttribute('data-room-id');
            const room = roomsData.find(r => r.id === roomId);
            console.log('Found room object:', room ? room.name : 'null');
            if (!room) return;
            
            let checkinVal = checkinParam;
            let checkoutVal = checkoutParam;
            let guestsVal = guestsParam || '2';
            
            if (!checkinVal || !checkoutVal) {
                const today = new Date();
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                const threeDaysAfter = new Date(tomorrow);
                threeDaysAfter.setDate(tomorrow.getDate() + 3);
                
                checkinVal = tomorrow.toISOString().split('T')[0];
                checkoutVal = threeDaysAfter.toISOString().split('T')[0];
            }
            
            const dateIn = new Date(checkinVal);
            const dateOut = new Date(checkoutVal);
            const nightsCount = Math.max(1, Math.round((dateOut - dateIn) / (1000 * 60 * 60 * 24)));
            
            const bookingData = {
                roomId: room.id,
                roomName: room.name,
                roomCategory: room.category,
                roomImage: room.image,
                roomPrice: room.price,
                checkinDate: checkinVal,
                checkoutDate: checkoutVal,
                guests: parseInt(guestsVal, 10),
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

    applyFilters();

    // ==========================================================================
    // DINING EXPERIENCE LOGIC
    // ==========================================================================
    
    // 1. AI Dining Concierge Randomizer
    const diningRecommendations = [
        {
            title: "Romantic Sunset Dinner",
            desc: "Perfect for couples, ocean views, and chef's tasting menu."
        },
        {
            title: "Chef's Signature Tasting",
            desc: "A 7-course culinary journey with exclusive wine pairings."
        },
        {
            title: "Seafood Experience",
            desc: "Freshly caught local seafood, grilled to perfection by the pool."
        },
        {
            title: "Family Dining Package",
            desc: "Interactive dining experience perfect for sharing and creating memories."
        },
        {
            title: "Wine Pairing Evening",
            desc: "Discover our private cellar with expert sommelier guidance."
        }
    ];

    const aiTitle = document.getElementById('aiDiningTitle');
    const aiDesc = document.getElementById('aiDiningDesc');
    
    if (aiTitle && aiDesc) {
        const randomRec = diningRecommendations[Math.floor(Math.random() * diningRecommendations.length)];
        aiTitle.innerText = randomRec.title;
        aiDesc.innerText = randomRec.desc;
    }

    // ==========================================================================
    // AI DINING CONCIERGE — Smart Chat Engine
    // ==========================================================================

    // Lucide icon refresh helper after DOM mutations
    function refreshLucide() {
        if (window.lucide) lucide.createIcons();
    }

    // Append a bot bubble to the chat window
    function appendBotBubble(html) {
        const win = document.getElementById('diningChatWindow');
        if (!win) return;
        const row = document.createElement('div');
        row.className = 'dc-msg dc-bot';
        row.style.cssText = 'display:flex; gap:8px; align-items:flex-start;';
        row.innerHTML = `
            <div style="width:28px; height:28px; border-radius:50%; background:linear-gradient(135deg,var(--forest),#0d4a3a); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                <i data-lucide="bot" style="width:14px; height:14px; color:var(--gold);"></i>
            </div>
            <div style="background:#fff; border:1px solid rgba(212,175,55,0.2); border-radius:0 10px 10px 10px; padding:10px 14px; font-size:13px; color:var(--text-main); line-height:1.6; max-width:92%; box-shadow:0 1px 4px rgba(0,0,0,0.05);">
                ${html}
            </div>`;
        win.appendChild(row);
        refreshLucide();
        win.scrollTop = win.scrollHeight;
    }

    // Append a user bubble
    function appendUserBubble(text) {
        const win = document.getElementById('diningChatWindow');
        if (!win) return;
        const row = document.createElement('div');
        row.style.cssText = 'display:flex; justify-content:flex-end; gap:8px; align-items:flex-start;';
        row.innerHTML = `
            <div style="background:linear-gradient(135deg,var(--forest),#0d4a3a); color:#fff; border-radius:10px 0 10px 10px; padding:10px 14px; font-size:13px; line-height:1.5; max-width:80%; box-shadow:0 1px 4px rgba(0,0,0,0.1);">
                ${text}
            </div>`;
        win.appendChild(row);
        win.scrollTop = win.scrollHeight;
    }

    // Show typing indicator
    function showTyping() {
        const win = document.getElementById('diningChatWindow');
        if (!win) return;
        const el = document.createElement('div');
        el.id = 'dc-typing';
        el.style.cssText = 'display:flex; gap:8px; align-items:flex-start;';
        el.innerHTML = `
            <div style="width:28px; height:28px; border-radius:50%; background:linear-gradient(135deg,var(--forest),#0d4a3a); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                <i data-lucide="bot" style="width:14px; height:14px; color:var(--gold);"></i>
            </div>
            <div style="background:#fff; border:1px solid rgba(212,175,55,0.2); border-radius:0 10px 10px 10px; padding:12px 16px; box-shadow:0 1px 4px rgba(0,0,0,0.05); display:flex; gap:5px; align-items:center;">
                <span style="width:7px;height:7px;border-radius:50%;background:var(--forest);display:inline-block;animation:dcDot 1.2s infinite 0s;"></span>
                <span style="width:7px;height:7px;border-radius:50%;background:var(--forest);display:inline-block;animation:dcDot 1.2s infinite 0.3s;"></span>
                <span style="width:7px;height:7px;border-radius:50%;background:var(--forest);display:inline-block;animation:dcDot 1.2s infinite 0.6s;"></span>
            </div>`;
        win.appendChild(el);
        refreshLucide();
        win.scrollTop = win.scrollHeight;
    }

    function hideTyping() {
        const el = document.getElementById('dc-typing');
        if (el) el.remove();
    }

    // Inject typing animation CSS once
    if (!document.getElementById('dcStyle')) {
        const s = document.createElement('style');
        s.id = 'dcStyle';
        s.textContent = `@keyframes dcDot{0%,80%,100%{transform:scale(0.6);opacity:0.4}40%{transform:scale(1);opacity:1}}
        .dc-chip:hover{transform:translateY(-1px);box-shadow:0 3px 8px rgba(0,0,0,0.1);}`;
        document.head.appendChild(s);
    }

});

// ==========================================================================
// GLOBAL: AI Dining Concierge Ask Function
// ==========================================================================
window.diningConciergeAsk = function(query) {
    query = (query || '').trim();
    if (!query) return;

    const input = document.getElementById('diningConciergeInput');
    if (input) input.value = '';

    // Append user bubble
    (function appendUser(text) {
        const win = document.getElementById('diningChatWindow');
        if (!win) return;
        const row = document.createElement('div');
        row.style.cssText = 'display:flex; justify-content:flex-end; gap:8px; align-items:flex-start;';
        row.innerHTML = `<div style="background:linear-gradient(135deg,var(--forest),#0d4a3a); color:#fff; border-radius:10px 0 10px 10px; padding:10px 14px; font-size:13px; line-height:1.5; max-width:80%; box-shadow:0 1px 4px rgba(0,0,0,0.1);">${text}</div>`;
        win.appendChild(row);
        win.scrollTop = win.scrollHeight;
    })(query);

    // Show typing indicator
    const win = document.getElementById('diningChatWindow');
    if (win) {
        const el = document.createElement('div');
        el.id = 'dc-typing';
        el.style.cssText = 'display:flex; gap:8px; align-items:flex-start;';
        el.innerHTML = `
            <div style="width:28px; height:28px; border-radius:50%; background:linear-gradient(135deg,#0d2a2a,#0d4a3a); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                <i data-lucide="bot" style="width:14px; height:14px; color:#d4af37;"></i>
            </div>
            <div style="background:#fff; border:1px solid rgba(212,175,55,0.2); border-radius:0 10px 10px 10px; padding:12px 16px; box-shadow:0 1px 4px rgba(0,0,0,0.05); display:flex; gap:5px; align-items:center;">
                <span style="width:7px;height:7px;border-radius:50%;background:#0d2a2a;display:inline-block;animation:dcDot 1.2s infinite 0s;"></span>
                <span style="width:7px;height:7px;border-radius:50%;background:#0d2a2a;display:inline-block;animation:dcDot 1.2s infinite 0.3s;"></span>
                <span style="width:7px;height:7px;border-radius:50%;background:#0d2a2a;display:inline-block;animation:dcDot 1.2s infinite 0.6s;"></span>
            </div>`;
        win.appendChild(el);
        if (window.lucide) lucide.createIcons();
        win.scrollTop = win.scrollHeight;
    }

    // Process after a short delay (simulates thinking)
    setTimeout(function() {
        const typing = document.getElementById('dc-typing');
        if (typing) typing.remove();

        const q = query.toLowerCase();

        // Keyword → menu item matching rules
        const rules = [
            { keys: ['veg','vegetarian','plant','green','salad','no meat'],    filter: i => i.isVeg,                  label: 'vegetarian options' },
            { keys: ['spicy','hot','chilli','chili','pepper','fire'],          filter: i => i.spicyLevel > 0,         label: 'spicy dishes' },
            { keys: ['seafood','fish','prawn','lobster','scallop','cod','tuna','crab'], filter: i => !i.isVeg && ['starters','main','grills'].includes(i.category), label: 'seafood selections' },
            { keys: ['dessert','sweet','chocolate','souffle','tart','cake'],   filter: i => i.category === 'desserts', label: 'desserts' },
            { keys: ['chef','special','recommended','signature','best','top'], filter: i => i.tags.includes('chef'),   label: "Chef's Specials" },
            { keys: ['wine','champagne','cellar','bottle','bordeaux'],         filter: i => i.category === 'wine',     label: 'wine selections' },
            { keys: ['drink','cocktail','beverage','juice','bar'],             filter: i => i.category === 'beverages', label: 'beverages' },
            { keys: ['italian','pasta','risotto','ravioli','pizza'],           filter: i => i.category === 'italian',   label: 'Italian cuisine' },
            { keys: ['asian','chinese','japanese','sushi','tofu','sichuan'],   filter: i => i.category === 'asian',     label: 'Asian dishes' },
            { keys: ['grill','bbq','steak','meat','beef','wagyu','tomahawk'],  filter: i => i.category === 'grills' || i.id === 'food-001' || i.id === 'food-004', label: 'grills & steaks' },
            { keys: ['romantic','couple','date','anniversary','sunset'],       filter: i => i.tags.includes('chef') || i.category === 'wine', label: 'romantic dining' },
            { keys: ['light','healthy','gluten','diet'],                       filter: i => i.tags.includes('gluten-free') || i.isVeg, label: 'light & healthy options' },
            { keys: ['starter','appetizer','small','snack'],                   filter: i => i.category === 'starters', label: 'starters' },
            { keys: ['main','course','dinner','lunch','meal'],                 filter: i => i.category === 'main',     label: 'main courses' },
        ];

        // Find matching rule
        let matched = null;
        let matchLabel = '';
        for (const rule of rules) {
            if (rule.keys.some(k => q.includes(k))) {
                const items = (typeof menuData !== 'undefined' ? menuData : []).filter(rule.filter);
                if (items.length > 0) {
                    matched = items;
                    matchLabel = rule.label;
                    break;
                }
            }
        }

        const chatWin = document.getElementById('diningChatWindow');
        if (!chatWin) return;

        const botRow = document.createElement('div');
        botRow.className = 'dc-msg dc-bot';
        botRow.style.cssText = 'display:flex; gap:8px; align-items:flex-start;';

        let innerHtml = '';

        if (matched && matched.length > 0) {
            const top = matched.slice(0, 3);
            const cards = top.map(item => `
                <a href="menu.html?search=${encodeURIComponent(item.name.split(' ')[0])}#menuControls" style="display:flex; align-items:center; gap:10px; padding:8px 10px; background:#f9f8f5; border:1px solid rgba(212,175,55,0.2); border-radius:8px; text-decoration:none; transition:all 0.2s; margin-top:6px;" 
                   onmouseover="this.style.background='#fff'; this.style.borderColor='var(--gold)'" 
                   onmouseout="this.style.background='#f9f8f5'; this.style.borderColor='rgba(212,175,55,0.2)'">
                    <img src="${item.image}" onerror="this.src='${item.fallbackImage || ''}'" alt="${item.name}" style="width:40px; height:40px; border-radius:6px; object-fit:cover; flex-shrink:0;">
                    <div>
                        <div style="font-weight:600; font-size:12px; color:#0d2a2a; line-height:1.3;">${item.name}</div>
                        <div style="font-size:11px; color:#888; line-height:1.3;">${item.description.substring(0, 50)}${item.description.length > 50 ? '…' : ''}</div>
                        <div style="font-size:11px; font-weight:700; color:#d4af37; margin-top:2px;">₹${item.price.toLocaleString('en-IN')}</div>
                    </div>
                </a>`).join('');

            innerHtml = `✨ Here are my top picks for <strong>${matchLabel}</strong>:${cards}
                <a href="menu.html#menuControls" style="display:inline-block; margin-top:10px; font-size:11px; color:var(--primary); text-decoration:none; font-weight:600;">View full menu →</a>`;
        } else {
            // Fallback: show 3 random chef specials
            const fallback = (typeof menuData !== 'undefined' ? menuData : []).filter(i => i.tags.includes('chef')).slice(0, 3);
            const cards = fallback.map(item => `
                <a href="menu.html?search=${encodeURIComponent(item.name.split(' ')[0])}#menuControls" style="display:flex; align-items:center; gap:10px; padding:8px 10px; background:#f9f8f5; border:1px solid rgba(212,175,55,0.2); border-radius:8px; text-decoration:none; transition:all 0.2s; margin-top:6px;"
                   onmouseover="this.style.background='#fff'" onmouseout="this.style.background='#f9f8f5'">
                    <img src="${item.image}" onerror="this.src='${item.fallbackImage || ''}'" alt="${item.name}" style="width:40px; height:40px; border-radius:6px; object-fit:cover; flex-shrink:0;">
                    <div>
                        <div style="font-weight:600; font-size:12px; color:#0d2a2a;">${item.name}</div>
                        <div style="font-size:11px; color:#888;">${item.description.substring(0, 50)}…</div>
                        <div style="font-size:11px; font-weight:700; color:#d4af37; margin-top:2px;">₹${item.price.toLocaleString('en-IN')}</div>
                    </div>
                </a>`).join('');
            innerHtml = `I couldn't find an exact match, but here are our <strong>Chef's Specials</strong> you'll love:${cards}
                <a href="menu.html#menuControls" style="display:inline-block; margin-top:10px; font-size:11px; color:var(--primary); text-decoration:none; font-weight:600;">Browse full menu →</a>`;
        }

        botRow.innerHTML = `
            <div style="width:28px; height:28px; border-radius:50%; background:linear-gradient(135deg,#0d2a2a,#0d4a3a); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                <i data-lucide="bot" style="width:14px; height:14px; color:#d4af37;"></i>
            </div>
            <div style="background:#fff; border:1px solid rgba(212,175,55,0.2); border-radius:0 10px 10px 10px; padding:10px 14px; font-size:13px; color:#333; line-height:1.6; max-width:92%; box-shadow:0 1px 4px rgba(0,0,0,0.05);">
                ${innerHtml}
            </div>`;
        chatWin.appendChild(botRow);
        if (window.lucide) lucide.createIcons();
        chatWin.scrollTop = chatWin.scrollHeight;

    }, 900);
};

/* ==========================================
   Luxury Dining Reservation Modal Logic
   ========================================== */
// Global function so the inline onclick always works
window.openLuxuryDiningModal = function(e) {
    if (e) e.preventDefault();
    console.log('Reserve Table clicked');

    var modal = document.getElementById('diningReservationModal');
    if (!modal) {
        console.error('diningReservationModal not found');
        return;
    }

    var formState = document.getElementById('diningReservationFormState');
    var successState = document.getElementById('diningSuccessState');
    var form = document.getElementById('diningReservationForm');
    var errorMsg = document.getElementById('diningFormError');
    var pills = document.querySelectorAll('.ai-pill');

    if (formState) formState.style.display = 'block';
    if (successState) successState.style.display = 'none';
    if (form) form.reset();
    if (errorMsg) errorMsg.style.display = 'none';
    if (pills) pills.forEach(function(p) { p.classList.remove('active'); });

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

// Global close function
window.closeLuxuryDiningModal = function() {
    var modal = document.getElementById('diningReservationModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
};

// Wire up all events after DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dining Modal: DOMContentLoaded fired');

    var modal = document.getElementById('diningReservationModal');
    var openBtn = document.getElementById('openDiningReservationBtn');
    var closeBtn = document.getElementById('closeDiningModalBtn');
    var form = document.getElementById('diningReservationForm');
    var errorMsg = document.getElementById('diningFormError');
    var formState = document.getElementById('diningReservationFormState');
    var successState = document.getElementById('diningSuccessState');
    var expInput = document.getElementById('resExperience');
    var aiPills = document.querySelectorAll('.ai-pill');

    // Attach open button listener (backup for the inline onclick)
    if (openBtn) {
        openBtn.addEventListener('click', window.openLuxuryDiningModal);
        console.log('Dining Modal: openBtn listener attached');
    }

    // Close button
    if (closeBtn) {
        closeBtn.addEventListener('click', window.closeLuxuryDiningModal);
    }

    // Click overlay to close
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) window.closeLuxuryDiningModal();
        });
    }

    // AI Concierge Pills
    if (aiPills && aiPills.length > 0) {
        aiPills.forEach(function(pill) {
            pill.addEventListener('click', function() {
                if (pill.classList.contains('active')) {
                    pill.classList.remove('active');
                    if (expInput) expInput.value = '';
                } else {
                    aiPills.forEach(function(p) { p.classList.remove('active'); });
                    pill.classList.add('active');
                    if (expInput) expInput.value = pill.getAttribute('data-exp') || '';
                }
            });
        });
    }

    // Form Submission
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (errorMsg) errorMsg.style.display = 'none';

            var name = document.getElementById('resName').value.trim();
            var email = document.getElementById('resEmail').value.trim();
            var phone = document.getElementById('resPhone').value.trim();
            var guests = document.getElementById('diningResGuests').value;
            var date = document.getElementById('diningResDate').value;
            var time = document.getElementById('diningResTime').value;
            var seating = document.getElementById('resSeating').value;
            var requests = document.getElementById('diningResRequests').value.trim();
            var experience = expInput ? expInput.value.trim() : '';

            if (!name || !email || !phone || !guests || !date || !time || !seating) {
                if (errorMsg) {
                    errorMsg.textContent = 'Please fill in all required fields.';
                    errorMsg.style.display = 'block';
                }
                return;
            }

            var resId = 'DIN-' + Math.floor(1000 + Math.random() * 9000);

            var reservation = {
                reservationId: resId,
                guestName: name,
                email: email,
                phone: phone,
                date: date,
                time: time,
                guests: guests,
                seatingPreference: seating,
                specialRequest: requests,
                diningExperience: experience
            };

            var existing = JSON.parse(localStorage.getItem('diningReservations') || '[]');
            existing.push(reservation);
            localStorage.setItem('diningReservations', JSON.stringify(existing));

            document.getElementById('successResId').textContent = resId;
            document.getElementById('successDate').textContent = date;
            document.getElementById('successTime').textContent = time;
            document.getElementById('successGuests').textContent = guests + (guests == 1 ? ' Guest' : ' Guests');

            if (formState) formState.style.display = 'none';
            if (successState) successState.style.display = 'block';

            setTimeout(function() {
                if (modal && modal.classList.contains('active')) {
                    window.closeLuxuryDiningModal();
                }
            }, 3000);
        });
    }

    console.log('Dining Modal: All listeners attached successfully');

    /* ==========================================
       Dining Gallery Modal Logic
       ========================================== */
    const galleryData = {
        interior: {
            title: "Restaurant Interior",
            experience: "Chef's Signature Tasting",
            btnText: "Reserve Table",
            details: [
                { icon: "users", label: "Capacity", value: "120 Seats" },
                { icon: "utensils", label: "Cuisine", value: "Modern European, Fine Dining" },
                { icon: "clock", label: "Opening Hours", value: "12:00 PM – 3:00 PM, 6:30 PM – 11:00 PM" }
            ],
            photos: [
                "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1414235077428-33898dba1c6f?auto=format&fit=crop&q=80&w=800"
            ]
        },
        chef: {
            title: "Chef's Signature Tasting",
            experience: "Chef's Signature Tasting",
            btnText: "Reserve Experience",
            details: [
                { icon: "star", label: "Experience", value: "Chef's Signature Tasting" },
                { icon: "chef-hat", label: "Menu", value: "7 Course Tasting Menu" },
                { icon: "glass-water", label: "Wine Pairing", value: "Optional Sommelier Pairing" },
                { icon: "dollar-sign", label: "Price", value: "$250 / Person" }
            ],
            photos: [
                "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&q=80&w=800"
            ]
        },
        private: {
            title: "Private Dining",
            experience: "Family Dining Package",
            btnText: "Reserve Private Dining",
            details: [
                { icon: "layers", label: "Rooms", value: "Private Rooms Available" },
                { icon: "users", label: "Capacity Options", value: "2, 4, 8, or 12 Guests" }
            ],
            photos: [
                "https://images.unsplash.com/photo-1560624052-449f5ddf0c31?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800"
            ]
        },
        terrace: {
            title: "Sunset Terrace",
            experience: "Romantic Sunset Dinner",
            btnText: "Reserve Table",
            details: [
                { icon: "sun", label: "Location", value: "Ocean View Dining" },
                { icon: "clock", label: "Timing", value: "Sunset Timings" },
                { icon: "heart", label: "Setup", value: "Romantic Setup" }
            ],
            photos: [
                "https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1464979681340-1261d70b2421?auto=format&fit=crop&q=80&w=800"
            ]
        }
    };

    const galleryModal = document.getElementById('diningGalleryModal');
    const galleryCards = document.querySelectorAll('.dining-gallery-card');
    const closeGalleryBtn = document.getElementById('closeGalleryModalBtn');
    const closeGalleryTextBtn = document.getElementById('galleryCloseTextBtn');
    const galleryReserveBtn = document.getElementById('galleryReserveBtn');
    
    const activeImg = document.getElementById('galleryActiveImg');
    const prevBtn = document.getElementById('galleryPrevBtn');
    const nextBtn = document.getElementById('galleryNextBtn');
    const galleryTitle = document.getElementById('galleryTitle');
    const counterText = document.getElementById('galleryPhotoCounter');

    let currentCategory = '';
    let currentPhotoIndex = 0;

    function openGallery(category) {
        console.log('Open Gallery Modal:', category);
        const data = galleryData[category];
        if (!data) return;

        currentCategory = category;
        currentPhotoIndex = 0;

        // Populate fields
        if (galleryTitle) galleryTitle.innerText = data.title;
        
        // Update Reserve Button text
        if (galleryReserveBtn) {
            galleryReserveBtn.innerHTML = `<span>${data.btnText}</span> <i data-lucide="arrow-right"></i>`;
        }

        // Dynamically build detail list
        const detailsContainer = document.getElementById('galleryDetailsContainer');
        if (detailsContainer) {
            detailsContainer.innerHTML = '';
            data.details.forEach(item => {
                const detailItem = document.createElement('div');
                detailItem.style.cssText = 'display: flex; gap: 12px; align-items: flex-start;';
                detailItem.innerHTML = `
                    <div style="background: var(--cream-light); color: var(--primary); padding: 10px; border-radius: 8px; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; flex-shrink: 0;">
                        <i data-lucide="${item.icon}"></i>
                    </div>
                    <div>
                        <h4 style="font-size: 11px; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.5px; margin: 0 0 4px 0;">${item.label}</h4>
                        <p style="font-size: 14px; color: var(--forest); font-weight: 600; margin: 0;">${item.value}</p>
                    </div>
                `;
                detailsContainer.appendChild(detailItem);
            });
        }

        updateSlideshow();

        if (galleryModal) {
            galleryModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        // Re-initialize newly added icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    function closeGallery() {
        if (galleryModal) {
            galleryModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    function updateSlideshow() {
        const data = galleryData[currentCategory];
        if (!data || !data.photos[currentPhotoIndex]) return;

        // Set image source
        if (activeImg) {
            activeImg.style.opacity = '0';
            setTimeout(() => {
                activeImg.src = data.photos[currentPhotoIndex];
                activeImg.style.opacity = '1';
            }, 150);
        }

        // Counter text
        if (counterText) {
            counterText.innerText = `Photo ${currentPhotoIndex + 1} of ${data.photos.length}`;
        }
    }

    // Attach click events to gallery cards
    galleryCards.forEach(card => {
        card.addEventListener('click', () => {
            const cat = card.getAttribute('data-category');
            openGallery(cat);
        });
    });

    // Close buttons
    if (closeGalleryBtn) closeGalleryBtn.addEventListener('click', closeGallery);
    if (closeGalleryTextBtn) closeGalleryTextBtn.addEventListener('click', closeGallery);
    if (galleryModal) {
        galleryModal.addEventListener('click', (e) => {
            if (e.target === galleryModal) closeGallery();
        });
    }

    // Prev/Next buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const data = galleryData[currentCategory];
            if (!data) return;
            currentPhotoIndex = (currentPhotoIndex - 1 + data.photos.length) % data.photos.length;
            updateSlideshow();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const data = galleryData[currentCategory];
            if (!data) return;
            currentPhotoIndex = (currentPhotoIndex + 1) % data.photos.length;
            updateSlideshow();
        });
    }

    // Reserve Table button inside gallery modal
    if (galleryReserveBtn) {
        galleryReserveBtn.addEventListener('click', () => {
            const data = galleryData[currentCategory];
            closeGallery();
            
            // Wait slightly for smooth transition, then open dining reservation modal
            setTimeout(() => {
                // Open reservation modal first (which resets the form)
                if (typeof window.openLuxuryDiningModal === 'function') {
                    window.openLuxuryDiningModal();
                }
                
                const expInput = document.getElementById('resExperience');
                const pills = document.querySelectorAll('.ai-pill');
                
                if (data && data.experience) {
                    if (expInput) expInput.value = data.experience;
                    
                    if (pills) {
                        pills.forEach(p => {
                            if (p.getAttribute('data-exp') === data.experience) {
                                p.classList.add('active');
                            } else {
                                p.classList.remove('active');
                            }
                        });
                    }
                }
            }, 350);
        });
    }

    /* ==========================================
       Experiences Modal Logic
       ========================================== */
    const experiencesData = {
        dining: {
            title: "Fine Dining",
            subtitle: "Culinary Artistry",
            image: "images/dining.jpg",
            desc: "World-class cuisine crafted by Michelin-starred chefs using the finest seasonal ingredients.",
            sectionHeader: "Dining Experience Page",
            btnText: "Reserve Table",
            secondaryBtnText: "View Menu",
            secondaryBtnUrl: "menu.html",
            details: [
                { icon: "star", label: "Signature Experience", value: "Chef's Signature Tasting" }
            ]
        },
        spa: {
            title: "Spa & Wellness",
            subtitle: "Inner Serenity",
            image: "images/spa.jpg",
            desc: "Bespoke treatments and ancient healing rituals in our award-winning wellness sanctuary.",
            sectionHeader: "Spa Packages",
            btnText: "Book Appointment",
            details: [
                { icon: "clock", label: "Massage Therapy", value: "60 Min Massage" },
                { icon: "sparkles", label: "Luxury Therapy", value: "90 Min Luxury Therapy" },
                { icon: "users", label: "Signature Service", value: "Couple Spa Package" }
            ]
        },
        pool: {
            title: "Infinity Pool",
            subtitle: "Endless Horizon",
            image: "images/pool.jpg",
            desc: "Swim where the water meets the sky in our temperature-controlled infinity pool.",
            sectionHeader: "Pool Information",
            btnText: "Reserve Cabana",
            details: [
                { icon: "clock", label: "Timings", value: "Opening Hours" },
                { icon: "utensils", label: "Dining Inclusions", value: "Poolside Dining" },
                { icon: "tent", label: "Facilities", value: "Private Cabanas" }
            ]
        },
        fitness: {
            title: "Fitness Center",
            subtitle: "Peak Performance",
            image: "images/fitness.jpg",
            desc: "State-of-the-art equipment with personal trainers and panoramic garden views.",
            sectionHeader: "Gym Facilities",
            btnText: "Book Trainer",
            details: [
                { icon: "user", label: "Coaching", value: "Personal Trainer" },
                { icon: "activity", label: "Group Sessions", value: "Yoga Sessions" }
            ]
        },
        transfers: {
            title: "Airport Transfers",
            subtitle: "Seamless Arrival",
            image: "images/transfers.jpg",
            desc: "Luxury chauffeur service from the moment you land to the comfort of your suite.",
            sectionHeader: "Vehicle Selection",
            btnText: "Schedule Pickup",
            details: [
                { icon: "car", label: "Executive Sedan", value: "Sedan" },
                { icon: "car", label: "Family SUV", value: "SUV" },
                { icon: "crown", label: "Prestige Class", value: "Luxury Car" }
            ]
        },
        tours: {
            title: "Private Tours",
            subtitle: "Discover & Explore",
            image: "images/tours.jpg",
            desc: "Curated private excursions to hidden gems and cultural landmarks.",
            sectionHeader: "Private Tours",
            btnText: "Book Tour",
            details: [
                { icon: "map-pin", label: "Urban Exploration", value: "City Tour" },
                { icon: "trees", label: "Natural Wonders", value: "Nature Tour" },
                { icon: "compass", label: "Adventure Guide", value: "Adventure Tour" }
            ]
        }
    };

    const expModal = document.getElementById('experiencesModal');
    const expCards = document.querySelectorAll('.exp-card');
    const closeExpBtn = document.getElementById('closeExpModalBtn');
    const expPrimaryBtn = document.getElementById('expPrimaryBtn');
    const expSecondaryBtn = document.getElementById('expSecondaryBtn');
    
    const expImg = document.getElementById('expModalImg');
    const expTitle = document.getElementById('expModalTitle');
    const expSubtitle = document.getElementById('expModalSubtitle');
    const expDesc = document.getElementById('expModalDesc');
    const expSectionHeader = document.getElementById('expSectionHeader');
    const expDetailsContainer = document.getElementById('expDetailsContainer');

    let currentExpCategory = '';

    function openExpModal(category) {
        console.log('Open Experiences Modal:', category);
        const data = experiencesData[category];
        if (!data) return;

        currentExpCategory = category;

        // Populate details
        if (expImg) expImg.src = data.image;
        if (expTitle) expTitle.innerText = data.title;
        if (expSubtitle) expSubtitle.innerText = data.subtitle;
        if (expDesc) expDesc.innerText = data.desc;
        if (expSectionHeader) expSectionHeader.innerText = data.sectionHeader;

        // Primary Button Text
        if (expPrimaryBtn) expPrimaryBtn.innerText = data.btnText;

        // Secondary Button logic (Fine Dining only)
        if (expSecondaryBtn) {
            if (data.secondaryBtnText) {
                expSecondaryBtn.innerText = data.secondaryBtnText;
                expSecondaryBtn.href = data.secondaryBtnUrl;
                expSecondaryBtn.style.display = 'inline-flex';
            } else {
                expSecondaryBtn.style.display = 'none';
            }
        }

        // Details list
        if (expDetailsContainer) {
            expDetailsContainer.innerHTML = '';
            data.details.forEach(item => {
                const detailItem = document.createElement('div');
                detailItem.style.cssText = 'display: flex; gap: 12px; align-items: flex-start;';
                detailItem.innerHTML = `
                    <div style="background: var(--cream-light); color: var(--primary); padding: 10px; border-radius: 8px; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; flex-shrink: 0;">
                        <i data-lucide="${item.icon}"></i>
                    </div>
                    <div>
                        <h4 style="font-size: 11px; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.5px; margin: 0 0 4px 0;">${item.label}</h4>
                        <p style="font-size: 14px; color: var(--forest); font-weight: 600; margin: 0;">${item.value}</p>
                    </div>
                `;
                expDetailsContainer.appendChild(detailItem);
            });
        }

        if (expModal) {
            expModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        // Re-initialize newly added icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    function closeExpModal() {
        if (expModal) {
            expModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Attach click events to cards
    expCards.forEach(card => {
        card.addEventListener('click', () => {
            const cat = card.getAttribute('data-exp-type');
            openExpModal(cat);
        });
    });

    // Close buttons
    if (closeExpBtn) closeExpBtn.addEventListener('click', closeExpModal);
    if (expModal) {
        expModal.addEventListener('click', (e) => {
            if (e.target === expModal) closeExpModal();
        });
    }

    // Booking actions
    if (expPrimaryBtn) {
        expPrimaryBtn.addEventListener('click', () => {
            closeExpModal();
            
            if (currentExpCategory === 'dining') {
                // Bridge to dining reservation modal
                setTimeout(() => {
                    if (typeof window.openLuxuryDiningModal === 'function') {
                        window.openLuxuryDiningModal();
                    }
                }, 350);
            } else {
                // Success toasts for other categories
                let successMessage = '';
                switch (currentExpCategory) {
                    case 'spa':
                        successMessage = 'Spa Appointment Booked Successfully! A concierge agent will contact you to coordinate the exact time.';
                        break;
                    case 'pool':
                        successMessage = 'Private Cabana Reserved! Your poolside attendant will have it prepared for you.';
                        break;
                    case 'fitness':
                        successMessage = 'Personal Trainer Session Scheduled! We will contact you to confirm your trainer profile.';
                        break;
                    case 'transfers':
                        successMessage = 'Airport Pickup Scheduled! Our driver will coordinate with your arrival details.';
                        break;
                    case 'tours':
                        successMessage = 'Curated Tour Booked! A private tour guide will contact you shortly.';
                        break;
                }
                
                setTimeout(() => {
                    showExperiencesToast(successMessage);
                }, 350);
            }
        });
    }

    // Shared experiences success toast
    function showExperiencesToast(message) {
        const existing = document.getElementById('experiencesSuccessToast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = 'experiencesSuccessToast';
        toast.style.cssText = 'position:fixed; bottom:30px; left:50%; transform:translateX(-50%); background:var(--forest); color:#fff; padding:16px 28px; border-radius:12px; font-size:14px; font-family:var(--font-body); z-index:9999; box-shadow:0 8px 32px rgba(0,0,0,0.3); display:flex; align-items:center; gap:12px; animation:slideUpToast 0.4s ease; max-width: 90%; text-align: center;';
        toast.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0ABFAC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>' + message;
        document.body.appendChild(toast);

        if (!document.getElementById('toastAnimStyle')) {
            const style = document.createElement('style');
            style.id = 'toastAnimStyle';
            style.textContent = '@keyframes slideUpToast { from { opacity:0; transform:translateX(-50%) translateY(20px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }';
            document.head.appendChild(style);
        }

        setTimeout(() => { toast.remove(); }, 5000);
    }

    /* ==========================================
       AI Event Concierge Logic
       ========================================== */
    window.planEvent = function(type) {
        console.log('Plan My Event button clicked:', type);

        // Auth guard — show sign-in popup if not logged in
        if (typeof window.isLoggedIn === 'function' && !window.isLoggedIn()) {
            if (typeof window.showAuthModal === 'function') {
                window.showAuthModal({ type: 'dashboard' });
            } else {
                localStorage.setItem('intendedAction', JSON.stringify({ type: 'dashboard' }));
                window.location.href = 'login.html';
            }
            return;
        }

        const section = document.getElementById('aiEventConcierge');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
            
            // Highlight the AI Event Concierge card in gold
            section.style.transition = 'all 0.5s ease';
            section.style.boxShadow = '0 0 35px rgba(212, 175, 55, 0.7)';
            section.style.borderColor = 'var(--gold)';
            setTimeout(() => {
                section.style.boxShadow = '';
                section.style.borderColor = '';
            }, 3000);
        }
        
        // Auto-select type
        const typeSelect = document.getElementById('aiEventType');
        if (typeSelect) {
            typeSelect.value = type;
        }
        
        // Auto-fill recommended guest range starting value
        const guestInput = document.getElementById('aiGuestCount');
        if (guestInput) {
            let defaultGuests = '50';
            if (type === 'birthday') defaultGuests = '50';
            else if (type === 'corporate') defaultGuests = '150';
            else if (type === 'wedding') defaultGuests = '200';
            else if (type === 'vip') defaultGuests = '25';
            guestInput.value = defaultGuests;
        }

        // Auto-fill recommended budget range
        const budgetInput = document.getElementById('aiBudget');
        if (budgetInput) {
            let defaultBudget = 'standard';
            if (type === 'birthday') defaultBudget = 'standard';
            else if (type === 'corporate') defaultBudget = 'premium';
            else if (type === 'wedding') defaultBudget = 'luxury';
            else if (type === 'vip') defaultBudget = 'luxury';
            budgetInput.value = defaultBudget;
        }

        // Show banner/alert notification inside the Concierge card
        const promoMsg = document.getElementById('aiConciergePromoMsg');
        if (promoMsg) {
            let eventName = 'Birthday Celebration';
            if (type === 'corporate') eventName = 'Corporate Event';
            else if (type === 'wedding') eventName = 'Wedding Package';
            else if (type === 'vip') eventName = 'VIP Gathering';
            
            promoMsg.innerHTML = `<i data-lucide="sparkles" style="width: 14px; height: 14px; display: inline-block; vertical-align: middle; margin-right: 6px;"></i> <strong>${eventName}</strong> selected. Complete the form below to receive a personalized proposal.`;
            promoMsg.style.display = 'block';
            
            if (window.lucide) {
                window.lucide.createIcons();
            }
        }
        
        // Focus the first empty field (Preferred Date) and open Flatpickr calendar
        const dateInput = document.getElementById('aiEventDate');
        if (dateInput) {
            setTimeout(() => {
                if (dateInput._flatpickr) {
                    dateInput._flatpickr.open();
                } else {
                    dateInput.focus();
                }
            }, 800);
        }
    };

    window.getAIRecommendation = function() {
        console.log('Generating AI event recommendation...');
        const eventType = document.getElementById('aiEventType').value;
        const guestCountVal = document.getElementById('aiGuestCount').value;
        const budgetRange = document.getElementById('aiBudget').value;
        const eventDate = document.getElementById('aiEventDate').value;
        const errDiv = document.getElementById('aiConciergeError');

        if (!eventType || !guestCountVal || !budgetRange || !eventDate) {
            if (errDiv) errDiv.style.display = 'block';
            return;
        }
        if (errDiv) errDiv.style.display = 'none';

        const guests = parseInt(guestCountVal, 10);
        
        // Determine recommended venue
        let venue = '';
        let packageName = '';
        let highlights = '';
        let baseRate = 30;
        let venueFee = 500;

        switch (eventType) {
            case 'birthday':
                venue = guests < 50 ? 'Ocean View Sunset Terrace' : 'Grand Celebration Hall';
                packageName = 'Milestone Celebration Package';
                highlights = 'Custom decoration, gourmet catering, professional photography, sound system, and a dedicated event coordinator.';
                baseRate = 30;
                venueFee = 500;
                break;
            case 'corporate':
                venue = guests < 100 ? 'Coastal Executive Boardroom' : 'Oceanic Conference Center';
                packageName = 'Executive Summit Package';
                highlights = 'High-speed secure Wi-Fi, state-of-the-art AV equipment, premium catering, refreshment bar, and technical assistance.';
                baseRate = 60;
                venueFee = 1500;
                break;
            case 'wedding':
                venue = guests < 150 ? 'Seaside Glass Pavilion' : 'Emerald Garden Lawn & Ballroom';
                packageName = 'Imperial Oceanfront Wedding Package';
                highlights = 'Stunning floral setups, 5-course gourmet reception, bridal suite, live band setup, champagne tower, and wedding planner.';
                baseRate = 120;
                venueFee = 4000;
                break;
            case 'vip':
                venue = guests < 25 ? 'Presidential Penthouse Lounge' : 'Private Beachfront Cabana Club';
                packageName = 'Elite Prestige Soirée';
                highlights = 'Ultraprivate VIP lounge, caviar & champagne reception, personal butler service, live jazz performance, and premium security.';
                baseRate = 180;
                venueFee = 2500;
                break;
        }

        // Budget multiplier
        let budgetMultiplier = 1.0;
        switch (budgetRange) {
            case 'economy': budgetMultiplier = 0.8; break;
            case 'standard': budgetMultiplier = 1.0; break;
            case 'premium': budgetMultiplier = 1.4; break;
            case 'luxury': budgetMultiplier = 2.0; break;
        }

        // Calculate Cost
        const estimatedCost = Math.round((guests * baseRate * budgetMultiplier) + venueFee);

        // Format Date
        const formattedDate = new Date(eventDate).toLocaleDateString(undefined, { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
        });

        // Set content
        document.getElementById('recVenue').innerText = venue;
        document.getElementById('recCost').innerText = `$${estimatedCost.toLocaleString()}`;
        document.getElementById('recPackage').innerText = `${packageName} (${budgetRange.toUpperCase()})`;
        document.getElementById('recAvailability').innerText = `Available on ${formattedDate}`;
        document.getElementById('recHighlights').innerText = highlights;

        // Set event date in lead form
        document.getElementById('recLeadDate').value = eventDate;

        // Open recommendation modal
        const modal = document.getElementById('eventRecModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Re-render Lucide icons
            if (window.lucide) {
                window.lucide.createIcons();
            }
        }
    };

    window.closeRecModal = function() {
        const modal = document.getElementById('eventRecModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // Reset states
        setTimeout(() => {
            document.getElementById('recModalMainState').style.display = 'block';
            document.getElementById('recSuccessState').style.display = 'none';
        }, 300);
    };

    window.submitEventInquiry = function(e) {
        e.preventDefault();
        console.log('Submitting event inquiry lead capture form...');
        
        const name = document.getElementById('recLeadName').value;
        const email = document.getElementById('recLeadEmail').value;
        const phone = document.getElementById('recLeadPhone').value;
        const date = document.getElementById('recLeadDate').value;
        const venue = document.getElementById('recVenue').innerText;
        const cost = document.getElementById('recCost').innerText;
        const packageTier = document.getElementById('recPackage').innerText;

        const inquiry = {
            id: 'EVQ-' + Math.floor(100000 + Math.random() * 900000),
            name,
            email,
            phone,
            date,
            venue,
            cost,
            packageTier,
            createdAt: new Date().toISOString()
        };

        // Save to localStorage dedicated eventInquiries array
        let eventInquiries = JSON.parse(localStorage.getItem('eventInquiries') || '[]');
        eventInquiries.push(inquiry);
        localStorage.setItem('eventInquiries', JSON.stringify(eventInquiries));

        // Switch to success view
        document.getElementById('recModalMainState').style.display = 'none';
        document.getElementById('recSuccessState').style.display = 'block';
        
        if (window.lucide) {
            window.lucide.createIcons();
        }
    };

    // Close button click listener
    const closeRecModalBtn = document.getElementById('closeRecModalBtn');
    if (closeRecModalBtn) {
        closeRecModalBtn.addEventListener('click', window.closeRecModal);
    }
    
    // Close on overlay click
    const recModalOverlay = document.getElementById('eventRecModal');
    if (recModalOverlay) {
        recModalOverlay.addEventListener('click', (e) => {
            if (e.target === recModalOverlay) {
                window.closeRecModal();
            }
        });
    }

    // Auto-scroll and pre-select event type if ?plan=[type] query parameter exists
    const urlParams = new URLSearchParams(window.location.search);
    const planParam = urlParams.get('plan');
    if (planParam) {
        setTimeout(() => {
            if (typeof window.planEvent === 'function') {
                window.planEvent(planParam);
            }
        }, 800);
    }
});

// Global function to book a package directly from the homepage and redirect to checkout
window.bookPackageDirectly = function(packageId) {
    const packagesData = [
        {
            id: "honeymoon",
            name: "Honeymoon Escape",
            price: 1200,
            image: "https://media.base44.com/images/public/6a350ca615156d469eb82de4/ebee99b38_generated_650bb2f1.png",
            maxGuests: 2,
            defaultNights: 3
        },
        {
            id: "family",
            name: "Family Getaway",
            price: 1500,
            image: "https://media.base44.com/images/public/6a350ca615156d469eb82de4/0da436efd_generated_8210ef4a.png",
            maxGuests: 5,
            defaultNights: 3
        },
        {
            id: "wellness",
            name: "Wellness & Spa Retreat",
            price: 850,
            image: "https://media.base44.com/images/public/6a350ca615156d469eb82de4/7e62d3cf8_generated_caebfb4c.png",
            maxGuests: 2,
            defaultNights: 2
        },
        {
            id: "corporate",
            name: "Corporate Executive",
            price: 1100,
            image: "https://media.base44.com/images/public/6a350ca615156d469eb82de4/b02b09e51_generated_f6873443.png",
            maxGuests: 2,
            defaultNights: 3
        },
        {
            id: "presidential",
            name: "Presidential Experience",
            price: 3500,
            image: "https://media.base44.com/images/public/6a350ca615156d469eb82de4/5652f2763_generated_68e877e7.png",
            maxGuests: 6,
            defaultNights: 4
        }
    ];

    const pkg = packagesData.find(p => p.id === packageId);
    if (!pkg) {
        console.error('Package not found:', packageId);
        window.location.href = 'checkout.html';
        return;
    }

    // Set checkin/checkout dates
    const today = new Date();
    const checkin = new Date(today);
    checkin.setDate(today.getDate() + 1); // Tomorrow
    const checkout = new Date(checkin);
    checkout.setDate(checkin.getDate() + pkg.defaultNights);

    const formatDate = (d) => {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const checkinVal = formatDate(checkin);
    const checkoutVal = formatDate(checkout);
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
        nights: pkg.defaultNights,
        guests: Math.min(2, pkg.maxGuests),
        roomTotal: basePrice,
        taxes: taxes,
        addons: [],
        addonsTotal: 0,
        promoCode: null,
        promoDiscount: 0,
        grandTotal: grandTotal
    };

    localStorage.setItem('bookingData', JSON.stringify(bookingData));

    // Auth guard — show sign-in popup if not logged in
    if (typeof window.isLoggedIn === 'function' && !window.isLoggedIn() && localStorage.getItem('guestCheckout') !== 'true') {
        if (typeof window.showAuthModal === 'function') {
            window.showAuthModal({ type: 'reserve-room', data: bookingData });
        } else {
            localStorage.setItem('intendedAction', JSON.stringify({ type: 'reserve-room', data: bookingData }));
            window.location.href = 'login.html';
        }
        return;
    }

    window.location.href = 'checkout.html';
};

// Homepage Search Bar Validation & Redirection
document.addEventListener('DOMContentLoaded', () => {
    const homeSearchBtn = document.getElementById('homeSearchBtn');
    if (homeSearchBtn) {
        homeSearchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const checkinVal = document.getElementById('homeCheckin').value;
            const checkoutVal = document.getElementById('homeCheckout').value;
            
            // 1. Validate Check-In & Check-Out selected
            if (!checkinVal && !checkoutVal) {
                showLuxuryToast("Please select Check-In and Check-Out dates.", "error");
                return;
            }
            if (!checkinVal) {
                showLuxuryToast("Please select Check-In date.", "error");
                return;
            }
            if (!checkoutVal) {
                showLuxuryToast("Please select Check-Out date.", "error");
                return;
            }
            
            // 2. Validate Check-Out > Check-In
            const checkinDate = new Date(checkinVal);
            const checkoutDate = new Date(checkoutVal);
            if (checkoutDate <= checkinDate) {
                showLuxuryToast("Check-Out date must be after Check-In.", "error");
                return;
            }
            
            // 3. Get Guests Count
            const guestsSelect = document.querySelector('#homeGuestsSelect .custom-option.selected');
            const guestsText = guestsSelect ? guestsSelect.getAttribute('data-value') : '2 Guests';
            const guestsCount = guestsText.replace(/[^0-9]/g, '') || '2';
            
            // 4. Get Room Type
            const roomTypeSelect = document.querySelector('#homeRoomTypeSelect .custom-option.selected');
            const roomTypeVal = roomTypeSelect ? roomTypeSelect.getAttribute('data-value') : 'Any Room';
            
            // 5. Redirect on success
            window.location.href = `search-results.html?checkin=${checkinVal}&checkout=${checkoutVal}&guests=${guestsCount}&roomType=${encodeURIComponent(roomTypeVal)}`;
        });
    }
});

// Luxury toast notification helper
function showLuxuryToast(message, type = 'info') {
    let toast = document.querySelector('.toast-notification');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast-notification';
        document.body.appendChild(toast);
    }
    
    let iconName = 'info';
    if (type === 'error') iconName = 'alert-circle';
    if (type === 'success') iconName = 'check-circle';
    
    toast.innerHTML = `<i data-lucide="${iconName}"></i> <span>${message}</span>`;
    if (window.lucide) {
        lucide.createIcons();
    }
    
    toast.classList.add('show');
    clearTimeout(toast.timeoutId);
    toast.timeoutId = setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}





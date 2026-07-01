/**
 * wine.js — Flex-Stays Wine & Spirits Collection
 * Full logic: rendering, filtering, search, AI sommelier, modal, toast
 */

'use strict';

// ============================================================
// STATE
// ============================================================
let currentFilter = 'all';
let currentSort   = 'default';
let currentSearch = '';
let currentModal  = null;

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    renderAll();
    attachEvents();
    // Navbar scroll behaviour
    const nav = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
    });
});

// ============================================================
// RENDER
// ============================================================
function renderAll() {
    const filtered = getFiltered();
    const groups   = { red: [], white: [], vodka: [] };

    filtered.forEach(item => {
        if (groups[item.category]) groups[item.category].push(item);
    });

    renderGroup('red',   groups.red);
    renderGroup('white', groups.white);
    renderGroup('vodka', groups.vodka);

    // Count badge
    const total = filtered.length;
    document.getElementById('wineCount').textContent = `${total} bottle${total !== 1 ? 's' : ''}`;

    // Empty state
    const empty = document.getElementById('emptyState');
    const hasAny = total > 0;
    empty.classList.toggle('show', !hasAny);

    // Show/hide section groups
    ['red', 'white', 'vodka'].forEach(cat => {
        const group = document.getElementById(`group-${cat}`);
        if (group) group.style.display = groups[cat].length > 0 ? '' : 'none';
    });

    lucide.createIcons();
}

function renderGroup(category, items) {
    const grid  = document.getElementById(`grid-${category}`);
    const count = document.getElementById(`count-${category}`);
    if (!grid) return;

    count.textContent = `(${items.length})`;
    grid.innerHTML = '';

    if (items.length === 0) return;

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'wine-card';
        card.setAttribute('data-id', item.id);
        card.innerHTML = buildCard(item);
        card.addEventListener('click', (e) => {
            if (e.target.closest('button')) return;
            openModal(item);
        });
        grid.appendChild(card);
    });
}

function buildCard(item) {
    const badgeClass  = `badge-${item.category}`;
    const labelMap    = { red: 'Red Wine', white: 'White Wine', vodka: item.type || 'Spirits & Vodka' };
    const availLabel  = item.availability === 'available' ? 'In Stock' :
                        item.availability === 'limited'   ? 'Limited' : 'Out of Stock';
    const dotClass    = item.availability === 'available' ? 'dot-available' :
                        item.availability === 'limited'   ? 'dot-limited' : 'dot-unavailable';

    const premiumBadge = item.tags.includes('chef-pick') ? `<div class="wine-badge-tag">Chef's Pick</div>` :
                         item.tags.includes('bestseller') ? `<div class="wine-badge-tag">Bestseller</div>` :
                         item.tags.includes('limited')   ? `<div class="wine-badge-tag" style="background:rgba(239,68,68,0.9);color:#fff;">Limited</div>` : '';

    const pairingsHtml = item.pairings.slice(0, 3).map(p =>
        `<span class="pairing-chip">${p}</span>`).join('');

    const stars = '★'.repeat(Math.floor(item.rating)) + (item.rating % 1 >= 0.5 ? '½' : '');

    return `
        <div class="wine-img-wrap">
            <img src="${item.image}" alt="${item.name}"
                 onerror="this.src='https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80'">
            <span class="wine-category-badge ${badgeClass}">${labelMap[item.category]}</span>
            ${premiumBadge}
            <div class="availability-dot">
                <span class="${dotClass}"></span>${availLabel}
            </div>
        </div>
        <div class="wine-body">
            <div class="wine-brand">${item.flag} ${item.brand}</div>
            <div class="wine-name">${item.name}</div>
            <div class="wine-meta">
                <span class="wine-meta-pill">
                    <i data-lucide="map-pin"></i>${item.origin}
                </span>
                <span class="wine-meta-pill">
                    <i data-lucide="droplets"></i>${item.alcohol}
                </span>
                <span class="wine-meta-pill">
                    <i data-lucide="package"></i>${item.bottleSize}
                </span>
                ${item.vintage ? `<span class="wine-meta-pill"><i data-lucide="calendar"></i>${item.vintage}</span>` : ''}
            </div>
            <p class="wine-desc">${item.description.substring(0, 90)}${item.description.length > 90 ? '…' : ''}</p>
            <div class="pairings-row">${pairingsHtml}</div>
            <div class="wine-footer">
                <div class="wine-price"><sup>₹</sup>${item.price.toLocaleString('en-IN')}</div>
                <div class="wine-rating">
                    <span class="star">★</span>
                    <strong style="color:#0f172a;">${item.rating}</strong>
                    <span>(${item.reviews})</span>
                </div>
            </div>
            <div class="btn-row">
                <button class="btn-reserve" onclick="event.stopPropagation(); reserveBottle('${item.id}')">
                    <i data-lucide="calendar" style="width:13px;height:13px;"></i>
                    Reserve Bottle
                </button>
                <button class="btn-add-dining" title="Add to Dining Reservation"
                    onclick="event.stopPropagation(); addToDining('${item.id}')">
                    <i data-lucide="utensils"></i>
                </button>
            </div>
        </div>`;
}

// ============================================================
// FILTER / SEARCH / SORT
// ============================================================
function getFiltered() {
    let data = [...wineData];

    // Filter by category
    if (currentFilter !== 'all' && currentFilter !== 'premium') {
        data = data.filter(i => i.category === currentFilter);
    }
    if (currentFilter === 'premium') {
        data = data.filter(i => i.tags.includes('premium') || i.tags.includes('chef-pick'));
    }

    // Search
    if (currentSearch.trim()) {
        const q = currentSearch.toLowerCase();
        data = data.filter(i =>
            i.name.toLowerCase().includes(q) ||
            i.brand.toLowerCase().includes(q) ||
            i.origin.toLowerCase().includes(q) ||
            i.description.toLowerCase().includes(q) ||
            i.pairings.some(p => p.toLowerCase().includes(q)) ||
            (i.type && i.type.toLowerCase().includes(q))
        );
    }

    // Sort
    switch (currentSort) {
        case 'price-low':  data.sort((a, b) => a.price - b.price); break;
        case 'price-high': data.sort((a, b) => b.price - a.price); break;
        case 'rating':     data.sort((a, b) => b.rating - a.rating); break;
        case 'name':       data.sort((a, b) => a.name.localeCompare(b.name)); break;
    }

    return data;
}

function attachEvents() {
    // Search
    const searchInput = document.getElementById('wineSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value;
            renderAll();
        });
    }

    // Filter tabs
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFilter = tab.getAttribute('data-filter');
            renderAll();
            // Scroll to controls
            document.getElementById('wineControls').scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // Sort
    const sortSelect = document.getElementById('wineSort');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            renderAll();
        });
    }
}

// ============================================================
// MODAL
// ============================================================
function openModal(item) {
    currentModal = item;

    document.getElementById('modalImg').src    = item.image;
    document.getElementById('modalImg').onerror = function() {
        this.src = 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=700&q=80';
    };
    document.getElementById('modalBrand').textContent = `${item.flag} ${item.brand}`;
    document.getElementById('modalName').textContent  = item.name;
    document.getElementById('modalDesc').textContent  = item.description;

    document.getElementById('modalSpecs').innerHTML = `
        <div class="modal-spec">
            <div class="modal-spec-icon"><i data-lucide="map-pin" style="width:18px;height:18px;color:#d4af37;"></i></div>
            <span class="modal-spec-val">${item.origin}</span>
            <span class="modal-spec-lbl">Origin</span>
        </div>
        <div class="modal-spec">
            <div class="modal-spec-icon"><i data-lucide="droplets" style="width:18px;height:18px;color:#d4af37;"></i></div>
            <span class="modal-spec-val">${item.alcohol}</span>
            <span class="modal-spec-lbl">Alcohol</span>
        </div>
        <div class="modal-spec">
            <div class="modal-spec-icon"><i data-lucide="package" style="width:18px;height:18px;color:#d4af37;"></i></div>
            <span class="modal-spec-val">${item.bottleSize}</span>
            <span class="modal-spec-lbl">Bottle Size</span>
        </div>
        ${item.vintage ? `
        <div class="modal-spec">
            <div class="modal-spec-icon"><i data-lucide="calendar" style="width:18px;height:18px;color:#d4af37;"></i></div>
            <span class="modal-spec-val">${item.vintage}</span>
            <span class="modal-spec-lbl">Vintage</span>
        </div>` : ''}
        <div class="modal-spec">
            <div class="modal-spec-icon"><i data-lucide="star" style="width:18px;height:18px;color:#d4af37;"></i></div>
            <span class="modal-spec-val">${item.rating} ★</span>
            <span class="modal-spec-lbl">${item.reviews} Reviews</span>
        </div>
        <div class="modal-spec">
            <div class="modal-spec-icon"><i data-lucide="indian-rupee" style="width:18px;height:18px;color:#d4af37;"></i></div>
            <span class="modal-spec-val">₹${item.price.toLocaleString('en-IN')}</span>
            <span class="modal-spec-lbl">Per Bottle</span>
        </div>`;

    document.getElementById('modalPairings').innerHTML =
        item.pairings.map(p => `<span class="modal-pairing">${p}</span>`).join('');

    document.getElementById('modalReserveBtn').onclick = () => reserveBottle(item.id);
    document.getElementById('modalDiningBtn').onclick  = () => addToDining(item.id);

    document.getElementById('wineModal').classList.add('open');
    lucide.createIcons();
}

function closeModal(e) {
    if (e.target === document.getElementById('wineModal')) {
        document.getElementById('wineModal').classList.remove('open');
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') document.getElementById('wineModal').classList.remove('open');
});

// ============================================================
// ACTIONS
// ============================================================
function reserveBottle(id) {
    const item = wineData.find(w => w.id === id);
    if (!item) return;

    // Save to localStorage
    const reservations = JSON.parse(localStorage.getItem('wineReservations') || '[]');
    reservations.push({
        id: item.id,
        name: item.name,
        brand: item.brand,
        price: item.price,
        reservedAt: new Date().toISOString()
    });
    localStorage.setItem('wineReservations', JSON.stringify(reservations));

    showToast(`🍾 <strong>${item.name}</strong> bottle reserved!`);
    document.getElementById('wineModal').classList.remove('open');
}

function addToDining(id) {
    const item = wineData.find(w => w.id === id);
    if (!item) return;

    const diningAddons = JSON.parse(localStorage.getItem('diningAddons') || '[]');
    diningAddons.push({
        id: item.id,
        name: item.name,
        brand: item.brand,
        price: item.price,
        type: 'wine',
        addedAt: new Date().toISOString()
    });
    localStorage.setItem('diningAddons', JSON.stringify(diningAddons));

    showToast(`🍽️ <strong>${item.name}</strong> added to dining reservation!`);
    document.getElementById('wineModal').classList.remove('open');
}

// ============================================================
// TOAST
// ============================================================
function showToast(msg) {
    const toast = document.getElementById('wineToast');
    document.getElementById('wineToastMsg').innerHTML = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
}

// ============================================================
// AI SOMMELIER CHAT
// ============================================================
const sommelierKnowledge = [
    {
        keys: ['steak', 'grill', 'bbq', 'beef', 'meat', 'tomahawk', 'wagyu'],
        wines: ['wine-001', 'wine-004', 'wine-007', 'wine-008'],
        reply: '🥩 For <strong>steak & grills</strong>, I recommend a bold red. Our <strong>Cabernet Sauvignon</strong> and <strong>Shiraz</strong> are classic matches — the tannins cut through the fat beautifully. For Indian cuisine, try the <strong>Grover La Réserve</strong>.'
    },
    {
        keys: ['seafood', 'fish', 'lobster', 'prawn', 'scallop', 'salmon', 'cod'],
        wines: ['wine-009', 'wine-010', 'wine-014', 'wine-015'],
        reply: '🦞 <strong>Seafood</strong> pairs beautifully with crisp whites. I\'d suggest our <strong>Sauvignon Blanc</strong> (New Zealand) for its zesty citrus profile, or the <strong>Sula Chenin Blanc</strong> — India\'s finest white wine that complements coastal flavours perfectly.'
    },
    {
        keys: ['pasta', 'italian', 'risotto', 'ravioli', 'truffle'],
        wines: ['wine-009', 'wine-012', 'wine-013', 'wine-006'],
        reply: '🍝 For <strong>Italian dishes</strong>, our <strong>Chardonnay</strong> is outstanding with creamy pasta and risotto. The <strong>Pinot Grigio</strong> is a lighter option that won\'t overpower delicate sauces.'
    },
    {
        keys: ['romantic', 'date', 'anniversary', 'couple', 'evening', 'dinner'],
        wines: ['wine-003', 'wine-009', 'wine-001'],
        reply: '🕯️ For a <strong>romantic evening</strong>, nothing compares to our <strong>Pinot Noir</strong> — elegant, mysterious, and deeply aromatic. Pair it with our Truffle Risotto. If you prefer white, the buttery <strong>Chardonnay</strong> sets a magical mood.'
    },
    {
        keys: ['party', 'nightlife', 'lounge', 'cocktail', 'drinks', 'club', 'night'],
        wines: ['spirit-002', 'spirit-006', 'spirit-007', 'spirit-003'],
        reply: '🎉 For <strong>lounge & nightlife</strong>, our <strong>Magic Moments Verve</strong> is the star — ultra-smooth for premium cocktails. Try the <strong>Raspberry</strong> and <strong>Chocolate</strong> flavours for signature mixes that will impress any crowd.'
    },
    {
        keys: ['indian', 'india', 'local', 'domestic', 'sula', 'grover', 'fratelli'],
        wines: ['wine-006', 'wine-007', 'wine-008', 'wine-014', 'wine-015'],
        reply: '🇮🇳 India\'s wine scene is thriving! Our top picks: <strong>Fratelli Sette</strong> (limited edition, bold Italian-Indian blend), <strong>Grover La Réserve</strong> (award-winning, French oak aged), and <strong>Sula Chenin Blanc</strong> — the nation\'s favourite white.'
    },
    {
        keys: ['dessert', 'sweet', 'chocolate', 'cake', 'souffle'],
        wines: ['spirit-007', 'wine-011', 'wine-013'],
        reply: '🍫 For <strong>desserts</strong>, our <strong>Magic Moments Chocolate Vodka</strong> is spectacular — try it in a chocolate martini. The German <strong>Riesling</strong> with its natural sweetness is also divine with fruit-based desserts.'
    },
    {
        keys: ['cheap', 'affordable', 'budget', 'value', 'low price', 'inexpensive'],
        wines: ['spirit-008', 'wine-006', 'wine-014', 'spirit-001'],
        reply: '💡 Great value picks from our cellar: <strong>Sula Chenin Blanc</strong> (₹1,800) and <strong>Sula Rasa</strong> (₹2,200) offer exceptional quality. The <strong>Magic Moments Original</strong> (₹1,200) is our most popular spirit.'
    },
    {
        keys: ['premium', 'luxury', 'expensive', 'best', 'finest', 'top', 'special'],
        wines: ['wine-001', 'wine-003', 'wine-008', 'wine-009'],
        reply: '⭐ Our <strong>premium selections</strong>: The <strong>Cabernet Sauvignon</strong> (₹8,500) and <strong>Pinot Noir</strong> (₹9,200) from France are our most celebrated reds. The <strong>Fratelli Sette</strong> (₹4,500) is a must-try limited edition.'
    },
    {
        keys: ['vodka', 'magic moments', 'spirit', 'shots'],
        wines: ['spirit-001', 'spirit-002', 'spirit-006', 'spirit-007'],
        reply: '🍸 Our <strong>Magic Moments</strong> collection is India\'s premium vodka line. The <strong>Verve</strong> is triple-distilled for ultra-smoothness. For flavoured options, <strong>Raspberry</strong> and <strong>Chocolate</strong> are guest favourites at our Sky Bar.'
    }
];

window.sommelierAsk = function(query) {
    query = (query || '').trim();
    if (!query) return;

    const input = document.getElementById('sommelierInput');
    if (input) input.value = '';

    const messagesEl = document.getElementById('sommelierMessages');
    if (!messagesEl) return;

    // User bubble
    const userRow = document.createElement('div');
    userRow.className = 'chat-msg-user';
    userRow.innerHTML = `<div class="user-bubble">${query}</div>`;
    messagesEl.appendChild(userRow);

    // Typing indicator
    const typing = document.createElement('div');
    typing.className = 'chat-msg-bot';
    typing.id = 'som-typing';
    typing.innerHTML = `
        <div class="som-mini-avatar">
            <i data-lucide="bot" style="width:14px;height:14px;color:#000;"></i>
        </div>
        <div class="bot-bubble" style="display:flex;gap:5px;align-items:center;">
            <span style="width:6px;height:6px;border-radius:50%;background:#d4af37;display:inline-block;animation:somDot 1.2s infinite 0s;"></span>
            <span style="width:6px;height:6px;border-radius:50%;background:#d4af37;display:inline-block;animation:somDot 1.2s infinite 0.3s;"></span>
            <span style="width:6px;height:6px;border-radius:50%;background:#d4af37;display:inline-block;animation:somDot 1.2s infinite 0.6s;"></span>
        </div>`;
    messagesEl.appendChild(typing);
    lucide.createIcons();
    messagesEl.scrollTop = messagesEl.scrollHeight;

    setTimeout(() => {
        const typingEl = document.getElementById('som-typing');
        if (typingEl) typingEl.remove();

        const q = query.toLowerCase();
        let matched = null;

        for (const rule of sommelierKnowledge) {
            if (rule.keys.some(k => q.includes(k))) {
                matched = rule;
                break;
            }
        }

        let botHtml = '';
        if (matched) {
            const bottles = matched.wines
                .map(id => wineData.find(w => w.id === id))
                .filter(Boolean).slice(0, 3);

            const bottleCards = bottles.map(b => `
                <div onclick="openModal(wineData.find(w=>w.id==='${b.id}'))" style="display:flex;align-items:center;gap:8px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:8px;padding:7px 10px;cursor:pointer;margin-top:5px;transition:background 0.2s;"
                     onmouseover="this.style.background='rgba(212,175,55,0.08)'" onmouseout="this.style.background='rgba(255,255,255,0.04)'">
                    <img src="${b.image}" onerror="this.style.display='none'" style="width:36px;height:36px;border-radius:6px;object-fit:cover;flex-shrink:0;">
                    <div>
                        <div style="font-size:11px;font-weight:700;color:#fff;">${b.name}</div>
                        <div style="font-size:10px;color:rgba(255,255,255,0.45);">${b.brand} · ₹${b.price.toLocaleString('en-IN')}</div>
                    </div>
                </div>`).join('');

            botHtml = `${matched.reply}${bottleCards}<div style="margin-top:8px;font-size:11px;color:rgba(255,255,255,0.35);">Click any bottle to see details &amp; reserve →</div>`;
        } else {
            botHtml = `I didn't catch a specific request, but our <strong>Chef's Picks</strong> are always a safe bet — the <strong>Grover La Réserve</strong> (red) and <strong>Sula Chenin Blanc</strong> (white) are beloved by our guests. Ask me about a specific pairing or mood!`;
        }

        const botRow = document.createElement('div');
        botRow.className = 'chat-msg-bot';
        botRow.innerHTML = `
            <div class="som-mini-avatar">
                <i data-lucide="bot" style="width:14px;height:14px;color:#000;"></i>
            </div>
            <div class="bot-bubble">${botHtml}</div>`;
        messagesEl.appendChild(botRow);
        lucide.createIcons();
        messagesEl.scrollTop = messagesEl.scrollHeight;

    }, 900);
};

// Make openModal globally available (called from sommelier inline onclick)
window.openModal = openModal;

// Flex-Stays AI Concierge Chatbot - Phase 2 Enterprise Edition
// Self-contained dynamic widget connected to Spring Boot REST API

(function() {
    // 1. Inject Styles
    const style = document.createElement('style');
    style.id = 'ai-concierge-styles';
    style.textContent = `
        /* Launcher Widget */
        .ai-launcher {
            position: fixed;
            bottom: 24px;
            right: 24px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #062f2f 0%, #0ABFAC 100%);
            border: 2px solid #d4af37;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            cursor: pointer;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .ai-launcher:hover {
            transform: scale(1.08) translateY(-2px);
            box-shadow: 0 12px 40px rgba(212,175,55,0.4);
        }
        .ai-launcher i {
            color: #d4af37;
            width: 28px;
            height: 28px;
        }
        .ai-pulse-dot {
            position: absolute;
            bottom: 2px;
            right: 2px;
            width: 12px;
            height: 12px;
            background-color: #0ABFAC;
            border-radius: 50%;
            border: 2px solid #062f2f;
            box-shadow: 0 0 0 0 rgba(10, 191, 172, 0.7);
            animation: pulse-teal 2s infinite;
        }
        @keyframes pulse-teal {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(10, 191, 172, 0.7); }
            70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(10, 191, 172, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(10, 191, 172, 0); }
        }
        .ai-badge {
            position: absolute;
            top: -5px;
            left: -5px;
            background: #d4af37;
            color: #0d2a2a;
            font-size: 11px;
            font-weight: 700;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid #0d2a2a;
            animation: bounce-badge 2s infinite;
        }
        @keyframes bounce-badge {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-4px); }
            60% { transform: translateY(-2px); }
        }

        /* Chat Window Container */
        .ai-window {
            position: fixed;
            bottom: 96px;
            right: 24px;
            width: 390px;
            height: 540px;
            border-radius: 16px;
            background: rgba(5, 30, 30, 0.95);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(212,175,55,0.45);
            box-shadow: 0 20px 50px rgba(0,0,0,0.5);
            z-index: 9998;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            opacity: 0;
            transform: scale(0.9) translateY(20px);
            pointer-events: none;
            transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
        }
        .ai-window.open {
            opacity: 1;
            transform: scale(1) translateY(0);
            pointer-events: auto;
        }

        /* Chat Header */
        .ai-header {
            padding: 16px;
            background: linear-gradient(90deg, #051a1a 0%, #092e2e 100%);
            border-bottom: 1px solid rgba(212,175,55,0.25);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .ai-header-info {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .ai-header-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(212, 175, 55, 0.1);
            border: 1.5px solid #d4af37;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }
        .ai-header-avatar i {
            color: #d4af37;
            width: 20px;
            height: 20px;
        }
        .ai-online-indicator {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 10px;
            height: 10px;
            background: #0ABFAC;
            border-radius: 50%;
            border: 1.5px solid #051a1a;
        }
        .ai-header-title h4 {
            color: #fff;
            margin: 0;
            font-size: 15px;
            font-weight: 600;
        }
        .ai-header-title span {
            color: rgba(255,255,255,0.5);
            font-size: 11px;
        }
        .ai-header-controls {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .ai-header-btn {
            background: transparent;
            border: none;
            color: rgba(255,255,255,0.6);
            cursor: pointer;
            padding: 6px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }
        .ai-header-btn:hover {
            color: #d4af37;
            background: rgba(255,255,255,0.05);
        }

        /* Chat Body */
        .ai-body {
            flex: 1;
            padding: 16px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 16px;
            scroll-behavior: smooth;
        }

        /* Message Bubbles */
        .ai-message {
            max-width: 80%;
            padding: 12px 16px;
            border-radius: 14px;
            font-size: 13.5px;
            line-height: 1.5;
            position: relative;
            animation: fadeInMsg 0.3s ease;
        }
        @keyframes fadeInMsg {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .bot-msg {
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: #f3f4f6;
            align-self: flex-start;
            border-top-left-radius: 2px;
        }
        .user-msg {
            background: linear-gradient(135deg, #0d3a3a 0%, #061c1c 100%);
            border: 1px solid rgba(10, 191, 172, 0.3);
            color: #fff;
            align-self: flex-end;
            border-top-right-radius: 2px;
        }
        .ai-msg-time {
            font-size: 9px;
            color: rgba(255,255,255,0.4);
            margin-top: 4px;
            text-align: right;
            display: block;
        }

        /* Chips / Suggested Prompts */
        .ai-chips-container {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 8px;
            animation: fadeInMsg 0.3s ease;
        }
        .ai-chip {
            background: rgba(10, 191, 172, 0.08);
            border: 1px solid rgba(10, 191, 172, 0.3);
            color: #0ABFAC;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .ai-chip:hover {
            background: #0ABFAC;
            color: #051e1e;
            transform: translateY(-1px);
        }

        /* Carousels & Dynamic Cards */
        .ai-carousel {
            display: flex;
            overflow-x: auto;
            gap: 12px;
            padding-bottom: 8px;
            margin-top: 8px;
            scroll-snap-type: x mandatory;
            scrollbar-width: thin;
        }
        .ai-rich-card {
            flex: 0 0 260px;
            background: rgba(10, 46, 43, 0.85);
            border: 1.5px solid #d4af37;
            border-radius: 12px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            scroll-snap-align: start;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            transition: all 0.2s;
        }
        .ai-rich-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(212,175,55,0.25);
        }
        .ai-rich-img {
            width: 100%;
            height: 120px;
            object-fit: cover;
            border-bottom: 1px solid rgba(212,175,55,0.25);
        }
        .ai-rich-body {
            padding: 12px;
            display: flex;
            flex-direction: column;
            gap: 6px;
        }
        .ai-rich-subtitle {
            font-size: 10px;
            color: #d4af37;
            font-weight: 700;
            text-transform: uppercase;
        }
        .ai-rich-title {
            font-size: 14px;
            color: #fff;
            font-weight: 700;
        }
        .ai-rich-price {
            font-size: 13px;
            color: #0ABFAC;
            font-weight: 600;
        }
        .ai-rich-desc {
            font-size: 11px;
            color: rgba(255,255,255,0.7);
            line-height: 1.4;
            margin: 4px 0;
        }
        .ai-rich-meta {
            font-size: 11px;
            color: rgba(255,255,255,0.55);
        }
        .ai-rich-actions {
            display: flex;
            gap: 8px;
            margin-top: 8px;
        }
        .ai-rich-btn {
            flex: 1;
            padding: 8px;
            font-size: 11px;
            font-weight: 600;
            border-radius: 6px;
            cursor: pointer;
            border: none;
            transition: all 0.2s;
            text-align: center;
        }
        .ai-rich-btn.primary {
            background: #d4af37;
            color: #0d2a2a;
        }
        .ai-rich-btn.primary:hover {
            background: #f7d050;
        }
        .ai-rich-btn.secondary {
            background: rgba(255,255,255,0.08);
            border: 1px solid rgba(255,255,255,0.2);
            color: #fff;
        }
        .ai-rich-btn.secondary:hover {
            background: rgba(255,255,255,0.15);
        }

        /* Footer Input Area */
        .ai-footer {
            padding: 12px;
            background: #051a1a;
            border-top: 1px solid rgba(255,255,255,0.08);
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .ai-input {
            flex: 1;
            background: rgba(255,255,255,0.06);
            border: 1px solid rgba(255,255,255,0.15);
            color: #fff;
            padding: 10px 14px;
            border-radius: 20px;
            font-size: 13.5px;
            outline: none;
            transition: all 0.2s;
        }
        .ai-input:focus {
            border-color: #d4af37;
            background: rgba(255,255,255,0.08);
        }
        .ai-footer-btn {
            background: rgba(212,175,55,0.1);
            border: 1px solid rgba(212,175,55,0.3);
            color: #d4af37;
            width: 38px;
            height: 38px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }
        .ai-footer-btn:hover {
            background: #d4af37;
            color: #051a1a;
            transform: scale(1.05);
        }
        .ai-footer-btn.recording {
            background: #ef4444;
            color: #fff;
            border-color: #ef4444;
            animation: pulse-recording 1.2s infinite;
        }
        @keyframes pulse-recording {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
            70% { transform: scale(1.08); box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }

        /* Typing dots animation */
        .typing-dot {
            width: 6px;
            height: 6px;
            background: rgba(255,255,255,0.6);
            border-radius: 50%;
            display: inline-block;
            animation: bounce-dot 1.4s infinite ease-in-out both;
            margin: 0 2px;
        }
        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }
        @keyframes bounce-dot {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
        }

        /* Mobile Layout Adjustments */
        @media (max-width: 480px) {
            .ai-window {
                width: calc(100% - 32px);
                height: 480px;
                bottom: 86px;
                right: 16px;
            }
            .ai-launcher {
                bottom: 16px;
                right: 16px;
            }
        }
    `;
    document.head.appendChild(style);

    // 2. Insert Chatbot HTML
    const container = document.createElement('div');
    container.id = 'ai-concierge-container';
    container.innerHTML = `
        <div class="ai-launcher" id="aiLauncher" title="Open AI Concierge">
            <i data-lucide="concierge-bell"></i>
            <div class="ai-pulse-dot"></div>
            <div class="ai-badge" id="aiBadge" style="display:none;">1</div>
        </div>
        <div class="ai-window" id="aiWindow">
            <div class="ai-header">
                <div class="ai-header-info">
                    <div class="ai-header-avatar">
                        <i data-lucide="bot"></i>
                        <div class="ai-online-indicator"></div>
                    </div>
                    <div class="ai-header-title">
                        <h4>AI Concierge</h4>
                        <span>Online • Ready to Assist</span>
                    </div>
                </div>
                <div class="ai-header-controls">
                    <button class="ai-header-btn" id="aiTtsToggleBtn" title="Unmute Voice">
                        <i data-lucide="volume-x"></i>
                    </button>
                    <button class="ai-header-btn" id="aiCloseBtn" title="Minimize">
                        <i data-lucide="x"></i>
                    </button>
                </div>
            </div>
            <div class="ai-body" id="aiChatBody">
                <!-- Message history -->
            </div>
            <div class="ai-footer">
                <button class="ai-footer-btn" id="aiMicBtn" title="Speak to Concierge">
                    <i data-lucide="mic"></i>
                </button>
                <input type="text" class="ai-input" id="aiInput" placeholder="Ask anything or speak..." autocomplete="off">
                <button class="ai-footer-btn" id="aiSendBtn" title="Send message">
                    <i data-lucide="send"></i>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    if (window.lucide) {
        lucide.createIcons();
    }

    // 3. Selection & State
    const launcher = document.getElementById('aiLauncher');
    const badge = document.getElementById('aiBadge');
    const windowEl = document.getElementById('aiWindow');
    const closeBtn = document.getElementById('aiCloseBtn');
    const sendBtn = document.getElementById('aiSendBtn');
    const micBtn = document.getElementById('aiMicBtn');
    const ttsBtn = document.getElementById('aiTtsToggleBtn');
    const inputField = document.getElementById('aiInput');
    const chatBody = document.getElementById('aiChatBody');

    let isChatOpen = false;
    let isTtsEnabled = localStorage.getItem('ai_tts_enabled') === 'true';
    let isVoiceActive = false;
    let recognition = null;
    let wakeWordRecognition = null;

    // Set initial TTS state icon
    updateTtsIcon();

    // 4. Voice Controls (STT & TTS)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            isVoiceActive = true;
            micBtn.classList.add('recording');
            micBtn.innerHTML = '<i data-lucide="mic-off"></i>';
            if (window.lucide) lucide.createIcons();
        };

        recognition.onend = () => {
            isVoiceActive = false;
            micBtn.classList.remove('recording');
            micBtn.innerHTML = '<i data-lucide="mic"></i>';
            if (window.lucide) lucide.createIcons();
        };

        recognition.onresult = (e) => {
            const transcript = e.results[0][0].transcript;
            inputField.value = transcript;
            handleUserSend();
        };

        recognition.onerror = (err) => {
            console.warn("Speech Recognition Error: ", err);
            isVoiceActive = false;
            micBtn.classList.remove('recording');
            micBtn.innerHTML = '<i data-lucide="mic"></i>';
            if (window.lucide) lucide.createIcons();
        };

        // Initialize background wake word listener
        initWakeWordListener();
    } else {
        micBtn.style.display = 'none';
        console.info("Speech recognition is not supported in this browser.");
    }

    function initWakeWordListener() {
        try {
            wakeWordRecognition = new SpeechRecognition();
            wakeWordRecognition.continuous = true;
            wakeWordRecognition.interimResults = true;
            wakeWordRecognition.lang = 'en-US';

            wakeWordRecognition.onresult = (e) => {
                const lastIdx = e.results.length - 1;
                const text = e.results[lastIdx][0].transcript.toLowerCase();
                if (text.includes("hey flex")) {
                    console.log("Wake word 'Hey Flex' detected!");
                    wakeWordRecognition.stop();
                    // Open chat and trigger active listening
                    if (!isChatOpen) toggleChat();
                    setTimeout(() => {
                        if (recognition && !isVoiceActive) recognition.start();
                    }, 500);
                }
            };

            wakeWordRecognition.onend = () => {
                // Restart background listening automatically
                if (!isVoiceActive && isChatOpen) {
                    try { wakeWordRecognition.start(); } catch(err) {}
                }
            };

            // Start background listening
            wakeWordRecognition.start();
        } catch(err) {
            console.warn("Wake word listener initialization failed: ", err);
        }
    }

    function toggleChat() {
        isChatOpen = !isChatOpen;
        windowEl.classList.toggle('open', isChatOpen);
        badge.style.display = 'none';

        if (isChatOpen) {
            if (chatBody.children.length === 0) {
                showGreeting();
            }
            inputField.focus();
            // Start wake word listener
            if (wakeWordRecognition) {
                try { wakeWordRecognition.start(); } catch(err) {}
            }
        } else {
            // Stop listeners
            if (wakeWordRecognition) {
                try { wakeWordRecognition.stop(); } catch(err) {}
            }
            if (recognition) {
                try { recognition.stop(); } catch(err) {}
            }
        }
    }

    function updateTtsIcon() {
        if (isTtsEnabled) {
            ttsBtn.innerHTML = '<i data-lucide="volume-2"></i>';
            ttsBtn.title = "Mute Voice";
        } else {
            ttsBtn.innerHTML = '<i data-lucide="volume-x"></i>';
            ttsBtn.title = "Unmute Voice";
        }
        if (window.lucide) lucide.createIcons();
    }

    function speakAloud(text) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            // Clean markdown tokens
            const cleanText = text.replace(/[\*_#]/g, '');
            const utterance = new SpeechSynthesisUtterance(cleanText);
            utterance.rate = 1.05;
            utterance.pitch = 1.0;
            window.speechSynthesis.speak(utterance);
        }
    }

    function showGreeting() {
        appendBotMessage("Welcome to Flex-Stays Luxury Resort.\nI'm your AI Concierge.\nI can help you find rooms, experience packages, Michelin-starred dining, and manage bookings.");
        appendChips(["Find Room", "Honeymoon Packages", "Check Booking Status", "Reserve a Table"]);
    }

    function appendUserMessage(text) {
        const msg = document.createElement('div');
        msg.className = 'ai-message user-msg';
        
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        msg.innerHTML = `<div>${text}</div><span class="ai-msg-time">${time}</span>`;
        
        chatBody.appendChild(msg);
        scrollToBottom();
    }

    function appendBotMessage(text) {
        const msg = document.createElement('div');
        msg.className = 'ai-message bot-msg';
        
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        // Simple markdown parsing for bold text
        const parsedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        msg.innerHTML = `<div>${parsedText}</div><span class="ai-msg-time">${time}</span>`;
        
        chatBody.appendChild(msg);
        scrollToBottom();
    }

    function appendChips(prompts) {
        const existing = chatBody.querySelector('.ai-chips-container');
        if (existing) existing.remove();

        const container = document.createElement('div');
        container.className = 'ai-chips-container';
        prompts.forEach(p => {
            const chip = document.createElement('div');
            chip.className = 'ai-chip';
            chip.innerText = p;
            chip.addEventListener('click', () => {
                inputField.value = p;
                handleUserSend();
            });
            container.appendChild(chip);
        });
        chatBody.appendChild(container);
        scrollToBottom();
    }

    function appendCarousel(items, type) {
        const carousel = document.createElement('div');
        carousel.className = 'ai-carousel';
        
        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'ai-rich-card';
            
            let img = item.imageUrl || 'images/dining.jpg';
            if (type === 'room') img = item.imageUrl || 'images/executive_sky_suite_1781945245772.png';
            if (type === 'package') img = item.imageUrl || 'images/luxury_helicopter_transfer_1781870264676.png';
            
            let subtitle = type.toUpperCase();
            let title = item.name || 'Premium Item';
            
            let priceLabel = '';
            if (item.pricePerNight) priceLabel = `$${item.pricePerNight} / night`;
            else if (item.price) priceLabel = `$${item.price}`;
            else if (item.startingPrice) priceLabel = item.startingPrice;
            
            let desc = item.description || '';
            if (desc.length > 90) desc = desc.substring(0, 87) + '...';
            
            let primaryBtn = '';
            let secondaryBtn = '';
            if (type === 'room') {
                primaryBtn = `<button class="ai-rich-btn secondary" onclick="window.location.href='room-details.html?id=${item.id}'">Details</button>`;
                secondaryBtn = `<button class="ai-rich-btn primary" onclick="window.aiReserveRoom('${item.id}')">Book Now</button>`;
            } else if (type === 'package') {
                primaryBtn = `<button class="ai-rich-btn secondary" onclick="window.location.href='package-details.html?id=${item.id}'">Details</button>`;
                secondaryBtn = `<button class="ai-rich-btn primary" onclick="window.location.href='package-details.html?id=${item.id}'">Book Package</button>`;
            } else {
                primaryBtn = `<button class="ai-rich-btn secondary" onclick="window.location.href='index.html'">View</button>`;
                secondaryBtn = `<button class="ai-rich-btn primary" onclick="document.getElementById('aiInput').value='Book table'; document.getElementById('aiSendBtn').click();">Reserve</button>`;
            }

            card.innerHTML = `
                <img class="ai-rich-img" src="${img}" alt="${title}">
                <div class="ai-rich-body">
                    <div class="ai-rich-subtitle">${subtitle}</div>
                    <div class="ai-rich-title">${title}</div>
                    <div class="ai-rich-price">${priceLabel}</div>
                    <p class="ai-rich-desc">${desc}</p>
                    <div class="ai-rich-actions">
                        ${primaryBtn}
                        ${secondaryBtn}
                    </div>
                </div>
            `;
            carousel.appendChild(card);
        });
        
        chatBody.appendChild(carousel);
        scrollToBottom();
    }

    function showTypingIndicator() {
        const el = document.createElement('div');
        el.id = 'ai-typing-indicator';
        el.className = 'ai-message bot-msg';
        el.style.width = 'fit-content';
        el.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
        chatBody.appendChild(el);
        scrollToBottom();
        return el;
    }

    function removeTypingIndicator() {
        const el = document.getElementById('ai-typing-indicator');
        if (el) el.remove();
    }

    function scrollToBottom() {
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function handleUserSend() {
        const query = inputField.value.trim();
        if (!query) return;

        appendUserMessage(query);
        inputField.value = '';

        // Stop STT listening
        if (recognition) {
            try { recognition.stop(); } catch(e) {}
        }

        generateResponse(query);
    }

    function generateResponse(query) {
        showTypingIndicator();
        
        const currentUser = typeof window.getCurrentUser === 'function' ? window.getCurrentUser() : null;
        
        const payload = {
            message: query,
            currentPage: window.location.pathname,
            activeId: new URLSearchParams(window.location.search).get('id'),
            userEmail: currentUser ? currentUser.email : null,
            userRole: currentUser ? currentUser.role : 'guest'
        };

        fetch('http://localhost:8080/api/v1/ai/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
            removeTypingIndicator();
            
            appendBotMessage(data.text);
            
            if (isTtsEnabled) {
                speakAloud(data.text);
            }
            
            if (data.items && data.items.length > 0) {
                appendCarousel(data.items, data.type);
            }
            
            if (data.action) {
                executeAction(data.action);
            }
            
            if (data.suggestions && data.suggestions.length > 0) {
                appendChips(data.suggestions);
            }
        })
        .catch(err => {
            removeTypingIndicator();
            console.error("AI Concierge API Error: ", err);
            appendBotMessage("I am having trouble communicating with our core servers. Please try again in a moment.");
            appendChips(["Room Recommendations", "Honeymoon Packages", "Reserve a Table"]);
        });
    }

    function executeAction(action) {
        if (action === 'plan-wedding') {
            window.location.href = 'index.html?plan=wedding';
        } else if (action === 'checkout') {
            window.location.href = 'checkout.html';
        }
    }

    // 5. Button Listeners
    launcher.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);
    
    sendBtn.addEventListener('click', handleUserSend);
    inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleUserSend();
    });

    ttsBtn.addEventListener('click', () => {
        isTtsEnabled = !isTtsEnabled;
        localStorage.setItem('ai_tts_enabled', isTtsEnabled);
        updateTtsIcon();
        if (!isTtsEnabled && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    });

    micBtn.addEventListener('click', () => {
        if (isVoiceActive) {
            recognition.stop();
        } else {
            recognition.start();
        }
    });

    // Auto open greetings
    setTimeout(() => {
        badge.style.display = 'flex';
    }, 1500);

})();

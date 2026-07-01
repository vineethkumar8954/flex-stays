const eventsData = [
    {
        id: "birthday",
        name: "Birthday Celebrations",
        availability: "Available This Week",
        capacity: "20 - 100 Guests",
        minGuests: 20,
        maxGuests: 100,
        startingPrice: "Starting from $499",
        venueName: "Grand Celebration Hall",
        venueFee: 500,
        baseRate: 30,
        description: "Celebrate milestones in style. Our birthday packages are tailored to your tastes, featuring customizable catering menus, creative theme options, premium sound setups, and dedicated coordinators to ensure your day runs flawlessly.",
        image: "images/resort_pool_sunset_1781863829140.png",
        highlights: [
            "Bespoke Catering & Menus",
            "Luxury Floral & Balloon Decor",
            "Professional Sound & Lighting",
            "Dedicated Event Coordinator",
            "Prioritized Room Block Bookings"
        ],
        pricingPackages: [
            { name: "Silver Classic", price: 49, features: ["Standard buffet menu", "Basic table linens", "Sound system setup", "Coordinator support"] },
            { name: "Gold Elegant", price: 79, features: ["Premium plated dinner", "Custom balloon & floral arch", "DJ and premium lights", "Full day coordination"] },
            { name: "Platinum Elite", price: 129, features: ["Custom gourmet catering", "Luxury thematic styling", "Photography & videography", "VIP lounge access"] }
        ],
        cateringOptions: [
            { name: "Signature Buffet Menu", desc: "Diverse hot dishes, gourmet salads, and dessert bar" },
            { name: "Live Grill & Ocean Station", desc: "Fresh oysters, lobster tails, and gourmet beef steaks" },
            { name: "Custom Mixology Bar", desc: "Craft cocktails, select wines, and champagne toast" }
        ],
        decorThemes: [
            { name: "Boho Chic", desc: "Natural pampas grass, warm copper accents, and cream velvet seatings" },
            { name: "Midnight Stars", desc: "Dark blue fabrics, fairy lights ceiling, and gold table setups" },
            { name: "Tropical Paradise", desc: "Exotic palm leaves, bamboo pillars, and vibrant orchids" }
        ],
        availableDatesText: "Highly recommended slots for Birthday Celebrations in the upcoming weeks:",
        reviews: [
            { author: "Michael D.", date: "Last Month", rating: 5, text: "Hosted my 40th birthday here. Flawless execution. The sunset views from the terrace were the highlight of the evening." },
            { author: "Amanda K.", date: "3 Months Ago", rating: 5, text: "The team organized everything from food to decor. Excellent service, highly recommended!" }
        ]
    },
    {
        id: "corporate",
        name: "Corporate Events",
        availability: "Limited Availability",
        capacity: "50 - 500 Guests",
        minGuests: 50,
        maxGuests: 500,
        startingPrice: "Starting from $999",
        venueName: "Skyline Conference Hall",
        venueFee: 1500,
        baseRate: 60,
        description: "Conduct high-impact business meetings, team-building sessions, or summits. Our spaces feature high-speed secure Wi-Fi, state-of-the-art visual equipment, dedicated business concierges, and exquisite executive lunches.",
        image: "images/executive_sky_suite_1781945245772.png",
        highlights: [
            "State-of-the-Art AV Equipment",
            "Premium Executive Catering",
            "Refreshment Bar & Canapes",
            "Secure High-Speed Internet Access",
            "Onsite Technical Assistance",
            "Business Lounge Privileges"
        ],
        pricingPackages: [
            { name: "Executive Silver", price: 79, features: ["Gourmet sandwich platters", "Basic projector and AV", "High-speed Wi-Fi", "Dedicated boardroom assistant"] },
            { name: "Executive Gold", price: 119, features: ["Hot lunch buffet", "Premium AV with microphones", "Refreshment bar", "Print & print support"] },
            { name: "Executive Platinum", price: 179, features: ["Fine dining plated lunch", "Live streaming capability", "Custom stage design", "Chauffeur shuttle vouchers"] }
        ],
        cateringOptions: [
            { name: "Executive Lunch Buffet", desc: "Gourmet hot dishes, fine cheeses, and artisan bread basket" },
            { name: "Gourmet Bento Box", desc: "Premium sashimi, tempura, teriyaki chicken, and organic green tea" },
            { name: "Barista Coffee Bar", desc: "Freshly brewed single-origin coffee, espresso, and premium pastries" }
        ],
        decorThemes: [
            { name: "Corporate Sleek", desc: "Branded banners, neat blue & white linens, and modern digital podium" },
            { name: "Eco-Green Workspace", desc: "Natural potted ferns, sustainable bamboo accents, and white lights" },
            { name: "Luxury Gala", desc: "Black tie elegance, velvet chair covers, and crystal glassware" }
        ],
        availableDatesText: "Highly recommended slots for Corporate Conferences in the upcoming weeks:",
        reviews: [
            { author: "Elena R.", date: "Last Month", rating: 5, text: "Flawless organization of our quarterly board meeting. The AV setup worked without a single glitch." },
            { author: "Sarah M.", date: "2 Months Ago", rating: 4, text: "Top-tier lunch buffet. High-speed Wi-Fi was extremely secure and fast. Professional staff." }
        ]
    },
    {
        id: "wedding",
        name: "Wedding Packages",
        availability: "Only 2 Dates Left This Month",
        capacity: "100 - 1000 Guests",
        minGuests: 100,
        maxGuests: 1000,
        startingPrice: "Starting from $5,000",
        venueName: "Grand Ballroom & Gardens",
        venueFee: 4000,
        baseRate: 120,
        description: "Transform your dream wedding into a reality on our beachfront lawns or in our grand ballrooms. With comprehensive wedding packages including 5-course dinners, floral setups, bridal suites, and master coordinators.",
        image: "images/executive_lounge_suite_1781945266318.png",
        highlights: [
            "Emerald Garden Lawn & Ballroom",
            "Exquisite 5-Course Dinner",
            "Premium Bridal Suite Overnight Stay",
            "Champagne Tower & Welcome Drinks",
            "Live Band Setup & Acoustics",
            "Personal Wedding Coordinator"
        ],
        pricingPackages: [
            { name: "Classic Silver", price: 129, features: ["3-course plated dinner", "Standard white floral layouts", "Sound system setup", "Complimentary bridal suite"] },
            { name: "Luxury Gold", price: 199, features: ["5-course custom dinner", "Elegant table backdrops & candles", "Live band setup", "Chilled champagne toast"] },
            { name: "Royal Platinum", price: 299, features: ["Custom luxury catering", "Premium theme floral design", "2-night bridal villa stay", "Multi-tier wedding cake"] }
        ],
        cateringOptions: [
            { name: "Gourmet 5-Course Plated", desc: "Wagyu beef sirloin, lobster thermidor, and signature soufflé dessert" },
            { name: "Luxury Seafood Carvery", desc: "Oysters, king prawns, smoked salmon, and premium seafood cocktails" },
            { name: "Champagne Fountain Reception", desc: "Chilled Moët & Chandon champagne fountain with artisan cheese boards" }
        ],
        decorThemes: [
            { name: "Enchanted Forest", desc: "Fairy lights, wild greenery, rustic oak tables, and white roses" },
            { name: "Royal Gold Romance", desc: "Gold candelabras, velvet drapery, crystal chandeliers, and white lilies" },
            { name: "Ocean Breeze", desc: "Beachfront glass pavilions, pastel linens, driftwood arches, and blue hydrangeas" }
        ],
        availableDatesText: "Highly recommended slots for Wedding Ceremonies in the upcoming weeks:",
        reviews: [
            { author: "Jessica & Tom", date: "Last Month", rating: 5, text: "The most magical day of our lives. The Emerald Lawn ceremony was straight out of a fairytale!" },
            { author: "David P.", date: "5 Months Ago", rating: 5, text: "Bespoke coordination from beginning to end. Food was excellent, guests are still talking about the Wagyu beef!" }
        ]
    },
    {
        id: "vip",
        name: "VIP Gatherings",
        availability: "High Demand",
        capacity: "10 - 50 Guests",
        minGuests: 10,
        maxGuests: 50,
        startingPrice: "Starting from $2,500",
        venueName: "VIP Lounge",
        venueFee: 2500,
        baseRate: 180,
        description: "Intimate and ultra-exclusive soirées. Ideal for art exhibits, high-profile product launches, celebrity dinners, or elite private meetings requiring maximum security, premium butler service, and high-end catering.",
        image: "images/luxury_helicopter_transfer_1781870264676.png",
        highlights: [
            "Ultra-Private Penthouse Venue",
            "Personal Butler Dining Service",
            "Premium Champagne Reception",
            "Exclusive Live Jazz Performance",
            "Private Security Options",
            "Valet Parking & Executive Transfers"
        ],
        pricingPackages: [
            { name: "Silver Elite", price: 199, features: ["Premium champagne welcome", "Canapé passings", "Live piano performance", "Dedicated valet parking"] },
            { name: "Gold Elite", price: 299, features: ["6-course gourmet dinner", "Caviar tasting station", "Personal butler services", "Custom lounge arrangements"] },
            { name: "Platinum Royal", price: 499, features: ["Unlimited luxury champagne", "Custom fine dining menu", "Helicopter transfer access", "Dedicated security escorts"] }
        ],
        cateringOptions: [
            { name: "Caviar & Truffle Tasting", desc: "Premium beluga caviar, fresh black truffle shavings, and selected vodka pairings" },
            { name: "Fine Dining Plated Dinner", desc: "7-course tasting menu curated by our Michelin-starred chef with cellared wine" },
            { name: "Ultra-Premium Mixology", desc: "Rare single-malt scotches, vintage cognac, and custom luxury cocktails" }
        ],
        decorThemes: [
            { name: "VIP Crimson & Gold", desc: "Deep red velvet, polished brass tables, and dark rose floral setups" },
            { name: "Modern Glassmorphism", desc: "Transparent acrylic chairs, glass tables, LED ambient lighting, and white orchids" },
            { name: "Beachside Cabana Club", desc: "White linen cabanas, soft firepits, tiki torches, and teak wood lounge chairs" }
        ],
        availableDatesText: "Highly recommended slots for VIP Gatherings in the upcoming weeks:",
        reviews: [
            { author: "Alexander V.", date: "Last Month", rating: 5, text: "Exquisite privacy and security. The penthouse lounge views and butler service were unmatched." },
            { author: "Sofia L.", date: "2 Months Ago", rating: 5, text: "Hosted an art auction for our top collectors. Absolute professionalism, perfect setup." }
        ]
    }
];

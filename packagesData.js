const packagesData = [
    {
        id: "honeymoon",
        name: "Honeymoon Escape",
        badge: "BEST VALUE",
        price: 1200,
        worthPrice: 1600,
        savingsPct: "Save 25%",
        duration: "3 Nights / 4 Days",
        description: "Celebrate your love in a private ocean-view suite. This signature honeymoon package offers total privacy, romantic wellness services, and personalized touches at every turn.",
        image: "images/resort_pool_sunset_1781863829140.png",
        inclusions: [
            { icon: "🍽️", text: "Complimentary Daily Breakfast" },
            { icon: "🧖", text: "Bespoke Couple Spa Access" },
            { icon: "🏖️", text: "Private Beach Cabana Access" },
            { icon: "🍾", text: "Chilled Champagne & Chocolates" },
            { icon: "🕯️", text: "Candlelight Beachside Dinner" },
            { icon: "🚗", text: "Luxury Airport Transfer" }
        ],
        maxGuests: 2,
        defaultNights: 3
    },
    {
        id: "family",
        name: "Family Getaway",
        badge: "MOST POPULAR",
        price: 1500,
        worthPrice: 2000,
        savingsPct: "Save 25%",
        duration: "3 Nights / 4 Days",
        description: "Reconnect with your loved ones in spacious connecting suites. Designed to offer comfort and fun for all ages, this package includes kids' club activities, family excursions, and specialized beachside dining.",
        image: "images/executive_lounge_suite_1781945266318.png",
        inclusions: [
            { icon: "🍽️", text: "Breakfast Buffet Included" },
            { icon: "🏖️", text: "Private Beach & Pool Access" },
            { icon: "🚗", text: "Roundtrip Airport Transfer" },
            { icon: "🎨", text: "Complimentary Kids Club Passes" },
            { icon: "🍕", text: "Family Pizza & Movie Night" },
            { icon: "🏄", text: "Water Sports Equipment Hire" }
        ],
        maxGuests: 5,
        defaultNights: 3
    },
    {
        id: "wellness",
        name: "Wellness & Spa Retreat",
        badge: "WELLNESS FAVORITE",
        price: 850,
        worthPrice: 1100,
        savingsPct: "Save 22%",
        duration: "2 Nights / 3 Days",
        description: "Rejuvenate your body, mind, and spirit with our premier wellness retreat. Focus on holistic health, deep relaxation, and mindfulness with specialized therapist consultations and organic cuisine.",
        image: "images/standard_garden_room_1781945287542.png",
        inclusions: [
            { icon: "🧖", text: "Unlimited Spa & Sauna Access" },
            { icon: "💆", text: "Two Signature Massage Therapies" },
            { icon: "🥗", text: "Daily Organic Breakfast & Dining" },
            { icon: "🧘", text: "Daily Yoga & Meditation Classes" },
            { icon: "📋", text: "Personal Wellness Consultation" },
            { icon: "🍵", text: "Aromatherapy Sleeping Rituals" }
        ],
        maxGuests: 2,
        defaultNights: 2
    },
    {
        id: "corporate",
        name: "Corporate Executive",
        badge: "BUSINESS CHOICE",
        price: 1100,
        worthPrice: 1400,
        savingsPct: "Save 21%",
        duration: "Business Package",
        description: "The ultimate business package. Indulge in executive-level privileges, premium business center access, high-speed secure Wi-Fi, and convenient private chauffeur services during your stay.",
        image: "images/executive_sky_suite_1781945245772.png",
        inclusions: [
            { icon: "🚗", text: "Daily Chauffeur Services" },
            { icon: "👑", text: "Executive Lounge Privileges" },
            { icon: "🍽️", text: "Complimentary Daily Breakfast" },
            { icon: "📶", text: "High-Speed Secure Wi-Fi" },
            { icon: "👔", text: "Express Laundry & Pressing" },
            { icon: "💼", text: "Private Meeting Room Access" }
        ],
        maxGuests: 2,
        defaultNights: 3
    },
    {
        id: "presidential",
        name: "Presidential Experience",
        badge: "VIP EXCLUSIVE",
        price: 3500,
        worthPrice: 5000,
        savingsPct: "Save 30%",
        duration: "VIP Luxury Experience",
        description: "Unparalleled privacy, space, and prestige. Our flagship Presidential Experience Villa package features 24/7 dedicated butler service, a private infinity pool, custom helicopter airport transfers, and unlimited luxury options.",
        image: "images/luxury_helicopter_transfer_1781870264676.png",
        inclusions: [
            { icon: "👑", text: "24/7 Dedicated Butler Service" },
            { icon: "🧖", text: "Unlimited Spa Therapy Access" },
            { icon: "🚁", text: "Luxury Helicopter Transfer" },
            { icon: "🍽️", text: "All-Inclusive Fine Dining" },
            { icon: "🏊", text: "Private Rooftop Pool Access" },
            { icon: "🛥️", text: "Sunset Private Yacht Cruise" }
        ],
        maxGuests: 4,
        defaultNights: 3
    }
];

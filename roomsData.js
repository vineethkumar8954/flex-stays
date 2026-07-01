const roomImages = {
    standard: [
        "https://media.base44.com/images/public/6a350ca615156d469eb82de4/a151e3668_generated_b934b4f1.png", // reusing for demo
        "https://media.base44.com/images/public/6a350ca615156d469eb82de4/dd984c790_generated_4485225f.png"
    ],
    deluxe: [
        "https://media.base44.com/images/public/6a350ca615156d469eb82de4/a151e3668_generated_b934b4f1.png"
    ],
    executive: [
        "https://media.base44.com/images/public/6a350ca615156d469eb82de4/dd984c790_generated_4485225f.png"
    ],
    presidential: [
        "https://media.base44.com/images/public/6a350ca615156d469eb82de4/5652f2763_generated_68e877e7.png"
    ]
};

const availabilityBadges = [
    "Only 2 Rooms Left",
    "Only 1 Room Left",
    "Limited Availability",
    "High Demand",
    "Available"
];

const roomsData = [
    // --- STANDARD ROOMS (12) ---
    { id: "STD-001", category: "Standard Rooms", name: "Standard Garden View Room", description: "Comfortable 35sqm room overlooking lush tropical gardens. Perfect for a relaxing retreat.", price: 180, rating: 4.2, reviews: 145, image: roomImages.standard[0], availability: "Available", amenities: ["Free Wi-Fi", "Garden View", "Queen Bed"], maxGuests: 2, roomSize: "35 sqm", bedType: "Queen", featured: false },
    { id: "STD-002", category: "Standard Rooms", name: "Standard City View Room", description: "Modern 35sqm room with dynamic views of the city skyline. Designed for convenience.", price: 195, rating: 4.3, reviews: 210, image: roomImages.standard[1], availability: "High Demand", amenities: ["Free Wi-Fi", "City View", "Queen Bed"], maxGuests: 2, roomSize: "35 sqm", bedType: "Queen", featured: false },
    { id: "STD-003", category: "Standard Rooms", name: "Standard Pool View Room", description: "Bright 38sqm room with direct views of the main infinity pool.", price: 210, rating: 4.5, reviews: 89, image: roomImages.standard[0], availability: "Limited Availability", amenities: ["Free Wi-Fi", "Pool View", "King Bed"], maxGuests: 2, roomSize: "38 sqm", bedType: "King", featured: false },
    { id: "STD-004", category: "Standard Rooms", name: "Standard Twin Room", description: "Practical 40sqm room with two twin beds, ideal for friends traveling together.", price: 200, rating: 4.4, reviews: 167, image: roomImages.standard[1], availability: "Available", amenities: ["Free Wi-Fi", "Twin Beds", "City View"], maxGuests: 2, roomSize: "40 sqm", bedType: "Twin", featured: false },
    { id: "STD-005", category: "Standard Rooms", name: "Standard Family Room", description: "Spacious 50sqm room designed to comfortably accommodate a small family.", price: 280, rating: 4.6, reviews: 312, image: roomImages.standard[0], availability: "Only 2 Rooms Left", amenities: ["Free Wi-Fi", "Family Friendly", "King Bed", "Sofa Bed"], maxGuests: 4, roomSize: "50 sqm", bedType: "King + Sofa", featured: false },
    { id: "STD-006", category: "Standard Rooms", name: "Standard Balcony Room", description: "Charming 42sqm room featuring a private balcony to enjoy the fresh air.", price: 230, rating: 4.7, reviews: 156, image: roomImages.standard[1], availability: "High Demand", amenities: ["Free Wi-Fi", "Private Balcony", "King Bed"], maxGuests: 2, roomSize: "42 sqm", bedType: "King", featured: false },
    { id: "STD-007", category: "Standard Rooms", name: "Standard Business Room", description: "Optimized 40sqm room with an ergonomic workspace and high-speed internet.", price: 220, rating: 4.5, reviews: 420, image: roomImages.standard[0], availability: "Available", amenities: ["Free Wi-Fi", "Work Desk", "King Bed"], maxGuests: 2, roomSize: "40 sqm", bedType: "King", featured: false },
    { id: "STD-008", category: "Standard Rooms", name: "Standard Courtyard Room", description: "Quiet 35sqm room facing the peaceful inner courtyard.", price: 185, rating: 4.3, reviews: 112, image: roomImages.standard[1], availability: "Available", amenities: ["Free Wi-Fi", "Quiet Zone", "Queen Bed"], maxGuests: 2, roomSize: "35 sqm", bedType: "Queen", featured: false },
    { id: "STD-009", category: "Standard Rooms", name: "Standard Comfort Room", description: "Cozy 38sqm room designed with extra plush bedding and warm tones.", price: 205, rating: 4.4, reviews: 95, image: roomImages.standard[0], availability: "Limited Availability", amenities: ["Free Wi-Fi", "Premium Bedding", "King Bed"], maxGuests: 2, roomSize: "38 sqm", bedType: "King", featured: false },
    { id: "STD-010", category: "Standard Rooms", name: "Standard Classic Room", description: "Timeless 36sqm room offering traditional decor and modern amenities.", price: 190, rating: 4.2, reviews: 234, image: roomImages.standard[1], availability: "Available", amenities: ["Free Wi-Fi", "Classic Decor", "Queen Bed"], maxGuests: 2, roomSize: "36 sqm", bedType: "Queen", featured: false },
    { id: "STD-011", category: "Standard Rooms", name: "Standard Ocean Peek Room", description: "A 40sqm room offering a partial, angled view of the ocean.", price: 250, rating: 4.6, reviews: 178, image: roomImages.standard[0], availability: "Only 1 Room Left", amenities: ["Free Wi-Fi", "Ocean View", "King Bed"], maxGuests: 2, roomSize: "40 sqm", bedType: "King", featured: false },
    { id: "STD-012", category: "Standard Rooms", name: "Standard Retreat Room", description: "A secluded 38sqm room tucked away in the quietest wing of the property.", price: 215, rating: 4.5, reviews: 88, image: roomImages.standard[1], availability: "High Demand", amenities: ["Free Wi-Fi", "Quiet Zone", "King Bed"], maxGuests: 2, roomSize: "38 sqm", bedType: "King", featured: false },

    // --- DELUXE ROOMS (12) ---
    { id: "DLX-001", category: "Deluxe Rooms", name: "Deluxe Ocean View Room", description: "Elegant 55sqm room featuring modern luxury finishes, a private balcony facing the ocean, and a deep soaking tub.", price: 550, rating: 4.7, reviews: 315, image: roomImages.deluxe[0], availability: "Limited Availability", amenities: ["Ocean View", "King Bed", "Soaking Tub", "Free Wi-Fi"], maxGuests: 2, roomSize: "55 sqm", bedType: "King", featured: true },
    { id: "DLX-002", category: "Deluxe Rooms", name: "Deluxe Sunset View Room", description: "Stunning 55sqm room positioned perfectly to capture the evening sunset over the water.", price: 580, rating: 4.8, reviews: 240, image: roomImages.deluxe[0], availability: "High Demand", amenities: ["Ocean View", "Sunset View", "King Bed", "Free Wi-Fi"], maxGuests: 2, roomSize: "55 sqm", bedType: "King", featured: false },
    { id: "DLX-003", category: "Deluxe Rooms", name: "Deluxe Balcony Suite", description: "Spacious 65sqm mini-suite with an extended wrap-around balcony.", price: 620, rating: 4.8, reviews: 190, image: roomImages.deluxe[0], availability: "Only 2 Rooms Left", amenities: ["Private Balcony", "King Bed", "Lounge Area", "Free Wi-Fi"], maxGuests: 3, roomSize: "65 sqm", bedType: "King", featured: false },
    { id: "DLX-004", category: "Deluxe Rooms", name: "Deluxe Family Suite", description: "Expansive 80sqm connecting rooms offering privacy and space for the whole family.", price: 680, rating: 4.9, reviews: 412, image: roomImages.deluxe[0], availability: "Available", amenities: ["Family Friendly", "Multiple Beds", "Free Wi-Fi", "Breakfast Included"], maxGuests: 5, roomSize: "80 sqm", bedType: "King + 2 Twin", featured: false },
    { id: "DLX-005", category: "Deluxe Rooms", name: "Deluxe Premium Room", description: "Upgraded 60sqm room on the higher floors offering panoramic vistas.", price: 600, rating: 4.7, reviews: 275, image: roomImages.deluxe[0], availability: "Available", amenities: ["High Floor", "King Bed", "Premium Amenities", "Free Wi-Fi"], maxGuests: 2, roomSize: "60 sqm", bedType: "King", featured: false },
    { id: "DLX-006", category: "Deluxe Rooms", name: "Deluxe Executive Room", description: "Refined 58sqm room offering complimentary access to the business lounge.", price: 590, rating: 4.6, reviews: 330, image: roomImages.deluxe[0], availability: "High Demand", amenities: ["Lounge Access", "Work Desk", "King Bed", "Free Wi-Fi"], maxGuests: 2, roomSize: "58 sqm", bedType: "King", featured: false },
    { id: "DLX-007", category: "Deluxe Rooms", name: "Deluxe Resort View Room", description: "Beautiful 55sqm room overlooking the entire resort grounds and pools.", price: 520, rating: 4.6, reviews: 185, image: roomImages.deluxe[0], availability: "Available", amenities: ["Resort View", "King Bed", "Balcony", "Free Wi-Fi"], maxGuests: 2, roomSize: "55 sqm", bedType: "King", featured: false },
    { id: "DLX-008", category: "Deluxe Rooms", name: "Deluxe King Room", description: "Luxurious 52sqm room centered around a signature custom King bed.", price: 500, rating: 4.5, reviews: 290, image: roomImages.deluxe[0], availability: "Available", amenities: ["Signature King Bed", "City View", "Free Wi-Fi"], maxGuests: 2, roomSize: "52 sqm", bedType: "King", featured: false },
    { id: "DLX-009", category: "Deluxe Rooms", name: "Deluxe Luxury Room", description: "Opulent 62sqm room featuring marble floors and artisan furniture.", price: 650, rating: 4.9, reviews: 142, image: roomImages.deluxe[0], availability: "Only 1 Room Left", amenities: ["Marble Bath", "King Bed", "Free Wi-Fi", "Premium Bar"], maxGuests: 2, roomSize: "62 sqm", bedType: "King", featured: false },
    { id: "DLX-010", category: "Deluxe Rooms", name: "Deluxe Corner Room", description: "Bright 60sqm corner room with dual-aspect floor-to-ceiling windows.", price: 610, rating: 4.8, reviews: 210, image: roomImages.deluxe[0], availability: "Limited Availability", amenities: ["Corner View", "King Bed", "Natural Light", "Free Wi-Fi"], maxGuests: 2, roomSize: "60 sqm", bedType: "King", featured: false },
    { id: "DLX-011", category: "Deluxe Rooms", name: "Deluxe Wellness Room", description: "Specialized 55sqm room featuring an in-room stationary bike and yoga equipment.", price: 570, rating: 4.7, reviews: 95, image: roomImages.deluxe[0], availability: "Available", amenities: ["Wellness Equipment", "King Bed", "Free Wi-Fi"], maxGuests: 2, roomSize: "55 sqm", bedType: "King", featured: false },
    { id: "DLX-012", category: "Deluxe Rooms", name: "Deluxe Oasis Room", description: "Tranquil 58sqm room located near the adults-only pool.", price: 540, rating: 4.6, reviews: 150, image: roomImages.deluxe[0], availability: "Available", amenities: ["Pool Access", "King Bed", "Quiet Zone", "Free Wi-Fi"], maxGuests: 2, roomSize: "58 sqm", bedType: "King", featured: false },

    // --- EXECUTIVE SUITES (10) ---
    { id: "EXEC-001", category: "Executive Suites", name: "Executive Ocean Suite", description: "Spacious 85sqm suite with panoramic ocean views, separate living area, and exclusive access to the Executive Lounge.", price: 850, rating: 4.9, reviews: 128, image: roomImages.executive[0], availability: "Only 2 Rooms Left", amenities: ["Ocean View", "King Bed", "Breakfast Included", "Free Wi-Fi"], maxGuests: 3, roomSize: "85 sqm", bedType: "King", featured: true },
    { id: "EXEC-002", category: "Executive Suites", name: "Executive Sky Suite", description: "Breathtaking 90sqm suite on the top floor with floor-to-ceiling windows.", price: 950, rating: 4.9, reviews: 215, image: roomImages.executive[0], availability: "High Demand", amenities: ["Skyline View", "King Bed", "Lounge Access", "Free Wi-Fi"], maxGuests: 3, roomSize: "90 sqm", bedType: "King", featured: false },
    { id: "EXEC-003", category: "Executive Suites", name: "Executive Lounge Suite", description: "Elegant 88sqm suite located on the same floor as the VIP Lounge for ultimate convenience.", price: 900, rating: 4.8, reviews: 175, image: roomImages.executive[0], availability: "Available", amenities: ["VIP Lounge Access", "King Bed", "Breakfast Included", "Free Wi-Fi"], maxGuests: 3, roomSize: "88 sqm", bedType: "King", featured: false },
    { id: "EXEC-004", category: "Executive Suites", name: "Executive Signature Suite", description: "Bespoke 95sqm suite featuring curated local artwork and a massive master bath.", price: 1050, rating: 5.0, reviews: 88, image: roomImages.executive[0], availability: "Only 1 Room Left", amenities: ["Signature Art", "Spa Bath", "King Bed", "Free Wi-Fi"], maxGuests: 2, roomSize: "95 sqm", bedType: "King", featured: false },
    { id: "EXEC-005", category: "Executive Suites", name: "Executive Business Suite", description: "Functional yet luxurious 92sqm suite featuring a dedicated 6-person meeting table.", price: 980, rating: 4.7, reviews: 310, image: roomImages.executive[0], availability: "Available", amenities: ["Meeting Table", "Lounge Access", "King Bed", "Free Wi-Fi"], maxGuests: 2, roomSize: "92 sqm", bedType: "King", featured: false },
    { id: "EXEC-006", category: "Executive Suites", name: "Executive Terrace Suite", description: "Stunning 85sqm suite featuring a massive 40sqm outdoor terrace with dining setup.", price: 1100, rating: 4.9, reviews: 142, image: roomImages.executive[0], availability: "Limited Availability", amenities: ["Private Terrace", "Ocean View", "King Bed", "Free Wi-Fi"], maxGuests: 3, roomSize: "85 sqm (+40sqm Terrace)", bedType: "King", featured: false },
    { id: "EXEC-007", category: "Executive Suites", name: "Executive Premium Suite", description: "Upgraded 95sqm suite with enhanced tech features and a state-of-the-art entertainment system.", price: 1020, rating: 4.8, reviews: 195, image: roomImages.executive[0], availability: "Available", amenities: ["Smart Home Tech", "Home Theater", "King Bed", "Free Wi-Fi"], maxGuests: 3, roomSize: "95 sqm", bedType: "King", featured: false },
    { id: "EXEC-008", category: "Executive Suites", name: "Executive Coastal Suite", description: "Breezy 88sqm suite styled with light coastal woods and direct beach access.", price: 920, rating: 4.8, reviews: 205, image: roomImages.executive[0], availability: "High Demand", amenities: ["Beach Access", "Ocean View", "King Bed", "Free Wi-Fi"], maxGuests: 3, roomSize: "88 sqm", bedType: "King", featured: false },
    { id: "EXEC-009", category: "Executive Suites", name: "Executive Panoramic Suite", description: "Corner 98sqm suite offering 270-degree panoramic views of the city and coast.", price: 1150, rating: 5.0, reviews: 112, image: roomImages.executive[0], availability: "Only 2 Rooms Left", amenities: ["Panoramic View", "Lounge Access", "King Bed", "Free Wi-Fi"], maxGuests: 3, roomSize: "98 sqm", bedType: "King", featured: false },
    { id: "EXEC-010", category: "Executive Suites", name: "Executive Elite Suite", description: "A prestigious 105sqm suite offering the pinnacle of our executive tier, complete with a baby grand piano.", price: 1300, rating: 5.0, reviews: 75, image: roomImages.executive[0], availability: "Available", amenities: ["Grand Piano", "Ocean View", "King Bed", "Free Wi-Fi"], maxGuests: 2, roomSize: "105 sqm", bedType: "King", featured: false },

    // --- PRESIDENTIAL COLLECTION (6) ---
    { id: "PRES-001", category: "Presidential Suites", name: "Presidential Experience Suite", description: "Our most luxurious offering. 200sqm of pure opulence with a private wrap-around balcony, dining room, and dedicated butler.", price: 2500, rating: 5.0, reviews: 42, image: roomImages.presidential[0], availability: "High Demand", amenities: ["Ocean View", "Master King", "Butler Service", "Breakfast Included"], maxGuests: 4, roomSize: "200 sqm", bedType: "Master King", featured: true },
    { id: "PRES-002", category: "Presidential Suites", name: "Royal Presidential Suite", description: "A 220sqm palace in the sky featuring a private library, formal dining for 10, and a gold-leaf bathroom.", price: 3200, rating: 5.0, reviews: 28, image: roomImages.presidential[0], availability: "Available", amenities: ["Private Library", "Formal Dining", "Butler Service", "Master King"], maxGuests: 4, roomSize: "220 sqm", bedType: "Master King", featured: false },
    { id: "PRES-003", category: "Presidential Suites", name: "Imperial Presidential Suite", description: "Majestic 250sqm suite designed for royalty, featuring two master bedrooms and a private cinema.", price: 3800, rating: 5.0, reviews: 15, image: roomImages.presidential[0], availability: "Limited Availability", amenities: ["Private Cinema", "Two Master Beds", "Butler Service", "Ocean View"], maxGuests: 6, roomSize: "250 sqm", bedType: "2 Master Kings", featured: false },
    { id: "PRES-004", category: "Presidential Suites", name: "Signature Collection Suite", description: "A 180sqm modern masterpiece curated by top designers, featuring exclusive artisan furniture and a private plunge pool.", price: 2800, rating: 4.9, reviews: 55, image: roomImages.presidential[0], availability: "Available", amenities: ["Plunge Pool", "Artisan Decor", "Butler Service", "Master King"], maxGuests: 2, roomSize: "180 sqm", bedType: "Master King", featured: false },
    { id: "PRES-005", category: "Presidential Suites", name: "Grand Palace Suite", description: "An extraordinary 300sqm split-level suite with a sweeping staircase and a private rooftop terrace.", price: 4500, rating: 5.0, reviews: 10, image: roomImages.presidential[0], availability: "Only 1 Room Left", amenities: ["Rooftop Terrace", "Split Level", "Butler Service", "Master King"], maxGuests: 4, roomSize: "300 sqm", bedType: "Master King", featured: false },
    { id: "PRES-006", category: "Presidential Suites", name: "Oceanfront Presidential Villa", description: "A standalone 400sqm beachfront villa offering total privacy, a private infinity pool, and direct beach access.", price: 5000, rating: 5.0, reviews: 33, image: roomImages.presidential[0], availability: "High Demand", amenities: ["Private Villa", "Infinity Pool", "Butler Service", "Direct Beach Access"], maxGuests: 8, roomSize: "400 sqm", bedType: "3 Kings, 2 Twins", featured: false }
];

const allImagesPool = [
    "images/executive_sky_suite_1781945245772.png",
    "images/executive_lounge_suite_1781945266318.png",
    "images/standard_garden_room_1781945287542.png",
    "https://media.base44.com/images/public/6a350ca615156d469eb82de4/a151e3668_generated_b934b4f1.png",
    "https://media.base44.com/images/public/6a350ca615156d469eb82de4/dd984c790_generated_4485225f.png",
    "https://media.base44.com/images/public/6a350ca615156d469eb82de4/5652f2763_generated_68e877e7.png"
];

roomsData.forEach((room) => {
    if (room.name.includes("Sky Suite")) {
        room.image = "images/executive_sky_suite_1781945245772.png";
    } else if (room.name.includes("Lounge Suite")) {
        room.image = "images/executive_lounge_suite_1781945266318.png";
    } else if (room.name.includes("Garden")) {
        room.image = "images/standard_garden_room_1781945287542.png";
    } else if (room.name.includes("Ocean")) {
        room.image = "images/resort_pool_sunset_1781863829140.png";
    } else {
        let hash = 0;
        for (let i = 0; i < room.name.length; i++) {
            hash = room.name.charCodeAt(i) + ((hash << 5) - hash);
        }
        hash = Math.abs(hash);
        room.image = allImagesPool[hash % allImagesPool.length];
    }
});

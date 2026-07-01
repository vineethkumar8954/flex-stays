const menuData = [
    // Starters
    {
        id: 'food-001',
        category: 'starters',
        name: 'Wagyu Beef Tartare',
        description: 'Truffle emulsion, cured egg yolk, sourdough crisps.',
        price: 3150,
        rating: 4.9,
        reviews: 312,
        image: 'images/wagyu_beef_1781947637289.png',
        fallbackImage: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&q=80',
        isVeg: false,
        spicyLevel: 0,
        tags: ['chef']
    },
    {
        id: 'food-002',
        category: 'starters',
        name: 'Seared Hokkaido Scallops',
        description: 'Cauliflower purée, brown butter capers, pancetta.',
        price: 2650,
        rating: 4.8,
        reviews: 245,
        image: 'images/food-002.jpg',
        fallbackImage: 'https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?w=400&q=80',
        isVeg: false,
        spicyLevel: 0,
        tags: []
    },
    {
        id: 'food-003',
        category: 'starters',
        name: 'Burrata & Heritage Tomato',
        description: 'Basil pesto, aged balsamic, toasted pine nuts.',
        price: 1990,
        rating: 4.7,
        reviews: 189,
        image: 'images/food-003.jpg',
        fallbackImage: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=400&q=80',
        isVeg: true,
        spicyLevel: 0,
        tags: ['vegetarian', 'gluten-free']
    },

    // Main Course
    {
        id: 'food-004',
        category: 'main',
        name: 'Dry-Aged Tomahawk Steak',
        description: 'Roasted garlic, herb butter, fondant potatoes. Serves two.',
        price: 12050,
        rating: 4.9,
        reviews: 542,
        image: 'images/food-004.jpg',
        fallbackImage: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80',
        isVeg: false,
        spicyLevel: 0,
        tags: ['chef']
    },
    {
        id: 'food-005',
        category: 'main',
        name: 'Miso Glazed Black Cod',
        description: 'Bok choy, dashi broth, ginger reduction.',
        price: 3990,
        rating: 4.8,
        reviews: 421,
        image: 'images/food-005.jpg',
        fallbackImage: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=80',
        isVeg: false,
        spicyLevel: 0,
        tags: ['gluten-free']
    },

    // Italian
    {
        id: 'food-006',
        category: 'italian',
        name: 'Truffle Risotto',
        description: 'Creamy arborio rice with fresh black truffle shavings and parmesan.',
        price: 2990,
        rating: 5.0,
        reviews: 890,
        image: 'images/food-006.jpg',
        fallbackImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80',
        isVeg: true,
        spicyLevel: 0,
        tags: ['vegetarian', 'chef']
    },
    {
        id: 'food-007',
        category: 'italian',
        name: 'Lobster Ravioli',
        description: 'Handmade pasta, lobster bisque reduction, tarragon oil.',
        price: 3490,
        rating: 4.7,
        reviews: 231,
        image: 'images/food-007.jpg',
        fallbackImage: 'https://images.unsplash.com/photo-1551183053-bf91798d9a33?w=400&q=80',
        isVeg: false,
        spicyLevel: 0,
        tags: []
    },

    // Asian
    {
        id: 'food-008',
        category: 'asian',
        name: 'Spicy Tuna Crispy Rice',
        description: 'Jalapeño, spicy mayo, eel sauce.',
        price: 1990,
        rating: 4.8,
        reviews: 412,
        image: 'images/food-008.jpg',
        fallbackImage: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400&q=80',
        isVeg: false,
        spicyLevel: 2,
        tags: ['spicy']
    },
    {
        id: 'food-009',
        category: 'asian',
        name: 'Sichuan Mapo Tofu',
        description: 'Silken tofu, minced pork, numbing peppercorn sauce.',
        price: 2320,
        rating: 4.6,
        reviews: 156,
        image: 'images/food-009.jpg',
        fallbackImage: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80',
        isVeg: false,
        spicyLevel: 3,
        tags: ['spicy']
    },

    // Grills
    {
        id: 'food-010',
        category: 'grills',
        name: 'Grilled King Prawns',
        description: 'Lemon butter, chili flakes, charred asparagus.',
        price: 3740,
        rating: 4.9,
        reviews: 320,
        image: 'images/food-010.jpg',
        fallbackImage: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80',
        isVeg: false,
        spicyLevel: 1,
        tags: ['gluten-free']
    },

    // Desserts
    {
        id: 'food-011',
        category: 'desserts',
        name: 'Signature Chocolate Soufflé',
        description: 'Valrhona 70% dark chocolate, Madagascar vanilla bean ice cream.',
        price: 1990,
        rating: 5.0,
        reviews: 678,
        image: 'images/chocolate_souffle_1781947650275.png',
        fallbackImage: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80',
        isVeg: true,
        spicyLevel: 0,
        tags: ['vegetarian', 'chef']
    },
    {
        id: 'food-012',
        category: 'desserts',
        name: 'Lemon Tart',
        description: 'Torched meringue, raspberry coulis, mint.',
        price: 1490,
        rating: 4.7,
        reviews: 211,
        image: 'images/food-012.jpg',
        fallbackImage: 'https://images.unsplash.com/photo-1519915028121-7d3463d5b1c5?w=400&q=80',
        isVeg: true,
        spicyLevel: 0,
        tags: ['vegetarian']
    },

    // Beverages
    {
        id: 'food-013',
        category: 'beverages',
        name: 'Artisan Craft Cocktails',
        description: 'Selection of seasonal mixed drinks.',
        price: 1660,
        rating: 4.8,
        reviews: 334,
        image: 'images/food-013.jpg',
        fallbackImage: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=400&q=80',
        isVeg: true,
        spicyLevel: 0,
        tags: ['vegan']
    }
];


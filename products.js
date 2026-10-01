// Product catalog for Wide City Smart Digital Homes
// Images sourced from Unsplash (free to use under Unsplash License)

const products = [
  // Home & Kitchen Appliances
  {
    id: 1,
    name: "Smart Microwave Oven 25L",
    category: "home-kitchen",
    price: 12500,
    image: "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&fit=crop&w=600&h=600&q=80",
    description: "Inverter technology, 10 auto-cook menus, child lock, stainless steel finish. Perfect for modern kitchens.",
    stock: 15
  },
  {
    id: 2,
    name: "Blender Pro 1000W",
    category: "home-kitchen",
    price: 4500,
    image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&h=600&fit=crop",
    description: "High-speed blender with 6 blades, glass jar, pulse function. Ideal for smoothies, soups and sauces.",
    stock: 28
  },
  {
    id: 3,
    name: "Electric Kettle 1.7L",
    category: "home-kitchen",
    price: 2800,
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop",
    description: "Fast boil, auto shut-off, boil-dry protection, stylish black design with LED indicator.",
    stock: 40
  },
  {
    id: 4,
    name: "Coffee Maker Deluxe",
    category: "home-kitchen",
    price: 8900,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop",
    description: "Programmable 12-cup coffee maker with thermal carafe, brew strength control and timer.",
    stock: 12
  },
  {
    id: 5,
    name: "Air Fryer XL 5.5L",
    category: "home-kitchen",
    price: 9800,
    image: "https://images.unsplash.com/photo-1556910103-1c02745a0b39?w=600&h=600&fit=crop",
    description: "Oil-free cooking, digital touchscreen, 8 presets, dishwasher-safe basket. Healthy meals made easy.",
    stock: 18
  },
  {
    id: 6,
    name: "Smart Refrigerator 300L",
    category: "home-kitchen",
    price: 68500,
    image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600&h=600&fit=crop",
    description: "Frost-free, inverter compressor, water dispenser, smart temperature control and energy efficient.",
    stock: 5
  },

  // Computer Accessories
  {
    id: 7,
    name: "Wireless Mouse Ergonomic",
    category: "computer",
    price: 1800,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=600&fit=crop",
    description: "Silent click, 2.4GHz wireless, adjustable DPI, long battery life. Comfortable for long work sessions.",
    stock: 50
  },
  {
    id: 8,
    name: "Mechanical Keyboard RGB",
    category: "computer",
    price: 6500,
    image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=600&h=600&fit=crop",
    description: "Blue switches, full RGB backlighting, aluminum frame, anti-ghosting. Perfect for gaming and typing.",
    stock: 22
  },
  {
    id: 9,
    name: "USB-C Hub 7-in-1",
    category: "computer",
    price: 3200,
    image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=600&h=600&fit=crop",
    description: "HDMI 4K, USB 3.0 ports, SD/TF card reader, PD charging. Expand your laptop connectivity.",
    stock: 35
  },
  {
    id: 10,
    name: "Laptop Stand Aluminum",
    category: "computer",
    price: 2500,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=600&fit=crop",
    description: "Adjustable height, ergonomic design, heat dissipation, compatible with all laptops up to 17\".",
    stock: 30
  },
  {
    id: 11,
    name: "External SSD 1TB",
    category: "computer",
    price: 11500,
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&h=600&fit=crop",
    description: "USB 3.2 Gen 2, up to 1050MB/s read speed, shock resistant, portable and reliable storage.",
    stock: 20
  },
  {
    id: 12,
    name: "Webcam Full HD 1080p",
    category: "computer",
    price: 4200,
    image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=600&h=600&fit=crop",
    description: "Auto-focus, built-in microphone, privacy shutter, plug-and-play for video calls and streaming.",
    stock: 25
  },

  // Electronics
  {
    id: 13,
    name: "Noise Cancelling Headphones",
    category: "electronics",
    price: 14500,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
    description: "Active noise cancellation, 30-hour battery, Bluetooth 5.0, premium sound quality and comfort.",
    stock: 16
  },
  {
    id: 14,
    name: "Smart TV 55\" 4K UHD",
    category: "electronics",
    price: 52000,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=600&fit=crop",
    description: "4K Ultra HD, Android TV, voice control, HDR10, multiple streaming apps built-in.",
    stock: 8
  },
  {
    id: 15,
    name: "Portable Bluetooth Speaker",
    category: "electronics",
    price: 3800,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop",
    description: "Waterproof IPX7, 20-hour playtime, deep bass, compact design for indoor and outdoor use.",
    stock: 42
  },
  {
    id: 16,
    name: "Wireless Earbuds Pro",
    category: "electronics",
    price: 7200,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop",
    description: "True wireless, active noise cancellation, touch controls, charging case with 24h total battery.",
    stock: 33
  },
  {
    id: 17,
    name: "Power Bank 20000mAh",
    category: "electronics",
    price: 3500,
    image: "https://images.unsplash.com/photo-1609091839311-b08b9f7b5b5b?w=600&h=600&fit=crop",
    description: "Fast charge, dual USB ports, LED indicator, compact and safe for phones and tablets.",
    stock: 45
  },
  {
    id: 18,
    name: "Smart Watch Fitness",
    category: "electronics",
    price: 8900,
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&h=600&fit=crop",
    description: "Heart rate monitor, SpO2, GPS, 7-day battery, water resistant, multiple sports modes.",
    stock: 19
  },
  {
    id: 19,
    name: "Laptop 15.6\" Core i5",
    category: "computer",
    price: 78500,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop",
    description: "Intel Core i5, 8GB RAM, 512GB SSD, Full HD display, Windows 11, lightweight aluminum body.",
    stock: 7
  },
  {
    id: 20,
    name: "Gaming Mouse Pad XXL",
    category: "computer",
    price: 1500,
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7cde1c?w=600&h=600&fit=crop",
    description: "Extended size, non-slip base, smooth surface, stitched edges for durability.",
    stock: 60
  }
];

// Format price to Kenyan Shillings
function formatPrice(price) {
  return `KSh ${price.toLocaleString('en-KE')}`;
}

// Get products by category
function getProductsByCategory(category) {
  if (category === 'all') return products;
  return products.filter(p => p.category === category);
}

// Search products
function searchProducts(query) {
  const q = query.toLowerCase().trim();
  if (!q) return products;
  return products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  );
}

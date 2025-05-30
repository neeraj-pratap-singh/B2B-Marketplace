import { connectMongoose } from '../src/lib/mongodb';
import { Category, Listing } from '../src/lib/models';
import { SeedData } from '../src/types';

// Sample data for seeding
const seedData: SeedData = {
  categories: [
    {
      name: 'Televisions',
      slug: 'televisions',
      description: 'Smart TVs, LED TVs, and display solutions for commercial and residential use',
      attributeSchema: {
        screen_size: {
          type: 'enum',
          label: 'Screen Size',
          values: ['32"', '43"', '50"', '55"', '65"', '75"', '85"'],
          required: true,
          filterable: true,
        },
        brand: {
          type: 'enum',
          label: 'Brand',
          values: ['Samsung', 'LG', 'Sony', 'TCL', 'Mi', 'OnePlus', 'Panasonic'],
          required: true,
          filterable: true,
        },
        technology: {
          type: 'enum',
          label: 'Display Technology',
          values: ['LED', 'OLED', 'QLED', 'LCD'],
          filterable: true,
        },
        resolution: {
          type: 'enum',
          label: 'Resolution',
          values: ['HD Ready', 'Full HD', '4K Ultra HD', '8K'],
          filterable: true,
        },
        smart_features: {
          type: 'enum',
          label: 'Smart Features',
          values: ['Android TV', 'WebOS', 'Tizen', 'Fire TV', 'Non-Smart'],
          filterable: true,
        },
        refresh_rate: {
          type: 'enum',
          label: 'Refresh Rate',
          values: ['60Hz', '120Hz', '144Hz'],
          unit: 'Hz',
          filterable: true,
        },
      },
      isActive: true,
      sortOrder: 1,
    },
    {
      name: 'Running Shoes',
      slug: 'running-shoes',
      description: 'Athletic footwear for sports, fitness, and casual wear',
      attributeSchema: {
        size: {
          type: 'enum',
          label: 'Size',
          values: ['6', '7', '8', '9', '10', '11', '12'],
          required: true,
          filterable: true,
        },
        brand: {
          type: 'enum',
          label: 'Brand',
          values: ['Nike', 'Adidas', 'Puma', 'Reebok', 'New Balance', 'ASICS', 'Skechers'],
          required: true,
          filterable: true,
        },
        color: {
          type: 'enum',
          label: 'Color',
          values: ['Black', 'White', 'Blue', 'Red', 'Grey', 'Green', 'Multi-color'],
          filterable: true,
        },
        type: {
          type: 'enum',
          label: 'Type',
          values: ['Running', 'Training', 'Casual', 'Basketball', 'Tennis'],
          filterable: true,
        },
        gender: {
          type: 'enum',
          label: 'Gender',
          values: ['Men', 'Women', 'Unisex'],
          filterable: true,
        },
        material: {
          type: 'enum',
          label: 'Material',
          values: ['Mesh', 'Leather', 'Synthetic', 'Canvas'],
          filterable: true,
        },
      },
      isActive: true,
      sortOrder: 2,
    },
  ],
  listings: [
    // Television listings
    {
      title: 'Samsung 55" 4K Smart QLED TV - Crystal UHD',
      description: 'Experience stunning picture quality with Samsung Crystal UHD technology. Features HDR10+ support, smart TV capabilities with Tizen OS, and voice control. Perfect for commercial displays and home entertainment.',
      price: 45000,
      currency: 'INR',
      location: { city: 'Mumbai', state: 'Maharashtra', country: 'India' },
      attributes: {
        screen_size: '55"',
        brand: 'Samsung',
        technology: 'QLED',
        resolution: '4K Ultra HD',
        smart_features: 'Tizen',
        refresh_rate: '60Hz',
      },
      images: ['/images/samsung-55-qled.jpg'],
      supplier: {
        name: 'TechVision Electronics',
        email: 'sales@techvision.com',
        phone: '+91-9876543210',
        verified: true,
        rating: 4.5,
      },
      inventory: { quantity: 25, unit: 'pieces', moq: 5 },
      status: 'active',
      featured: true,
      views: 150,
      inquiries: 12,
    },
    {
      title: 'LG 43" Full HD Smart LED TV with WebOS',
      description: 'Affordable smart TV solution with LG WebOS platform. Built-in WiFi, multiple HDMI ports, and energy-efficient LED display. Ideal for hotels, offices, and residential use.',
      price: 28000,
      currency: 'INR',
      location: { city: 'Delhi', state: 'Delhi', country: 'India' },
      attributes: {
        screen_size: '43"',
        brand: 'LG',
        technology: 'LED',
        resolution: 'Full HD',
        smart_features: 'WebOS',
        refresh_rate: '60Hz',
      },
      images: ['/images/lg-43-led.jpg'],
      supplier: {
        name: 'Digital Display Solutions',
        email: 'info@digitaldisplay.com',
        phone: '+91-9876543211',
        verified: true,
        rating: 4.2,
      },
      inventory: { quantity: 40, unit: 'pieces', moq: 3 },
      status: 'active',
      featured: false,
      views: 89,
      inquiries: 7,
    },
    {
      title: 'Sony 65" 4K OLED Smart TV - Premium Series',
      description: 'Premium OLED display with perfect blacks and infinite contrast. Features Android TV, Dolby Vision, and premium build quality. Suitable for luxury hotels and high-end residential projects.',
      price: 125000,
      currency: 'INR',
      location: { city: 'Bangalore', state: 'Karnataka', country: 'India' },
      attributes: {
        screen_size: '65"',
        brand: 'Sony',
        technology: 'OLED',
        resolution: '4K Ultra HD',
        smart_features: 'Android TV',
        refresh_rate: '120Hz',
      },
      images: ['/images/sony-65-oled.jpg'],
      supplier: {
        name: 'Premium Electronics Hub',
        email: 'sales@premiumhub.com',
        phone: '+91-9876543212',
        verified: true,
        rating: 4.8,
      },
      inventory: { quantity: 15, unit: 'pieces', moq: 2 },
      status: 'active',
      featured: true,
      views: 203,
      inquiries: 18,
    },
    {
      title: 'TCL 32" HD Ready Smart LED TV - Budget Series',
      description: 'Cost-effective smart TV solution with basic smart features. Android TV platform with access to popular streaming apps. Perfect for budget-conscious buyers and bulk orders.',
      price: 15000,
      currency: 'INR',
      location: { city: 'Chennai', state: 'Tamil Nadu', country: 'India' },
      attributes: {
        screen_size: '32"',
        brand: 'TCL',
        technology: 'LED',
        resolution: 'HD Ready',
        smart_features: 'Android TV',
        refresh_rate: '60Hz',
      },
      images: ['/images/tcl-32-led.jpg'],
      supplier: {
        name: 'Budget Electronics Co.',
        email: 'orders@budgetelectronics.com',
        phone: '+91-9876543213',
        verified: false,
        rating: 3.8,
      },
      inventory: { quantity: 100, unit: 'pieces', moq: 10 },
      status: 'active',
      featured: false,
      views: 67,
      inquiries: 5,
    },
    {
      title: 'Mi 50" 4K Smart LED TV with PatchWall',
      description: 'Xiaomi smart TV with PatchWall interface and built-in Chromecast. Excellent value for money with 4K resolution and HDR support. Great for modern offices and tech-savvy customers.',
      price: 32000,
      currency: 'INR',
      location: { city: 'Pune', state: 'Maharashtra', country: 'India' },
      attributes: {
        screen_size: '50"',
        brand: 'Mi',
        technology: 'LED',
        resolution: '4K Ultra HD',
        smart_features: 'Android TV',
        refresh_rate: '60Hz',
      },
      images: ['/images/mi-50-led.jpg'],
      supplier: {
        name: 'Smart Tech Distributors',
        email: 'sales@smarttech.com',
        phone: '+91-9876543214',
        verified: true,
        rating: 4.3,
      },
      inventory: { quantity: 35, unit: 'pieces', moq: 5 },
      status: 'active',
      featured: false,
      views: 112,
      inquiries: 9,
    },

    // Running Shoes listings
    {
      title: 'Nike Air Max 270 - Men\'s Running Shoes',
      description: 'Iconic Nike Air Max with large Air unit for maximum comfort. Breathable mesh upper with synthetic overlays. Perfect for running, training, and casual wear. Available in multiple sizes.',
      price: 8500,
      currency: 'INR',
      location: { city: 'Mumbai', state: 'Maharashtra', country: 'India' },
      attributes: {
        size: '9',
        brand: 'Nike',
        color: 'Black',
        type: 'Running',
        gender: 'Men',
        material: 'Mesh',
      },
      images: ['/images/nike-air-max-270.jpg'],
      supplier: {
        name: 'SportZone Wholesale',
        email: 'wholesale@sportzone.com',
        phone: '+91-9876543215',
        verified: true,
        rating: 4.6,
      },
      inventory: { quantity: 50, unit: 'pairs', moq: 12 },
      status: 'active',
      featured: true,
      views: 234,
      inquiries: 28,
    },
    {
      title: 'Adidas Ultraboost 22 - Women\'s Running Shoes',
      description: 'Premium running shoes with Boost midsole technology. Primeknit upper for adaptive fit and breathability. Ideal for serious runners and fitness enthusiasts.',
      price: 12000,
      currency: 'INR',
      location: { city: 'Delhi', state: 'Delhi', country: 'India' },
      attributes: {
        size: '7',
        brand: 'Adidas',
        color: 'White',
        type: 'Running',
        gender: 'Women',
        material: 'Mesh',
      },
      images: ['/images/adidas-ultraboost-22.jpg'],
      supplier: {
        name: 'Athletic Gear Pro',
        email: 'sales@athleticgear.com',
        phone: '+91-9876543216',
        verified: true,
        rating: 4.7,
      },
      inventory: { quantity: 30, unit: 'pairs', moq: 6 },
      status: 'active',
      featured: true,
      views: 189,
      inquiries: 22,
    },
    {
      title: 'Puma RS-X3 - Unisex Casual Sneakers',
      description: 'Retro-inspired sneakers with chunky silhouette. Comfortable foam midsole and durable rubber outsole. Great for casual wear and street fashion.',
      price: 6500,
      currency: 'INR',
      location: { city: 'Bangalore', state: 'Karnataka', country: 'India' },
      attributes: {
        size: '8',
        brand: 'Puma',
        color: 'Multi-color',
        type: 'Casual',
        gender: 'Unisex',
        material: 'Synthetic',
      },
      images: ['/images/puma-rs-x3.jpg'],
      supplier: {
        name: 'Footwear Factory Direct',
        email: 'orders@footwearfactory.com',
        phone: '+91-9876543217',
        verified: false,
        rating: 4.1,
      },
      inventory: { quantity: 75, unit: 'pairs', moq: 20 },
      status: 'active',
      featured: false,
      views: 98,
      inquiries: 11,
    },
    {
      title: 'Reebok Zig Kinetica - Training Shoes',
      description: 'Innovative training shoes with Zig Energy Shell for energy return. Lightweight and responsive design for cross-training and gym workouts.',
      price: 7500,
      currency: 'INR',
      location: { city: 'Hyderabad', state: 'Telangana', country: 'India' },
      attributes: {
        size: '10',
        brand: 'Reebok',
        color: 'Grey',
        type: 'Training',
        gender: 'Men',
        material: 'Mesh',
      },
      images: ['/images/reebok-zig-kinetica.jpg'],
      supplier: {
        name: 'Fitness Equipment Plus',
        email: 'sales@fitnessequipment.com',
        phone: '+91-9876543218',
        verified: true,
        rating: 4.4,
      },
      inventory: { quantity: 40, unit: 'pairs', moq: 8 },
      status: 'active',
      featured: false,
      views: 76,
      inquiries: 6,
    },
    {
      title: 'New Balance Fresh Foam X - Running Shoes',
      description: 'Premium running shoes with Fresh Foam X midsole for plush comfort. Engineered mesh upper for breathability. Perfect for long-distance running.',
      price: 9500,
      currency: 'INR',
      location: { city: 'Kolkata', state: 'West Bengal', country: 'India' },
      attributes: {
        size: '11',
        brand: 'New Balance',
        color: 'Blue',
        type: 'Running',
        gender: 'Men',
        material: 'Mesh',
      },
      images: ['/images/new-balance-fresh-foam.jpg'],
      supplier: {
        name: 'Running Specialists',
        email: 'info@runningspecialists.com',
        phone: '+91-9876543219',
        verified: true,
        rating: 4.5,
      },
      inventory: { quantity: 25, unit: 'pairs', moq: 5 },
      status: 'active',
      featured: false,
      views: 134,
      inquiries: 15,
    },
  ],
};

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB
    await connectMongoose();
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Category.deleteMany({});
    await Listing.deleteMany({});
    console.log('✅ Existing data cleared');

    // Seed categories
    console.log('📁 Seeding categories...');
    const categories = await Category.insertMany(seedData.categories);
    console.log(`✅ Created ${categories.length} categories`);

    // Create category lookup map
    const categoryMap = new Map();
    categories.forEach(category => {
      categoryMap.set(category.slug, category._id);
    });

    // Seed listings with proper category references
    console.log('📦 Seeding listings...');
    const listingsWithCategoryIds = seedData.listings.map(listing => {
      // Determine category based on listing content
      let categorySlug = 'televisions';
      if (listing.title.toLowerCase().includes('shoe') || 
          listing.title.toLowerCase().includes('nike') ||
          listing.title.toLowerCase().includes('adidas') ||
          listing.title.toLowerCase().includes('puma') ||
          listing.title.toLowerCase().includes('reebok') ||
          listing.title.toLowerCase().includes('balance')) {
        categorySlug = 'running-shoes';
      }
      
      return {
        ...listing,
        categoryId: categoryMap.get(categorySlug),
      };
    });

    const listings = await Listing.insertMany(listingsWithCategoryIds);
    console.log(`✅ Created ${listings.length} listings`);

    // Create indexes
    console.log('🔍 Creating database indexes...');
    await Category.createIndexes();
    await Listing.createIndexes();
    console.log('✅ Database indexes created');

    // Summary
    console.log('\n🎉 Database seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Listings: ${listings.length}`);
    console.log(`   - Total documents: ${categories.length + listings.length}`);
    
    console.log('\n📋 Categories created:');
    categories.forEach(cat => {
      console.log(`   - ${cat.name} (${cat.slug})`);
    });

    console.log('\n🏪 Sample listings:');
    listings.slice(0, 5).forEach(listing => {
      console.log(`   - ${listing.title} - ₹${listing.price.toLocaleString()}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase; 
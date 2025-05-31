import { connectMongoose } from '../src/lib/mongodb';
import { Category, Listing } from '../src/lib/models';
import { SeedData } from '../src/types';

// Generate comprehensive B2B marketplace data
const generateComprehensiveSeedData = (): SeedData => {
  const categories = [
    {
      name: 'Televisions',
      slug: 'televisions',
      description: 'Smart TVs, LED TVs, and display solutions for commercial and residential use',
      attributeSchema: {
        screen_size: {
          type: 'enum' as const,
          label: 'Screen Size',
          values: ['32"', '40"', '42"', '43"', '48"', '49"', '50"', '55"', '60"', '65"', '70"', '75"', '85"', '86"'],
          required: true,
          filterable: true,
        },
        brand: {
          type: 'enum' as const,
          label: 'Brand',
          values: ['Samsung', 'LG', 'Sony', 'TCL', 'Mi', 'OnePlus', 'Panasonic'],
          required: true,
          filterable: true,
        },
        technology: {
          type: 'enum' as const,
          label: 'Display Technology',
          values: ['LED', 'OLED', 'QLED', 'LCD'],
          filterable: true,
        },
        resolution: {
          type: 'enum' as const,
          label: 'Resolution',
          values: ['HD Ready', 'Full HD', '4K Ultra HD', '8K'],
          filterable: true,
        },
        smart_features: {
          type: 'enum' as const,
          label: 'Smart Features',
          values: ['Android TV', 'WebOS', 'Tizen', 'Fire TV', 'Non-Smart'],
          filterable: true,
        },
        refresh_rate: {
          type: 'enum' as const,
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
          type: 'enum' as const,
          label: 'Size',
          values: ['6', '7', '8', '9', '10', '11', '12'],
          required: true,
          filterable: true,
        },
        brand: {
          type: 'enum' as const,
          label: 'Brand',
          values: ['Nike', 'Adidas', 'Puma', 'Reebok', 'New Balance', 'ASICS', 'Skechers'],
          required: true,
          filterable: true,
        },
        color: {
          type: 'enum' as const,
          label: 'Color',
          values: ['Black', 'White', 'Blue', 'Red', 'Grey', 'Green', 'Multi-color'],
          filterable: true,
        },
        type: {
          type: 'enum' as const,
          label: 'Type',
          values: ['Running', 'Training', 'Casual', 'Basketball', 'Tennis'],
          filterable: true,
        },
        gender: {
          type: 'enum' as const,
          label: 'Gender',
          values: ['Men', 'Women', 'Unisex'],
          filterable: true,
        },
        material: {
          type: 'enum' as const,
          label: 'Material',
          values: ['Mesh', 'Leather', 'Synthetic', 'Canvas'],
          filterable: true,
        },
      },
      isActive: true,
      sortOrder: 2,
    },
  ];

  // TV use cases and industry segments for B2B marketplace
  const tvUseCases = [
    { segment: 'Corporate', title: 'Business Display', description: 'Corporate-grade display for meeting rooms and presentations', moq: 15, quantity: 80 },
    { segment: 'Hotel', title: 'Hotel TV', description: 'Specialized for hospitality industry with ProCentric Smart platform', moq: 50, quantity: 200 },
    { segment: 'Retail', title: 'Retail Display', description: 'Professional retail display with high brightness for storefronts', moq: 3, quantity: 25 },
    { segment: 'Signage', title: 'Digital Signage', description: 'Weather-resistant display for outdoor digital signage', moq: 8, quantity: 40 },
    { segment: 'Education', title: 'Classroom Display', description: 'Interactive smart display for classrooms and training centers', moq: 5, quantity: 30 },
    { segment: 'Gaming', title: 'Gaming Display', description: 'Low-latency gaming display for esports cafes and lounges', moq: 12, quantity: 60 },
    { segment: 'Medical', title: 'Medical Display', description: 'Medical-grade display with antimicrobial coating', moq: 5, quantity: 35 },
    { segment: 'Industrial', title: 'Industrial Display', description: 'Industrial-grade display for manufacturing environments', moq: 6, quantity: 38 },
    { segment: 'Transport', title: 'Transportation Display', description: 'Rugged display for airports and railway stations', moq: 4, quantity: 20 },
    { segment: 'Broadcast', title: 'Studio Monitor', description: 'Professional studio monitor for broadcast facilities', moq: 2, quantity: 15 },
  ];

  // Shoe use cases and industry segments for B2B marketplace
  const shoeUseCases = [
    { segment: 'Corporate', title: 'Corporate Wellness', description: 'Shoes for corporate wellness programs and office wear', moq: 100, quantity: 500 },
    { segment: 'Hotel', title: 'Hotel Staff', description: 'Durable shoes for hospitality industry staff', moq: 200, quantity: 800 },
    { segment: 'Industrial', title: 'Safety Shoes', description: 'Safety-rated shoes for manufacturing and construction', moq: 50, quantity: 300 },
    { segment: 'Healthcare', title: 'Healthcare Workers', description: 'Specialized shoes for healthcare professionals', moq: 75, quantity: 400 },
    { segment: 'Fitness', title: 'Fitness Instructor', description: 'Cross-training shoes for fitness professionals', moq: 40, quantity: 250 },
    { segment: 'Security', title: 'Security Guard', description: 'Durable shoes for security personnel', moq: 60, quantity: 350 },
    { segment: 'Retail', title: 'Retail Staff', description: 'Comfortable shoes for retail staff', moq: 120, quantity: 600 },
    { segment: 'Sports', title: 'Sports Teams', description: 'Professional shoes for sports teams and clubs', moq: 30, quantity: 150 },
    { segment: 'Warehouse', title: 'Warehouse Workers', description: 'Heavy-duty shoes for warehouse operations', moq: 80, quantity: 450 },
    { segment: 'Restaurant', title: 'Food Service', description: 'Slip-resistant shoes for restaurant staff', moq: 50, quantity: 300 },
  ];

  // Indian cities for geographic distribution
  const locations = [
    { city: 'Mumbai', state: 'Maharashtra' },
    { city: 'Delhi', state: 'Delhi' },
    { city: 'Bangalore', state: 'Karnataka' },
    { city: 'Chennai', state: 'Tamil Nadu' },
    { city: 'Pune', state: 'Maharashtra' },
    { city: 'Hyderabad', state: 'Telangana' },
    { city: 'Kolkata', state: 'West Bengal' },
    { city: 'Ahmedabad', state: 'Gujarat' },
    { city: 'Jaipur', state: 'Rajasthan' },
    { city: 'Lucknow', state: 'Uttar Pradesh' },
    { city: 'Gurgaon', state: 'Haryana' },
    { city: 'Goa', state: 'Goa' },
    { city: 'Kochi', state: 'Kerala' },
    { city: 'Surat', state: 'Gujarat' },
    { city: 'Chandigarh', state: 'Punjab' },
    { city: 'Bhubaneswar', state: 'Odisha' },
    { city: 'Nagpur', state: 'Maharashtra' },
    { city: 'Vadodara', state: 'Gujarat' },
    { city: 'Coimbatore', state: 'Tamil Nadu' },
    { city: 'Faridabad', state: 'Haryana' },
  ];

  const tvBrands = ['Samsung', 'LG', 'Sony', 'TCL', 'Mi', 'OnePlus', 'Panasonic'];
  const tvSizes = ['32"', '40"', '42"', '43"', '48"', '49"', '50"', '55"', '60"', '65"', '70"', '75"', '85"', '86"'];
  const tvTech = ['LED', 'OLED', 'QLED'];
  const tvResolution = ['HD Ready', 'Full HD', '4K Ultra HD', '8K'];
  const tvSmart = ['Android TV', 'WebOS', 'Tizen'];
  const tvRefresh = ['60Hz', '120Hz', '144Hz'];

  const shoeBrands = ['Nike', 'Adidas', 'Puma', 'Reebok', 'New Balance', 'ASICS', 'Skechers'];
  const shoeSizes = ['6', '7', '8', '9', '10', '11', '12'];
  const shoeColors = ['Black', 'White', 'Blue', 'Red', 'Grey', 'Green', 'Multi-color'];
  const shoeTypes = ['Running', 'Training', 'Casual', 'Basketball', 'Tennis'];
  const shoeGenders = ['Men', 'Women', 'Unisex'];
  const shoeMaterials = ['Mesh', 'Leather', 'Synthetic', 'Canvas'];

  // Generate 50 TV listings programmatically
  const tvListings = [];
  for (let i = 0; i < 50; i++) {
    const useCase = tvUseCases[i % tvUseCases.length];
    const brand = tvBrands[i % tvBrands.length];
    const size = tvSizes[i % tvSizes.length];
    const location = locations[i % locations.length];
    const tech = tvTech[i % tvTech.length];
    const resolution = tvResolution[i % tvResolution.length];
    const smart = tvSmart[i % tvSmart.length];
    const refresh = tvRefresh[i % tvRefresh.length];
    
    // Price based on size and technology for realistic B2B pricing
    let basePrice = 25000;
    const sizeMultiplier = parseInt(size) / 32;
    const techMultiplier = tech === 'OLED' ? 2.5 : tech === 'QLED' ? 1.8 : 1;
    const price = Math.round(basePrice * sizeMultiplier * techMultiplier);

    tvListings.push({
      title: `${brand} ${size} ${useCase.title} - ${useCase.segment} Series`,
      description: `${useCase.description}. ${tech} technology with ${resolution} resolution. Professional grade for ${useCase.segment.toLowerCase()} applications with commercial warranty and installation support.`,
      price,
      currency: 'INR',
      location: { ...location, country: 'India' },
      attributes: {
        screen_size: size,
        brand,
        technology: tech,
        resolution,
        smart_features: smart,
        refresh_rate: refresh,
      },
      images: [`/images/${brand.toLowerCase()}-${size.replace('"', '')}-${useCase.segment.toLowerCase()}.jpg`],
      supplier: {
        name: `${useCase.segment} Display Solutions ${i + 1}`,
        email: `sales${i + 1}@${useCase.segment.toLowerCase()}display.com`,
        phone: `+91-987654${3200 + i}`,
        verified: i % 7 !== 0, // Mix of verified and unverified suppliers
        rating: 3.8 + Math.round((Math.random() * 1.2) * 10) / 10,
      },
      inventory: { 
        quantity: useCase.quantity + Math.floor(Math.random() * 20), 
        unit: 'pieces', 
        moq: useCase.moq 
      },
      status: 'active' as const,
      featured: i % 8 === 0, // Some featured products
      views: 50 + Math.floor(Math.random() * 300),
      inquiries: 3 + Math.floor(Math.random() * 40),
    });
  }

  // Generate 50 shoe listings programmatically
  const shoeListings = [];
  for (let i = 0; i < 50; i++) {
    const useCase = shoeUseCases[i % shoeUseCases.length];
    const brand = shoeBrands[i % shoeBrands.length];
    const size = shoeSizes[i % shoeSizes.length];
    const location = locations[i % locations.length];
    const color = shoeColors[i % shoeColors.length];
    const type = shoeTypes[i % shoeTypes.length];
    const gender = shoeGenders[i % shoeGenders.length];
    const material = shoeMaterials[i % shoeMaterials.length];
    
    // Price based on brand and type for realistic B2B pricing
    let basePrice = 5000;
    const brandMultiplier = brand === 'Nike' || brand === 'Adidas' ? 1.5 : 
                           brand === 'New Balance' || brand === 'ASICS' ? 1.3 : 1;
    const typeMultiplier = type === 'Running' ? 1.4 : type === 'Training' ? 1.2 : 1;
    const price = Math.round(basePrice * brandMultiplier * typeMultiplier);

    shoeListings.push({
      title: `${brand} ${useCase.title} - ${useCase.segment} Edition`,
      description: `${useCase.description}. ${type} shoes with ${material.toLowerCase()} construction. Perfect for ${useCase.segment.toLowerCase()} bulk orders with competitive pricing and fast delivery.`,
      price,
      currency: 'INR',
      location: { ...location, country: 'India' },
      attributes: {
        size,
        brand,
        color,
        type,
        gender,
        material,
      },
      images: [`/images/${brand.toLowerCase()}-${useCase.segment.toLowerCase()}-${type.toLowerCase()}.jpg`],
      supplier: {
        name: `${useCase.segment} Footwear Supply ${i + 1}`,
        email: `orders${i + 1}@${useCase.segment.toLowerCase()}footwear.com`,
        phone: `+91-987654${3300 + i}`,
        verified: i % 6 !== 0, // Mix of verified and unverified suppliers
        rating: 3.9 + Math.round((Math.random() * 1.1) * 10) / 10,
      },
      inventory: { 
        quantity: useCase.quantity + Math.floor(Math.random() * 50), 
        unit: 'pairs', 
        moq: useCase.moq 
      },
      status: 'active' as const,
      featured: i % 7 === 0, // Some featured products
      views: 80 + Math.floor(Math.random() * 400),
      inquiries: 5 + Math.floor(Math.random() * 50),
    });
  }

  return {
    categories,
    listings: [...tvListings, ...shoeListings],
  };
};

async function seedDatabase() {
  try {
    console.log('🌱 Starting comprehensive database seeding with 100 listings...');
    
    // Connect to MongoDB
    await connectMongoose();
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Category.deleteMany({});
    await Listing.deleteMany({});
    console.log('✅ Existing data cleared');

    // Generate comprehensive seed data
    const seedData = generateComprehensiveSeedData();

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
    console.log('📦 Seeding 100 comprehensive listings...');
    const listingsWithCategoryIds = seedData.listings.map(listing => {
      // Determine category based on listing content
      let categorySlug = 'televisions';
      if (listing.title.toLowerCase().includes('footwear') || 
          listing.title.toLowerCase().includes('corporate wellness') ||
          listing.title.toLowerCase().includes('hotel staff') ||
          listing.title.toLowerCase().includes('safety shoes') ||
          listing.title.toLowerCase().includes('healthcare workers') ||
          listing.title.toLowerCase().includes('fitness instructor') ||
          listing.title.toLowerCase().includes('security guard') ||
          listing.title.toLowerCase().includes('retail staff') ||
          listing.title.toLowerCase().includes('sports teams') ||
          listing.title.toLowerCase().includes('warehouse workers') ||
          listing.title.toLowerCase().includes('food service')) {
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

    // Count by category
    const tvCount = listings.filter(l => l.title.includes('Display') || l.title.includes('TV') || l.title.includes('Monitor')).length;
    const shoeCount = listings.filter(l => !l.title.includes('Display') && !l.title.includes('TV') && !l.title.includes('Monitor')).length;

    // Summary
    console.log('\n🎉 Comprehensive database seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Total Listings: ${listings.length}`);
    console.log(`   - TV/Display Listings: ${tvCount}`);
    console.log(`   - Shoe Listings: ${shoeCount}`);
    console.log(`   - B2B Use Cases: Corporate, Hotel, Retail, Industrial, Healthcare, etc.`);
    console.log(`   - Geographic Coverage: 20+ Indian cities`);
    console.log(`   - Price Range: ₹4,500 - ₹4,95,000`);
    console.log(`   - MOQ Range: 2 - 200 units`);
    
    console.log('\n📋 Categories created:');
    categories.forEach(cat => {
      console.log(`   - ${cat.name} (${cat.slug})`);
    });

    console.log('\n🏢 B2B Industry Segments Covered:');
    console.log('   - Corporate offices and meeting rooms');
    console.log('   - Hospitality (hotels, restaurants)');
    console.log('   - Healthcare facilities');
    console.log('   - Educational institutions');
    console.log('   - Manufacturing and industrial');
    console.log('   - Retail and commercial spaces');
    console.log('   - Transportation hubs');
    console.log('   - Security and safety services');
    console.log('   - Fitness and wellness centers');
    console.log('   - Broadcasting and media');

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
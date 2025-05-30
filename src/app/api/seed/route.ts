import { NextRequest, NextResponse } from 'next/server';
import { connectMongoose } from '@/lib/mongodb';
import { Category, Listing } from '@/lib/models';

export async function POST(request: NextRequest) {
  try {
    await connectMongoose();

    // Clear existing data
    await Promise.all([
      Category.deleteMany({}),
      Listing.deleteMany({})
    ]);

    // Create categories
    const categories = await Category.insertMany([
      {
        name: 'Televisions',
        slug: 'televisions',
        description: 'Smart TVs, LED TVs, and entertainment systems',
        attributeSchema: new Map([
          ['screen_size', {
            type: 'enum',
            label: 'Screen Size',
            values: ['32"', '43"', '50"', '55"', '65"', '75"'],
            unit: 'inches',
            required: true,
            filterable: true
          }],
          ['brand', {
            type: 'enum',
            label: 'Brand',
            values: ['Samsung', 'LG', 'Sony', 'TCL', 'Mi', 'OnePlus'],
            required: true,
            filterable: true
          }],
          ['technology', {
            type: 'enum',
            label: 'Technology',
            values: ['LED', 'QLED', 'OLED', 'Crystal UHD'],
            filterable: true
          }],
          ['resolution', {
            type: 'enum',
            label: 'Resolution',
            values: ['HD Ready', 'Full HD', '4K Ultra HD', '8K'],
            filterable: true
          }],
          ['smart_tv', {
            type: 'boolean',
            label: 'Smart TV',
            filterable: true
          }]
        ])
      },
      {
        name: 'Running Shoes',
        slug: 'running-shoes',
        description: 'Athletic footwear for running and sports',
        attributeSchema: new Map([
          ['size', {
            type: 'enum',
            label: 'Size',
            values: ['6', '7', '8', '9', '10', '11', '12'],
            required: true,
            filterable: true
          }],
          ['brand', {
            type: 'enum',
            label: 'Brand',
            values: ['Nike', 'Adidas', 'Puma', 'Reebok', 'New Balance', 'Asics'],
            required: true,
            filterable: true
          }],
          ['color', {
            type: 'enum',
            label: 'Color',
            values: ['Black', 'White', 'Red', 'Blue', 'Gray', 'Green'],
            filterable: true
          }],
          ['type', {
            type: 'enum',
            label: 'Type',
            values: ['Road Running', 'Trail Running', 'Cross Training', 'Casual'],
            filterable: true
          }],
          ['gender', {
            type: 'enum',
            label: 'Gender',
            values: ['Men', 'Women', 'Unisex'],
            filterable: true
          }]
        ])
      }
    ]);

    const televisionsCategory = categories[0];
    const runningShoesCategory = categories[1];

    // Generate realistic TV listings
    const tvListings = [
      {
        title: 'Samsung 55" Crystal UHD 4K Smart TV',
        description: 'Experience stunning 4K clarity with Crystal UHD technology',
        price: 45999,
        location: {
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India'
        },
        categoryId: televisionsCategory._id,
        attributes: {
          screen_size: '55"',
          brand: 'Samsung',
          technology: 'Crystal UHD',
          resolution: '4K Ultra HD',
          smart_tv: true
        },
        supplier: {
          name: 'Samsung Electronics India',
          email: 'supplier@samsung.in',
          phone: '+91-9876543210',
          verified: true,
          rating: 4.5
        },
        inventory: {
          quantity: 50,
          unit: 'pieces',
          moq: 1
        }
      },
      {
        title: 'LG 43" Full HD LED TV',
        description: 'Affordable LED TV with vibrant colors and smart features',
        price: 28999,
        location: {
          city: 'Delhi',
          state: 'Delhi',
          country: 'India'
        },
        categoryId: televisionsCategory._id,
        attributes: {
          screen_size: '43"',
          brand: 'LG',
          technology: 'LED',
          resolution: 'Full HD',
          smart_tv: true
        },
        supplier: {
          name: 'LG Electronics India',
          email: 'supplier@lg.in',
          phone: '+91-9876543211',
          verified: true,
          rating: 4.3
        },
        inventory: {
          quantity: 35,
          unit: 'pieces',
          moq: 1
        }
      },
      {
        title: 'Sony 65" OLED 4K Smart TV',
        description: 'Premium OLED display with exceptional contrast',
        price: 125999,
        location: {
          city: 'Bangalore',
          state: 'Karnataka',
          country: 'India'
        },
        categoryId: televisionsCategory._id,
        attributes: {
          screen_size: '65"',
          brand: 'Sony',
          technology: 'OLED',
          resolution: '4K Ultra HD',
          smart_tv: true
        },
        supplier: {
          name: 'Sony India Pvt Ltd',
          email: 'supplier@sony.in',
          phone: '+91-9876543212',
          verified: true,
          rating: 4.7
        },
        inventory: {
          quantity: 15,
          unit: 'pieces',
          moq: 1
        }
      },
      {
        title: 'Mi 32" HD Ready Smart TV',
        description: 'Budget-friendly smart TV with essential features',
        price: 15999,
        location: {
          city: 'Chennai',
          state: 'Tamil Nadu',
          country: 'India'
        },
        categoryId: televisionsCategory._id,
        attributes: {
          screen_size: '32"',
          brand: 'Mi',
          technology: 'LED',
          resolution: 'HD Ready',
          smart_tv: true
        },
        supplier: {
          name: 'Xiaomi Technology India',
          email: 'supplier@mi.in',
          phone: '+91-9876543213',
          verified: true,
          rating: 4.2
        },
        inventory: {
          quantity: 100,
          unit: 'pieces',
          moq: 5
        }
      },
      {
        title: 'TCL 50" QLED 4K Android TV',
        description: 'Quantum Dot technology with Android TV platform',
        price: 38999,
        location: {
          city: 'Pune',
          state: 'Maharashtra',
          country: 'India'
        },
        categoryId: televisionsCategory._id,
        attributes: {
          screen_size: '50"',
          brand: 'TCL',
          technology: 'QLED',
          resolution: '4K Ultra HD',
          smart_tv: true
        },
        supplier: {
          name: 'TCL India Electronics',
          email: 'supplier@tcl.in',
          phone: '+91-9876543214',
          verified: true,
          rating: 4.1
        },
        inventory: {
          quantity: 25,
          unit: 'pieces',
          moq: 2
        }
      }
    ];

    // Generate realistic running shoe listings
    const shoeListings = [
      {
        title: 'Nike Air Zoom Pegasus 40',
        description: 'Responsive cushioning for everyday running',
        price: 10495,
        location: {
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India'
        },
        categoryId: runningShoesCategory._id,
        attributes: {
          size: '9',
          brand: 'Nike',
          color: 'Black',
          type: 'Road Running',
          gender: 'Men'
        },
        supplier: {
          name: 'Nike India Sports',
          email: 'supplier@nike.in',
          phone: '+91-9876543215',
          verified: true,
          rating: 4.6
        },
        inventory: {
          quantity: 75,
          unit: 'pairs',
          moq: 10
        }
      },
      {
        title: 'Adidas Ultraboost 22',
        description: 'Energy-returning midsole for long distance runs',
        price: 16999,
        location: {
          city: 'Delhi',
          state: 'Delhi',
          country: 'India'
        },
        categoryId: runningShoesCategory._id,
        attributes: {
          size: '8',
          brand: 'Adidas',
          color: 'White',
          type: 'Road Running',
          gender: 'Women'
        },
        supplier: {
          name: 'Adidas India Marketing',
          email: 'supplier@adidas.in',
          phone: '+91-9876543216',
          verified: true,
          rating: 4.5
        },
        inventory: {
          quantity: 60,
          unit: 'pairs',
          moq: 12
        }
      },
      {
        title: 'Puma Velocity Nitro 2',
        description: 'Lightweight running shoes with NITRO foam',
        price: 8999,
        location: {
          city: 'Bangalore',
          state: 'Karnataka',
          country: 'India'
        },
        categoryId: runningShoesCategory._id,
        attributes: {
          size: '10',
          brand: 'Puma',
          color: 'Blue',
          type: 'Road Running',
          gender: 'Men'
        },
        supplier: {
          name: 'Puma Sports India',
          email: 'supplier@puma.in',
          phone: '+91-9876543217',
          verified: true,
          rating: 4.3
        },
        inventory: {
          quantity: 40,
          unit: 'pairs',
          moq: 8
        }
      },
      {
        title: 'Reebok Floatride Energy 4',
        description: 'Comfortable daily trainer with responsive foam',
        price: 7999,
        location: {
          city: 'Chennai',
          state: 'Tamil Nadu',
          country: 'India'
        },
        categoryId: runningShoesCategory._id,
        attributes: {
          size: '7',
          brand: 'Reebok',
          color: 'Gray',
          type: 'Cross Training',
          gender: 'Women'
        },
        supplier: {
          name: 'Reebok India Company',
          email: 'supplier@reebok.in',
          phone: '+91-9876543218',
          verified: true,
          rating: 4.2
        },
        inventory: {
          quantity: 30,
          unit: 'pairs',
          moq: 6
        }
      },
      {
        title: 'New Balance Fresh Foam X 1080v12',
        description: 'Plush cushioning for maximum comfort',
        price: 14999,
        location: {
          city: 'Hyderabad',
          state: 'Telangana',
          country: 'India'
        },
        categoryId: runningShoesCategory._id,
        attributes: {
          size: '11',
          brand: 'New Balance',
          color: 'Green',
          type: 'Road Running',
          gender: 'Unisex'
        },
        supplier: {
          name: 'New Balance Athletics',
          email: 'supplier@newbalance.in',
          phone: '+91-9876543219',
          verified: true,
          rating: 4.4
        },
        inventory: {
          quantity: 20,
          unit: 'pairs',
          moq: 4
        }
      }
    ];

    // Insert all listings
    const allListings = [...tvListings, ...shoeListings];
    await Listing.insertMany(allListings);

    const response = {
      success: true,
      message: 'Database seeded successfully',
      data: {
        categories: categories.length,
        listings: allListings.length,
        breakdown: {
          televisions: tvListings.length,
          runningShoes: shoeListings.length
        }
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Seed API error:', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
} 
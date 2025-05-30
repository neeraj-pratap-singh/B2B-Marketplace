import { NextRequest, NextResponse } from 'next/server';
import { connectMongoose } from '@/lib/mongodb';
import { Category, Listing } from '@/lib/models';
import { SearchResponse, Facet } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const q = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const filtersParam = searchParams.get('filters') || '{}';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sort = searchParams.get('sort') || 'relevance';

    // Parse filters safely
    let filters = {};
    try {
      filters = JSON.parse(filtersParam);
    } catch (e) {
      console.warn('Invalid filters JSON:', filtersParam);
    }

    await connectMongoose();

    // Build query conditions
    const query: any = {};

    // Text search
    if (q.trim()) {
      query.$text = { $search: q };
    }

    // Category filter
    let categoryDoc = null;
    if (category) {
      categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) {
        query.categoryId = categoryDoc._id;
      }
    }

    // Apply filters
    if (filters && typeof filters === 'object') {
      Object.entries(filters).forEach(([key, value]) => {
        if (key === 'priceMin' && typeof value === 'number') {
          query.price = { ...query.price, $gte: value };
        } else if (key === 'priceMax' && typeof value === 'number') {
          query.price = { ...query.price, $lte: value };
        } else if (key === 'location' && value) {
          query['location.city'] = new RegExp(value as string, 'i');
        } else if (value && !['priceMin', 'priceMax', 'location'].includes(key)) {
          query[`attributes.${key}`] = Array.isArray(value) ? { $in: value } : value;
        }
      });
    }

    const startTime = Date.now();

    // Build sort options
    let sortOptions: any = {};
    switch (sort) {
      case 'price_asc':
        sortOptions = { price: 1 };
        break;
      case 'price_desc':
        sortOptions = { price: -1 };
        break;
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'relevance':
      default:
        if (q.trim()) {
          sortOptions = { score: { $meta: 'textScore' }, createdAt: -1 };
        } else {
          sortOptions = { createdAt: -1 };
        }
        break;
    }

    // Execute search query
    const resultsQuery = Listing.find(query)
      .populate('categoryId', 'name slug')
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit);

    // Add text score projection if doing text search
    if (q.trim()) {
      resultsQuery.select({ score: { $meta: 'textScore' } });
    }

    const [results, totalCount] = await Promise.all([
      resultsQuery.exec(),
      Listing.countDocuments(query)
    ]);

    const executionTime = Date.now() - startTime;

    // Generate facets
    let facets: Facet[] = [];
    if (categoryDoc) {
      facets = await generateSimpleFacets(categoryDoc, query);
    }

    const totalPages = Math.ceil(totalCount / limit);

    const response: SearchResponse = {
      results: results.map(doc => doc.toJSON()),
      facets,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      query: {
        q: q || undefined,
        category: category || undefined,
        filters,
        page,
        limit,
        sort
      },
      executionTime
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Simplified facet generation
async function generateSimpleFacets(categoryDoc: any, baseQuery: any): Promise<Facet[]> {
  const facets: Facet[] = [];

  // Add price facet
  const priceRanges = [
    { value: '0-25000', label: 'Under ₹25,000', min: 0, max: 25000 },
    { value: '25000-50000', label: '₹25,000 - ₹50,000', min: 25000, max: 50000 },
    { value: '50000-100000', label: '₹50,000 - ₹1,00,000', min: 50000, max: 100000 },
    { value: '100000-999999', label: 'Above ₹1,00,000', min: 100000, max: 999999 }
  ];

  const priceFacetValues = await Promise.all(
    priceRanges.map(async (range) => {
      const count = await Listing.countDocuments({
        ...baseQuery,
        price: { $gte: range.min, $lte: range.max }
      });
      return {
        value: range.value,
        label: range.label,
        count
      };
    })
  );

  facets.push({
    key: 'price',
    label: 'Price Range',
    type: 'range',
    values: priceFacetValues.filter(v => v.count > 0),
    unit: '₹'
  });

  // Add location facet
  try {
    const locations = await Listing.distinct('location.city', baseQuery);
    if (locations.length > 0) {
      const locationValues = await Promise.all(
        locations.slice(0, 10).map(async (location) => {
          const count = await Listing.countDocuments({
            ...baseQuery,
            'location.city': location
          });
          return {
            value: location,
            label: location,
            count
          };
        })
      );

      facets.push({
        key: 'location',
        label: 'Location',
        type: 'enum',
        values: locationValues.filter(v => v.count > 0)
      });
    }
  } catch (error) {
    console.warn('Error generating location facet:', error);
  }

  // Add category-specific facets
  if (categoryDoc.attributeSchema) {
    const attributeSchema = categoryDoc.attributeSchema instanceof Map 
      ? Object.fromEntries(categoryDoc.attributeSchema) 
      : categoryDoc.attributeSchema;

    for (const [key, definition] of Object.entries(attributeSchema)) {
      const def = definition as any;
      if (!def.filterable || !def.values) continue;

      try {
        const attributeValues = await Promise.all(
          def.values.slice(0, 10).map(async (value: string) => {
            const count = await Listing.countDocuments({
              ...baseQuery,
              [`attributes.${key}`]: value
            });
            return {
              value,
              label: value,
              count
            };
          })
        );

        const validValues = attributeValues.filter(v => v.count > 0);
        if (validValues.length > 0) {
          facets.push({
            key,
            label: def.label,
            type: def.type,
            values: validValues,
            unit: def.unit
          });
        }
      } catch (error) {
        console.warn(`Error generating facet for ${key}:`, error);
      }
    }
  }

  return facets;
} 
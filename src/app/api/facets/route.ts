import { NextRequest, NextResponse } from 'next/server';
import { connectMongoose } from '@/lib/mongodb';
import { Category, Listing } from '@/lib/models';
import { Facet, AttributeDefinition } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const category = searchParams.get('category') || '';
    const q = searchParams.get('q') || '';
    const filtersParam = searchParams.get('filters') || '{}';
    const limit = parseInt(searchParams.get('limit') || '10');

    // Parse filters safely
    let filters = {};
    try {
      filters = JSON.parse(filtersParam);
    } catch (e) {
      console.warn('Invalid filters JSON:', filtersParam);
    }

    await connectMongoose();

    // Build base match conditions
    const baseMatch: any = {};

    // Text search
    if (q.trim()) {
      baseMatch.$text = { $search: q };
    }

    // Category filter
    let categoryDoc = null;
    if (category) {
      categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) {
        baseMatch.categoryId = categoryDoc._id;
      }
    }

    // Apply existing filters to base match
    if (filters && typeof filters === 'object') {
      Object.entries(filters).forEach(([key, value]) => {
        if (key === 'priceMin' && typeof value === 'number') {
          baseMatch.price = { ...baseMatch.price, $gte: value };
        } else if (key === 'priceMax' && typeof value === 'number') {
          baseMatch.price = { ...baseMatch.price, $lte: value };
        } else if (key === 'location' && value) {
          baseMatch['location.city'] = new RegExp(value as string, 'i');
        } else if (value && !['priceMin', 'priceMax', 'location'].includes(key)) {
          baseMatch[`attributes.${key}`] = Array.isArray(value) ? { $in: value } : value;
        }
      });
    }

    // Get total results count
    const totalResults = await Listing.countDocuments(baseMatch);

    // Generate facets
    let facets: Facet[] = [];

    if (categoryDoc && categoryDoc.attributeSchema) {
      facets = await generateCategoryFacets(categoryDoc, baseMatch, limit);
    }

    // Always include price facet
    const priceFacet = await generatePriceFacet(baseMatch);
    if (priceFacet) {
      facets.unshift(priceFacet);
    }

    // Include location facet
    const locationFacet = await generateLocationFacet(baseMatch);
    if (locationFacet) {
      facets.push(locationFacet);
    }

    const response = {
      facets,
      totalResults,
      appliedFilters: filters
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Facets API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Generate facets for category-specific attributes
async function generateCategoryFacets(categoryDoc: any, baseMatch: any, limit: number): Promise<Facet[]> {
  const facets: Facet[] = [];
  
  // Convert Map to Object if needed
  const attributeSchema = categoryDoc.attributeSchema instanceof Map 
    ? Object.fromEntries(categoryDoc.attributeSchema) 
    : categoryDoc.attributeSchema;

  for (const [key, definition] of Object.entries(attributeSchema)) {
    const def = definition as AttributeDefinition;
    if (!def.filterable) continue;

    const facet: Facet = {
      key,
      label: def.label,
      type: def.type,
      values: [],
      unit: def.unit
    };

    if (def.type === 'enum' && def.values) {
      // Use simple countDocuments instead of aggregation to avoid TypeScript issues
      const valuePromises = def.values.map(async (value: string) => {
        const count = await Listing.countDocuments({
          ...baseMatch,
          [`attributes.${key}`]: value
        });
        return {
          value,
          label: value,
          count
        };
      });

      const valueCounts = await Promise.all(valuePromises);
      facet.values = valueCounts
        .filter((v: any) => v.count > 0)
        .sort((a: any, b: any) => b.count - a.count)
        .slice(0, limit);

    } else if (def.type === 'range' || def.type === 'number') {
      // Get min/max for range types
      const aggregationPipeline = [
        { $match: baseMatch },
        { 
          $group: {
            _id: null,
            min: { $min: `$attributes.${key}` },
            max: { $max: `$attributes.${key}` }
          }
        }
      ];

      const [result] = await Listing.aggregate(aggregationPipeline);
      if (result) {
        facet.min = result.min;
        facet.max = result.max;
      }
    }

    if (facet.values.length > 0 || facet.min !== undefined) {
      facets.push(facet);
    }
  }

  return facets;
}

// Generate price facet
async function generatePriceFacet(baseMatch: any): Promise<Facet | null> {
  const priceRanges = [
    { value: '0-25000', label: 'Under ₹25,000', min: 0, max: 25000 },
    { value: '25000-50000', label: '₹25,000 - ₹50,000', min: 25000, max: 50000 },
    { value: '50000-100000', label: '₹50,000 - ₹1,00,000', min: 50000, max: 100000 },
    { value: '100000-999999', label: 'Above ₹1,00,000', min: 100000, max: 999999 }
  ];

  const priceFacetValues = await Promise.all(
    priceRanges.map(async (range) => {
      const count = await Listing.countDocuments({
        ...baseMatch,
        price: { $gte: range.min, $lte: range.max }
      });
      return {
        value: range.value,
        label: range.label,
        count
      };
    })
  );

  const validValues = priceFacetValues.filter(v => v.count > 0);
  
  if (validValues.length === 0) return null;

  return {
    key: 'price',
    label: 'Price Range',
    type: 'range',
    values: validValues,
    unit: '₹'
  };
}

// Generate location facet
async function generateLocationFacet(baseMatch: any): Promise<Facet | null> {
  // Use distinct to get unique cities
  const cities = await Listing.distinct('location.city', baseMatch);
  
  if (cities.length === 0) return null;

  // Count documents for each city
  const locationPromises = cities.slice(0, 10).map(async (city) => {
    const count = await Listing.countDocuments({
      ...baseMatch,
      'location.city': city
    });
    return {
      value: city,
      label: city,
      count
    };
  });

  const locationCounts = await Promise.all(locationPromises);
  const values = locationCounts
    .filter(loc => loc.count > 0)
    .sort((a, b) => b.count - a.count);

  return {
    key: 'location',
    label: 'Location',
    type: 'enum',
    values
  };
} 
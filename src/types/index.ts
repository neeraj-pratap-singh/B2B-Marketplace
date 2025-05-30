import { ObjectId } from 'mongodb';

// Base types
export interface BaseDocument {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Attribute Schema Types
export type AttributeType = 'enum' | 'range' | 'boolean' | 'text' | 'number';

export interface AttributeDefinition {
  type: AttributeType;
  label: string;
  values?: string[];           // For enum types
  unit?: string;              // For numeric types (e.g., "inches", "GB")
  min?: number;               // For range types
  max?: number;               // For range types
  required?: boolean;
  searchable?: boolean;
  filterable?: boolean;
}

export interface AttributeSchema {
  [key: string]: AttributeDefinition;
}

// Category Interface
export interface Category extends BaseDocument {
  name: string;               // "Televisions"
  slug: string;               // "televisions"
  description?: string;
  attributeSchema: AttributeSchema;
  isActive: boolean;
  sortOrder: number;
}

// Listing Interface
export interface Listing extends BaseDocument {
  title: string;
  description: string;
  price: number;
  currency: string;           // "INR", "USD"
  location: {
    city: string;
    state: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  categoryId: ObjectId;
  category?: Category;        // Populated field
  attributes: Record<string, any>;  // Dynamic attributes based on category
  images: string[];           // Array of image URLs
  supplier: {
    name: string;
    email: string;
    phone?: string;
    verified: boolean;
    rating?: number;
  };
  inventory: {
    quantity: number;
    unit: string;             // "pieces", "kg", "liters"
    moq: number;              // Minimum Order Quantity
  };
  status: 'draft' | 'active' | 'inactive' | 'expired';
  featured: boolean;
  views: number;
  inquiries: number;
}

// Search and Filter Types
export interface SearchFilters {
  category?: string;          // Category slug
  priceMin?: number;
  priceMax?: number;
  location?: string;
  attributes?: Record<string, any>;
  [key: string]: any;
}

export interface SearchQuery {
  q?: string;                 // Search query
  category?: string;          // Category slug
  filters?: SearchFilters;
  page?: number;
  limit?: number;
  sort?: string;              // "price_asc", "price_desc", "newest", "relevance"
}

export interface FacetValue {
  value: string | number;
  label: string;
  count: number;
  selected?: boolean;
}

export interface Facet {
  key: string;                // Attribute key
  label: string;              // Display label
  type: AttributeType;
  values: FacetValue[];
  min?: number;               // For range facets
  max?: number;               // For range facets
  unit?: string;              // For numeric facets
}

export interface SearchResponse {
  results: Listing[];
  facets: Facet[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  query: SearchQuery;
  executionTime: number;      // Query execution time in ms
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Component Props Types
export interface SearchBarProps {
  initialQuery?: string;
  initialCategory?: string;
  onSearch?: (query: SearchQuery) => void;
  placeholder?: string;
  className?: string;
}

export interface FilterPanelProps {
  facets: Facet[];
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  className?: string;
}

export interface SearchResultsProps {
  results: Listing[];
  loading?: boolean;
  error?: string;
  className?: string;
}

export interface ListingCardProps {
  listing: Listing;
  className?: string;
}

// Utility Types
export type SortOption = {
  value: string;
  label: string;
  field: string;
  direction: 'asc' | 'desc';
};

export const SORT_OPTIONS: SortOption[] = [
  { value: 'relevance', label: 'Relevance', field: 'score', direction: 'desc' },
  { value: 'price_asc', label: 'Price: Low to High', field: 'price', direction: 'asc' },
  { value: 'price_desc', label: 'Price: High to Low', field: 'price', direction: 'desc' },
  { value: 'newest', label: 'Newest First', field: 'createdAt', direction: 'desc' },
  { value: 'popular', label: 'Most Popular', field: 'views', direction: 'desc' },
];

// Database Seeding Types
export interface SeedData {
  categories: Omit<Category, '_id' | 'createdAt' | 'updatedAt'>[];
  listings: Omit<Listing, '_id' | 'createdAt' | 'updatedAt' | 'categoryId'>[];
} 
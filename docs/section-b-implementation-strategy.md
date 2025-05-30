# Section B: Coding Challenge Implementation Strategy

## Overview

This document outlines our comprehensive approach to building the B2B marketplace search and discovery system. We'll implement a scalable, maintainable solution that meets all requirements while following best practices.

## Project Architecture

### Tech Stack
- **Frontend**: Next.js 14 (App Router) with TypeScript
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Styling**: Tailwind CSS for modern, responsive UI
- **State Management**: React hooks with URL state synchronization
- **Development**: ESLint, Prettier, TypeScript strict mode

### Project Structure
```
B2B-Marketplace/
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── api/               # API routes
│   │   │   ├── search/        # Search endpoint
│   │   │   ├── facets/        # Facets endpoint
│   │   │   └── seed/          # Database seeding
│   │   ├── search/            # Search page
│   │   └── layout.tsx         # Root layout
│   ├── components/            # Reusable UI components
│   │   ├── SearchBar.tsx
│   │   ├── FilterPanel.tsx
│   │   ├── SearchResults.tsx
│   │   └── ui/                # Base UI components
│   ├── lib/                   # Utilities and configurations
│   │   ├── mongodb.ts         # Database connection
│   │   ├── models/            # Mongoose models
│   │   └── utils.ts           # Helper functions
│   └── types/                 # TypeScript type definitions
├── docs/                      # Documentation
├── scripts/                   # Database seeding scripts
├── docker-compose.yml         # Local MongoDB setup
└── README.md                  # Setup instructions
```

## Data Model Implementation

### 1. Category Schema
```typescript
interface Category {
  _id: ObjectId;
  name: string;                 // "Televisions"
  slug: string;                 // "televisions"
  attributeSchema: {
    [key: string]: {
      type: 'enum' | 'range' | 'boolean' | 'text';
      label: string;
      values?: string[];         // For enum types
      unit?: string;             // For numeric types
      required?: boolean;
      searchable?: boolean;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### 2. Listing Schema
```typescript
interface Listing {
  _id: ObjectId;
  title: string;
  description: string;
  price: number;
  location: string;
  categoryId: ObjectId;
  attributes: Record<string, any>;  // Dynamic attributes
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### 3. Database Indexes
```javascript
// Compound indexes for common queries
db.listings.createIndex({ categoryId: 1, price: 1, location: 1 });
db.listings.createIndex({ title: "text", description: "text" });

// Wildcard index for dynamic attributes
db.listings.createIndex({ "attributes.$**": 1 });

// Category-specific attribute indexes
db.listings.createIndex({ "attributes.brand": 1 });
db.listings.createIndex({ "attributes.size": 1 });
```

## API Implementation

### 1. Search API (`/api/search`)

**Endpoint**: `GET /api/search`

**Parameters**:
- `q` (string): Search query
- `category` (string): Category slug
- `filters` (string): JSON-encoded filters object
- `page` (number): Page number (default: 1)
- `limit` (number): Results per page (default: 20)

**Response**:
```typescript
interface SearchResponse {
  results: Listing[];
  facets: FacetConfig[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  query: {
    q?: string;
    category?: string;
    filters: Record<string, any>;
  };
}
```

**Implementation Strategy**:
1. **Query Building**: Construct MongoDB aggregation pipeline
2. **Text Search**: Use `$text` operator for full-text search
3. **Filtering**: Apply category and attribute filters
4. **Facet Calculation**: Use `$facet` to get results and counts simultaneously
5. **Pagination**: Implement skip/limit with total count

### 2. Facets API (`/api/facets`)

**Purpose**: Provide dynamic facet configurations and counts
**Integration**: Called by frontend after search to update filter panel

## Frontend Implementation

### 1. Search Page (`/app/search/page.tsx`)

**Features**:
- Server-side rendering for SEO
- URL state management for shareable links
- Real-time search with debouncing
- Loading states and error handling

**Component Structure**:
```tsx
export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <SearchBar />
      <div className="flex gap-6 mt-6">
        <FilterPanel className="w-1/4" />
        <SearchResults className="w-3/4" />
      </div>
    </div>
  );
}
```

### 2. Key Components

**SearchBar Component**:
- Controlled input with search suggestions
- Category selection dropdown
- Search button with loading state

**FilterPanel Component**:
- Dynamic filter rendering based on facet configs
- Checkbox groups for enum attributes
- Range sliders for numeric attributes
- Clear filters functionality

**SearchResults Component**:
- Grid layout for listing cards
- Pagination controls
- Results count and sorting options
- Empty state handling

### 3. State Management

**URL State Synchronization**:
```typescript
// Custom hook for URL state management
function useSearchParams() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const updateParams = useCallback((updates: Record<string, any>) => {
    const params = new URLSearchParams(searchParams);
    // Update parameters and navigate
  }, [searchParams, router]);
  
  return { params: searchParams, updateParams };
}
```

## Database Seeding Strategy

### 1. Sample Categories
- **Televisions**: screen_size, brand, technology, resolution, smart_features
- **Running Shoes**: size, brand, color, type, gender, price_range

### 2. Realistic Data Generation
```typescript
// Seeder script structure
const seedData = {
  categories: [
    {
      name: "Televisions",
      slug: "televisions",
      attributeSchema: {
        screen_size: { type: "enum", values: ["32", "43", "55", "65", "75"] },
        brand: { type: "enum", values: ["Samsung", "LG", "Sony", "TCL"] },
        // ... more attributes
      }
    }
  ],
  listings: [
    // 30+ realistic listings with varied attributes
  ]
};
```

### 3. Data Distribution
- **Televisions**: 20 listings with varied screen sizes, brands, and features
- **Running Shoes**: 15 listings with different sizes, colors, and brands
- **Price Range**: ₹5,000 to ₹2,00,000 for realistic B2B pricing
- **Locations**: Major Indian cities (Mumbai, Delhi, Bangalore, Chennai)

## Development Workflow

### 1. Phase 1: Foundation (Day 1)
- [ ] Project setup with Next.js 14 and TypeScript
- [ ] MongoDB connection and basic models
- [ ] Docker setup for local development
- [ ] Basic UI layout with Tailwind CSS

### 2. Phase 2: Core Features (Day 2)
- [ ] Search API implementation
- [ ] Database seeding script
- [ ] Search page with basic functionality
- [ ] Filter panel with dynamic facets

### 3. Phase 3: Enhancement (Day 3)
- [ ] Advanced filtering and facet counts
- [ ] Pagination and sorting
- [ ] URL state management
- [ ] Error handling and loading states

### 4. Phase 4: Polish (Day 4)
- [ ] UI/UX improvements
- [ ] Performance optimization
- [ ] Testing and bug fixes
- [ ] Documentation and README

## Performance Considerations

### 1. Database Optimization
- Strategic indexing for common query patterns
- Aggregation pipeline optimization
- Connection pooling and query caching

### 2. Frontend Optimization
- Debounced search to reduce API calls
- Skeleton loading for better perceived performance
- Lazy loading for large result sets
- Memoization of expensive computations

### 3. API Efficiency
- Combined search and facet endpoints to reduce round trips
- Efficient MongoDB aggregation pipelines
- Response compression and caching headers

## Testing Strategy

### 1. Unit Tests
- Model validation and business logic
- Utility functions and helpers
- Component rendering and interactions

### 2. Integration Tests
- API endpoint functionality
- Database operations
- Search and filtering accuracy

### 3. E2E Tests (Bonus)
- Complete user workflows
- Cross-browser compatibility
- Performance benchmarks

## Deployment Considerations

### 1. Local Development
- Docker Compose for MongoDB
- Environment variable management
- Hot reloading and development tools

### 2. Production Readiness
- Environment-specific configurations
- Error logging and monitoring
- Database migration strategies
- Performance monitoring

## Success Metrics

### 1. Functional Requirements
- ✅ Search returns relevant results
- ✅ Filters work correctly and update facet counts
- ✅ Category-specific attributes display properly
- ✅ Pagination and sorting function correctly

### 2. Technical Requirements
- ✅ Clean, maintainable code structure
- ✅ TypeScript strict mode compliance
- ✅ Responsive, accessible UI
- ✅ Fast query performance (<500ms)

### 3. Bonus Features
- ✅ URL state management for shareable links
- ✅ Skeleton loading and error boundaries
- ✅ Advanced sorting and relevance scoring
- ✅ Search suggestions and autocomplete

This implementation strategy ensures we build a robust, scalable B2B marketplace search system that meets all requirements while demonstrating best practices in full-stack development. 
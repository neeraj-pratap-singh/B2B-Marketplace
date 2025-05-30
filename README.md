# B2B Marketplace Search & Discovery System

A modern B2B marketplace with advanced search and filtering capabilities built with Next.js 14, TypeScript, MongoDB, and Tailwind CSS.

## 🎯 Project Status: Phase 2 Complete ✅

### ✅ Phase 1: Foundation (Completed)
- Next.js 14 project setup with TypeScript
- MongoDB integration with Mongoose ODM
- Database models (Category & Listing)
- UI component library (shadcn/ui)
- Database seeding with realistic data
- Docker setup for local development

### ✅ Phase 2: Backend Implementation (Completed)
- **Search API** (`/api/search`) - Full-text search with filtering and pagination
- **Facets API** (`/api/facets`) - Dynamic facet generation with real-time counts
- **Seed API** (`/api/seed`) - Database initialization endpoint
- **Search Page** (`/search`) - Complete search interface
- **UI Components** - SearchBar, FilterPanel, SearchResults

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker (for MongoDB)
- Yarn or npm

### 1. Install Dependencies
```bash
yarn install
# or
npm install
```

### 2. Environment Setup
Create a `.env.local` file in the project root:
```bash
MONGODB_URI=mongodb://localhost:27017/b2b-marketplace
```

### 3. Start Services
```bash
# Start MongoDB
docker compose up -d

# Start development server
npm run dev
```

### 4. Seed Database
```bash
curl -X POST http://localhost:3000/api/seed
```

### 5. Open Application
Visit [http://localhost:3000/search](http://localhost:3000/search)

## 🔍 Features

### Search & Discovery
- **Full-text search** across product titles and descriptions
- **Category-aware filtering** (Televisions, Running Shoes)
- **Dynamic attribute filtering** (brand, size, color, technology)
- **Price range filtering** with distribution counts
- **Location-based filtering**
- **Sorting options** (relevance, price, newest)
- **Pagination** with configurable page sizes

### User Experience
- **Real-time search** with debounced queries
- **URL state management** for shareable search links
- **Loading states** and skeleton components
- **Error handling** with retry mechanisms
- **Responsive design** for mobile and desktop
- **Accessibility** with proper ARIA labels

### Technical Features
- **Performance optimized** MongoDB queries with proper indexing
- **Type-safe** TypeScript implementation
- **Component-based** architecture with reusable UI components
- **Server-side rendering** for SEO optimization
- **Docker containerization** for easy development setup

## 📊 Sample Data

The application includes realistic sample data:
- **10 listings** across 2 categories
- **Televisions**: Samsung, LG, Sony, Mi, TCL with various specifications
- **Running Shoes**: Nike, Adidas, Puma, Reebok, New Balance with different sizes and colors
- **Price range**: ₹7,999 to ₹1,25,999
- **Locations**: Mumbai, Delhi, Bangalore, Chennai, Pune, Hyderabad

## 🏗️ Architecture

### Database Schema
```typescript
// Category with dynamic attribute schema
interface Category {
  name: string;
  slug: string;
  attributeSchema: Map<string, AttributeDefinition>;
}

// Listing with flexible attributes
interface Listing {
  title: string;
  description: string;
  price: number;
  location: string;
  categoryId: ObjectId;
  attributes: Record<string, any>;
}
```

### API Endpoints

#### GET `/api/search`
Search listings with filtering and pagination.

**Parameters:**
- `q` - Search query
- `category` - Category slug (televisions, running-shoes)
- `filters` - JSON-encoded filter object
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 20)
- `sort` - Sort order (relevance, price_asc, price_desc, newest)

#### GET `/api/facets`
Get dynamic facets with counts for the current search context.

#### POST `/api/seed`
Initialize database with sample data.

## 🎨 UI Components

### SearchBar
- Text input with category selection
- Real-time search with loading states
- Search suggestions and tips

### FilterPanel
- Dynamic facet rendering based on category
- Checkbox filters for enum values
- Price range selectors
- Active filter management

### SearchResults
- Product cards with detailed information
- Pagination controls
- Empty state handling
- Loading skeletons

## 🔧 Development

### Project Structure
```
src/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   ├── search/            # Search page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── SearchBar.tsx
│   ├── FilterPanel.tsx
│   ├── SearchResults.tsx
│   └── ui/                # shadcn/ui components
├── lib/                   # Utilities
│   ├── mongodb.ts         # Database connection
│   └── models/            # Mongoose models
└── types/                 # TypeScript definitions
```

### Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run seed         # Seed database (alternative to API)
```

## 🚀 Deployment

The application is ready for deployment with:
- Environment-specific configurations
- Docker containerization support
- Optimized production builds
- Database migration strategies

## 📝 Next Steps

### Phase 3: Advanced Features (Planned)
- User authentication and profiles
- Advanced search with ML-powered relevance
- Search suggestions and autocomplete
- Analytics and search tracking
- Real-time notifications
- Bulk operations and admin panel

### Phase 4: Scale & Performance (Planned)
- Elasticsearch integration
- Redis caching layer
- CDN for static assets
- Performance monitoring
- Load testing and optimization

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using Next.js 14, TypeScript, MongoDB, and Tailwind CSS**

# B2B Marketplace - Technical Assessment

A full-stack MERN application implementing a sophisticated search and discovery engine for a B2B marketplace, featuring natural language search, dynamic category-aware facets, and flexible schema management.

## 📋 Project Overview

This project is a technical assessment demonstrating full-stack development skills with a focus on:

- **Advanced Search & Filtering**: Natural language query processing with structured filter extraction
- **Dynamic Schema Management**: Flexible category-specific attributes without database migrations  
- **Scalable Architecture**: Document-based data model optimized for complex queries
- **Modern UI/UX**: Responsive, accessible interface with real-time search and filtering

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB, Mongoose ODM
- **Development**: Docker, ESLint, Prettier

### Key Features
- ✅ Full-text search with category-aware filtering
- ✅ Dynamic facet generation based on category schemas
- ✅ Real-time filter updates with facet counts
- ✅ URL state management for shareable search results
- ✅ Responsive design with loading states and error handling
- ✅ Database seeding with realistic B2B marketplace data

## 📚 Documentation

### Section A: Architecture & Problem Solving
- **[Question 1: Intent Extraction Strategy](./docs/section-a-question-1.md)**
  - Natural language query processing pipeline
  - ML and rule-based entity extraction
  - Fallback strategies for ambiguous queries

- **[Question 2: Flexible Schema Design](./docs/section-a-question-2.md)**
  - Document vs. relational data model analysis
  - Dynamic attribute storage and indexing
  - Performance optimization for multi-attribute filtering

- **[Question 3: Dynamic Facet API Design](./docs/section-a-question-3.md)**
  - RESTful API contract for faceted search
  - Real-time facet count calculation
  - Category-aware filter configuration

### Section B: Implementation
- **[Complete Implementation Strategy](./docs/section-b-implementation-strategy.md)**
  - Detailed technical approach and architecture
  - Development phases and timeline
  - Performance considerations and testing strategy

- **[Assignment Requirements](./docs/assignment-requirements.md)**
  - Full technical assessment specification
  - Evaluation criteria and deliverables
  - Submission guidelines and expectations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose
- Git

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd B2B-Marketplace
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start MongoDB with Docker**
   ```bash
   docker-compose up -d
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your MongoDB connection string
   ```

5. **Seed the database**
   ```bash
   npm run seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open the application**
   - Navigate to [http://localhost:3000/search](http://localhost:3000/search)
   - Try searching for "Samsung TV" or "running shoes size 9"

## 🎯 Key Functionality

### Search & Discovery
- **Natural Language Search**: Type queries like "Samsung 55 inch smart TV under ₹50000"
- **Category Filtering**: Browse by specific product categories (Televisions, Running Shoes)
- **Dynamic Facets**: Filter by brand, size, price range, and category-specific attributes
- **Real-time Updates**: Facet counts update automatically as filters are applied

### Technical Highlights
- **Flexible Schema**: Add new product categories and attributes without database migrations
- **Optimized Queries**: MongoDB aggregation pipelines for efficient faceted search
- **Responsive Design**: Mobile-first UI with skeleton loading and error boundaries
- **URL State**: Shareable search results with filter state preserved in URL

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e
```

## 📊 Sample Data

The application includes realistic sample data:
- **20 Television listings** with varied screen sizes, brands, and smart features
- **15 Running Shoe listings** with different sizes, colors, and types
- **Price ranges** from ₹5,000 to ₹2,00,000 for B2B marketplace scenarios
- **Multiple locations** across major Indian cities

## 🔧 Development

### Project Structure
```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API endpoints
│   ├── search/         # Search page
│   └── layout.tsx      # Root layout
├── components/         # React components
├── lib/               # Database models and utilities
└── types/             # TypeScript definitions
```

### Key Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run seed         # Seed database with sample data
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

## 📈 Performance

- **Search Response Time**: < 500ms for complex queries
- **Database Indexing**: Optimized for common filter combinations
- **Frontend Optimization**: Debounced search, memoized components
- **Scalability**: Horizontal scaling support with document sharding

## 🤝 Contributing

This is a technical assessment project. For questions or clarifications, please refer to the documentation in the `docs/` directory.

## 📄 License

This project is created for technical assessment purposes.

---

**Assessment Timeline**: Completed before May 29th, 8:00 PM  
**Submission**: [Notion Form](https://instinctive-studio.notion.site/1fb9efe8574980108956fcf65489c1e8)

# Section A - Question 2: Flexible Schema for Category-Specific Attributes

## Question

2. **Flexible Schema for Category-Specific Attributes**
   1. Relational vs. document vs. hybrid: which data model would you adopt so merchandisers can add new attributes (e.g., *"Energy Rating"* for ACs) without large-scale migrations?
   2. Explain how your choice supports fast multi-attribute filtering and attribute existence queries.

## Answer

### 2.1 Data Model Choice: Document-Based with Schema Registry

**Recommended Approach: Document Database (MongoDB) with Structured Schema Management**

**Core Collections:**

```javascript
// Categories Collection
{
  _id: ObjectId,
  name: "Air Conditioners",
  slug: "air-conditioners",
  attributeSchema: {
    "energy_rating": { type: "enum", values: ["1 Star", "2 Star", "3 Star", "4 Star", "5 Star"], required: true },
    "capacity": { type: "number", unit: "tons", min: 0.5, max: 5.0 },
    "technology": { type: "enum", values: ["Inverter", "Non-Inverter"] },
    "brand": { type: "string", indexed: true }
  },
  createdAt: Date,
  updatedAt: Date
}

// Listings Collection
{
  _id: ObjectId,
  title: "Samsung 1.5 Ton 3 Star Inverter AC",
  description: "Energy efficient split AC...",
  price: 35000,
  location: "Mumbai",
  categoryId: ObjectId("category_id"),
  attributes: {
    "energy_rating": "3 Star",
    "capacity": 1.5,
    "technology": "Inverter",
    "brand": "Samsung"
  },
  createdAt: Date
}
```

**Why Document Model:**
- **Schema Evolution**: New attributes added to category schema without touching existing listings
- **Flexible Storage**: Attributes stored as key-value pairs in BSON documents
- **No Migrations**: Existing listings remain valid; new attributes are optional by default

### 2.2 Fast Multi-Attribute Filtering Support

**Indexing Strategy:**

1. **Compound Indexes for Common Filter Combinations:**
   ```javascript
   // Category + Price + Location (most common filters)
   db.listings.createIndex({ categoryId: 1, price: 1, location: 1 })
   
   // Dynamic attribute indexing
   db.listings.createIndex({ "attributes.brand": 1, "attributes.energy_rating": 1 })
   ```

2. **Wildcard Indexes for Dynamic Attributes:**
   ```javascript
   // MongoDB 4.2+ wildcard index for all attribute fields
   db.listings.createIndex({ "attributes.$**": 1 })
   ```

3. **Text Index for Search:**
   ```javascript
   db.listings.createIndex({ title: "text", description: "text" })
   ```

**Query Performance Optimization:**

1. **Aggregation Pipeline for Faceted Search:**
   ```javascript
   db.listings.aggregate([
     { $match: { categoryId: ObjectId("ac_category"), "attributes.brand": "Samsung" } },
     { $facet: {
         results: [{ $limit: 20 }],
         facets: [
           { $group: { _id: "$attributes.energy_rating", count: { $sum: 1 } } },
           { $group: { _id: "$attributes.technology", count: { $sum: 1 } } }
         ]
       }
     }
   ])
   ```

2. **Attribute Existence Queries:**
   ```javascript
   // Fast existence check using sparse indexes
   db.listings.find({ "attributes.energy_rating": { $exists: true } })
   ```

**Benefits:**
- **Horizontal Scaling**: Document sharding by categoryId or location
- **Query Flexibility**: Complex attribute combinations without JOIN operations
- **Schema Validation**: MongoDB schema validation ensures data integrity
- **Performance**: Targeted indexes for specific attribute combinations based on usage patterns

This approach provides the flexibility of NoSQL with the structure needed for efficient querying and faceted search. 
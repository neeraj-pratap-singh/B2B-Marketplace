# Section A - Question 3: Dynamic Facet API Design

## Question

3. **(Optional) Dynamic Facet API Design**
   1. Sketch an API contract that the frontend calls after any search to retrieve **facet configs + counts**.

## Answer

### 3.1 Dynamic Facet API Contract

**Endpoint:** `GET /api/facets`

**Request Parameters:**
```typescript
interface FacetRequest {
  category?: string;           // Category slug (e.g., "televisions", "running-shoes")
  q?: string;                 // Search query for context-aware facets
  filters?: Record<string, any>; // Current applied filters
  limit?: number;             // Max facet values per attribute (default: 10)
}
```

**Response Schema:**
```typescript
interface FacetResponse {
  facets: FacetConfig[];
  totalResults: number;
  appliedFilters: Record<string, any>;
}

interface FacetConfig {
  key: string;                // Attribute key (e.g., "brand", "screen_size")
  label: string;              // Display name (e.g., "Brand", "Screen Size")
  type: "enum" | "range" | "boolean" | "text";
  values: FacetValue[];
  metadata: {
    unit?: string;            // For numeric ranges (e.g., "inches", "₹")
    min?: number;             // For range facets
    max?: number;
    required?: boolean;
    searchable?: boolean;     // Whether facet supports search
  };
}

interface FacetValue {
  value: string | number;
  label: string;
  count: number;
  selected?: boolean;
}
```

**Example API Call:**
```bash
GET /api/facets?category=televisions&q=smart%20tv&filters={"brand":"Samsung"}&limit=5
```

**Example Response:**
```json
{
  "facets": [
    {
      "key": "screen_size",
      "label": "Screen Size",
      "type": "enum",
      "values": [
        { "value": "32", "label": "32 inches", "count": 45 },
        { "value": "43", "label": "43 inches", "count": 67 },
        { "value": "55", "label": "55 inches", "count": 89 }
      ],
      "metadata": { "unit": "inches", "searchable": false }
    },
    {
      "key": "price",
      "label": "Price Range",
      "type": "range",
      "values": [
        { "value": "0-25000", "label": "Under ₹25,000", "count": 23 },
        { "value": "25000-50000", "label": "₹25,000 - ₹50,000", "count": 156 }
      ],
      "metadata": { "unit": "₹", "min": 15000, "max": 200000 }
    },
    {
      "key": "brand",
      "label": "Brand",
      "type": "enum",
      "values": [
        { "value": "Samsung", "label": "Samsung", "count": 234, "selected": true },
        { "value": "LG", "label": "LG", "count": 189 }
      ],
      "metadata": { "searchable": true }
    }
  ],
  "totalResults": 234,
  "appliedFilters": { "brand": "Samsung" }
}
```

**Implementation Strategy:**

1. **Category-Driven Facets**: Fetch facet schema from category collection
2. **Dynamic Counting**: Use MongoDB aggregation to count facet values based on current search/filter context
3. **Smart Ordering**: Order facet values by count (descending) and relevance
4. **Performance**: Cache facet configs per category, only recompute counts
5. **Progressive Loading**: Support pagination for facets with many values

This API provides the frontend with all necessary information to render dynamic, context-aware filter panels while maintaining performance through efficient aggregation queries. 
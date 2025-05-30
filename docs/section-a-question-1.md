# Section A - Question 1: Intent Extraction Strategy

## Question

1. **Intent Extraction Strategy**
   1. Describe a pragmatic and scalable pipeline (libraries, ML models, rule layers) that converts the query *"running shoes size 9 red under ₹2 000 in Mumbai"* into structured filters.
   2. What fallback do you implement when the system cannot confidently classify part of the query?

## Answer

### 1.1 Pragmatic and Scalable Pipeline

**Multi-Layer Pipeline Architecture:**

1. **Preprocessing Layer**
   - Text normalization (lowercase, remove special chars)
   - Currency/number extraction using regex patterns (₹2,000 → price filter)
   - Location detection using Named Entity Recognition (spaCy's en_core_web_sm)

2. **Rule-Based Layer (Primary)**
   - **Category Detection**: Keyword dictionary mapping ("shoes" → footwear category)
   - **Attribute Extraction**: Regex patterns for common attributes:
     - Size: `\bsize\s*(\d+)\b` 
     - Colors: Dictionary lookup against predefined color list
     - Price: `under|below\s*₹?(\d+[,\d]*)`
     - Location: City/state gazetteer matching

3. **ML Enhancement Layer (Secondary)**
   - Fine-tuned BERT model for intent classification when rules fail
   - Training data: historical search queries with manual annotations
   - Confidence scoring for each extracted entity

4. **Validation & Ranking**
   - Cross-reference extracted attributes with category schema
   - Confidence scoring based on rule certainty + ML probability
   - Structured output: `{category: "footwear", filters: {size: "9", color: "red", price_max: 2000, location: "Mumbai"}}`

### 1.2 Fallback Strategy

**Confidence-Based Fallbacks:**

1. **Partial Classification** (confidence < 0.7):
   - Extract high-confidence entities only
   - Treat unclassified terms as general search keywords
   - Example: "red under ₹2000" → color filter + price filter, "running" → search term

2. **Full Fallback** (no confident classification):
   - Entire query becomes full-text search against title/description
   - Log failed queries for model improvement
   - Suggest popular categories/filters based on partial matches

3. **Progressive Enhancement**:
   - Start with broad search, then suggest filters based on result patterns
   - "Did you mean: Category: Footwear, Size: 9?"

This approach balances accuracy with performance, using fast rule-based extraction for common patterns while leveraging ML for edge cases. 
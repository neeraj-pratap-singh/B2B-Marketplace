# Full-Stack MERN Developer Technical Assessment

## Introduction

This technical assessment is designed to evaluate your full-stack development skills (MERN stack). It is divided into two sections:

1. Architecture and Problem Solving (Subjective Questions)
2. Coding Challenge

Both parts have to be finished and submitted at this link: [https://instinctive-studio.notion.site/1fb9efe8574980108956fcf65489c1e8](https://www.notion.so/1fb9efe8574980108956fcf65489c1e8?pvs=21)

## Instructions and Deliverables

- **🕐 Timeline:** The assessment needs to be completed before 29th May, 8:00 PM. Submitting the assessment earlier is advantageous.
- **🧰 Tech Stack:** For both the coding and subjective questions, please assume the following tech-stack:
    - Next.js
    - Typescript
    - MongoDB
    - (optional) Mongoose
- **🖥️ Locally Testable:** We should be able to test your submission locally without requiring any cloud deployment. Provide clear instructions (in a README) on how to set up and run your project (e.g. environment variables, database setup or seeding, etc).
- **🧠 Assumptions:** If any requirement is unclear or open-ended, feel free to make reasonable assumptions. Justify these assumptions in the notes section of the submission form.
- **🤖 AI-usage:** We are not against usage of AI in your submission. In fact we encourage thoughtful, transparent AI usage at Instinctive Studios. However, we expect you to clearly state where you have used AI in the AI disclosure section of the submission form.
- **🌟 Expectations:** We expect **clean, maintainable code** and a **thoughtful** approach. Prioritize clarity and correctness. Ensure your code is well-structured, properly commented where necessary and uses clear naming conventions.

## Section A: Architecture and Problem Solving

### Scenario

You are building the search and discovery engine for a B2B marketplace. One of the features of the marketplace is powerful and intuitive search and filtering:

- **Natural-language search:** A buyer might type *"organic NPK fertilisers in Thrissur under ₹500 / kg"*. The system should infer **intent** (product type = fertiliser), **filters** (organic, NPK, location = Thrissur, price ≤ ₹500) and return ranked results. See implementation on IndiaMART.
- **Dynamic, category-aware facets:** After the first results load, the UI must display context-specific filters. E.g. for TVs it shows *Screen Size, Technology, Resolution*; for Shoes it shows *Size, Colour, Brand*. Facet definitions can evolve over time as the catalogue team adds new categories or attributes. Similar to implementation on sites like Amazon.

### Questions

Aim for concise answers not more than 300 words. Please note that higher word counts won't be treated as better answers. We are looking for clarity of thought and good communication.

1. **Intent Extraction Strategy**
    1. Describe a pragmatic and scalable pipeline (libraries, ML models, rule layers) that converts the query *"running shoes size 9 red under ₹2 000 in Mumbai"* into structured filters.
    2. What fallback do you implement when the system cannot confidently classify part of the query?

2. **Flexible Schema for Category-Specific Attributes**
    1. Relational vs. document vs. hybrid: which data model would you adopt so merchandisers can add new attributes (e.g., *"Energy Rating"* for ACs) without large-scale migrations?
    2. Explain how your choice supports fast multi-attribute filtering and attribute existence queries.

3. **(Optional) Dynamic Facet API Design**
    1. Sketch an API contract that the frontend calls after any search to retrieve **facet configs + counts**.

## Section B: Coding Challenge

You're prototyping a **B2B marketplace** where buyers search a large catalogue of business listings (think "fertiliser suppliers", "industrial pumps", or "running shoes"). This mini-project asks you to implement:

1. A thin data layer that support category-specific attributes.
2. A search + filter API that returns results and dynamic facet metadata.
3. A Next.js UI with a search bar and context-aware filter panel.

No cloud deploy is required — everything must run locally with Docker or a locally-installed MongoDB.

### Requirements Table

| **Scope bucket** | Must-have (complete these) | Nice-to-have (bonus) |
| --- | --- | --- |
| Data model | - Category collection/table (name, slug, attributeSchema)<br>- Listing collection with common fields (title, description, price, location, categoryId, attributes → key-value object) | Seeder script that inserts ≥ 30 sample listings across **2 categories** (e.g. *"Televisions"* and *"Running Shoes"*) with realistic attribute spreads |
| API - Search | **`GET /api/search`**<br>Accepts:<br>**- q (string):** full text-keyword to match against title and description<br>**- category (string):** Category slug (e.g. televisions, running-shoes). Determines which dynamic facets are returned.<br>- filters (JSON string): URL-encoded JSON object of attribute key-value pairs to refine results. Example: {"size": "9", "colour": "red"} | Pagination (page, limit) and basic relevance sorting (e.g. text score + recency) |
| Frontend (Next.js 13/14) | `/search` page that:<br>1. Shows a search bar.<br>2. After each search, fetches results and facet data.<br>3. Renders a filter panel whose controls are generated from the facet response (checkboxes/drop-downs)<br>4. When a user toggles a filter, it refetches with updated filters. | Skeleton loaders and error boundaries |
| Setup and DX | Clear **README** with 1-command start (e.g. `docker-compose up` or `npm run dev` && `npm run seed`). | Clean commit history or small demo GIF in README |

### Technical Guard-rails

- **Stack:** Next.js (pages or App Router), Node/Express via API routes, MongoDB (Mongoose or Prisma-Mongo).
- **Dynamic attributes:** Avoid rigid columns; store per-listing attributes as an object/JSONB sub-document and **index** the keys you plan to query.
- **Facet counts:** You may use MongoDB aggregation ($facet, $group, $match) or equivalent. Accuracy > approximate counts.
- **No Authentication** required.
- **Testing:** Not mandatory, but a few unit or integration tests earn bonus points.

### Submission Checklist

- ✅ Public Git repo or ZIP with source.
- ✅ README.md covering: prerequisites, setup, seed data, API docs.
- ✅ Running locally yields a page at localhost:3000/search where we can replicate:

## What We'll Evaluate

1. **Correctness:** Do searches & filters work? Do facets respect category schema?
2. **Data Modelling:** Is the attribute storage/extensibility sensible and indexed?
3. **API Quality:** Clear parameter contract, proper status codes, aggregation efficiency.
4. **Code Structure:** Separation of concerns, readable components, clean naming.
5. **UX Clarity:** Simple, intuitive interactions; visible loading/error states.
6. **Documentation and DX:** Can we boot it in ≤ 5 minutes? Is the README clear?
7. **Bonus polish** (pagination, tests, URL state, etc.) adds brownie points but only after must-haves are solid. 
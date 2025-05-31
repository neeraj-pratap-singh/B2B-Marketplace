'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SearchResponse, Facet, SearchFilters } from '@/types';
import SearchBar from '@/components/SearchBar';
import FilterPanel from '@/components/FilterPanel';
import SearchResults from '@/components/SearchResults';
import { Skeleton } from '@/components/ui/skeleton';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get current search parameters
  const currentQuery = searchParams.get('q') || '';
  const currentCategory = searchParams.get('category') || 'all';
  const currentPage = parseInt(searchParams.get('page') || '1');
  const currentFilters = useMemo(() => {
    try {
      return JSON.parse(searchParams.get('filters') || '{}');
    } catch {
      return {};
    }
  }, [searchParams]);

  // Update URL with new search parameters
  const updateSearchParams = (updates: {
    q?: string;
    category?: string;
    page?: number;
    filters?: SearchFilters;
  }) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (updates.q !== undefined) {
      if (updates.q) {
        newParams.set('q', updates.q);
      } else {
        newParams.delete('q');
      }
    }
    
    if (updates.category !== undefined) {
      if (updates.category && updates.category !== 'all') {
        newParams.set('category', updates.category);
      } else {
        newParams.delete('category');
      }
    }
    
    if (updates.page !== undefined) {
      if (updates.page > 1) {
        newParams.set('page', updates.page.toString());
      } else {
        newParams.delete('page');
      }
    }
    
    if (updates.filters !== undefined) {
      if (Object.keys(updates.filters).length > 0) {
        newParams.set('filters', JSON.stringify(updates.filters));
      } else {
        newParams.delete('filters');
      }
    }

    router.push(`/search?${newParams.toString()}`, { scroll: false });
  };

  // Perform search
  const performSearch = async (query: string, category: string, filters: SearchFilters, page: number) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (category) params.set('category', category);
      if (page > 1) params.set('page', page.toString());
      if (Object.keys(filters).length > 0) {
        params.set('filters', JSON.stringify(filters));
      }

      const response = await fetch(`/api/search?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const data: SearchResponse = await response.json();
      setSearchResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setSearchResults(null);
    } finally {
      setLoading(false);
    }
  };

  // Effect to trigger search when parameters change
  useEffect(() => {
    performSearch(currentQuery, currentCategory, currentFilters, currentPage);
  }, [currentQuery, currentCategory, currentPage, currentFilters]);

  // Handlers
  const handleSearch = useCallback((query: string, category: string) => {
    updateSearchParams({
      q: query,
      category,
      page: 1, // Reset to first page
      filters: {} // Clear filters when new search
    });
  }, [updateSearchParams]);

  const handleClearSearch = useCallback(() => {
    updateSearchParams({
      q: '',
      category: '',
      page: 1,
      filters: {}
    });
  }, [updateSearchParams]);

  const handleFiltersChange = (filters: SearchFilters) => {
    updateSearchParams({
      filters,
      page: 1 // Reset to first page when filters change
    });
  };

  const handlePageChange = (page: number) => {
    updateSearchParams({ page });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            B2B Marketplace Search
          </h1>
          <p className="text-gray-600">
            Find the perfect products for your business needs
          </p>
        </div>

        <SearchBar
          onSearch={handleSearch}
          initialQuery={currentQuery}
          initialCategory={currentCategory}
          loading={loading}
          onClearSearch={handleClearSearch}
        />

        <div className="flex gap-6 mt-8">
          {/* Filter Panel */}
          <div className="w-1/4">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>
              
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-32 w-full" />
                </div>
              ) : searchResults?.facets ? (
                <FilterPanel
                  facets={searchResults.facets}
                  filters={currentFilters}
                  onFiltersChange={handleFiltersChange}
                />
              ) : (
                <p className="text-gray-500 text-sm">
                  Perform a search to see available filters
                </p>
              )}
            </div>
          </div>

          {/* Search Results */}
          <div className="w-3/4">
            <div className="bg-white rounded-lg shadow-sm border">
              {error ? (
                <div className="p-6">
                  <div className="text-center">
                    <p className="text-red-600 font-medium">Error: {error}</p>
                    <button
                      onClick={() => performSearch(currentQuery, currentCategory, currentFilters, currentPage)}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              ) : (
                <SearchResults
                  results={searchResults?.results || []}
                  pagination={searchResults?.pagination}
                  onPageChange={handlePageChange}
                  loading={loading}
                  query={searchResults?.query}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
 
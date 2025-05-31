'use client';

import { useState, useEffect } from 'react';
import { Search, Loader2, X, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useDebounceWithLoading } from '@/hooks/useDebounce';

interface SearchBarProps {
  onSearch: (query: string, category: string) => void;
  initialQuery?: string;
  initialCategory?: string;
  loading?: boolean;
  onClearSearch?: () => void;
}

const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'televisions', label: 'Televisions' },
  { value: 'running-shoes', label: 'Running Shoes' }
];

// Recent searches management
const STORAGE_KEY = 'b2b-recent-searches';
const MAX_RECENT_SEARCHES = 5;

function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function addRecentSearch(query: string) {
  if (typeof window === 'undefined' || !query.trim()) return;
  
  try {
    const recent = getRecentSearches();
    const filtered = recent.filter(item => item !== query);
    const updated = [query, ...filtered].slice(0, MAX_RECENT_SEARCHES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Silently fail if localStorage is not available
  }
}

function clearRecentSearches() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Silently fail
  }
}

export default function SearchBar({ 
  onSearch, 
  initialQuery = '', 
  initialCategory = '',
  loading = false,
  onClearSearch
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  // Debounced search for real-time experience
  const { debouncedValue: debouncedQuery, isDebouncing } = useDebounceWithLoading(query, 300);

  // Update local state when props change
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    setCategory(initialCategory);
  }, [initialCategory]);

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  // Auto-search when debounced query or category changes
  useEffect(() => {
    const apiCategory = category === 'all' ? '' : category;
    if (debouncedQuery !== initialQuery || apiCategory !== initialCategory) {
      onSearch(debouncedQuery.trim(), apiCategory);
      if (debouncedQuery.trim()) {
        addRecentSearch(debouncedQuery.trim());
        setRecentSearches(getRecentSearches());
      }
    }
  }, [debouncedQuery, category, onSearch, initialQuery, initialCategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    const apiCategory = category === 'all' ? '' : category;
    onSearch(trimmedQuery, apiCategory);
    if (trimmedQuery) {
      addRecentSearch(trimmedQuery);
      setRecentSearches(getRecentSearches());
    }
    setShowRecentSearches(false);
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    // Category change triggers automatic search via useEffect
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleRecentSearchClick = (recentQuery: string) => {
    setQuery(recentQuery);
    setShowRecentSearches(false);
    // This will trigger the debounced search
  };

  const handleClearQuery = () => {
    setQuery('');
    onClearSearch?.();
    setShowRecentSearches(false);
  };

  const handleClearRecentSearches = () => {
    clearRecentSearches();
    setRecentSearches([]);
  };

  const isSearching = loading || isDebouncing;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 relative">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4">
          {/* Search Input with Enhanced UX */}
          <div className="flex-1 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search for products, brands, or descriptions..."
                value={query}
                onChange={handleQueryChange}
                onFocus={() => setShowRecentSearches(true)}
                onBlur={() => setTimeout(() => setShowRecentSearches(false), 200)}
                className="pl-10 pr-10 h-12 text-base"
                disabled={loading}
              />
              {/* Clear button */}
              {query && (
                <button
                  type="button"
                  onClick={handleClearQuery}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              
              {/* Search indicator */}
              {isSearching && (
                <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                </div>
              )}
            </div>

            {/* Recent Searches Dropdown */}
            {showRecentSearches && recentSearches.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                <div className="p-3 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Clock className="h-4 w-4" />
                      Recent Searches
                    </div>
                    <button
                      type="button"
                      onClick={handleClearRecentSearches}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <div className="p-2">
                  {recentSearches.map((recent, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleRecentSearchClick(recent)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded flex items-center gap-2"
                    >
                      <Search className="h-3 w-3 text-gray-400" />
                      {recent}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Category Select */}
          <div className="w-48">
            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search Button */}
          <Button 
            type="submit" 
            className="h-12 px-8"
            disabled={isSearching}
          >
            {isSearching ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Searching...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Search
              </>
            )}
          </Button>
        </div>

        {/* Active Search Indicators */}
        {(query || (category && category !== 'all')) && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600">Active filters:</span>
            {query && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: "{query}"
                <button
                  type="button"
                  onClick={handleClearQuery}
                  className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {category && category !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Category: {CATEGORIES.find(c => c.value === category)?.label}
                <button
                  type="button"
                  onClick={() => setCategory('all')}
                  className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}

        {/* Search Tips with Popular Searches */}
        <div className="text-sm text-gray-500 space-y-2">
          <p>
            Try searching for specific products like <em>"Samsung 55 inch TV"</em> or 
            <em> "Nike running shoes size 9"</em> for best results.
          </p>
          
          {!query && (
            <div className="flex items-center gap-2 flex-wrap">
              <TrendingUp className="h-4 w-4" />
              <span className="font-medium">Popular:</span>
              {['Samsung TV', 'Nike shoes', 'LED 4K', 'Running shoes'].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setQuery(term)}
                  className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-xs transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          )}
        </div>
      </form>
    </div>
  );
} 
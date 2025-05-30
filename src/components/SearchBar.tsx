'use client';

import { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SearchBarProps {
  onSearch: (query: string, category: string) => void;
  initialQuery?: string;
  initialCategory?: string;
  loading?: boolean;
}

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'televisions', label: 'Televisions' },
  { value: 'running-shoes', label: 'Running Shoes' }
];

export default function SearchBar({ 
  onSearch, 
  initialQuery = '', 
  initialCategory = '',
  loading = false 
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);

  // Update local state when props change
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    setCategory(initialCategory);
  }, [initialCategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim(), category);
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    // Automatically trigger search when category changes
    onSearch(query.trim(), newCategory);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search for products, brands, or descriptions..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 h-12 text-base"
                disabled={loading}
              />
            </div>
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
            disabled={loading}
          >
            {loading ? (
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

        {/* Search Tips */}
        <div className="text-sm text-gray-500">
          <p>
            Try searching for specific products like <em>"Samsung 55 inch TV"</em> or 
            <em>"Nike running shoes size 9"</em> for best results.
          </p>
        </div>
      </form>
    </div>
  );
} 
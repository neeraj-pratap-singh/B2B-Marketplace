'use client';

import { useState } from 'react';
import { Facet, SearchFilters } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { X, RotateCcw } from 'lucide-react';

interface FilterPanelProps {
  facets: Facet[];
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

export default function FilterPanel({ facets, filters, onFiltersChange }: FilterPanelProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);

  const handleCheckboxChange = (facetKey: string, value: string, checked: boolean) => {
    const currentValues = Array.isArray(filters[facetKey]) ? filters[facetKey] : [];
    
    let newValues;
    if (checked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter((v: string) => v !== value);
    }

    const newFilters = { ...filters };
    if (newValues.length > 0) {
      newFilters[facetKey] = newValues;
    } else {
      delete newFilters[facetKey];
    }

    onFiltersChange(newFilters);
  };

  const handlePriceRangeChange = (facetKey: string, range: string) => {
    const newFilters = { ...filters };
    
    if (range === 'custom') {
      // For custom range, we'll handle this separately
      return;
    }
    
    if (range) {
      newFilters[facetKey] = range;
    } else {
      delete newFilters[facetKey];
    }

    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const removeFilter = (filterKey: string) => {
    const newFilters = { ...filters };
    delete newFilters[filterKey];
    onFiltersChange(newFilters);
  };

  const getActiveFilterCount = () => {
    return Object.keys(filters).length;
  };

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          {getActiveFilterCount()} filter{getActiveFilterCount() !== 1 ? 's' : ''} applied
        </span>
        {getActiveFilterCount() > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-xs"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {getActiveFilterCount() > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Active Filters:</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => (
              <Badge
                key={key}
                variant="secondary"
                className="flex items-center gap-1"
              >
                <span className="capitalize">{key}:</span>
                <span>
                  {Array.isArray(value) ? value.join(', ') : String(value)}
                </span>
                <X
                  className="h-3 w-3 cursor-pointer hover:text-red-500"
                  onClick={() => removeFilter(key)}
                />
              </Badge>
            ))}
          </div>
          <Separator />
        </div>
      )}

      {/* Facet Filters */}
      {facets.map((facet) => (
        <div key={facet.key} className="space-y-3">
          <h4 className="text-sm font-medium">{facet.label}</h4>
          
          {facet.type === 'enum' && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {facet.values.map((value) => (
                <div key={value.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${facet.key}-${value.value}`}
                    checked={
                      Array.isArray(filters[facet.key]) &&
                      filters[facet.key].includes(value.value)
                    }
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(
                        facet.key,
                        String(value.value),
                        checked as boolean
                      )
                    }
                  />
                  <label
                    htmlFor={`${facet.key}-${value.value}`}
                    className="text-sm cursor-pointer flex-1 flex justify-between"
                  >
                    <span>{value.label}</span>
                    <span className="text-gray-500">({value.count})</span>
                  </label>
                </div>
              ))}
            </div>
          )}

          {facet.type === 'range' && facet.key === 'price' && (
            <div className="space-y-3">
              {facet.values.map((value) => (
                <div key={value.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${facet.key}-${value.value}`}
                    checked={filters[facet.key] === value.value}
                    onCheckedChange={(checked) =>
                      handlePriceRangeChange(
                        facet.key,
                        checked ? String(value.value) : ''
                      )
                    }
                  />
                  <label
                    htmlFor={`${facet.key}-${value.value}`}
                    className="text-sm cursor-pointer flex-1 flex justify-between"
                  >
                    <span>{value.label}</span>
                    <span className="text-gray-500">({value.count})</span>
                  </label>
                </div>
              ))}
            </div>
          )}

          {facet.type === 'range' && facet.key !== 'price' && facet.min !== undefined && facet.max !== undefined && (
            <div className="space-y-3">
              <div className="px-2">
                <Slider
                  value={[
                    Math.max(facet.min, priceRange[0]),
                    Math.min(facet.max, priceRange[1])
                  ]}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  max={facet.max}
                  min={facet.min}
                  step={Math.ceil((facet.max - facet.min) / 100)}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{facet.unit}{facet.min}</span>
                <span>{facet.unit}{facet.max}</span>
              </div>
            </div>
          )}

          <Separator />
        </div>
      ))}

      {facets.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <p className="text-sm">No filters available</p>
          <p className="text-xs mt-1">Try searching for products first</p>
        </div>
      )}
    </div>
  );
} 
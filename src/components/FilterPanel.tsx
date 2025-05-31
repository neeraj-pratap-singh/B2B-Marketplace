'use client';

import { useState, useEffect } from 'react';
import { Facet, SearchFilters } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { X, RotateCcw, ChevronDown, ChevronUp, Filter, Smartphone } from 'lucide-react';

interface FilterPanelProps {
  facets: Facet[];
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  className?: string;
  isMobile?: boolean;
}

export default function FilterPanel({ 
  facets, 
  filters, 
  onFiltersChange, 
  className = '',
  isMobile = false 
}: FilterPanelProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [filterPreview, setFilterPreview] = useState<Record<string, number>>({});

  // Initialize all sections as open on desktop, collapsed on mobile
  useEffect(() => {
    const initialOpenState: Record<string, boolean> = {};
    facets.forEach(facet => {
      initialOpenState[facet.key] = !isMobile; // Open on desktop, closed on mobile
    });
    setOpenSections(initialOpenState);
  }, [facets, isMobile]);

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

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

  const getTotalResultsForFilter = (facetKey: string, value: string) => {
    // Find the facet and value to get the count
    const facet = facets.find(f => f.key === facetKey);
    const facetValue = facet?.values.find(v => v.value === value);
    return facetValue?.count || 0;
  };

  const containerClasses = isMobile 
    ? "fixed inset-x-0 bottom-0 bg-white border-t rounded-t-lg max-h-[80vh] overflow-y-auto z-50 shadow-2xl"
    : "bg-white rounded-lg shadow-sm border sticky top-4";

  if (facets.length === 0) {
    return (
      <Card className={`${containerClasses} ${className}`}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            <Filter className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-sm font-medium">No filters available</p>
            <p className="text-xs mt-1">Try searching for products first</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${containerClasses} ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5" />
            Filters
            {isMobile && <Smartphone className="h-4 w-4 text-gray-400" />}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {getActiveFilterCount()} active
            </Badge>
            {getActiveFilterCount() > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs h-6 px-2"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Active Filters Summary */}
        {getActiveFilterCount() > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Active Filters:</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, value]) => (
                <Badge
                  key={key}
                  variant="secondary"
                  className="flex items-center gap-1 text-xs"
                >
                  <span className="capitalize">{key.replace('_', ' ')}:</span>
                  <span className="font-medium">
                    {Array.isArray(value) ? value.join(', ') : String(value)}
                  </span>
                  <button
                    onClick={() => removeFilter(key)}
                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <Separator />
          </div>
        )}

        {/* Facet Filters */}
        <div className="space-y-4">
          {facets.map((facet) => (
            <Collapsible
              key={facet.key}
              open={openSections[facet.key]}
              onOpenChange={() => toggleSection(facet.key)}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex w-full items-center justify-between p-2 h-auto hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{facet.label}</span>
                    {filters[facet.key] && (
                      <Badge variant="default" className="h-5 text-xs">
                        {Array.isArray(filters[facet.key]) 
                          ? filters[facet.key].length 
                          : 1}
                      </Badge>
                    )}
                  </div>
                  {openSections[facet.key] ? (
                    <ChevronUp className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="px-2 pb-4">
                {facet.type === 'enum' && (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {facet.values.map((value) => (
                      <div key={value.value} className="flex items-center space-x-2 group">
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
                          className="text-sm cursor-pointer flex-1 flex justify-between items-center group-hover:text-blue-600 transition-colors"
                        >
                          <span>{value.label}</span>
                          <div className="flex items-center gap-1">
                            <span className="text-gray-500 text-xs">({value.count})</span>
                            {value.count > 0 && (
                              <div className="w-2 h-2 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                )}

                {facet.type === 'range' && facet.key === 'price' && (
                  <div className="space-y-3">
                    {facet.values.map((value) => (
                      <div key={value.value} className="flex items-center space-x-2 group">
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
                          className="text-sm cursor-pointer flex-1 flex justify-between items-center group-hover:text-blue-600 transition-colors"
                        >
                          <span>{value.label}</span>
                          <div className="flex items-center gap-1">
                            <span className="text-gray-500 text-xs">({value.count})</span>
                            {value.count > 0 && (
                              <div className="w-2 h-2 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                          </div>
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
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>

        {/* Mobile: Close button */}
        {isMobile && (
          <div className="pt-4 border-t">
            <Button 
              className="w-full" 
              onClick={() => {
                // In a real implementation, this would close the mobile filter drawer
                console.log('Close mobile filters');
              }}
            >
              Apply Filters ({getActiveFilterCount()})
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 
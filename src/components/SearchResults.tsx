'use client';

import { Listing, SearchQuery } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton, ListingSkeleton } from '@/components/ui/skeleton';
import { MapPin, IndianRupee, ChevronLeft, ChevronRight, Package } from 'lucide-react';

interface SearchResultsProps {
  results: Listing[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  onPageChange?: (page: number) => void;
  loading?: boolean;
  query?: SearchQuery;
}

export default function SearchResults({
  results,
  pagination,
  onPageChange,
  loading = false,
  query
}: SearchResultsProps) {
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatAttributes = (attributes: Record<string, any>) => {
    return Object.entries(attributes)
      .filter(([key, value]) => value !== null && value !== undefined)
      .slice(0, 4); // Show only first 4 attributes
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="grid gap-4">
            {[...Array(5)].map((_, i) => (
              <ListingSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">
            {pagination?.total ? (
              <>
                {pagination.total} result{pagination.total !== 1 ? 's' : ''}
                {query?.q && (
                  <span className="text-gray-600"> for "{query.q}"</span>
                )}
                {query?.category && (
                  <span className="text-gray-600"> in {query.category.replace('-', ' ')}</span>
                )}
              </>
            ) : (
              'Search Results'
            )}
          </h2>
          {pagination && pagination.total > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              Showing {(pagination.page - 1) * pagination.limit + 1}-
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
            </p>
          )}
        </div>
      </div>

      {/* Results Grid */}
      {results.length > 0 ? (
        <div className="space-y-4">
          {results.map((listing) => (
            <Card key={String(listing._id)} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2 line-clamp-2">
                      {listing.title}
                    </CardTitle>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {listing.description}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-2xl font-bold text-green-600 flex items-center">
                      <IndianRupee className="h-5 w-5" />
                      {formatPrice(listing.price)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Location */}
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    {listing.location && typeof listing.location === 'object' && 'city' in listing.location 
                      ? `${listing.location.city}, ${listing.location.state}` 
                      : typeof listing.location === 'string' 
                        ? listing.location 
                        : 'Unknown location'}
                  </div>

                  {/* Attributes */}
                  {listing.attributes && Object.keys(listing.attributes).length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formatAttributes(listing.attributes).map(([key, value]) => (
                        <Badge key={key} variant="outline" className="text-xs">
                          <span className="capitalize">{key.replace('_', ' ')}:</span>
                          <span className="ml-1 font-medium">
                            {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                          </span>
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Category */}
                  {listing.categoryId && typeof listing.categoryId === 'object' && 'name' in listing.categoryId && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Package className="h-4 w-4 mr-1" />
                      Category: {(listing.categoryId as any).name}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button size="sm">
                      Contact Seller
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-500">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(pagination.page - 1)}
            disabled={!pagination.hasPrev}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              let pageNum;
              if (pagination.totalPages <= 5) {
                pageNum = i + 1;
              } else if (pagination.page <= 3) {
                pageNum = i + 1;
              } else if (pagination.page >= pagination.totalPages - 2) {
                pageNum = pagination.totalPages - 4 + i;
              } else {
                pageNum = pagination.page - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={pageNum === pagination.page ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange?.(pageNum)}
                  className="w-8 h-8 p-0"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(pagination.page + 1)}
            disabled={!pagination.hasNext}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
} 
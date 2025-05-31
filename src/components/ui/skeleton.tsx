import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }

// Specialized skeleton components for different content types
export function ListingSkeleton() {
  return (
    <div className="border rounded-lg p-6 space-y-4 bg-white shadow-sm">
      <div className="flex justify-between items-start">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-8 w-24" />
      </div>
      
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-32" />
      </div>
      
      <div className="flex gap-2 flex-wrap">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-14" />
      </div>
      
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-28" />
      </div>
    </div>
  )
}

export function FilterSkeleton() {
  return (
    <div className="space-y-6 p-6 bg-white rounded-lg border shadow-sm">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
      
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-5 w-24" />
          <div className="space-y-2">
            {[...Array(4)].map((_, j) => (
              <div key={j} className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function SearchBarSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <Skeleton className="h-12 w-full" />
          </div>
          <div className="w-48">
            <Skeleton className="h-12 w-full" />
          </div>
          <Skeleton className="h-12 w-24" />
        </div>
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  )
}

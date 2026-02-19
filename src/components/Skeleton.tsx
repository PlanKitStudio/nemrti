import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  className?: string;
}

export const SkeletonCard = ({ className }: SkeletonCardProps) => (
  <div className={cn("rounded-xl border border-border bg-card p-5 space-y-4", className)}>
    {/* Header */}
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-muted animate-pulse" />
        <div className="h-3 w-12 bg-muted rounded animate-pulse" />
      </div>
      <div className="h-5 w-10 bg-muted rounded-full animate-pulse" />
    </div>
    {/* Number area */}
    <div className="py-4 bg-secondary/30 rounded-lg flex justify-center">
      <div className="h-7 w-40 bg-muted rounded animate-pulse" />
    </div>
    {/* Price */}
    <div className="flex justify-between items-center">
      <div className="h-3 w-16 bg-muted rounded animate-pulse" />
      <div className="h-6 w-24 bg-muted rounded animate-pulse" />
    </div>
    {/* Button */}
    <div className="h-9 w-full bg-muted rounded-md animate-pulse" />
  </div>
);

export const SkeletonGrid = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export const SkeletonDetail = () => (
  <div className="container mx-auto px-4 py-8 space-y-8">
    <div className="h-4 w-48 bg-muted rounded animate-pulse" />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="h-64 bg-card border border-border rounded-xl animate-pulse" />
      </div>
      <div className="space-y-4">
        <div className="h-8 w-3/4 bg-muted rounded animate-pulse" />
        <div className="h-6 w-1/2 bg-muted rounded animate-pulse" />
        <div className="h-10 w-full bg-muted rounded animate-pulse" />
        <div className="h-10 w-full bg-muted rounded animate-pulse" />
      </div>
    </div>
  </div>
);

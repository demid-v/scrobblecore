"use client";

import { Skeleton } from "~/components/ui/skeleton";
import { useIsMobile } from "~/hooks/use-mobile";
import { cn } from "~/lib/utils";

const GridSkeleton = ({
  count = 60,
  hasHeader = false,
  areArtists = false,
  ...props
}: {
  count?: number;
  areArtists?: boolean;
  hasHeader?: boolean;
} & React.ComponentProps<"div">) => {
  const isMobile = useIsMobile();

  return (
    <div>
      {hasHeader && <Skeleton className="mt-10 mb-6 h-7 w-20" />}
      <div
        className={cn(
          "grid-cols-tiles mx-auto grid gap-x-4 gap-y-6",
          isMobile && "grid-cols-mobile",
        )}
        {...props}
      >
        {new Array(count).fill(0).map((_item, index) => (
          <div key={index}>
            <Skeleton className="mb-2 aspect-square rounded-none" />
            <div className="px-1.5 pb-1">
              {!areArtists && <Skeleton className="h-5 max-w-24" />}
              <Skeleton className="mt-1.5 h-6 max-w-36" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GridSkeleton;

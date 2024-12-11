import { Skeleton } from "~/components/ui/skeleton";

const GridSkeleton = ({
  count = 60,
  hasHeader = false,
  areArtists = false,
  ...props
}: {
  count?: number;
  areArtists?: boolean;
  hasHeader?: boolean;
} & React.ComponentProps<"div">) => (
  <div>
    {hasHeader && <Skeleton className="mb-6 mt-10 h-7 w-20" />}
    <div
      className="mx-auto grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-x-6 gap-y-10"
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

export default GridSkeleton;

import { Skeleton } from "~/components/ui/skeleton";

const GridSkeleton = ({
  count = 60,
  hasHeader = false,
  ...props
}: { count?: number; hasHeader?: boolean } & React.ComponentProps<"div">) => (
  <div>
    {hasHeader && <Skeleton className="mb-6 mt-10 h-7 w-20" />}
    <div
      className="mx-auto grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-x-6 gap-y-10"
      {...props}
    >
      {new Array(count).fill(0).map((_item, index) => (
        <div key={index}>
          <Skeleton className="mb-2 aspect-square" />
          <Skeleton className="mb-2 h-4 w-2/5" />
          <Skeleton className="h-6 w-2/3" />
        </div>
      ))}
    </div>
  </div>
);

export default GridSkeleton;

import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";

const ListSkeleton = ({
  count = 50,
  hasHeader = false,
}: {
  count?: number;
  hasHeader?: boolean;
}) => (
  <div>
    {hasHeader && <Skeleton className="mb-6 mt-10 h-7 w-16" />}
    {new Array(count).fill(0).map((_item, index) => (
      <div key={index}>
        <div className="flex items-center justify-between gap-2 px-2 py-1">
          <div className="flex min-w-0 items-center gap-2">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-6 w-48" />
          </div>
          <Skeleton className="h-8 w-[74.77px] shrink-0" />
        </div>
        {index !== count - 1 && <Separator />}
      </div>
    ))}
  </div>
);

export default ListSkeleton;

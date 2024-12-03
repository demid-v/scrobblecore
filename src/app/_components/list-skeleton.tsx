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
      <div
        key={index}
        className="flex h-10 items-center justify-between px-2 py-0.5 [&:not(:last-child)]:border-b"
      >
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-6 w-48" />
        </div>
        <Skeleton className="h-8 w-20" />
      </div>
    ))}
  </div>
);

export default ListSkeleton;

import { Skeleton } from "~/components/ui/skeleton";

const ListLoading = ({
  count = 50,
  hasHeader = false,
}: {
  count?: number;
  hasHeader?: boolean;
}) => (
  <div>
    {hasHeader && <Skeleton className="mb-6 mt-10 h-7 w-16" />}
    {new Array(count).fill(0).map((_item, index) => (
      <Skeleton key={index} className="mb-2 h-8" />
    ))}
  </div>
);

export default ListLoading;

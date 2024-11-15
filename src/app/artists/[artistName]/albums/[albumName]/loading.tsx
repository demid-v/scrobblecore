import ListLoading from "~/app/_components/list-loading";
import { Skeleton } from "~/components/ui/skeleton";

const Loading = () => (
  <div>
    <Skeleton className="mx-auto mb-3 h-[300px] w-[300px]" />
    <Skeleton className="mx-auto mb-3 h-5 w-28" />
    <Skeleton className="mx-auto mb-3 h-6 w-48" />
    <Skeleton className="mx-auto mb-6 h-9 w-32" />
    <ListLoading count={12} />
  </div>
);

export default Loading;

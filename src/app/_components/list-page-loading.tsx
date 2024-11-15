import { Skeleton } from "~/components/ui/skeleton";

import ListLoading from "./list-loading";

const ListPageLoading = ({ count = 50 }: { count?: number }) => (
  <div>
    <Skeleton className="mx-auto mb-6 h-9 w-96" />
    <Skeleton className="mx-auto mb-6 h-9 w-28" />
    <ListLoading count={count} />
  </div>
);

export default ListPageLoading;

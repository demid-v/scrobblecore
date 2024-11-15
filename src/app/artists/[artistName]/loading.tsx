import GridLoading from "~/app/_components/grid-loading";
import ListLoading from "~/app/_components/list-loading";
import { Skeleton } from "~/components/ui/skeleton";

const Loading = () => (
  <>
    <Skeleton className="mb-10 h-9 w-48" />
    <GridLoading count={12} hasHeader />
    <ListLoading count={10} hasHeader />
  </>
);

export default Loading;

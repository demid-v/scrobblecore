import GridSkeleton from "~/app/_components/grid-skeleton";
import ListSkeleton from "~/app/_components/list-skeleton";

const Skeleton = () => (
  <>
    <GridSkeleton count={12} hasHeader />
    <GridSkeleton count={12} hasHeader />
    <ListSkeleton count={10} hasHeader />
  </>
);

export default Skeleton;

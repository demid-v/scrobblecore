import GridLoading from "~/app/_components/grid-loading";
import ListLoading from "~/app/_components/list-loading";

const Loading = () => (
  <>
    <GridLoading count={12} hasHeader />
    <GridLoading count={12} hasHeader />
    <ListLoading count={10} hasHeader />
  </>
);

export default Loading;

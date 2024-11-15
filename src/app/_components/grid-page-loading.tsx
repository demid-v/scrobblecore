import { Skeleton } from "~/components/ui/skeleton";

import GridLoading from "./grid-loading";

const GridPageLoading = ({
  count = 60,
  ...props
}: { count?: number } & React.ComponentProps<"div">) => (
  <div {...props}>
    <Skeleton className="mx-auto mb-6 h-9 w-96" />
    <GridLoading count={count} />
    <Skeleton className="mx-auto mt-6 h-9 w-96" />
  </div>
);

export default GridPageLoading;

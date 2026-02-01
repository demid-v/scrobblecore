import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";

const ListSkeleton = ({
  count = 50,
  hasHeader = false,
  isEnumerated,
}: {
  count?: number;
  hasHeader?: boolean;
  isEnumerated?: boolean;
}) => (
  <div>
    {hasHeader && <Skeleton className="mt-10 mb-6 h-7 w-16" />}
    {new Array(count).fill(0).map((_item, index) => (
      <div key={index}>
        <div className="flex items-center justify-between gap-x-2 px-2 py-1">
          <div className="flex min-w-0 items-center gap-x-2">
            {isEnumerated && (
              <div className="w-7 text-center text-xs">{index + 1}</div>
            )}
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="flex items-center gap-x-1">
            <Button
              variant="link"
              className="h-fit shrink-0 px-3 py-0"
              disabled
            >
              Edit
            </Button>
            <Button size="sm" className="shrink-0" disabled>
              Scrobble
            </Button>
          </div>
        </div>
        {index !== count - 1 && <Separator />}
      </div>
    ))}
  </div>
);

export default ListSkeleton;

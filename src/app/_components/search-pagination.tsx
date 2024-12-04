"use client";

import { usePathname, useSearchParams } from "next/navigation";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import { Skeleton } from "~/components/ui/skeleton";
import { type QueriesResults, paginate } from "~/lib/utils";

const SearchPagination = ({
  page = 1,
  limit,
  query,
  ...props
}: {
  page: number;
  limit: number;
  query: QueriesResults;
} & React.ComponentProps<"nav">) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (query.isFetching) return <Skeleton className="mb-6 h-10 w-[480px]" />;
  if (!query.isSuccess || query.data.total === 0) return null;

  const paginationRange = paginate({
    total: query.data.total,
    limit,
    page,
  });

  if (paginationRange.length < 2) return null;

  const lastPage = paginationRange.at(-1);

  const getHref = (page: number) => ({
    pathname,
    query: { ...Object.fromEntries(searchParams), page },
  });

  return (
    <Pagination {...props}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={getHref(page - 1)}
            isDisabled={page === 1}
          />
        </PaginationItem>
        {paginationRange.map((pageNumber, index) =>
          pageNumber === "DOTS" ? (
            <PaginationItem key={index}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={index}>
              <PaginationLink
                href={getHref(pageNumber)}
                isActive={pageNumber === page}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <PaginationNext
            href={getHref(page + 1)}
            isDisabled={page === lastPage}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default SearchPagination;

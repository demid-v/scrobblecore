"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

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
import { paginate } from "~/lib/utils";

const SearchPagination = ({
  page,
  limit,
  total,
  ...props
}: {
  page: number;
  limit: number;
  total: number;
} & React.ComponentProps<"nav">) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (total === 0) return null;

  const range = paginate({ total, limit, page });

  if (range.length < 2) return null;

  const lastPage = range.at(-1);

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
        {range.map((pageNumber, index) =>
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

const SearchPaginationSuspense = ({
  children,
  search,
}: {
  children: React.ReactNode;
  search: string;
}) => (
  <Suspense
    key={JSON.stringify({ search })}
    fallback={<Skeleton className="h-10 w-[480px]" />}
  >
    {children}
  </Suspense>
);

export default SearchPagination;
export { SearchPaginationSuspense };

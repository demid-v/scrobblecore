import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { env } from "~/env";

import { type AlbumsResult } from "./queries/album";
import { type ArtistsResult } from "./queries/artist";
import { type TracksResult } from "./queries/track";

export const getBaseUrl = () => {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.VERCEL) {
    if (env.NODE_ENV === "production") return env.NEXT_PUBLIC_PROD_BASE_URL!;
    return `https://${process.env.VERCEL_URL}`;
  }
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

const params = {
  api_key: env.NEXT_PUBLIC_LASTFM_API_KEY,
  cb: `${getBaseUrl()}/api/auth`,
};

export const authUrl = `https://www.last.fm/api/auth/?${new URLSearchParams(params)}`;

const range = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, index) => index + start);

export const paginate = ({
  total,
  limit,
  page,
  siblingCount = 1,
}: {
  total: number;
  limit: number;
  page: number;
  siblingCount?: number;
}) => {
  const totalPageCount = Math.ceil(total / limit);

  // Pages count is determined as siblingCount + firstPage + lastPage + currentPage + 2*"DOTS"
  const totalPageNumbers = siblingCount + 5;

  /**
   * Case 1:
   * If the number of pages is less than the page numbers we want to show in our
   * paginationComponent, we return the range [1..totalPageCount]
   */

  if (totalPageNumbers >= totalPageCount) {
    return range(1, totalPageCount);
  }

  /**
   * Calculate left and right sibling index and make sure they are within range 1 and totalPageCount
   */
  const leftSiblingIndex = Math.max(page - siblingCount, 1);
  const rightSiblingIndex = Math.min(page + siblingCount, totalPageCount);

  /**
   * We do not show dots when there is just one page number to be inserted between
   * the extremes of sibling and the page limits i.e 1 and totalPageCount.
   * Hence we are using leftSiblingIndex > 2 and rightSiblingIndex < totalPageCount - 2
   */
  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

  const firstPageIndex = 1;
  const lastPageIndex = totalPageCount;

  /**
   * Case 2: No left dots to show, but rights dots to be shown
   */
  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = 3 + 2 * siblingCount;
    const leftRange = range(1, leftItemCount);

    return [...leftRange, "DOTS", totalPageCount] as const;
  }

  /**
   * Case 3: No right dots to show, but left dots to be shown
   */
  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = 3 + 2 * siblingCount;
    const rightRange = range(
      totalPageCount - rightItemCount + 1,
      totalPageCount,
    );
    return [firstPageIndex, "DOTS", ...rightRange] as const;
  }

  /**
   * Case 4: Both left and right dots to be shown
   */
  const middleRange = range(leftSiblingIndex, rightSiblingIndex);
  return [
    firstPageIndex,
    "DOTS",
    ...middleRange,
    "DOTS",
    lastPageIndex,
  ] as const;
};

export const wait = async (ms?: number) =>
  await new Promise((resolve) => setTimeout(() => resolve(1), ms));

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type QueriesResults = AlbumsResult | TracksResult | ArtistsResult;

"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

import ImageWithFallback from "~/components/image-with-fallback";
import { Button } from "~/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";
import { Skeleton } from "~/components/ui/skeleton";
import { authUrl, cn } from "~/lib/utils";
import { signOut } from "~/server/api/actions";
import { type User } from "~/server/api/routers/auth";

import Navigation from "./navigation";
import NoUserImage from "./no-user-image";
import SearchBar from "./search-bar";
import ThemeToggle from "./theme-toggle";

const ScrobblecoreIcon = dynamic(
  () => import("~/components/scrobblecore-icon"),
  {
    ssr: false,
    loading: () => <Skeleton className="h-8 w-8" />,
  },
);

const HeaderClient = ({ user }: { user: User | null }) => {
  const selectedLayoutSegment = useSelectedLayoutSegment();
  const isSegmentWithSearchBar = selectedLayoutSegment === "(with-search-bar)";

  return (
    <header className="fixed z-10 flex h-12 w-full items-center justify-between gap-x-4 bg-background px-11">
      <div className="flex grow items-center gap-x-9">
        <Link
          href="/"
          className="flex items-center gap-x-2 text-xl font-semibold"
        >
          <ScrobblecoreIcon />
          <span className="hidden sm:block">Scrobblecore</span>
        </Link>
        {user && <Navigation />}
        <SearchBar className="max-w-lg grow" />
      </div>
      <div
        className={cn(
          "flex shrink-0 items-center justify-end gap-x-4",
          user && "hidden",
          isSegmentWithSearchBar && "md:flex",
          !isSegmentWithSearchBar && "sm:flex",
        )}
      >
        <ThemeToggle className="shrink-0" />
        {!user && (
          <Button className="mr-2" asChild>
            <Link href={authUrl}>Sign in</Link>
          </Button>
        )}
        {user && (
          <>
            <form action={signOut}>
              <Button type="submit">Sign out</Button>
            </form>
            <Link href={user.url} target="_blank" className="shrink-0">
              <ImageWithFallback
                src={user.image}
                alt="User's image"
                width={34}
                height={34}
                defaultImage={<NoUserImage />}
                priority
                className="rounded-full"
              />
            </Link>
          </>
        )}
      </div>

      <div
        className={cn(
          "hidden shrink-0 items-center gap-x-4",
          user && "flex",
          isSegmentWithSearchBar && "md:hidden",
          !isSegmentWithSearchBar && "sm:hidden",
        )}
      >
        <ThemeToggle />
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem className="flex items-center">
              <NavigationMenuTrigger className="px-2">
                {user && (
                  <Link
                    href={user.url}
                    target="_blank"
                    className="block h-auto w-auto"
                  >
                    <ImageWithFallback
                      src={user.image}
                      alt="User's image"
                      width={34}
                      height={34}
                      defaultImage={<NoUserImage />}
                      priority
                      className="rounded-full"
                    />
                  </Link>
                )}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul>
                  {!user && (
                    <li>
                      <Button asChild>
                        <Link href={authUrl}>Sign in</Link>
                      </Button>
                    </li>
                  )}
                  {user && (
                    <li>
                      <form action={signOut}>
                        <Button type="submit">Sign out</Button>
                      </form>
                    </li>
                  )}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
};

const HeaderSkeleton = () => {
  const selectedLayoutSegment = useSelectedLayoutSegment();
  const isSegmentWithSearchBar = selectedLayoutSegment === "(with-search-bar)";

  return (
    <div className="fixed z-10 flex h-12 w-full items-center justify-between bg-background px-11">
      <div className="flex items-center gap-x-9">
        <Link
          href="/"
          className="flex items-center gap-x-2 text-xl font-semibold"
        >
          <ScrobblecoreIcon />
          <span className="hidden sm:block">Scrobblecore</span>
        </Link>
        <div className="hidden md:flex">
          <Skeleton className="mx-4 h-5 w-12" />
          <div className="hidden xl:flex">
            <Skeleton className="mx-4 h-5 w-12" />
            <Skeleton className="mx-4 h-5 w-12" />
            <Skeleton className="mx-4 h-5 w-12" />
            <Skeleton className="mx-4 h-5 w-12" />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-x-4">
        <Skeleton className="h-9 w-9" />
        <Skeleton
          className={cn(
            "hidden h-9 w-[86.56px]",
            isSegmentWithSearchBar && "md:block",
            !isSegmentWithSearchBar && "sm:block",
          )}
        />
        <Skeleton className="h-[34px] w-[34px] rounded-full" />
      </div>
    </div>
  );
};

export default HeaderClient;
export { HeaderSkeleton };

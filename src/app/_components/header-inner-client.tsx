import Link from "next/link";

import GitHubLink from "~/components/github-link";
import ImageWithFallback from "~/components/image-with-fallback";
import ScrobblecoreIcon from "~/components/scrobblecore-icon";
import { Button } from "~/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";
import { Skeleton } from "~/components/ui/skeleton";
import { authUrl } from "~/lib/utils";
import { type User } from "~/server/api/routers/auth";

import Navigation from "./navigation";
import NoUserImage from "./no-user-image";
import SearchBar from "./search-bar";
import ThemeToggle from "./theme-toggle";

const HeaderInnerClient = ({
  user,
  children,
}: { user: User | null } & Readonly<{ children: React.ReactNode }>) => {
  return (
    <header className="bg-background fixed z-10 flex h-12 w-full items-center justify-between gap-x-4 px-4">
      <div className="flex grow items-center gap-x-9">
        <Link
          href="/"
          className="flex items-center gap-x-2 text-xl font-semibold"
        >
          <ScrobblecoreIcon />
          <span className="hidden sm:block">Scrobblecore</span>
        </Link>
        {user && (
          <>
            <Navigation />
            <SearchBar className="max-w-lg grow" />
          </>
        )}
      </div>
      {!user && (
        <div className="flex shrink-0 items-center justify-end gap-x-4">
          <ThemeToggle className="shrink-0" />
          <GitHubLink />
          <Button className="mr-2" asChild>
            <Link href={authUrl}>Sign in</Link>
          </Button>
        </div>
      )}

      {user && (
        <div className="flex shrink-0 items-center gap-x-4">
          <ThemeToggle />
          <NavigationMenu className="md:hidden">
            <NavigationMenuList>
              <NavigationMenuItem className="flex items-center">
                <NavigationMenuTrigger className="px-2">
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
                      preload
                      className="rounded-full"
                    />
                  </Link>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul>
                    <li>
                      <GitHubLink />
                    </li>
                    <li>{children}</li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="hidden shrink-0 items-center justify-end gap-x-4 md:flex">
            <GitHubLink />
            {children}
            <Link href={user.url} target="_blank" className="shrink-0">
              <ImageWithFallback
                src={user.image}
                alt="User's image"
                width={34}
                height={34}
                defaultImage={<NoUserImage />}
                preload
                className="rounded-full"
              />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

const HeaderSkeleton = () => (
  <div className="bg-background fixed z-10 flex h-12 w-full items-center justify-between gap-x-4 px-4">
    <div className="flex grow items-center gap-x-9">
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
      <Skeleton className="h-9 max-w-lg grow" />
    </div>
    <div className="flex items-center gap-x-4">
      <Skeleton className="h-9 w-9" />
      <Skeleton className="hidden h-9 w-9 rounded-full md:block" />
      <Skeleton className="hidden h-9 w-[86.56px] md:block" />
      <Skeleton className="h-[34px] w-[34px] rounded-full" />
    </div>
  </div>
);

export default HeaderInnerClient;
export { HeaderSkeleton };

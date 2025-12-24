import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

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
import { api } from "~/trpc/server";

import Navigation from "./navigation";
import NoUserImage from "./no-user-image";
import SearchBar from "./search-bar";
import ThemeToggle from "./theme-toggle";

const signOut = async () => {
  "use server";

  await api.auth.signout();
  redirect("/");
};

const HeaderInner = async () => {
  const user = await api.auth.user();

  return (
    <header className="fixed z-10 flex h-12 w-full items-center justify-between gap-x-4 bg-background px-4">
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
                    <li>
                      <form action={signOut}>
                        <Button type="submit">Sign out</Button>
                      </form>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="hidden shrink-0 items-center justify-end gap-x-4 md:flex">
            <GitHubLink />
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
      <Skeleton className="hidden h-9 w-[86.56px] md:block" />
      <Skeleton className="h-[34px] w-[34px] rounded-full" />
    </div>
  </div>
);

const Header = () => (
  <Suspense fallback={<HeaderSkeleton />}>
    <HeaderInner />
  </Suspense>
);

export default Header;

import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import ImageWithFallback from "~/components/image-with-fallback";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { authUrl } from "~/lib/utils";
import { api } from "~/trpc/server";

import Navigation from "./navigation";
import NoUserImage from "./no-user-image";
import SearchBar from "./search-bar";
import SignOutButton from "./sign-out-button";
import ThemeToggle from "./theme-toggle";

const HeaderInner = async () => {
  const user = await api.auth.user();

  return (
    <header className="fixed z-10 flex h-12 w-full items-center justify-between gap-x-4 bg-background px-11">
      <div className="flex grow items-center gap-x-9">
        <Link href="/" className="text-xl font-semibold">
          Scrobblecore
        </Link>
        {user && <Navigation />}
        <SearchBar className="max-w-lg grow" />
      </div>
      <div className="flex items-center justify-end gap-x-4">
        <ThemeToggle className="shrink-0" />
        {!user && (
          <Button className="mr-2" asChild>
            <Link href={authUrl}>Sign in</Link>
          </Button>
        )}
        {user && (
          <>
            <form
              action={async () => {
                "use server";

                await api.auth.signout();
                redirect("/");
              }}
            >
              <SignOutButton />
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
    </header>
  );
};

const Header = () => (
  <Suspense
    fallback={
      <div className="fixed z-10 flex h-12 w-full items-center justify-between bg-background px-11">
        <div className="flex items-center gap-x-9">
          <Link href="/" className="text-xl font-semibold">
            Scrobblecore
          </Link>
          <div className="flex">
            <Skeleton className="mx-4 h-5 w-12" />
            <Skeleton className="mx-4 h-5 w-12" />
            <Skeleton className="mx-4 h-5 w-12" />
            <Skeleton className="mx-4 h-5 w-12" />
            <Skeleton className="mx-4 h-5 w-12" />
          </div>
        </div>
        <div className="flex items-center gap-x-4">
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-[34px] w-[34px] rounded-full" />
        </div>
      </div>
    }
  >
    <HeaderInner />
  </Suspense>
);

export default Header;

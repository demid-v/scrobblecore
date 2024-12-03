import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { authUrl, cn } from "~/lib/utils";
import { api } from "~/trpc/server";

import Navigation from "./navigation";
import SignOutButton from "./sign-out-button";
import ThemeToggle from "./theme-toggle";

const HeaderInner = async () => {
  const user = await api.auth.user();

  return (
    <header className="fixed z-10 flex h-12 w-full items-center justify-between bg-background px-11">
      <div className="flex items-center gap-9">
        <Link href="/" className="text-xl font-semibold">
          Scrobblecore
        </Link>
        {user && <Navigation />}
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
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
            <Link href={user.url} target="_blank">
              <Image
                src={user.image !== "" ? user.image : "/no-user-image.svg"}
                alt="User's image"
                width={34}
                height={34}
                className={cn("rounded-full", user.image === "" && "h-6")}
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
        <div className="flex items-center gap-9">
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
        <div className="flex items-center gap-4">
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

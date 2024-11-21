import { revalidatePath } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";

import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { authUrl } from "~/lib/utils";
import { api } from "~/trpc/server";

import Navigation from "./navigation";

const HeaderInner = async () => {
  const session = await api.auth.auth();

  return (
    <header className="fixed z-10 flex h-12 w-full items-center justify-between bg-background px-11">
      <div className="flex items-center gap-9">
        <Link href="/" className="text-xl font-semibold">
          Scrobblecore
        </Link>
        {session && <Navigation />}
      </div>
      {!session && (
        <Button className="mr-2" asChild>
          <a href={authUrl}>Sign in</a>
        </Button>
      )}
      {session && (
        <span className="flex items-center gap-4">
          <form
            action={async () => {
              "use server";

              await api.auth.signout();
              revalidatePath("/");
            }}
          >
            <Button type="submit">Sign out</Button>
          </form>
          <span>{session.user.name}</span>
        </span>
      )}
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
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-5 w-32" />
        </div>
      </div>
    }
  >
    <HeaderInner />
  </Suspense>
);

export default Header;

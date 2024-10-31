"use client";

import Link from "next/link";
import { env } from "~/env";
import { getBaseUrl } from "~/lib/utils";
import { api } from "~/trpc/react";

const Header = () => {
  const { data: session, isFetching } = api.auth.auth.useQuery();
  const signout = api.auth.signout.useMutation();

  return (
    <header className="bg-background fixed flex h-10 w-full items-center justify-between px-9">
      <Link href="/" className="text-xl">
        Scrobblecore
      </Link>
      {!isFetching && (
        <span>
          {!session && (
            <Link
              href={`https://www.last.fm/api/auth/?api_key=${env.NEXT_PUBLIC_LASTFM_API_KEY}&cb=${getBaseUrl()}/api/auth`}
            >
              Sign in
            </Link>
          )}
          {session && (
            <>
              <button className="mr-2" onClick={() => signout.mutate()}>
                Sign out
              </button>
              <span>
                {
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                  session?.user.name
                }
              </span>
            </>
          )}
        </span>
      )}
    </header>
  );
};

export default Header;

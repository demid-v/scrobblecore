import { revalidatePath } from "next/cache";
import Link from "next/link";

import { env } from "~/env";
import { api, HydrateClient } from "~/trpc/server";
import { getBaseUrl } from "~/utils";

export default async function Home() {
  const session = await api.auth.auth();

  return (
    <HydrateClient>
      <main>
        {session && (
          <form
            action={async () => {
              "use server";
              await api.auth.signout();
              revalidatePath("/");
            }}
          >
            <button type="submit">Sign out</button>
          </form>
        )}
        {!session && (
          <Link
            href={`https://www.last.fm/api/auth/?api_key=${env.NEXT_PUBLIC_LASTFM_API_KEY}&cb=${getBaseUrl()}/api/auth`}
          >
            Sign in
          </Link>
        )}
        {session && (
          <p>
            Signed in as{" "}
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              session?.user.name
            }
          </p>
        )}
      </main>
    </HydrateClient>
  );
}

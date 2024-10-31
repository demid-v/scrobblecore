import { revalidatePath } from "next/cache";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { env } from "~/env";
import { getBaseUrl } from "~/lib/utils";
import { api } from "~/trpc/server";

const Header = async () => {
  const session = await api.auth.auth();

  return (
    <header className="bg-background fixed flex h-10 w-full items-center justify-between px-9">
      <Link href="/" className="text-xl">
        Scrobblecore
      </Link>
      {!session && (
        <Button className="mr-2" asChild>
          <a
            href={`http://www.last.fm/api/auth/?api_key=${env.NEXT_PUBLIC_LASTFM_API_KEY}&cb=${getBaseUrl()}/api/auth`}
          >
            Sign in
          </a>
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
          <span>
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              session?.user.name
            }
          </span>
        </span>
      )}
    </header>
  );
};

export default Header;

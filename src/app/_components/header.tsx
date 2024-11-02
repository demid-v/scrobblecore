import { revalidatePath } from "next/cache";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { env } from "~/env";
import { getBaseUrl } from "~/lib/utils";
import { api } from "~/trpc/server";

const params = {
  api_key: env.NEXT_PUBLIC_LASTFM_API_KEY,
  cb: encodeURIComponent(`${getBaseUrl()}/api/auth`),
};

const authUrl = `https://www.last.fm/api/auth/?${new URLSearchParams(params)}`;

const Header = async () => {
  const session = await api.auth.auth();

  return (
    <header className="fixed flex h-12 w-full items-center justify-between bg-background px-9">
      <Link href="/" className="text-xl">
        Scrobblecore
      </Link>
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

export default Header;

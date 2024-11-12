import { revalidatePath } from "next/cache";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { authUrl } from "~/lib/utils";
import { api } from "~/trpc/server";
import Navigation from "./navigation";

const Header = async () => {
  const session = await api.auth.auth();

  return (
    <header className="fixed z-10 flex h-12 w-full items-center justify-between bg-background px-11">
      <div className="flex items-center gap-9">
        <Link href="/" className="text-xl">
          Scrobblecore
        </Link>
        <Navigation />
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

export default Header;

import { Button } from "~/components/ui/button";
import { authUrl } from "~/lib/utils";
import { api } from "~/trpc/server";

const Home = async () => {
  const session = await api.auth.auth();

  return (
    <div className="flex h-full items-center justify-center">
      <div className="my-auto text-center">
        <h1 className="text-5xl font-semibold">Welcome to Scrobblecore</h1>
        {!session && (
          <Button className="mt-10" asChild>
            <a href={authUrl}>Sign in Last.fm</a>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Home;

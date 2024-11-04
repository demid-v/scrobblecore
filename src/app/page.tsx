import { api } from "~/trpc/server";
import { Button } from "~/components/ui/button";
import { authUrl } from "~/lib/utils";

const Home = async () => {
  const session = await api.auth.auth();

  return (
    <div className="text-center">
      <h1 className="mt-12 text-5xl font-semibold">Welcome to Scrobblecore</h1>
      {!session && (
        <Button className="mt-10" asChild>
          <a href={authUrl}>Sign in Last.fm</a>
        </Button>
      )}
    </div>
  );
};

export default Home;

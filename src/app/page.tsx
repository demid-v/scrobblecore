import Albums from "~/app/_components/albums";
import { Suspense } from "react";
import { api } from "~/trpc/server";
import { Button } from "~/components/ui/button";
import { authUrl } from "~/lib/utils";

const Home = async () => {
  const session = await api.auth.auth();

  return (
    <>
      {session === null ? (
        <div className="text-center">
          <h1 className="mt-12 text-5xl font-semibold">
            Welcome to Scrobblecore
          </h1>
          <Button className="mt-10" asChild>
            <a href={authUrl}>Sign in Last.fm</a>
          </Button>
        </div>
      ) : (
        <Suspense>
          <Albums />
        </Suspense>
      )}
    </>
  );
};

export default Home;

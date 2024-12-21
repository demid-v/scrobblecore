import Link from "next/link";
import { Suspense } from "react";

import { Button } from "~/components/ui/button";
import { authUrl } from "~/lib/utils";
import { api } from "~/trpc/server";

const Home = () => (
  <div className="flex h-[calc(100vh-3rem-1rem)] items-center justify-center">
    <div className="my-auto text-center">
      <h1 className="text-5xl font-semibold">Welcome to Scrobblecore</h1>
      <Suspense>
        <SignInButton />
      </Suspense>
    </div>
  </div>
);

const SignInButton = async () => {
  const user = await api.auth.user();

  if (user) return null;

  return (
    <Button className="mt-10" asChild>
      <Link href={authUrl}>Sign in Last.fm</Link>
    </Button>
  );
};

export default Home;

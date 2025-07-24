import Link from "next/link";
import { Suspense } from "react";

import { Button } from "~/components/ui/button";
import { authUrl } from "~/lib/utils";
import { api } from "~/trpc/server";

const Home = () => (
  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
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
      <Link href={authUrl}>Sign in</Link>
    </Button>
  );
};

export default Home;

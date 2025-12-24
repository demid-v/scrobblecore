import Link from "next/link";
import { Suspense } from "react";

import { Button } from "~/components/ui/button";
import { authUrl } from "~/lib/utils";
import { api } from "~/trpc/server";

import HomePage from "./_components/home-page";

const Home = () => {
  return (
    <HomePage>
      <Suspense fallback={null}>
        <SignInButton />
      </Suspense>
    </HomePage>
  );
};

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

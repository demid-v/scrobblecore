import { redirect } from "next/navigation";
import { Suspense } from "react";

import { Button } from "~/components/ui/button";
import { api } from "~/trpc/server";

import HeaderInnerClient from "./header-inner";
import { HeaderSkeleton } from "./header-inner-client";

const signOut = async () => {
  "use server";

  await api.auth.signout();
  redirect("/");
};

const HeaderInner = async () => {
  const user = await api.auth.user();

  return (
    <HeaderInnerClient user={user}>
      <form action={signOut}>
        <Button type="submit">Sign out</Button>
      </form>
    </HeaderInnerClient>
  );
};

const Header = () => (
  <Suspense fallback={<HeaderSkeleton />}>
    <HeaderInner />
  </Suspense>
);

export default Header;

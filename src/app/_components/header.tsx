import { Suspense } from "react";

import { api } from "~/trpc/server";

import HeaderClient, { HeaderSkeleton } from "./header-client";

const HeaderInner = async () => {
  const user = await api.auth.user();

  return <HeaderClient user={user} />;
};

const Header = () => (
  <Suspense fallback={<HeaderSkeleton />}>
    <HeaderInner />
  </Suspense>
);

export default Header;

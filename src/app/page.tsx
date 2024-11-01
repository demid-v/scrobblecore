import { HydrateClient } from "~/trpc/server";
import Header from "./_components/header";
import Albums from "./_components/albums";
import { Suspense } from "react";

export default async function Home() {
  return (
    <HydrateClient>
      <Header />
      <main className="pt-10">
        <Suspense>
          <Albums />
        </Suspense>
      </main>
    </HydrateClient>
  );
}

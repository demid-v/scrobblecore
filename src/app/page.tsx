import { HydrateClient } from "~/trpc/server";
import Header from "./_components/header";
import Album from "./_components/album";

export default async function Home() {
  return (
    <HydrateClient>
      <Header />
      <main className="pt-10">
        <Album />
      </main>
    </HydrateClient>
  );
}

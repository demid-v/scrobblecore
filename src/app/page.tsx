import { HydrateClient } from "~/trpc/server";
import Header from "./_components/header";

export default async function Home() {
  return (
    <HydrateClient>
      <Header />
      <main></main>
    </HydrateClient>
  );
}

import { cookies } from "next/headers";
import { env } from "~/env";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const authRouter = createTRPCRouter({
  auth: publicProcedure.query(async () => {
    const cookieStore = await cookies();
    const sessionKey = cookieStore.get("sessionKey")?.value;
    const userName = cookieStore.get("userName")?.value;

    if (
      typeof sessionKey === "undefined" ||
      sessionKey === "" ||
      typeof userName === "undefined" ||
      userName === ""
    ) {
      return null;
    }

    const searchParams = {
      method: "user.getinfo",
      format: "json",
      user: userName,
      api_key: env.NEXT_PUBLIC_LASTFM_API_KEY,
    };
    const url = `http://ws.audioscrobbler.com/2.0/?${new URLSearchParams(searchParams)}`;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const user = (await (await fetch(url)).json()).user;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return { sessionKey, user };
  }),

  signout: publicProcedure.mutation(async () => {
    const cookieStore = await cookies();
    cookieStore.delete("sessionKey");
    cookieStore.delete("userName");

    return cookieStore;
  }),
});

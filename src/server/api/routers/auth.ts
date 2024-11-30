import { cookies } from "next/headers";
import { z } from "zod";

import { env } from "~/env";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const userSchema = z.object({
  user: z.object({
    name: z.string(),
    image: z.array(z.object({ size: z.string(), "#text": z.string() })),
  }),
});

export const authRouter = createTRPCRouter({
  auth: publicProcedure.query(async () => {
    const cookieStore = await cookies();

    const sessionKey = cookieStore.get("sessionKey")?.value ?? "";
    const userName = cookieStore.get("userName")?.value ?? "";

    if (sessionKey === "" || userName === "") return null;

    const searchParams = {
      method: "user.getinfo",
      format: "json",
      user: userName,
      api_key: env.NEXT_PUBLIC_LASTFM_API_KEY,
    };

    const url = `https://ws.audioscrobbler.com/2.0/?${new URLSearchParams(searchParams)}`;

    const rawUser = (await (await fetch(url)).json()) as unknown;
    const parsedUser = userSchema.parse(rawUser);
    const user = parsedUser.user;

    return { sessionKey, user };
  }),

  signout: privateProcedure.mutation(({ ctx: { cookies } }) => {
    cookies.delete("sessionKey");
    cookies.delete("userName");

    return cookies;
  }),
});

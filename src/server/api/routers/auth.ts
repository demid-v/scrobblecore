import { z } from "zod";

import { env } from "~/env";
import { lastFmApiGet } from "~/lib/utils";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { type RouterOutputs } from "~/trpc/react";

const userSchema = z.object({
  user: z.object({
    name: z.string(),
    image: z.array(
      z.object({
        size: z.enum(["small", "medium", "large", "extralarge"]),
        "#text": z.string(),
      }),
    ),
    url: z.string(),
  }),
});

const authRouter = createTRPCRouter({
  user: publicProcedure.query(async ({ ctx: { cookies } }) => {
    const sessionKey = cookies.get("sessionKey")?.value ?? "";
    const userName = cookies.get("userName")?.value ?? "";

    if (sessionKey === "" || userName === "") return null;

    const params = {
      method: "user.getinfo",
      format: "json",
      user: userName,
      api_key: env.NEXT_PUBLIC_LASTFM_API_KEY,
    };

    const parsedUser = (
      await lastFmApiGet(params).then((json) => userSchema.parse(json))
    ).user;

    const user = {
      ...parsedUser,
      image:
        parsedUser.image.find((image) => image.size === "small")?.["#text"] ??
        "",
    };

    return user;
  }),

  signout: privateProcedure.mutation(async ({ ctx: { cookies } }) => {
    cookies.delete("sessionKey");
    cookies.delete("userName");

    return cookies;
  }),
});

type User = NonNullable<RouterOutputs["auth"]["user"]>;

export default authRouter;
export type { User };

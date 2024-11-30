import crypto from "crypto";
import { cookies } from "next/headers";
import { z } from "zod";

import { env } from "~/env";
import { getBaseUrl } from "~/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const authToken = requestUrl.searchParams.get("token");

  if (authToken === null) return Response.error();

  const stringToHash = `api_key${env.NEXT_PUBLIC_LASTFM_API_KEY}methodauth.getSessiontoken${authToken}${env.LASTFM_SHARED_SECRET}`;
  const apiSig = crypto.createHash("md5").update(stringToHash).digest("hex");

  const searchParams = {
    method: "auth.getSession",
    format: "json",
    api_key: env.NEXT_PUBLIC_LASTFM_API_KEY,
    token: authToken,
    api_sig: apiSig,
  };
  const url = `https://ws.audioscrobbler.com/2.0/?${new URLSearchParams(searchParams)}`;

  const rawSession = (await (await fetch(url)).json()) as unknown;
  const parsedSession = z
    .object({ session: z.object({ key: z.string(), name: z.string() }) })
    .parse(rawSession);
  const session = parsedSession.session;

  const cookieStore = await cookies();

  cookieStore.set("sessionKey", session.key, {
    expires: Infinity,
    httpOnly: true,
  });

  cookieStore.set("userName", session.name, {
    expires: Infinity,
  });

  return Response.redirect(getBaseUrl(), 302);
}

import crypto from "crypto";
import { cookies } from "next/headers";
import { z } from "zod";

import { env } from "~/env";
import { getBaseUrl, lastFmApiGet } from "~/lib/utils";

export const dynamic = "force-dynamic";

const sessionSchema = z.object({
  session: z.object({ key: z.string(), name: z.string() }),
});

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const authToken = requestUrl.searchParams.get("token");

  if (authToken === null) return Response.error();

  const stringToHash = `api_key${env.NEXT_PUBLIC_LASTFM_API_KEY}methodauth.getSessiontoken${authToken}${env.LASTFM_SHARED_SECRET}`;
  const apiSig = crypto.createHash("md5").update(stringToHash).digest("hex");

  const params = {
    method: "auth.getSession",
    format: "json",
    api_key: env.NEXT_PUBLIC_LASTFM_API_KEY,
    token: authToken,
    api_sig: apiSig,
  };

  const [sessionResult, cookieStoreResult] = await Promise.allSettled([
    lastFmApiGet(params).then((json) => sessionSchema.parse(json)),
    cookies(),
  ]);

  if (
    sessionResult.status === "rejected" ||
    cookieStoreResult.status === "rejected"
  )
    return Response.error();

  const session = sessionResult.value.session;
  const cookieStore = cookieStoreResult.value;

  cookieStore.set("sessionKey", session.key, {
    expires: Infinity,
    httpOnly: true,
  });

  cookieStore.set("userName", session.name, {
    expires: Infinity,
  });

  return Response.redirect(getBaseUrl(), 302);
}

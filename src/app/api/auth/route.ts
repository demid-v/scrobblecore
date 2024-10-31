import { env } from "~/env";
import crypto from "crypto";
import { cookies } from "next/headers";
import { getBaseUrl } from "~/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const authToken = requestUrl.searchParams.get("token");

  if (authToken === null) {
    return Response.error();
  }

  const stringToHash = `api_key${env.NEXT_PUBLIC_LASTFM_API_KEY}methodauth.getSessiontoken${authToken}${env.LASTFM_SHARED_SECRET}`;
  const apiSig = crypto.createHash("md5").update(stringToHash).digest("hex");

  const searchParams = {
    method: "auth.getSession",
    format: "json",
    api_key: env.NEXT_PUBLIC_LASTFM_API_KEY,
    token: authToken,
    api_sig: apiSig,
  };
  const url = `http://ws.audioscrobbler.com/2.0/?${new URLSearchParams(searchParams)}`;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const session = (await (await fetch(url)).json()).session;

  const cookieStore = await cookies();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  cookieStore.set("sessionKey", session.key as string, {
    expires: Infinity,
    httpOnly: true,
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  cookieStore.set("userName", session.name as string, {
    expires: Infinity,
    httpOnly: true,
  });

  return Response.redirect(getBaseUrl(), 302);
}

import { NextResponse, type NextRequest } from "next/server";

export const middleware = (request: NextRequest) => {
  const requestUrl = new URL(request.url);

  if (requestUrl.pathname === "/api/auth") return;

  const cookieStore = request.cookies;

  const sessionKey = cookieStore.get("sessionKey")?.value ?? "";
  const userName = cookieStore.get("userName")?.value ?? "";

  if (sessionKey === "" || userName === "")
    return NextResponse.redirect(new URL("/", requestUrl));
};

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/api(.*)"],
};

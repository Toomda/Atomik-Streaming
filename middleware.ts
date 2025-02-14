import NextAuth from "next-auth";
import authConfig from "./next-auth.config";

const { auth: middleware } = NextAuth(authConfig);

const authPaths = ["/login", "/register"];

export default middleware((req) => {
  if (authPaths.includes(req.nextUrl.pathname)) {
    if (req.auth) {
      const redirectUrl = new URL("/", req.url);
      return Response.redirect(redirectUrl);
    }

    return null;
  }

  if (!req.auth) {
    const redirectUrl = new URL("/login", req.url);
    return Response.redirect(redirectUrl);
  }

  return null;
});

export const config = {
  matcher: ["/u/:path*", "/login", "/register"],
};

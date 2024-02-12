import NextAuth from "next-auth";
import authConfig from "./next-auth.config";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  callbacks: {
    async session({ token, session }) {
      if (!token.sub) {
        return {
          ...session,
          user: {
            id: token.sub as string,
            accessToken: token.accessToken,
          },
        };
      }

      if (!token.username) {
        return {
          ...session,
          user: {
            id: token.sub as string,
            accessToken: token.accessToken,
          },
        };
      } else {
        return {
          ...session,
          user: {
            username: token.username as string,
            id: token.id as string,
            accessToken: token.accessToken,
          },
        };
      }
    },
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
  },
  ...authConfig,
});

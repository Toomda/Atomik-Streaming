import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { db } from "./lib/db";
import authConfig from "./next-auth.config";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(db),
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  callbacks: {
    async session({ token, session }) {
      return {
        ...session,
        user: {
          username: token.username as string,
          id: token.sub as string,
        },
      };
    },
    async jwt({ token }) {
      const id = token.sub;
      if (!id) return token;

      const dbUser = await db.user.findUnique({
        where: { id },
        select: {
          username: true,
        },
      });

      if (!dbUser) return token;

      return {
        ...token,
        username: dbUser.username,
      };
    },
  },
  ...authConfig,
});

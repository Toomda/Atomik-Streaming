import { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./lib/db";
import bcrypt from "bcryptjs";

export default {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "username" },
        password: { label: "Password", type: "password" },
      },
      type: "credentials",
      async authorize(credentials) {
        // Add logic here to look up the user from the credentials supplied
        const user = await db.user.findUnique({
          where: {
            username: credentials.username as string,
          },
          select: {
            username: true,
            password: true,
            id: true,
          },
        });

        if (user) {
          const dbHashPassword = user.password;
          const credentialPassword = credentials?.password as string | "";

          const passwordCorrect = await bcrypt.compare(
            credentialPassword,
            dbHashPassword
          );

          if (!passwordCorrect) {
            return null;
          }

          return {
            id: user.id,
            username: user.username,
            password: user.password,
          };
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    }),
  ],
} satisfies NextAuthConfig;

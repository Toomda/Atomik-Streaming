import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';

import { db } from './lib/db';
import authConfig from './next-auth.config';
import axios from 'axios';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: '/login',
  },
  session: { strategy: 'jwt' },
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
      const response = await axios.get(
        `http://localhost:5000/api/user/${token.sub}`
      );

      if (response.status !== 200 || !response.data.user) {
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
            username: response.data.user.username as string,
            id: token.sub as string,
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

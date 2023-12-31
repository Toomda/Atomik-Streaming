import { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from './lib/db';
import bcrypt from 'bcryptjs';
import axios from 'axios';

export default {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'username' },
        password: { label: 'Password', type: 'password' },
      },
      type: 'credentials',
      async authorize(credentials) {
        // Add logic here to look up the user from the credentials supplied
        let response;
        try {
          response = await axios.post('http://localhost:5000/api/user/login', {
            username: credentials.username,
            password: credentials.password,
          });
        } catch (error) {
          return null;
        }

        const responseData = response.data;

        return {
          id: responseData.userId,
          username: credentials.username,
          name: credentials.username as string,
          accessToken: responseData.token,
        };
        // If you return null then an error will be displayed advising the user to check their details.

        // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
      },
    }),
  ],
} satisfies NextAuthConfig;

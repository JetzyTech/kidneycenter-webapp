import Credentials from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import {
  AuthorizedUserAccountApi,
  AuthorizeUserApi,
  AuthVerifyApi,
} from "@Jetzy/services/auth/authapis";
import { ROUTES } from "@Jetzy/configs/routes";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Email Address" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        let serverRes;
        if (credentials?.password !== "auto-login") {
          serverRes = await AuthorizeUserApi({ data: credentials });
          if (!serverRes?.status) {
            throw new Error(serverRes?.message);
          }
          return { ...serverRes?.data } as any;
        } else {
          // The email is the user authorization (it will be passed to the user email.)
          serverRes = await AuthorizedUserAccountApi({ id: credentials.email });
          if (!serverRes?.status) {
            throw new Error(serverRes?.message);
          }
          return { ...serverRes?.data } as any;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "openid email profile",
        },
      },
    }),
  ],
  pages: {
    signIn: ROUTES.auth,
    error: ROUTES.auth,
    signOut: ROUTES.auth,
  },
  callbacks: {
    async signIn({ account, profile }) {
      switch (account?.provider) {
        case "google":
          const res = await AuthVerifyApi({
            data: { idToken: account?.id_token as string },
          });
          if (!res?.status) {
            throw new Error(res?.message);
          }

          // @ts-ignore
          profile.googleAuth = res?.data;

          break;
        default:
          break;
      }
      return true;
    },
    async jwt({ token, user, profile }) {
      if (user) {
        token.profile = user;
      }

      // @ts-ignore
      if (profile?.googleAuth) {
        // @ts-ignore
        token.profile = profile?.googleAuth;
      }
      return token;
    },

    async session({ session, user, token }) {
      //   @ts-ignore
      if (token?.profile) {
        // @ts-ignore
        session.profile = token?.profile;
        session.user = token?.profile;
      }

      return session;
    },
  },
  secret: "le6ORbjIV1m6TvryV1EelcQhCMkJcrUPU424N/t9xXk=",
};

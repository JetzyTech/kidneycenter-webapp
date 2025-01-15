import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      user: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
      };
    };
  }
}

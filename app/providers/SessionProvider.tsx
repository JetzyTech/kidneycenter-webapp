"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

type SessionProviderProps = {
  children: React.ReactNode;
  session: Session | null;
};
export default function AppSessionProvider({
  children,
  session,
}: SessionProviderProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}

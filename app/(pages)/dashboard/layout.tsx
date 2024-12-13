import { Navbar } from "@/app/components";
import { SimpleFooter } from "@/app/components/footer";
import React from "react";

export default function DashboardLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pl-10 py-10">{children}</main>
      <SimpleFooter />
    </div>
  )
}
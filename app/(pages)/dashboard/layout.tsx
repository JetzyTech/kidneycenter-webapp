import { Navbar } from "@/app/components";
import { SimpleFooter } from "@/app/components/footer";
import { ReactQueryProvider } from "@/app/providers/react-query-provider";
import { authOptions } from "@Jetzy/app/api/auth/[...nextauth]/authOptions";
import { ROUTES } from "@Jetzy/configs/routes";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function DashboardLayout({children}: {children: React.ReactNode}) {
  // const session =  await getServerSession(authOptions)

  // if(!session) {
  //   return redirect(ROUTES.auth)
  // }


  return (
    <div className="flex flex-col min-h-screen">
      <ReactQueryProvider>
        <Navbar />
        <main className="flex-1 pl-10 py-10">{children}</main>
        <SimpleFooter />
      </ReactQueryProvider>
    </div>
  )
}

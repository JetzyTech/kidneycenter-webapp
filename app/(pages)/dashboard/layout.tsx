import { Navbar } from "@/app/components";
import { SimpleFooter } from "@/app/components/footer";
import { ReactQueryProvider } from "@/app/providers/react-query-provider";
import { authOptions } from "@Jetzy/app/api/auth/[...nextauth]/authOptions";
import { ROUTES } from "@Jetzy/configs/routes";
import { Spin } from "antd";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const session =  await getServerSession(authOptions)

  // if(!session) {
  //   return redirect(ROUTES.auth)
  // }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <Spin />
        </div>
      }
    >
      <div className="flex flex-col min-h-screen">
        <ReactQueryProvider>
          <Navbar />

          <main className="flex-1 p-10">{children}</main>
          <SimpleFooter />
        </ReactQueryProvider>
      </div>
    </Suspense>
  );
}

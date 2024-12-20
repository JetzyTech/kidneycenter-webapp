import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "./providers/theme-provider";
import { NuqsAdapter } from "nuqs/adapters/next";
import theme from "@/theme";
import "./globals.css";
import { ChakraProvider } from "@chakra-ui/react"
import ReduxProvider from "@Jetzy/redux/ReduxProvider";

import { authOptions } from "./api/auth/[...nextauth]/route";
import AppSessionProvider from "./providers/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jetzy",
  description:
    "The world's first geo-based social app to connect you with travel and lifestyle enthusiasts with similar interests.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

 
  return (
   
      <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <ThemeProvider theme={theme}>
          <NuqsAdapter>
                  <div className="flex flex-col min-h-screen">
                    <main className="flex-1">
                      
                    <AppSessionProvider>
                      <ReduxProvider>
                        <ChakraProvider>
                          {children}
                        </ChakraProvider>
                      </ReduxProvider>
                    </AppSessionProvider>
                    </main>
                  </div>
          </NuqsAdapter>
        </ThemeProvider>
        
      </body>
    </html>
  );
}

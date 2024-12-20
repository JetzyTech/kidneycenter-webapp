import theme from "@/theme";
import AppSessionProvider from "./providers/SessionProvider";
import ReduxProvider from "@Jetzy/redux/ReduxProvider";
import type { Metadata } from "next";
import { ThemeProvider } from "./providers/theme-provider";
import { NuqsAdapter } from "nuqs/adapters/next";
import { ChakraProvider } from "@chakra-ui/react";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({ weight: ["100", "200", "300", "400", "500", "600", "700", "800"], subsets: ['latin'] });

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
      <body className={`${poppins.className} antialiased`}>
        <ThemeProvider theme={theme}>
          <NuqsAdapter>
            <div className="flex flex-col min-h-screen">
              <main className="flex-1">
                <AppSessionProvider>
                  <ReduxProvider>
                    <ChakraProvider>{children}</ChakraProvider>
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

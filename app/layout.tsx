import theme from "@/theme";
import AppSessionProvider from "./providers/SessionProvider";
import ReduxProvider from "@Jetzy/redux/ReduxProvider";
import type { Metadata } from "next";
import { ThemeProvider } from "./providers/theme-provider";
import { NuqsAdapter } from "nuqs/adapters/next";
import { ChakraProvider } from "@chakra-ui/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jetzy",
  description:
    "The world's first geo-based social app to connect you with travel and lifestyle enthusiasts with similar interests.",
  other: {
    "http-equiv": "Permissions-Policy",
    content: "interest-cohort=()",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ThemeProvider theme={theme}>
        <body className={`antialiased`}>
          <ChakraProvider>
            <NuqsAdapter>
              <div className="flex flex-col min-h-screen">
                <main className="flex-1">
                  <AppSessionProvider>
                    <ReduxProvider>{children}</ReduxProvider>
                  </AppSessionProvider>
                </main>
              </div>
            </NuqsAdapter>
          </ChakraProvider>
        </body>
      </ThemeProvider>
    </html>
  );
}

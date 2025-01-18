import theme from "@/theme"
import ReduxProvider from "@Jetzy/redux/ReduxProvider"
import type { Metadata } from "next"
import { NuqsAdapter } from "nuqs/adapters/next"
import { ChakraProvider } from "@chakra-ui/react"
import { ThemeProvider } from "../providers/theme-provider"
import AppSessionProvider from "../providers/SessionProvider"
import "@/app/globals.css"
import { Suspense } from "react"


export const metadata: Metadata = {
	title: "Jetzy",
	description: "The world's first geo-based social app to connect you with travel and lifestyle enthusiasts with similar interests.",
	other: {
		"http-equiv": "Permissions-Policy",
		content: "interest-cohort=()",
	},
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
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
										<ReduxProvider>
										<Suspense fallback={<div className="animate-pulse w-10 h-10 rounded-full bg-primary" />}>
											{children}
										</Suspense>
										</ReduxProvider>
									</AppSessionProvider>
								</main>
							</div>
						</NuqsAdapter>
					</ChakraProvider>
				</body>
			</ThemeProvider>
		</html>
	)
}

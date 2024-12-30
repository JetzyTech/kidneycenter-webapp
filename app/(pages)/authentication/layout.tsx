import { authOptions } from "@Jetzy/app/api/auth/[...nextauth]/authOptions"
import { ROUTES } from "@Jetzy/configs/routes"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
	const session = await getServerSession(authOptions)

	if (session) {
		return redirect(ROUTES.dashboard)
	}

	return <section>{children}</section>
}

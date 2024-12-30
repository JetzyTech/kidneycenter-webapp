"use client"
import { Button } from "antd"
import Image from "next/image"
import JetzyLogo from "../assets/logos/jetzy-logo.png"
import Link from "next/link"
import { getSession, signOut, useSession } from "next-auth/react"
import React from "react"
import { ROUTES } from "@Jetzy/configs/routes"

export default function Navbar() {
	const session = useSession()
	const [isActive, setLoggedIn] = React.useState(false)

	React.useEffect(() => {
		if (session && session?.status === "authenticated") {
			setLoggedIn(true)
		}
	}, [session])

	// handle logout
	const handleLogout = async () => signOut({ redirect: true, callbackUrl: ROUTES.auth })

	return (
		<div className="bg-white z-50 sticky top-0 left-0 right-0 flex items-center justify-between py-4 px-10 border-b border-b-[#EDEDED]">
			<Link href="/" className="w-max inline-block">
				<Image src={JetzyLogo} alt="Jetzy Logo" className="w-12 h-12 cursor-pointer" />
			</Link>
			<Link href="/authentication">
				{isActive ? (
					<Button onClick={handleLogout} className="rounded-full border-primary text-primary font-semibold">
						Logout
					</Button>
				) : (
					<Button className="rounded-full border-primary text-primary font-semibold">Log in / Signup</Button>
				)}
			</Link>
		</div>
	)
}

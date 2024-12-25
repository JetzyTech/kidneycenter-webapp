import React from "react"
import { Button as AntdButton } from "antd"
import { AppleIcon, GoogleIcon } from "@/app/assets/icons"
import { ROUTES } from "@Jetzy/configs/routes"
import { signIn } from "next-auth/react"

export default function AuthFooter() {
	const [loader, setLoader] = React.useState(false)

	const handleSSOSignIn = () => {
		// get callback url
		const baseUrl = window.location.origin
		const callbackUrl = `${baseUrl}${ROUTES.dashboard}`

		setLoader(true)
		signIn("google", { callbackUrl: callbackUrl })
			.then(() => {
				setLoader(false)
			})
			.catch(() => {
				setLoader(false)
			})
	}

	return (
		<div className="flex items-center gap-x-2">
			<AntdButton onClick={handleSSOSignIn} loading={loader} size="large" className="rounded-full font-medium px-6 py-6" icon={<GoogleIcon />}>
				Sign in with Google
			</AntdButton>
			<AntdButton size="large" className="rounded-full font-medium px-6 py-6" icon={<AppleIcon />}>
				Sign in with Apple
			</AntdButton>
		</div>
	)
}

import { ROUTES } from "@Jetzy/configs/routes"
import { AuthorizedOptions } from "@Jetzy/types"
import { getSession } from "next-auth/react"

export const authorizedOnly = async (context: any, options?: AuthorizedOptions) => {
	const { resolvedUrl } = context
	const _session = await getSession(context)

	if (!_session)
		return {
			redirect: {
				// This section hanadles redirecting user to intended url after there are logged in
				destination: resolvedUrl && resolvedUrl !== ROUTES.auth ? `${ROUTES.auth}?_cb=${resolvedUrl?.toString()}` : ROUTES.auth,
				permanent: false,
			},
		}

	try {
		return {
			props: {
				session: _session,
			},
		}
	} catch (error) {
		return {
			props: {
				session: _session,
			},
		}
	}
}

export const unauthorizedOnly = async (context: any) => {
	const _session = await getSession(context)

	if (_session)
		return {
			redirect: {
				destination: ROUTES.app,
				permanent: false,
			},
		}

	try {
		// Fetch site config date
		const _data = null

		return {
			props: {
				session: _session,
				configs: _data,
			},
		}
	} catch (error) {
		return {
			props: {
				session: _session,
				configs: null,
			},
		}
	}
}

export const isAuthorized = async (context: any) => {
	const _session = await getSession(context)

	return _session ? true : false
}

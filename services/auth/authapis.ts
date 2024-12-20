import { GET, POST, PUT } from "@Jetzy/configs/api"
import { RequestParams, ServerResponse, SignInFormData, SignUpFormData, UserInterface } from "@Jetzy/types"
import { authEndpoints } from "./authendpoints"

export const AuthCreateAccountApi = async (params: RequestParams<SignUpFormData>): Promise<ServerResponse<UserInterface, any>> => {
	return await POST(authEndpoints.create, params?.data)
}

export const AuthorizeUserApi = async (params: RequestParams<SignInFormData>): Promise<ServerResponse<UserInterface, any>> => {
	return await POST(authEndpoints.login, params?.data)
}

export const AuthVerifyApi = async (params: RequestParams<{ idToken: string }>): Promise<ServerResponse<UserInterface, any>> => {
	return await POST(authEndpoints.verify, params?.data)
}

export const AuthorizedUserAccountApi = async (params: RequestParams): Promise<ServerResponse<UserInterface, any>> => {
	return await GET(authEndpoints.autoLogin, {
		headers: {
			Authorization: `Bearer ${params?.id}`,
		},
	})
}

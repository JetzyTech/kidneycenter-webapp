import { GET, POST, PUT } from "@Jetzy/configs/api"
import { IPlan, ISubscription, ISubscriptionPayload, RequestParams, ServerResponse } from "@Jetzy/types"
import { subscriptionEndpoints } from "./subendpoints"

export const ListPlansApi = async (): Promise<ServerResponse<IPlan[], any>> => {
	return await GET(subscriptionEndpoints.listPlans)
}

export const StartSubscriptionApi = async (params: RequestParams<{ plan: string; callbackUrl: string }>): Promise<ServerResponse<ISubscriptionPayload, any>> => {
	return await POST(subscriptionEndpoints.start, params?.data)
}

export const SetupPaymentMethodApi = async (params: RequestParams<{ subscriptionId: string }>): Promise<ServerResponse<ISubscription, any>> => {
	return await PUT(subscriptionEndpoints.setupPaymentMethod, params?.data)
}

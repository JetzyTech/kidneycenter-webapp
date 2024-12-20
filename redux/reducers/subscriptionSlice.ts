import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { HYDRATE } from "next-redux-wrapper"
import { IPlan, ISubscription, ISubscriptionPayload, RequestParams, SubscriptionSliceState } from "@Jetzy/types"
import { AppState } from "../stores"
import { ListPlansApi, SetupPaymentMethodApi, StartSubscriptionApi } from "@Jetzy/services/subscription/subapis"
import { ServerErrors } from "@Jetzy/app/lib/_toaster"

export const ListSubscriptionPlansThunk = createAsyncThunk("subscription/listPlans", async (thunkApi) => {
	return await ListPlansApi()
})

// -----> [ Start subscription ] <-----
export const StartSubscriptionThunk = createAsyncThunk("subscription/start", async (params: RequestParams<{ plan: string; callbackUrl: string }>) => {
	return await StartSubscriptionApi(params)
})

// -----> [ Setup Payment method ] <-----

export const SetupPaymentMethodThunk = createAsyncThunk("subscription/setupPaymentMethod", async (params: RequestParams<{ subscriptionId: string }>) => {
	return await SetupPaymentMethodApi(params)
})

// Initial state
const initialState: SubscriptionSliceState<ISubscription | ISubscriptionPayload, IPlan> = {
	isLoading: false,
	data: undefined,
	plans: [],
}

// Actual Slice
export const subscriptionSlice = createSlice({
	name: "subscription",
	initialState,
	reducers: {
		// Special reducer for hydrating the state. Special case for next-redux-wrapper
		extraReducers: {
			// @ts-ignore
			[HYDRATE]: (state, action) => {
				return {
					...state,
					...action.payload,
				}
			},
		},
	},

	extraReducers(builder) {
		// -----> [ List Subscription plans ] <-----
		builder.addCase(ListSubscriptionPlansThunk.pending, (state) => {
			state.isLoading = true
		})

		builder.addCase(ListSubscriptionPlansThunk.fulfilled, (state, action) => {
			state.isLoading = false
			state.plans = action.payload?.data
		})

		builder.addCase(ListSubscriptionPlansThunk.rejected, (state, action) => {
			state.isLoading = false
			ServerErrors("Failed to create account.", [{ message: action?.error?.message as string }])
		})

		// -----> [ Start subscription ] <-----
		builder.addCase(StartSubscriptionThunk.pending, (state) => {
			state.isLoading = true
		})

		builder.addCase(StartSubscriptionThunk.fulfilled, (state, action) => {
			state.isLoading = false
			state.data = action.payload?.data

			 
		})

		builder.addCase(StartSubscriptionThunk.rejected, (state, action) => {
			state.isLoading = false
			ServerErrors("Failed to start subscription.", [{ message: action?.error?.message as string }])
		})

		// -----> [ Setup Payment method ] <-----

		builder.addCase(SetupPaymentMethodThunk.pending, (state) => {
			state.isLoading = true
		})

		builder.addCase(SetupPaymentMethodThunk.fulfilled, (state, action) => {
			state.isLoading = false
			state.data = action.payload?.data

			 
		})

		builder.addCase(SetupPaymentMethodThunk.rejected, (state, action) => {
			state.isLoading = false
			ServerErrors("Failed to setup payment method.", [{ message: action?.error?.message as string }])
		})
	},
})

export const {} = subscriptionSlice.actions
export const getSubscriptionState = (state: AppState) => state?.subscription
export default subscriptionSlice

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { HYDRATE } from "next-redux-wrapper"
import { AuthSliceState, RequestParams, SignUpFormData, UserInterface } from "@Jetzy/types"
import { ServerErrors } from "@Jetzy/lib/_toaster"
import { AppState } from "../stores"
import { AuthCreateAccountApi } from "@Jetzy/services/auth/authapis"

export const AuthCreateAccountThunk = createAsyncThunk("auth/create", async (params: RequestParams<SignUpFormData>, thunkApi) => {
	return await AuthCreateAccountApi(params)
})

// Initial state
const initialState: AuthSliceState<UserInterface> = {
	isLoading: false,
	data: undefined,
}

// Actual Slice
export const authSlice = createSlice({
	name: "auth",
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
		// -----> [ AuthCreateAccountThunk ] <-----
		builder.addCase(AuthCreateAccountThunk.pending, (state) => {
			state.isLoading = true
		})

		builder.addCase(AuthCreateAccountThunk.fulfilled, (state, action) => {
			state.isLoading = false
			state.data = action.payload?.data
		})

		builder.addCase(AuthCreateAccountThunk.rejected, (state, action) => {
			state.isLoading = false
			ServerErrors("Failed to create account.", [{ message: action?.error?.message as string }])
		})
	},
})

export const {} = authSlice.actions
export const getAuthState = (state: AppState) => state?.auth
export default authSlice

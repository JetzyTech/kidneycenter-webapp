import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import { createWrapper } from "next-redux-wrapper"
import appSlice from "./reducers/appSlice"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import authSlice from "./reducers/authSlice"
import subscriptionSlice from "./reducers/subscriptionSlice"
import hotelBookingSlice from "./reducers/hotel/bookingSlice"

const makeStore = () =>
	configureStore({
		reducer: {
			[appSlice?.name]: appSlice.reducer,
			[authSlice?.name]: authSlice.reducer,
			[subscriptionSlice?.name]: subscriptionSlice.reducer,
			[hotelBookingSlice?.name]: hotelBookingSlice.reducer,
		},
		devTools: true,
	})
export type AppStore = ReturnType<typeof makeStore>
export type AppState = ReturnType<AppStore["getState"]>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action>

export const ReduxStore = makeStore()

export type AppDispatch = typeof ReduxStore.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector

interface RequestState<D = any> {
	isLoading: boolean
	isFetching?: boolean
	data?: D
	dataList?: Array<D>
}
export interface AppSliceState {
	isActive: boolean
	user: any
}

export interface AuthSliceState<T = any> extends RequestState<T> {}
export interface SubscriptionSliceState<T = any, Plan = any> extends RequestState<T> {
	plans: Plan[]
}

export interface EventSliceState<T = any> extends RequestState<T> {}

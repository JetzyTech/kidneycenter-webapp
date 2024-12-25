import { Roles, TransactionStatus } from "./const"

export interface UserInterface {
	accountId: string
	createdAt: string
	dob: string
	elixirId: string
	email: string
	firstName: string
	image: string
	lastName: string
	phone: string
	role: Roles
	updatedAt: string
	verifiedAt: string
	__v: number
	_id: string
}

export interface UserSession {
	user: UserInterface
	accessToken: string
	tokenExpiresIn: string
}

export interface IPlan {
	_id: string
	amount: number
	type: "year" | "month"
	planName: string
	priceId: string
	isDeleted: boolean
	createdAt: string
	updatedAt: string
	__v: 0
}

export interface ISubscriptionPayload {
	subId: string
	sessionId: string
	url: string
}
export interface ISubscription {
	clientSecret: string
	subscriptionId: string
	_id: string
	user: string
	customerId: string
	planId: string
	subscription: {
		subscriptionId: string
		priceId: string
		customerId: string
		interval: "month" | "year"
		status: "trial" | "active" | "inactive"
		trialPeriod: string
		isTrialEnded: false
		hasPaymentMethod: true
		_id: string
	}
	isDeleted: false
	createdAt: string
	updatedAt: string
	__v: 0
}

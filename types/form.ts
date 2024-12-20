
export type SignUpFormData = {
	refCode: string
	role?: string
	email: string
	password: string
}

export type CompleteProfileFormData = {
	firstName: string
	lastName: string
	phone: string
	dob: string
	country: string
	city: string
	region: string
}

export type SignInFormData = {
	email: string
	password: string
}

export type CodeVerificationFormData = {
	code: string
}

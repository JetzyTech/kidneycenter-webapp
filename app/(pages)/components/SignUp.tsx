import { countries } from "@/app/lib/countries"
import { Box, Button, Flex } from "@chakra-ui/react"
import { ServerErrors } from "@Jetzy/app/lib/_toaster"
import { ROUTES } from "@Jetzy/configs/routes"
import { AuthCreateAccountThunk, getAuthState, useAppDispatch, useAppSelector } from "@Jetzy/redux"
import { SignInFormData, SignUpFormData } from "@Jetzy/types"
import { Button as AntdButton, Divider, Input, Select, Typography } from "antd"
import { ErrorMessage, Field, Form, Formik, FormikProps } from "formik"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import React from "react"
import PasswordInput from "./PasswordInput"
import { signupValidation } from "@Jetzy/validator/authValidtor"
import AuthFooter from "./AuthFooter"

const Signup = () => {
	const defaultValue = countries.find((entry) => entry.cca2 === "US")?.cca2 || "US"

	const dispatcher = useAppDispatch()
	const { isLoading } = useAppSelector(getAuthState)
	const [loader, setLoader] = React.useState<boolean>(isLoading)
	const navigator = useRouter()
	const formRef = React.createRef<FormikProps<SignUpFormData>>()

	const InitialFormState: SignUpFormData = {
		refCode: "KIDNEYCENTERPRO",
		phone: "",
		role: "user",
		email: "",
		password: "",
	}

	const handleLogin = async (values: SignInFormData) => {
		setLoader(true)

		//  Process user login
		const res = await signIn("credentials", {
			email: values?.email,
			password: values?.password,
			redirect: false,
		})

		// handle error
		if (res?.error) {
			setLoader(false)

			// format an error message
			const error = { message: res?.error }

			ServerErrors("Sorry", [{ message: error?.message }])

			return
		}

		// turn off loader
		setLoader(false)

		navigator?.push(ROUTES.dashboard)
	}
	// handle form submit
	const handleSubmit = (data: SignUpFormData) => {
		dispatcher(AuthCreateAccountThunk({ data })).then((res) => {
			if (typeof res?.payload !== "undefined") {
				handleLogin({ email: data.email, password: data.password })
			}
		})
	}

	const onSelectPhoneNumberCode = (
		<Select
			showSearch
			defaultValue={defaultValue}
			onChange={(value) => console.log(value)}
			className="w-24"
			labelInValue={false}
			optionLabelProp="label"
			popupMatchSelectWidth={192}
			filterOption={(input, option) => {
				const countryData = countries.find((entry) => entry.cca2 === option?.value)
				return (countryData?.name.toLowerCase().includes(input.toLowerCase()) || countryData?.cca2.toLowerCase().includes(input.toLowerCase())) ?? false
			}}
		>
			{countries.map((country) => (
				<Select.Option key={country.cca2} value={country.cca2} label={`${country.flag} +${country.code}`}>
					{country.flag}&nbsp;&nbsp;(+{country.code})&nbsp;{country.name}
				</Select.Option>
			))}
		</Select>
	)

	return (
		<>
			<div className="space-y-5 px-5">
				<Typography.Text className="text-[32px] font-extrabold">Sign up</Typography.Text>

				<div>
					<Formik innerRef={formRef} initialValues={InitialFormState} onSubmit={handleSubmit} validationSchema={signupValidation}>
						{({ values, handleChange }) => (
							<Form className="space-y-4">
								<Flex flexDir="column" gap={4}>
									<Typography.Text className="font-medium text-lg leading-6">Invite Code</Typography.Text>
									<Field value={values?.refCode} variant="filled" size="large" disabled className="p-3 w-full rounded-md border-transparent shadow-sm focus:outline-primary bg-[#f5f5f5]" />
								</Flex>

								<Flex flexDir="column" gap={4}>
									<Typography.Text className="font-medium text-lg leading-6">Enter your email address</Typography.Text>
									<Field
										value={values?.email}
										name="email"
										onChange={handleChange}
										placeholder="Enter your email address"
										variant="filled"
										className="p-3 w-full rounded-md border-transparent shadow-sm focus:outline-primary bg-[#f5f5f5]"
									/>
									{/* error message */}
									<ErrorMessage name="email" component="div" className="text-red-500" />
								</Flex>

								<Flex flexDir="column" gap={4}>
									<Typography.Text className="font-medium text-lg leading-6">Phone Number <span className="text-sm text-muted">(optional)</span></Typography.Text>
									<Field
										onChange={handleChange}
										name="phone"
										value={values?.phone}
										size="large"
										variant="filled"
										placeholder="Enter your Phone Number"
										component={({ field, form, ...props }: { field: any; form: any }) => <Input addonBefore={onSelectPhoneNumberCode} {...field} {...props} />}
									/>
									{/* error message */}
									<ErrorMessage name="phone" component="div" className="text-red-500" />
								</Flex>
								<Flex flexDir="column" gap={4}>
									<Typography.Text className="font-medium text-lg leading-6">Password</Typography.Text>
									<PasswordInput value={values?.password} handleChange={handleChange} name="password" placeholder="Password" variant="filled" size="large" />
									{/* error message */}
									<ErrorMessage name="password" component="div" className="text-red-500" />
								</Flex>
								<Box mt={2} mb={4}>
									<Button isLoading={isLoading || loader} size="large" variant="filled" type="submit" className="w-full bg-primary p-3 rounded-md ">
										Signup
									</Button>
								</Box>
							</Form>
						)}
					</Formik>

					<Divider />

					<AuthFooter />
				</div>
			</div>
		</>
	)
}

export default Signup

"use client";
import Link from "next/link";
import { AppleIcon } from "@/app/assets/icons";
import { GoogleIcon } from "@/app/assets/icons";
import { Button, Divider, Form, Input, Typography } from "antd";
import { AuthCreateAccountThunk, getAuthState, useAppDispatch, useAppSelector } from "@Jetzy/redux";
import React from "react";
import { useRouter } from "next/navigation";
import { SignInFormData, SignUpFormData } from "@Jetzy/types";
import { signIn } from "next-auth/react";
import { ServerErrors } from "@Jetzy/app/lib/_toaster";
import { ROUTES } from "@Jetzy/configs/routes";
import { ErrorMessage, Field,  Formik } from "formik"
import { signupValidation } from "@Jetzy/validator/authValidtor";

const Login = () => {
  const [form] = Form.useForm();

  const dispatcher = useAppDispatch()
	const authState = useAppSelector(getAuthState)
	const [loader, setLoader] = React.useState<boolean>(authState.isLoading)
	const navigator = useRouter()

	const InitialFormState: SignUpFormData = {
		refCode: "",
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
		dispatcher(AuthCreateAccountThunk
      ({ data })).then((res) => {
			if (typeof res?.payload !== "undefined") {
				handleLogin({ email: data.email, password: data.password })
			}
		})
	}


  return (
    <>
      <div className="space-y-5">
        <Typography.Text className="text-[32px] font-extrabold">
          Sign in
        </Typography.Text>
        <div className="">
          <Form form={form} layout="vertical">
            <Form.Item
              name="emailAddress"
              label={
                <Typography.Text className="font-medium text-lg leading-6">
                Enter your email address
                </Typography.Text>
              }
            >
              <Input   name="email" variant="filled" size="large" placeholder="Enter your email address" />
              
            </Form.Item>
            <Form.Item
              name="password"
              label={
                <Typography.Text className="font-medium text-lg leading-6">
                Password
                </Typography.Text>
              }
            >
              <Input.Password   name="password"  variant="filled" size="large" placeholder="Enter your account password" />
            </Form.Item>

            <Form.Item className="text-end">
              <Link href='/' className="text-primary hover:underline hover:text-primary">Forgot Password?</Link>
            </Form.Item>

            <Form.Item>
              <Button size='large' variant="filled" type='primary' className="w-full">Sign in</Button>
            </Form.Item>
          </Form>

          <Divider />
          
          <div className="flex items-center gap-x-2">
            <Button size="large" className="rounded-full font-medium px-6 py-6" icon={<GoogleIcon />}>
              Sign in with Google
            </Button>
            <Button size="large" className="rounded-full font-medium px-6 py-6" icon={<AppleIcon />}>
              Sign in with Apple
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

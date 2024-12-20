"use client";
import Link from "next/link";
import { AppleIcon } from "@/app/assets/icons";
import { GoogleIcon } from "@/app/assets/icons";
import { Button, Divider, Form as AntdForm,   Typography } from "antd";
import { AuthCreateAccountThunk, getAuthState, useAppDispatch, useAppSelector } from "@Jetzy/redux";
import React from "react";
import { useRouter } from "next/navigation";
import { SignInFormData, SignUpFormData } from "@Jetzy/types";
import { signIn } from "next-auth/react";
import { ServerErrors } from "@Jetzy/app/lib/_toaster";
import { ROUTES } from "@Jetzy/configs/routes";
import { ErrorMessage, Field,  Form,  Formik } from "formik"
import { signupValidation } from "@Jetzy/validator/authValidtor";
import { Box, Button as ChakraButton } from "@chakra-ui/react";
import { appColors } from "@Jetzy/theme/theme";

const {Item: FormItem} = AntdForm

const Login = () => {
  

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

        <Formik initialValues={InitialFormState} onSubmit={handleSubmit} validationSchema={signupValidation}>
        {({ handleChange, values, errors }) => (
          <div className="">
          <Form>
           
            
            <Box>
                <Field value={values?.email} onChange={handleChange} name="email" variant="filled" size="large" placeholder="Enter your email address" />
                {/* error message */}
                <ErrorMessage name="email" component="div" className="text-red-500" />
              </Box>
              <Field type="password" value={values?.password} name="password"  variant="filled" size="large" placeholder="Enter your account password" />
 
              <Link href='/' className="text-primary hover:underline hover:text-primary">Forgot Password?</Link>

            <FormItem>
              <ChakraButton size='large' variant="filled" type='submit' bg={appColors.primary} borderRadius={'3xl'} className="w-full">Sign in</ChakraButton>
            </FormItem>
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
        )}
      </Formik>
      </div>
    </>
  );
};

export default Login;

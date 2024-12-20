"use client";
import Link from "next/link";
import { AppleIcon } from "@/app/assets/icons";
import { GoogleIcon } from "@/app/assets/icons";
import { Button as AntButton, Divider, Form as AntdForm, Input, Typography } from "antd";
import { AuthCreateAccountThunk, getAuthState, useAppDispatch, useAppSelector } from "@Jetzy/redux";
import React from "react";
import { useRouter } from "next/navigation";
import { SignInFormData, SignUpFormData } from "@Jetzy/types";
import { signIn } from "next-auth/react";
import { ServerErrors } from "@Jetzy/app/lib/_toaster";
import { ROUTES } from "@Jetzy/configs/routes";
import { ErrorMessage, Field,  Form,  Formik } from "formik"
import { signupValidation } from "@Jetzy/validator/authValidtor";
import { Box, Button, Flex } from "@chakra-ui/react";
import PasswordInput from "./PasswordInput";

const {Item: FormItem} = AntdForm;

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
     handleLogin(data)
	}


  return (
    <>
      <div className="space-y-5 px-5">
        <Typography.Text className="text-[32px] font-extrabold">
          Sign in
        </Typography.Text>

        <Formik initialValues={InitialFormState} onSubmit={handleSubmit} validationSchema={signupValidation}>
        {({ handleChange, values, errors, handleSubmit }) => (
          <div className="">
          <Form>
           <Flex flexDir="column" gap={8}>
           <Flex flexDir={'column'} gap={4}>
           <Typography.Text className="font-medium text-lg leading-6">
                Enter your email address
                </Typography.Text>
             <Box>
             <Field value={values?.email} onChange={handleChange} name="email" variant="filled" size="large" placeholder="Enter your email address" className="p-3 w-full rounded-md border-transparent shadow-sm focus:outline-primary bg-[#f5f5f5]" />
              {/* error message */}
              <ErrorMessage name="email" component="div" className="text-red-500" />
             </Box>
            </Flex>
            <Flex flexDir={'column'} gap={4}>
            <Typography.Text className="font-medium text-lg leading-6">
                Password
                </Typography.Text>
                <PasswordInput value={values?.password} handleChange={handleChange} name="password" />
              {/* <Field type="password" value={values?.password} name="password"  variant="filled" size="large" placeholder="Enter your account password" className="p-3 rounded-md border-transparent shadow-sm focus:outline-primary bg-[#f5f5f5]" /> */}
              {/* error message */}
              <ErrorMessage name="password" component="div" className="text-red-500" />
            </Flex>
           </Flex>

            <Flex w={"100%"} justifyContent="flex-end" mt={2} mb={4}>
              <Link href='/' className="text-primary hover:underline hover:text-primary">Forgot Password?</Link>
            </Flex>

            <Flex>
              <Button isLoading={loader} size='large' variant="filled" type='submit'  className="w-full bg-primary p-3 rounded-md ">Sign in</Button>
            </Flex>
          </Form>

          <Divider />
          
          <div className="flex items-center gap-x-2">
            <AntButton size="large" className="rounded-full font-medium px-6 py-6" icon={<GoogleIcon />}>
              Sign in with Google
            </AntButton>
            <AntButton size="large" className="rounded-full font-medium px-6 py-6" icon={<AppleIcon />}>
              Sign in with Apple
            </AntButton>
          </div>
        </div>
        )}
      </Formik>
      </div>
    </>
  );
};

export default Login;

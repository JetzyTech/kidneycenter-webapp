import { Box } from "@chakra-ui/react"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import { ErrorMessage, Field, GenericFieldHTMLAttributes } from "formik"
import React from "react"

type PasswordInputProps = {
	value: string
	handleChange: (e: React.ChangeEvent<any>) => void
	name: string
	[key: string]: any
}

export default function PasswordInput({ value, handleChange, name, ...props }: PasswordInputProps) {
	const [showPassword, setShowPassword] = React.useState(false)

	return (
		<Box className="relative">
			<Field
				type={showPassword ? "text" : "password"}
				className="p-3 border border-gray-300 rounded-md bg-slate-100/50 focus:bg-white w-full pr-10"
				value={value}
				onChange={handleChange}
				name={name}
				{...props}
			/>
			{!showPassword ? (
				<EyeSlashIcon className="w-6 h-6 absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer z-10" onClick={() => setShowPassword(!showPassword)} />
			) : (
				<EyeIcon className="w-6 h-6 absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer z-10" onClick={() => setShowPassword(!showPassword)} />
			)}
		</Box>
	)
}

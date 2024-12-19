import { uniqueId } from "./utils"
import { Box, StackDivider, Text, VStack, createStandaloneToast } from "@chakra-ui/react"

export type ServerErrorsProps = {
	message: string
}

export const { ToastContainer, toast } = createStandaloneToast({
	defaultOptions: {
		duration: 9000,
		isClosable: true,
		position: "bottom",
	},
})

export const Success = (title?: string, message?: string) => {
	toast({
		title,
		description: message as string,
		status: "success",
	})
}

export const Error = (title?: string, message?: string) => {
	toast({
		title,
		description: message as string,
		status: "error",
	})
}

export const ServerErrors = (title?: string, error: ServerErrorsProps[] = []) => {
	toast({
		title,
		render: () => (
			<Box background={"red.500"} color={"white"} p={3} borderRadius={3}>
				<VStack divider={<StackDivider />} spacing={3}>
					{error && error?.length > 0 && (
						<>
							{error?.map((err) => (
								<Text key={uniqueId()}>{err?.message}</Text>
							))}
						</>
					)}
				</VStack>
			</Box>
		),
		status: "error",
	})
}

export const Info = (title?: string, message?: string) => {
	toast({
		title,
		description: message as string,
		status: "info",
	})
}

export const Warning = (title?: string, message?: string) => {
	toast({
		title,
		description: message as string,
		status: "warning",
	})
}

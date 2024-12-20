import { io } from "socket.io-client"

const url = process.env.NEXT_PUBLIC_WS_URL as string

// instanciate the socket client
export const wbSocket = io(`${url}/private_chats`, {
	autoConnect: false,
	reconnection: false,
	auth: (cb) => {
		if (typeof sessionStorage === "undefined") return

		if (sessionStorage?.getItem("api_token") === null) return

		cb({ token: sessionStorage?.getItem("api_token") })
	},
})

// Manually handle reconnection
export const tryReconnect = () => {
	setTimeout(() => {
		wbSocket.io.open((err) => {
			if (err) {
				tryReconnect()
			}
		})
	}, 2000)
}

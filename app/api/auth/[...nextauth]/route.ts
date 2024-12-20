import NextAuth, { NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"
export const authOptions: NextAuthOptions = {
	providers: [
	 Credentials({
		 type: 'credentials',
		 // The credentials is used to generate a suitable form on the sign in page.
			 // You can specify whatever fields you are expecting to be submitted.
			 // e.g. domain, username, password, 2FA token, etc.
			 // You can pass any HTML attribute to the <input> tag through the object.
			 credentials: {
				 email: { label: "Email", type: "text", placeholder: "Email Address" },
				 password: { label: "Password", type: "password" },
			 },
 
			 async authorize(credentials, req) {
				 // You need to provide your own logic here that takes the credentials
				 // submitted and returns either a object representing a user or value
				 // that is false/null if the credentials are invalid.
				 // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
				 // You can also use the `req` object to obtain additional parameters
				 // (i.e., the request IP address)
 
				 // let serverRes
				 // if (credentials?.password !== "auto-login") {
				 // 	serverRes = await AuthorizeUserApi({ data: credentials })
				 // 	if (!serverRes?.status) {
				 // 		throw new Error(serverRes?.message)
				 // 	}
				 // 	return { ...serverRes?.data } as any
				 // } else {
				 // 	// The email is the user authorization (it will be passed to the user email.)
				 // 	serverRes = await AuthorizedUserAccountApi({ id: credentials.email })
				 // 	if (!serverRes?.status) {
				 // 		throw new Error(serverRes?.message)
				 // 	}
				 // 	return { ...serverRes?.data } as any
				 // }
 
				 return null
			 },
	 })
	]
 }
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/authentication", // Redirect users to this page if not authenticated
  },
});

export const config = {
  matcher: ["/dashboard/:path*", ], // Apply middleware only to these routes
};

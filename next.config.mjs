/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  env: {
    // Fix: this resolve the deployment issue on AWS Amplify
    // NEXTAUTH_URL: "https://jetzy-dev.jetzy.com", // On development comment this line to avoid conflict with NEXTAUTH_URL

    NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,

    NEXT_PUBLIC_AUTH_TOKEN: process.env.NEXT_PUBLIC_AUTH_TOKEN,
   
    JWT_SECRET: process.env.JWT_SECRET,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,

    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,

    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_NAME: process.env.MONGODB_NAME,
  },
};

export default nextConfig;

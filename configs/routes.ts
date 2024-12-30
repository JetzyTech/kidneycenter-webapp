export const ROUTES = {
  auth: process.env.NEXT_PUBLIC_BASE_URL
    ? `${process.env.NEXT_PUBLIC_BASE_URL}/authentication`
    : "/authentication",
  dashboard: process.env.NEXT_PUBLIC_BASE_URL
    ? `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`
    : "/dashboard",
};

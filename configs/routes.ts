export const ROUTES = {
  auth: process.env.NEXT_PUBLIC_URL
    ? `${process.env.NEXT_PUBLIC_URL}/authentication`
    : "/authentication",
  dashboard: process.env.NEXT_PUBLIC_URL
    ? `${process.env.NEXT_PUBLIC_URL}/dashboard`
    : "/dashboard",
};

import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F79432',
        secondary: '#FFF0E2',
        paragraph: '#595E62',
        muted: '#ACACAC'
      },
    },
  },
  plugins: [],
} satisfies Config;

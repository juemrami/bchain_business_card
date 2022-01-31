import { defineConfig } from "windicss/helpers";

export default defineConfig({
  attributify: true,
  extract: {
    include: [
      "./src/**/*.{html,jsx,tsx}",
      "./src/components/**/*.{js,ts,jsx,tsx}",
      "./src/containers/**/*.{js,ts,jsx,tsx}",
    ],
    exclude: ["node_modules", ".git", ".next"],
  },
  safelist: ["prose", "prose-sm", "m-auto"],
  theme: {
    extend: {
      colors: {
        "near-blue": "#0072CE",
        success: "#218838",
        danger: "#a80c19",
        "modal-bg": "rgba(0,0,0,0.4)",
      },
    },
  },
  shortcuts: {
    btn: 'rounded-lg border border-gray-300 text-gray-100 bg-blue-500 px-4 py-2 m-2 inline-block hover:shadow',
  },
  plugins: [],
});

module.exports = {
    content: [
      "./src/pages/**/*.{js,ts,jsx,tsx}",
      "./src/components/**/*.{js,ts,jsx,tsx}",
      "./src/containers/**/*.{js,ts,jsx,tsx}",
      "./src/pages/home.tsx",
    ],
    theme: {
      extend: {
        colors: {
          "near-blue": "#5F8AFA",
          success: "#218838",
          danger: "#DC3545",
          "modal-bg": "rgba(0,0,0,0.4)",
        },
      },
    },
    plugins: [],
  };
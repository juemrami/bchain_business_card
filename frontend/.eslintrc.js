module.exports = {
  env: {
    browser: false,
    es2021: true,
    mocha: true,
    node: true,
  },
  plugins: ["@typescript-eslint/plugin"],
  extends: [
    "next/core-web-vitals",
    "plugin:typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:node/recommended",
    "plugin:react/reccomened",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeature: {
      jsx: true,
    },
    ecmaVersion: 12,
  },
  rules: {
    "node/no-unsupported-features/es-syntax": [
      "error",
      { ignores: ["modules"] },
    ],
  },
};

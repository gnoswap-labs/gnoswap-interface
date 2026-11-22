module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: ["next", "prettier", "plugin:storybook/recommended"],
  root: true,
  rules: {
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "array-element-newline": [
      "error",
      {
        ArrayExpression: "consistent",
        ArrayPattern: { multiline: true },
      },
    ],
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-unused-expressions": "error",
    "no-duplicate-imports": "error",
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/no-empty-function": "warn",
    "@typescript-eslint/no-empty-interface": "warn",
    "@next/next/no-html-link-for-pages": "off",
  },
  settings: {
    "import/external-module-folders": [".yarn"],
    react: {
      version: "detect",
    },
  },
};

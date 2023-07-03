module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  extends: ["next", "plugin:@typescript-eslint/recommended"],
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
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/no-empty-function": "warn",
    "@typescript-eslint/no-empty-interface": "warn",
  },
  settings: {
    "import/external-module-folders": [".yarn"],
    react: {
      version: "detect",
    },
  },
};

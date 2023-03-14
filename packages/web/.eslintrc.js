module.exports = {
  root: false,
  env: {
    browser: true,
    es2021: true,
    jest: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  extends: ["next"],
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
  },
  settings: {
    "import/external-module-folders": [".yarn"],
    react: {
      version: "detect",
    },
  },
};

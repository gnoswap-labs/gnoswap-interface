/* eslint-disable @typescript-eslint/no-require-imports */
const nextJest = require("next/jest");
const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  roots: ["<rootDir>"],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
    "react-markdown": "<rootDir>/__mocks__/react-markdown.tsx",
    "remark-gfm": "<rootDir>/__mocks__/remark-gfm.ts",
    "^@(.*)$": "<rootDir>/src/$1",
  }),
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  testMatch: ["<rootDir>/**/*.spec.(js|jsx|ts|tsx)"],
};

// faker v10 ships ESM only and next/jest otherwise ignores node_modules so its
// transform patterns are replaced to add @faker-js to the allowlist
module.exports = async () => {
  const config = await createJestConfig(customJestConfig)();
  config.transformIgnorePatterns = [
    "/node_modules/(?!.pnpm)(?!(geist|@faker-js)/)",
    "/node_modules/.pnpm/(?!(geist|@faker-js)@)",
    "^.+\\.module\\.(css|sass|scss)$",
  ];
  return config;
};

/* eslint-disable @typescript-eslint/no-require-imports */
const nextJest = require("next/jest");
const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// The gno clients and a part of their dependency tree (uuid, @scure, @noble, @cosmjs)
// are published as ESM only, so they have to go through the transformer instead of
// being required as-is. Every enclosing scope has to be listed as well, otherwise the
// pattern still matches on the outer `node_modules/` segment of a nested dependency.
// faker v10 and geist also ship ESM only, so they join the allowlist below.
const ESM_ONLY_PACKAGES = [
  "@gnolang",
  "@cosmjs",
  "@scure",
  "@noble",
  "uuid",
  "geist",
  "@faker-js",
];

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

// next/jest always ignores `node_modules` for transforms and only lets custom config
// append to that list, so the resolved config is patched after the fact.
module.exports = async () => {
  const config = await createJestConfig(customJestConfig)();

  config.transformIgnorePatterns = [
    "^.+\\.module\\.(css|sass|scss)$",
    `/node_modules/(?!(${ESM_ONLY_PACKAGES.join("|")})/)`,
  ];

  return config;
};

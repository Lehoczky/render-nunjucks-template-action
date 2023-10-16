/* eslint-disable @typescript-eslint/naming-convention */

/** @type {import('jest').Config} */
const config = {
  preset: "ts-jest",
  verbose: true,
  clearMocks: true,
  testEnvironment: "node",
  moduleFileExtensions: ["js", "ts"],
  testMatch: ["**/*.test.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  coverageReporters: ["json-summary", "text", "lcov"],
  collectCoverageFrom: ["./src/**"],
  setupFiles: ["<rootDir>/jest.setup.js"],
}

export default config

import type { JestConfigWithTsJest } from "ts-jest"

export const jestConfig: JestConfigWithTsJest = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": ["<rootDir>/src/$1", "<rootDir>/tests/$1"],
  },
}

export default jestConfig

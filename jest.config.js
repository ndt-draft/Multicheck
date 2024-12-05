/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      // ts-jest configuration goes here
    },
  },
  moduleNameMapper: {
    "\\.(css)$": "<rootDir>/__mocks__/styleMock.js",
  }
};
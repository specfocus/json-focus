/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.[tj]s?$': 'ts-jest',
  },
  testEnvironment: 'node',
  // testRegex: '/**/?(*.)+(spec|test).[tj]s?(x)',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['./testSetup.js']
};
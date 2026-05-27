/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        isolatedModules: true,
        tsconfig: {
          module: 'CommonJS',
          moduleResolution: 'node',
          strict: false,
        },
      },
    ],
  },
  testMatch: ['**/__tests__/**/*.test.ts'],
  verbose: true,
};

module.exports = {
    moduleNameMapper: {
      '@/tests/(.+)': '<rootDir>/tests/$1',
      '@/(.+)': '<rootDir>/src/$1'
    },
    testMatch: ['**/*.spec.ts'],
    roots: [
      '<rootDir>/src',
      '<rootDir>/tests'
    ],
    transform: {
      '\\.ts$': 'ts-jest'
    },
    clearMocks: true,
    setupFiles: ['dotenv/config']
  }

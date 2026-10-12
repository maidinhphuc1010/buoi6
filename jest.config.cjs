module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: { module: 'CommonJS', moduleResolution: 'Node', ignoreDeprecations: '6.0' } }],
  },
  collectCoverageFrom: ['src/features/**/*.{ts,tsx}', 'src/app/hooks.ts', 'src/App.tsx'],
  coveragePathIgnorePatterns: ['\\.test\\.'],
  coverageReporters: ['text', 'html', 'lcov', 'json-summary'],
  coverageThreshold: {
    global: { statements: 70, branches: 70, functions: 70, lines: 70 },
    './src/features/': { statements: 70, branches: 70, functions: 70, lines: 70 },
  },
  clearMocks: true,
};

import reactNativeConfig from '@react-native/eslint-config/flat'

export default [
  ...reactNativeConfig,
  {
    files: ['src/**/*.ts', 'tests/**/*.ts'],
    // tsc checks unused source declarations and understands JSDoc-only type
    // imports. Contract test variables intentionally exist only to typecheck.
    rules: { '@typescript-eslint/no-unused-vars': 'off' },
  },
  {
    ignores: [
      'android/**',
      'ios/**',
      'lib/**',
      'nitrogen/generated/**',
      'node_modules/**',
    ],
  },
]

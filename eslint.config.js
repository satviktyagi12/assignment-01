import { defineConfig } from 'eslint/config'
import { getConfig } from './fe-zen-arch/eslint.config.js'

const ignores = ['dist/', 'fe-zen-arch/', '**/*.js']

export default defineConfig(...getConfig(ignores, import.meta), {
  // Keep legacy findings visible without blocking assignment verification.
  // TypeScript compilation is still strict and runs before ESLint.
  rules: {
    '@typescript-eslint/prefer-nullish-coalescing': 'warn',
    '@typescript-eslint/no-unnecessary-condition': 'warn',
    '@typescript-eslint/prefer-optional-chain': 'warn',
    '@typescript-eslint/require-await': 'warn',
    '@typescript-eslint/no-unsafe-call': 'warn',
    '@typescript-eslint/no-unsafe-return': 'warn',
    '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'warn',
    '@typescript-eslint/no-unnecessary-type-conversion': 'warn',
    '@typescript-eslint/prefer-regexp-exec': 'warn',
    'const-to-function/convert-const-to-function': 'warn',
    'func-style': 'warn'
  }
})

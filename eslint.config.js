import js from '@eslint/js'
import globals from 'globals'
import reactPlugin from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

/**
 * React: `eslint-plugin-react` + `react/jsx-uses-vars` — JSX’te kullanılan bileşenler (ör. Icon, motion)
 * `no-unused-vars` ile uyumlu sayılır. Ölü export / dosya: `npm run knip`
 */
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['vite.config.js', 'tailwind.config.js', 'postcss.config.cjs', 'scripts/**/*.{js,mjs}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    },
    extends: [js.configs.recommended],
  },
  {
    files: ['**/*.{js,jsx}'],
    ignores: ['vite.config.js', 'tailwind.config.js', 'postcss.config.cjs', 'scripts/**/*.{js,mjs}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    plugins: {
      react: reactPlugin,
    },
    settings: {
      react: { version: 'detect' },
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react/jsx-uses-vars': 'error',
    },
  },
  {
    files: ['src/contexts/**/*.{js,jsx}'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])

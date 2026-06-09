import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  // ── Ignore patterns ─────────────────────────────────────────────────────────
  {
    ignores: ['dist/**', 'node_modules/**', 'jest.config.cjs', 'vite.config.ts'],
  },

  // ── TypeScript source files ──────────────────────────────────────────────────
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // TypeScript recommended + type-checked rules
      ...tsPlugin.configs['flat/recommended-type-checked'].rules,

      // React hooks
      ...reactHooks.configs['recommended-latest'].rules,

      // React Refresh (fast HMR — warn only so it doesn't block)
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // Project-specific rules
      'no-console': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
];

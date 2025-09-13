// eslint.config.js
import tseslint from 'typescript-eslint';
import angular from '@angular-eslint/eslint-plugin';
import angularTemplate from '@angular-eslint/eslint-plugin-template';
import prettier from 'eslint-plugin-prettier';

export default [
  {
    ignores: ['**/dist/**', 'src/index.html'],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['tsconfig.json', 'e2e/tsconfig.json'],
        createDefaultProgram: true,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      '@angular-eslint': angular,
      prettier,
    },
    rules: {
      // Punto y coma obligatorio
      semi: ['error', 'always'],

      // Coma final donde aplique
      'comma-dangle': ['error', 'always-multiline'],

      // Comillas simples
      quotes: ['error', 'single', { avoidEscape: true }],

      // Línea en blanco al final de archivo
      'eol-last': ['error', 'always'],

      // --- Reglas de Angular ---
      // '@angular-eslint/component-selector': ['error', { type: 'element', prefix: 'p', style: 'kebab-case' }],
      // '@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix: 'p', style: 'camelCase' }],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', style: 'kebab-case' },
      ],
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', style: 'camelCase' },
      ],
      '@angular-eslint/component-class-suffix': ['error', { suffixes: [''] }],
      // '@angular-eslint/template/eqeqeq': ['error', { allowNullOrUndefined: true }],
      '@angular-eslint/no-host-metadata-property': 'off',
      '@angular-eslint/no-output-on-prefix': 'off',

      // --- Reglas de TypeScript ---
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/member-ordering': [
        'error',
        {
          default: [
            'public-static-field',
            'static-field',
            'instance-field',
            'public-instance-method',
            'public-static-field',
          ],
        },
      ],

      // --- Reglas de estilo ---
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        {
          blankLine: 'any',
          prev: ['const', 'let', 'var'],
          next: ['const', 'let', 'var'],
        },
        { blankLine: 'any', prev: ['case', 'default'], next: 'break' },
        { blankLine: 'any', prev: 'case', next: 'case' },
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: 'block', next: '*' },
        { blankLine: 'always', prev: '*', next: 'block' },
        { blankLine: 'always', prev: 'block-like', next: '*' },
        { blankLine: 'always', prev: '*', next: 'block-like' },
        {
          blankLine: 'always',
          prev: ['import'],
          next: ['const', 'let', 'var'],
        },
      ],
      'arrow-body-style': ['error', 'as-needed'],
      curly: 0,
      'no-console': 0,
      'prefer-const': 0,
      'prettier/prettier': 'error',
    },
  },
  {
    files: ['**/*.html'],
    plugins: {
      '@angular-eslint/template': angularTemplate,
      prettier,
    },
    rules: {
      ...angularTemplate.configs.recommended.rules,
      'prettier/prettier': 'error',
    },
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        allowImportExportEverywhere: true,
      },
    },
    plugins: {
      prettier,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
];

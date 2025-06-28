import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
	//baseDirectory: import.meta.dirname,
	recommendedConfig: js.configs.recommended,
});

const eslintConfig = [
	...compat.config({
		ignorePatterns: [
			'**/*.js',
			'**/*.mjs',
			'node_modules/',
			'dist/',
			'build/',
			'.next/',
			'.husky/',
		],
		globals: { React: true },

		extends: [
			'next/core-web-vitals',
			'plugin:@typescript-eslint/recommended',
			'next/typescript',
			'prettier',
			'next',
			'plugin:react/recommended',
			'plugin:prettier/recommended',
			'plugin:@next/next/recommended',
		],
		settings: {
			react: {
				version: 'detect',
			},
		},
		plugins: ['prettier', '@typescript-eslint', 'react', 'react-hooks'],
		rules: {
			semi: ['error', 'always'],
			quotes: ['error', 'single'],
			'react/react-in-jsx-scope': 'off',
			'prefer-arrow-callback': ['error'],
			'prefer-template': ['error'],
			'no-var': ['error'],
			'no-unused-vars': ['off'],
			'no-undef': ['error'],
			'no-constant-condition': ['error'],
			'prefer-const': ['error'],
			'no-else-return': ['error'],
			'no-useless-return': ['error'],
			'@typescript-eslint/no-unused-vars': ['error'],
			'@typescript-eslint/explicit-function-return-type': ['error'],
			'@typescript-eslint/explicit-module-boundary-types': ['error'],
			'@typescript-eslint/no-inferrable-types': ['off'],
			'@typescript-eslint/typedef': [
				'error',
				{
					variableDeclaration: true,
					parameter: false,
					arrowParameter: false,
					propertyDeclaration: false,
					memberVariableDeclaration: false,
				},
			],
			'@typescript-eslint/no-explicit-any': ['error'],
			'@typescript-eslint/consistent-type-assertions': [
				'error',
				{
					assertionStyle: 'as',
					objectLiteralTypeAssertions: 'never',
				},
			],
			'@typescript-eslint/no-use-before-define': [
				'error',
				{
					functions: false,
					classes: true,
					variables: true,
				},
			],
			'prettier/prettier': [
				'error',
				{
					useTabs: true,
					tabWidth: 4,
					singleQuote: true,
					semi: true,
					arrowParens: 'always',
					trailingComma: 'es5',
					endOfLine: 'auto',
				},
			],
			indent: [
				'error',
				'tab',
				{
					SwitchCase: 1,
				},
			],
			indent: 'off',
		},
	}),
];

export default eslintConfig;

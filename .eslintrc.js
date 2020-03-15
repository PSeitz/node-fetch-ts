module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 2017,
      project: 'tsconfig.json'
    },
    plugins: [
      '@typescript-eslint',
    ],
    extends: [
      "plugin:prettier/recommended",
      'eslint:recommended',
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:@typescript-eslint/recommended',
    ],
    rules:{
      "prettier/prettier": ["error", {
        "endOfLine":"auto"
      }],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/camelcase": "off",
      // "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/member-delimiter-style": "off",
      "@typescript-eslint/prefer-as-const": "error",
      "@typescript-eslint/prefer-for-of": "error",
      "@typescript-eslint/prefer-function-type": "error",
      "@typescript-eslint/prefer-includes": "error",
      "@typescript-eslint/prefer-namespace-keyword": "error",
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/prefer-readonly": "error",
      "@typescript-eslint/prefer-regexp-exec": "error",
      "@typescript-eslint/prefer-string-starts-ends-with": "error",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-use-before-define": ["error", { "functions": false }],
      "no-empty": ["error", { "allowEmptyCatch": true }],
    }
  };


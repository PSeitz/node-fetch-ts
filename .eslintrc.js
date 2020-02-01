module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
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
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/camelcase": "off",
      // "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/member-delimiter-style": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-use-before-define": ["error", { "functions": false }],
      "no-empty": ["error", { "allowEmptyCatch": true }],
    }
  };
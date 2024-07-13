import globals from "globals";
import pluginJs from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin-js";
import unicorn from "eslint-plugin-unicorn";
import pluginJest from "eslint-plugin-jest";


export default [
  {
    languageOptions: { globals: globals.browser },
    rules: {
      "@stylistic/js/indent": ["error", 2],
      "@stylistic/js/quotes": ["error", "single"],
      "@stylistic/js/padded-blocks": ["error", "never"],
      "@stylistic/js/array-element-newline": ["warn", "consistent"],
      "@stylistic/js/quote-props": ["warn", "as-needed"]
    }
  },
  pluginJs.configs.recommended,
  stylistic.configs["all-flat"],
  unicorn.configs["flat/recommended"],
  pluginJest.configs["flat/recommended"],
];
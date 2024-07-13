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
      "@stylistic/js/array-element-newline": ["error", "consistent"]
    }
  },
  pluginJs.configs.recommended,
  stylistic.configs["all-flat"],
  unicorn.configs["flat/recommended"],
  pluginJest.configs["flat/recommended"],
];
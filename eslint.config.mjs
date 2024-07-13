import globals from "globals";
import pluginJs from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import unicorn from "eslint-plugin-unicorn";
import pluginJest from "eslint-plugin-jest";


export default [
  pluginJs.configs.recommended,
  stylistic.configs["recommended-flat"],
  unicorn.configs["flat/recommended"],
  pluginJest.configs["flat/recommended"],
  {
    languageOptions: { globals: globals.browser },
    rules: {
      "@stylistic/indent": ["error", 2],
      "@stylistic/quotes": ["error", "single"],
      "@stylistic/padded-blocks": ["error", "never"],
      "@stylistic/operator-linebreak": ["error", "after"],
      "unicorn/filename-case": ["warn", {"case": "pascalCase"}],
      "unicorn/prevent-abbreviations": ["warn",
        {
          "allowList": {
            "obj": true,
            "Obj": true
          },
        }
      ]
    }
  },
];
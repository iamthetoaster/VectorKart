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
    linterOptions: { reportUnusedDisableDirectives: "error" },
    languageOptions: { globals: globals.browser },
    rules: {
      "prefer-const": "error",
      "@stylistic/semi": ["error", "always"],
      "@stylistic/indent": ["error", 2],
      "@stylistic/quotes": ["error", "single"],
      "@stylistic/padded-blocks": ["error", "never"],
      "@stylistic/operator-linebreak": ["error", "after"],
      "@stylistic/arrow-parens": ["error", "always"],
      "@stylistic/brace-style": ["error", "1tbs"],
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
  {
    files: ["src/engine/*", "src/state-objects/*", "tests"],
    rules: {
      "unicorn/filename-case": ["error", {"case": "pascalCase"}],
    }
  }
];
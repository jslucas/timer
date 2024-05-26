// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import jest from "eslint-plugin-jest";
import globals from "globals";

export default tseslint.config(
  {
    ignores: ["src-tauri/", "build/"],
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
  },
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
  jest.configs["flat/recommended"],
);

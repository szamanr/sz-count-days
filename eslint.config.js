import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import solid from "eslint-plugin-solid/configs/typescript.js";
import prettier from "eslint-config-prettier";

/** @type { import("eslint").Linter.FlatConfig[] } */
export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    files: ["**/*.{ts,tsx}"],
    ...solid,
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "tsconfig.json",
      },
    },
  },
);

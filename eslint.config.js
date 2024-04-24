import eslint from "@eslint/js";
import prettier from "eslint-config-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import solid from "eslint-plugin-solid/configs/typescript.js";
import tseslint from "typescript-eslint";

/**
 * this is for simple-import-sort plugin. imports will be grouped before sorting.
 * it's the default plugin config, plus one custom group (project imports)
 * @type {string[][]}
 */
const importGroups = [
  [
    // side effect imports
    "^\\u0000",
    // packages
    "^@?\\w",
    // project imports
    "^(@|app|common)(/.*|$)",
    // anything else
    "^",
    // relative imports
    "^\\.",
  ],
];

/** @type { import('eslint').Linter.FlatConfig[] } */
export default tseslint.config(
  {
    ignores: ["dist/*", "node_modules/*"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    ...solid,
    files: ["{app,common}/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "tsconfig.json",
      },
    },
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    ...eslint.configs.recommended,
    rules: {
      "simple-import-sort/imports": [
        "error",
        {
          groups: importGroups,
        },
      ],
    },
  },
);

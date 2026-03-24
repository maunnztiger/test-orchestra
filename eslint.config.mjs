import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  // 🔹 Ignore build output + node_modules
  {
    ignores: ["dist/**", "node_modules/**"]
  },

  // 🔹 Base JS config
  js.configs.recommended,

  // 🔹 TypeScript config
  ...tseslint.configs.recommended,

  // 🔹 Custom rules + Node environment
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly",
        __dirname: "readonly",
        module: "readonly",
        require: "readonly"
      }
    },
    rules: {
      // 🔥 pragmatische Settings für dein Framework
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-vars": "warn"
    }
  }
];

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.ts", "**/*.tsx"],
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:react/recommended",
      "plugin:jsx-a11y/recommended",
      "plugin:prettier/recommended"
    ],
    rules: {
      "react/react-in-jsx-scope": "off", // Not needed in Next.js
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "jsx-a11y/anchor-is-valid": "off", // Next.js handles <a> tags differently
      "prettier/prettier": ["warn", { endOfLine: "auto" }]
    },
    settings: {
      react: { version: "detect" }
    }
  }
];

export default eslintConfig;

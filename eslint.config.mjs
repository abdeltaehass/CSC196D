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
    rules: {
      // Disable specific TypeScript and React Hook rules
      "@typescript-eslint/no-unused-vars": "off",    // Ignore unused variables
      "@typescript-eslint/no-explicit-any": "off",   // Ignore use of `any`
      "react-hooks/exhaustive-deps": "off"  ,
      "react/no-unescaped-entities": "off",         // Ignore dependency array warnings
    },
  }
];

export default eslintConfig;

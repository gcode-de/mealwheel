import { FlatCompat } from "@eslint/eslintrc";
import { defineConfig, globalIgnores } from "eslint/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const baseDirectory = path.dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory });

export default defineConfig([
  ...compat.extends("next/core-web-vitals", "plugin:jest/recommended"),
  {
    rules: {
      "import/no-anonymous-default-export": ["error", { allowObject: true }],
    },
  },
  globalIgnores([".next/**"]),
]);

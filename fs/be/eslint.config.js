import globals from "globals";
import { defineConfig } from "eslint/config";
import daStyle from 'eslint-config-dicodingacademy';
import pluginJs from "@eslint/js";

export default defineConfig([
  {
    files: ['src/**/*.js'],
    languageOptions: { sourceType: 'module' },
    ...daStyle,
  },
  {
    languageOptions: { globals: globals.node },
  },
  pluginJs.configs.recommended,
]);

/* eslint-disable quotes */
import globals from "globals";
import { defineConfig } from "eslint/config";
import daStyle from 'eslint-config-dicodingacademy';
import pluginJs from "@eslint/js";

export default defineConfig([
  daStyle,
  {
    files: ['**/*.js'],
    languageOptions: { sourceType: 'module' },
  },
  {
    languageOptions: { globals: globals.node },
  },
  pluginJs.configs.recommended,
]);

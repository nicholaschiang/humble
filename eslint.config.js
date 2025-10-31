const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");

// Ref: https://docs.expo.dev/guides/using-eslint/
module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  { rules: { "func-style": ["error", "declaration"] } },
  { ignores: ["dist/*"] },
]);

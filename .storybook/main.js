const path = require('path');
const {resolve} = require("path");
const compilerOptions = require("../tsconfig.json").compilerOptions;
//const vue = require("@vitejs/plugin-vue");
const { loadConfigFromFile, mergeConfig } = require("vite");
module.exports = {
  async viteFinal(config, { configType }) {
      const { config: userConfig } = await loadConfigFromFile(
          path.resolve(__dirname, "../vite.config.ts")
      );

      return mergeConfig(config, {
          ...userConfig,
          // manually specify plugins to avoid conflict
          plugins: [],
      });
  },
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
      "@storybook/addon-actions",
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  "core": {
    "builder": "storybook-builder-vite"
  }
}
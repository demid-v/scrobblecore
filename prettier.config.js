/**
 * @typedef {import('prettier').Config} PrettierConfig
 * @typedef {import('prettier-plugin-tailwindcss').PluginOptions} TailwindPluginOptions
 * @typedef {import('@trivago/prettier-plugin-sort-imports').PluginConfig} SortImportsPluginConfig
 *
 * @type {PrettierConfig & TailwindPluginOptions & SortImportsPluginConfig}
 */
const config = {
  plugins: [
    "@trivago/prettier-plugin-sort-imports",
    // Must come last. https://dev.to/kachidk/common-prettier-plugins-installation-30hc
    "prettier-plugin-tailwindcss",
  ],
  importOrder: [],
  importOrderSortSpecifiers: true,
};

export default config;

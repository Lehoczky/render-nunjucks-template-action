// @ts-check
const { defineConfig } = require("eslint-define-config")

module.exports = defineConfig({
  root: true,
  extends: ["@lehoczky/eslint-config-typescript"],
  overrides: [
    {
      files: "__tests__/**",
      env: {
        jest: true,
      },
      plugins: ["jest"],
      extends: ["plugin:jest/recommended"],
    },
  ],
})

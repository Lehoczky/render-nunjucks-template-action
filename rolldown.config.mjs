import { defineConfig } from "rolldown"

export default defineConfig({
  input: "src/index.js",
  output: {
    file: "dist/index.js",
    format: "cjs",
    minify: true,
  },
  platform: "node",
})

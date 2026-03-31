import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        flowAutomator: resolve(__dirname, "products/flow-automator.html"),
        promptLengthMatcher: resolve(__dirname, "products/prompt-length-matcher.html"),
      },
    },
  },
});

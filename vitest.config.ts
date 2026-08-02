import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    testTimeout: 30_000,
    setupFiles: ["./tests/setup.ts"],
  },
  resolve: {
    alias: {
      "@app": path.resolve(dirname, "./src"),
    },
  },
});

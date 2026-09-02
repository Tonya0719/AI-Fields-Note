import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  publicDir: resolve(__dirname, "../public"),
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});

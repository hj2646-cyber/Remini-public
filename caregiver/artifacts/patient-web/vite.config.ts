import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/static/patient-react/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
  build: {
    outDir: path.resolve(import.meta.dirname, "../../../ai-server/web/patient-react"),
    emptyOutDir: true,
  },
  server: {
    host: "0.0.0.0",
    port: 8083,
    allowedHosts: true,
  },
  preview: {
    host: "0.0.0.0",
    port: 8083,
    allowedHosts: true,
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/shopify-schema-builder/",
  plugins: [react()],
});

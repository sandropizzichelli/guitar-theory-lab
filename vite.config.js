import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  envPrefix: ["VITE_", "NEXT_PUBLIC_", "SITE_"],
  plugins: [react()],
  server: {
    fs: {
      allow: ["."]
    }
  }
});

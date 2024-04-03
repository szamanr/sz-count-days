import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid()],
  resolve: {
    alias: {
      app: "/app",
      common: "/common",
    },
  },
  server: {
    port: 3000,
  },
});

import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['react-router-dom'], // Mark react-router-dom as external
    },
  },
  resolve: {
    alias: {
      //eslint-disable-next-line no-undef
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // Build otimizado
  build: {
    outDir: 'dist',
    sourcemap: false, // Desativar em produção
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar vendor chunks para cache
          'react-vendor': ['react', 'react-dom'],
          'pdf-vendor': ['jspdf', 'html2canvas'], // Adjusted based on package.json dependencies
          'motion-vendor': ['framer-motion'] // Added framer-motion if present or keep generic
        }
      }
    }
  },

  // Preview server (para testes)
  preview: {
    port: 4173,
    host: true
  }
}));

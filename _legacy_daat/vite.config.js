import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  build: {
    // Mantemos o limite alto para ele não reclamar
    chunkSizeWarningLimit: 2000,

    // REMOVEMOS O BLOCO "rollupOptions" QUE TINHA O manualChunks
    // Isso garante que o código do PDF fique inteiro e funcione.
  }
})

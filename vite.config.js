import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'node:process'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Gestión Documental (evita CORS en dev)
      '/api/DocumentoSolicitadoes': {
        target: 'https://gestiondocumental-1.onrender.com',
        changeOrigin: true,
        secure: true,
      },
      '/api': {
        target: process.env.VITE_DEV_PROXY_TARGET || 'https://diagnosticoseguro2-3.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})

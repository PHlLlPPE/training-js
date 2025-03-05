import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0', // Permet d'écouter toutes les IPs
    port: 5173,
    strictPort: true, // Force l'utilisation du port défini
    cors: true, // Active CORS
    allowedHosts: ['exo-js.philippe-gaulin.dev'] // 🔥 Autorise ton domaine !
  },
  preview: {
    port: 4173,
    strictPort: true
  }
  
})

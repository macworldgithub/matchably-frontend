import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/', // ✅ Important for routing
  build: {
    outDir: 'dist', // ✅ Required for correct publish directory
  },
  server: {
    port: 3007,
    historyApiFallback: true
  },
  optimizeDeps: {
    include: ['zustand'],
  },
  plugins: [
    react(),
    tailwindcss()
  ]
})

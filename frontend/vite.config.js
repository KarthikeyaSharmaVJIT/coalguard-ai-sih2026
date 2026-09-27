import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^three$/, replacement: path.resolve(__dirname, 'node_modules/three/build/three.module.js') },
    ],
    dedupe: ['three', 'react', 'react-dom'],
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
  build: {
    chunkSizeWarningLimit: 2500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('three')) {
            return 'three';
          }
          if (id.includes('react-globe.gl') || id.includes('three-globe')) {
            return 'globe';
          }
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
})

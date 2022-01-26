import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import reactRefresh from "@vitejs/plugin-react-refresh"
import legacy from '@vitejs/plugin-legacy'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
      react(),
      reactRefresh(),
      legacy({
          targets: ['defaults', 'not IE 11']
      })
  ]
})

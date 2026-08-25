import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // I configure the repository subpath because GitHub Pages serves project
  // sites below the repository name instead of directly from the domain root.
  base: '/task-manager/',
  plugins: [react()],
})
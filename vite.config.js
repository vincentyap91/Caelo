import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vite.dev/config/
// `base: './'` — relative asset URLs for static hosting.
// `vite build --mode offline` — inlines JS/CSS into one HTML so `file://` works (browsers block ES modules on file URLs).
export default defineConfig(({ mode }) => ({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    ...(mode === 'offline' ? [viteSingleFile()] : []),
  ],
}))

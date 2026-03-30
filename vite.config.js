import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://v2.vitejs.dev/config/
// `base: './'` keeps asset URLs relative for static hosting.
// Offline mode emits one JS/CSS bundle first; `scripts/inline-dist.cjs` then inlines them
// into `dist/index.html` so `file://` works without extra files.
export default defineConfig(({ mode }) => {
  const isOffline = mode === 'offline'

  return {
    base: './',
    plugins: [react()],
    build: isOffline
      ? {
          assetsInlineLimit: Number.MAX_SAFE_INTEGER,
          cssCodeSplit: false,
          rollupOptions: {
            output: {
              inlineDynamicImports: true,
            },
          },
        }
      : undefined,
  }
})

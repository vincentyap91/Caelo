import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://v2.vitejs.dev/config/
// `base: '/'`  → absolute asset paths; required for Vercel/server deployments so that
//               sub-routes like /casino still load /assets/index-xxx.js correctly.
// `base: './'` → relative paths; only used for the offline single-file bundle so that
//               file:// protocol works without a web server.
export default defineConfig(({ mode }) => {
  const isOffline = mode === 'offline'

  return {
    // Use absolute base for all server/Vercel deployments; relative only for offline bundle.
    base: isOffline ? './' : '/',
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

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      'use-sync-external-store/shim/with-selector.js': path.resolve(__dirname, 'src/shims/use-sync-external-store-shim-with-selector.js'),
      'use-sync-external-store/shim/with-selector': path.resolve(__dirname, 'src/shims/use-sync-external-store-shim-with-selector.js'),
    },
  },
  server: {
    port: 5173,
    strictPort: false,
    // Automatically invalidate outdated optimized deps instead of returning 504
    hmr: {
      overlay: true,
    },
  },
  optimizeDeps: {
    // Force re-optimization on every cold start to avoid stale 504 errors
    force: false,
    include: [
      'framer-motion',
      'firebase/app',
      'firebase/firestore',
      'firebase/auth',
      'firebase/storage',
      'react-router-dom',
      'lucide-react',
      'recharts',
      'react-dropzone',
      'react-markdown',
      'react-qr-code',
      'date-fns',
      'clsx',
      'tailwind-merge',
      'zustand',
      'use-sync-external-store',
      'use-sync-external-store/shim/with-selector.js',
      '@react-three/fiber',
      '@react-three/drei',
      'three',
    ],
  },
  build: {
    chunkSizeWarningLimit: 1500,
    modulePreload: {
      resolveDependencies: (filename, deps) => {
        return deps.filter(dep => !dep.includes('three'));
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Animation
          'motion': ['framer-motion'],
          // Three.js / 3D (lazy loaded, not preloaded)
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          // Firebase
          'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
          // Charts
          'charts': ['recharts'],
          // UI utils
          'ui-utils': ['lucide-react', 'clsx', 'tailwind-merge'],
        },
      },
    },
  },
})

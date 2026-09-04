import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 600,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'vendor-react',
              test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              priority: 30,
            },
            {
              name: 'vendor-router',
              test: /node_modules[\\/]react-router/,
              priority: 25,
            },
            {
              name: 'vendor-mui',
              test: /node_modules[\\/](@mui|@emotion|@floating-ui)[\\/]/,
              priority: 25,
            },
            {
              name: 'vendor-charts',
              test: /node_modules[\\/](recharts|d3-[a-z-]+|victory-vendor)[\\/]/,
              priority: 20,
            },
            {
              name: 'vendor-pdf',
              test: /node_modules[\\/](jspdf|jspdf-autotable|html2canvas|dompurify)[\\/]/,
              priority: 20,
            },
            {
              name: 'vendor-xlsx',
              test: /node_modules[\\/]xlsx[\\/]/,
              priority: 20,
            },
            {
              name: 'vendor',
              test: /node_modules[\\/]/,
              priority: 10,
            },
          ],
        },
      },
    },
  },
})
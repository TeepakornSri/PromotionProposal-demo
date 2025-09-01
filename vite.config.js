import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  base: '/PromotionProposal/dist/',
  plugins: [
    react(),
    {
      name: 'modify-html',
      transformIndexHtml(html) {
        
        return html.replace(
          /<link rel="icon"[^>]*>/g,  
          '<link rel="icon" type="image/png" href="/PromotionProposal/dist/assets/Logo.png">'  
        );
      }
    }
  ],
  preview: {
    port: 8004,
    strictPort: true,
  },
  server: {
    port: 8004,
    strictPort: true,
    host: true,
  },
  build: {
    outDir: path.resolve(__dirname, 'dist/PromotionProposal/dist'),
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/index-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
  },
});

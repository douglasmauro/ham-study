import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

// Relative base so the same build works at any path, including inside Home Assistant.
export default defineConfig({
  base: './',
  plugins: [preact()],
  build: { outDir: 'dist', assetsInlineLimit: 0 },
});

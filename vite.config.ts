import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/RushGrid/', // <- required for GitHub Pages (replace with repo name)
  plugins: [react()],
});
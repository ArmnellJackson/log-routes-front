// @ts-check
// Configuración de Astro — React + Tailwind v4
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

export default defineConfig({
  output: 'hybrid',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});

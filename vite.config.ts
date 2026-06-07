import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(async () => {
  const plugins = [react(), tailwindcss()];
  try {
    // @ts-ignore
    const m = await import('./.vite-source-tags.js');
    plugins.push(m.sourceTags());
  } catch {}

  return {
    plugins,
    build: {
      // Alza il limite del warning a 600 kB (default 500 kB)
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          // Separa le librerie di terze parti dal codice dell'app
          manualChunks: {
            'vendor-react':    ['react', 'react-dom'],
            'vendor-supabase': ['@supabase/supabase-js'],
          },
        },
      },
    },
  };
})

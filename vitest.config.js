import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    threads: {
      singleThread: true,
    },
    exclude: ['node_modules/**', 'dist/**', '.next/**', 'src/test/e2e/**'],
    server: {
      deps: {
        inline: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  ssr: {
    noExternal: [/tailwindcss/, /@csstools/, /@asamuzakjp/, /recharts/, /framer-motion/, /@phosphor-icons/],
  },
});

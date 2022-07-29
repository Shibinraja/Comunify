import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  //   base: './src/',
  plugins: [react(), tsconfigPaths()]
  //   resolve: {
  //     alias: [{ find: '@', replacement: '/src' }],
  //   },
});

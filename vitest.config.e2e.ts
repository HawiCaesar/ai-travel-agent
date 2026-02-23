import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    name: 'e2e',
    include: ['e2e/tests/**/*.spec.ts'],
    globals: true,
    environment: 'node',
    testTimeout: 180000,
    hookTimeout: 60000,
    retry: 0, // No retries while debugging
    reporters: ['verbose'],
  },
  resolve: {
    alias: {
      '@e2e': path.resolve(__dirname, './e2e'),
      '@fixtures': path.resolve(__dirname, './e2e/fixtures'),
      '@helpers': path.resolve(__dirname, './e2e/helpers')
    }
  }
});

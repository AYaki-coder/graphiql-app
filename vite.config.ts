/// <reference types="vitest" />
/// <reference types="vite/client" />

import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [!process.env.VITEST && remix(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['./app/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      provider: 'v8',
      ignoreEmptyLines: false,
      exclude: [
        'node_modules',
        'app/firebase',
        '.eslintrc.cjs',
        'vite.config.ts',
        'app/root.tsx',
        'app/routes/$.tsx',
        'app/utils/history-service.ts',
        'app/components/lang-context/lang-context.tsx',
        'app/models',
        'app/routes/*.ts',
        'app/routes/history.tsx',
        'app/routes/_index.tsx',
      ],
    },
  },
});

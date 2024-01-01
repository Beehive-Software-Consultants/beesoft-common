import path from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import gzipPlugin from 'rollup-plugin-gzip';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    dts({
      tsconfigPath: 'tsconfig.json',
      rollupTypes: true,
      outDir: 'types',
      insertTypesEntry: true,
    }),
    gzipPlugin(),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'BeeSoftComponents',
      formats: ['es', 'umd'],
      fileName: (format) => `index.${format}.js`,
    },
    minify: 'esbuild',
    sourcemap: false,
  },
});

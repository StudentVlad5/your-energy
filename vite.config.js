import { defineConfig } from 'vite';
import { glob } from 'glob';
import injectHTML from 'vite-plugin-html-inject';
import FullReload from 'vite-plugin-full-reload';
import SortCss from 'postcss-sort-media-queries';

export default defineConfig(({ command }) => {
  const basePath = process.env.VITE_BASE_PATH;
  const devHost = process.env.VITE_DEV_HOST;
  const devPort = process.env.VITE_DEV_PORT;

  return {
    base: basePath,
    define: {
      [command === 'serve' ? 'global' : '_global']: {},
    },
    root: 'src',

    server: {
      host: devHost,
      port: devPort,
      open: true, // опционально — откроет браузер при старте
    },

    build: {
      sourcemap: true,
      rollupOptions: {
        input: glob.sync('./src/*.html'),
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
          entryFileNames: chunkInfo => {
            if (chunkInfo.name === 'commonHelpers') {
              return 'commonHelpers.js';
            }
            return '[name].js';
          },
          assetFileNames: assetInfo => {
            if (assetInfo.name && assetInfo.name.endsWith('.html')) {
              return '[name].[ext]';
            }
            return 'assets/[name]-[hash][extname]';
          },
        },
      },
      outDir: '../dist',
      emptyOutDir: true,
    },
    plugins: [
      injectHTML(),
      FullReload(['./src/**/**.html']),
      SortCss({
        sort: 'mobile-first',
      }),
    ],
  };
});

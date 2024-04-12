import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { glob } from 'glob';

const root = resolve(__dirname, 'src/pages');
const publicDir = resolve(__dirname, 'src/assets');
const outDir = resolve(__dirname, 'dist');

export default async ({ mode }) => {
  // Load app-level env vars to node-level env vars.
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};

  const indexFiles = (await glob('src/**/index.html')).reduce(
    (result, file) => {
      const key = file.replace(/[\/\.]/g, '-').replace('src-pages-', '');

      result[key] = file;

      return result;
    },
    {} as any,
  );

  // https://vitejs.dev/config/
  return defineConfig({
    root,
    publicDir,
    appType: 'mpa',
    plugins: [
      vue(),
    ],
    build: {
      outDir,
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: resolve(root, 'index.html'),
          ...indexFiles,
        },
      },
    },
    server: {
      host: '0.0.0.0',
      watch: {
        usePolling: false,
      },
      proxy: {
        '/api': 'http://localhost:3000/',
      },
    },
  });
}
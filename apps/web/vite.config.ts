import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));
const workspaceRoot = fileURLToPath(new URL('../..', import.meta.url));

export default defineConfig(({ isSsrBuild, mode }) => {
  const env = loadEnv(mode, workspaceRoot, '');
  const proxy = {
    '/api': {
      target: env.API_ORIGIN || 'http://127.0.0.1:4000',
      changeOrigin: true
    }
  };

  return {
    root: projectRoot,
    envDir: workspaceRoot,
    base: '/',
    appType: 'spa',
    envPrefix: ['VITE_', 'SITE_', 'WEB_'],
    plugins: [react()],
    publicDir: 'public',
    server: { proxy },
    preview: { proxy },
    ssr: {
      noExternal: ['react', 'react-dom']
    },
    build: {
      outDir: isSsrBuild ? '../../dist/server' : '../../dist/web',
      emptyOutDir: true,
      manifest: !isSsrBuild,
      rollupOptions: {
        input: isSsrBuild ? 'src/entry-server.tsx' : 'index.html',
        ...(isSsrBuild ? { output: { format: 'esm' } } : {})
      }
    }
  };
});

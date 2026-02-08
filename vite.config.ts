import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// When building on GitHub Actions, set the base path to "/<repo>/" so
// the app resolves assets correctly on GitHub Pages. Locally we keep "/".
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const isCI = process.env.GITHUB_ACTIONS === 'true';

export default defineConfig({
  base: isCI && repoName ? `/${repoName}/` : '/',
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  }
});



import { defineConfig, type Plugin } from 'vite';
import preact from '@preact/preset-vite';

// Build stamp: shown at the bottom of the home screen and published as version.json so the
// running app can tell whether a newer build is live. The build number is the deploy
// workflow's run number, so it goes up by one with every deploy.
const build = {
  number: process.env.GITHUB_RUN_NUMBER ?? 'dev',
  commit: (process.env.GITHUB_SHA ?? 'local').slice(0, 7),
  time: new Date().toISOString(),
};

const versionFile: Plugin = {
  name: 'version-file',
  generateBundle() {
    this.emitFile({ type: 'asset', fileName: 'version.json', source: JSON.stringify(build) });
  },
};

// Relative base so the same build works at any path.
export default defineConfig({
  base: './',
  plugins: [preact(), versionFile],
  define: { __BUILD__: JSON.stringify(build) },
  build: { outDir: 'dist', assetsInlineLimit: 0 },
});

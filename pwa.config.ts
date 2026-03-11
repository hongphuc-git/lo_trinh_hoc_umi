import type { VitePWAOptions } from 'vite-plugin-pwa'

import { APP_MANIFEST } from './app/constants/manifest'

export default {
  registerType: 'autoUpdate',
  minify: true,
  manifest: APP_MANIFEST,
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,svg}'],
    cleanupOutdatedCaches: true,
    clientsClaim: true,
    maximumFileSizeToCacheInBytes: 5000000,
  },
} as Partial<VitePWAOptions>

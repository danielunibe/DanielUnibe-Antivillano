import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    // Prefer a stable default port, but don't hard-fail if it's taken.
    // This avoids "Port XXXX is already in use" blocking local dev.
    port: 5173,
    strictPort: false,
    // Force HMR + reliable file watching (useful when FS events are flaky).
    hmr: true,
    watch: {
      usePolling: true,
      interval: 150,
    },
  },
  preview: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: false,
  },
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three')) return 'three';
            if (id.includes('howler')) return 'howler';
            return 'vendor';
          }
          // Shared modules that cross feature boundaries get their own chunk so
          // lazy feature chunks never drag them (and thus three.js) into the entry graph.
          if (id.includes('/src/config/')) return 'config';
          if (id.includes('/src/utils/')) return 'utils';
          if (id.includes('/src/components/ui/') || id.includes('/src/features/profile/')) return 'ui';
          if (id.includes('/src/features/InteractionSystem')) return 'interaction';
          if (id.includes('/src/features/StackScreen/')) return 'feature-stack';
          if (id.includes('/src/features/ProjectsScreen/')) return 'feature-projects';
          if (id.includes('/src/features/LootMapScreen/')) return 'feature-lootmap';
          if (id.includes('/src/features/ContactScreen/')) return 'feature-contact';
          if (id.includes('/src/features/music/')) return 'feature-music';
          return undefined;
        },
      },
    },
  },
});

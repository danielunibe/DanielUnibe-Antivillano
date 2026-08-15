import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './src/App';
import './index.css';
import '@fontsource/teko/300.css';
import '@fontsource/teko/400.css';
import '@fontsource/teko/600.css';
import '@fontsource/teko/700.css';
import '@fontsource/roboto-mono/400.css';
import '@fontsource/roboto-mono/700.css';
import '@fontsource/anton/400.css';
import '@fontsource/roboto-condensed/700.css';
import '@fontsource/share-tech-mono/400.css';

const clearLegacyPwaState = async () => {
  try {
    const isLocalhost =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';

    if (!isLocalhost) return;
    if (window.sessionStorage.getItem('unibelands_pwa_cleared') === '1') return;

    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((reg) => reg.unregister()));
    }

    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
    }

    window.sessionStorage.setItem('unibelands_pwa_cleared', '1');
  } catch (error) {
    // Do not block app boot when browser denies cache/service-worker ops.
    console.warn('PWA cleanup skipped:', error);
  }
};

void clearLegacyPwaState();

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <App />
);

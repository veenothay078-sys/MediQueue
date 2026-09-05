import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { registerServiceWorker } from './utils/registerServiceWorker';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register production Service Worker for offline capability & PWA installation
registerServiceWorker({
  onUpdate: (registration) => {
    window.dispatchEvent(
      new CustomEvent('mediqueue_sw_update', {
        detail: { waiting: registration.waiting },
      })
    );
  },
});

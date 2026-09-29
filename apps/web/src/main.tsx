import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import '@fontsource-variable/outfit/wght.css';
import '@fontsource/poppins/latin-400.css';
import '@fontsource/poppins/latin-500.css';
import '@fontsource/poppins/latin-600.css';
import '@fontsource/poppins/latin-700.css';
import { applyHead } from './head.ts';
import { App } from './App.tsx';
import { resolveRoute } from './routes.ts';
import './styles.css';

const container = document.querySelector<HTMLElement>('#app');

if (container) {
  const routePath = container.dataset.route || window.location.pathname;
  const route = resolveRoute(routePath);
  container.dataset.route = route.pathname;
  container.dataset.status = String(route.status);
  applyHead(route.metadata);

  if (container.hasChildNodes()) {
    hydrateRoot(container, <StrictMode><App route={route} /></StrictMode>);
  } else {
    createRoot(container).render(<StrictMode><App route={route} /></StrictMode>);
  }
}

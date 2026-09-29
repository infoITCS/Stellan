import type { RouteDefinition } from './routes.ts';
import { normalizeRoute } from './routes.ts';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { ServicesPage } from './pages/ServicesPage.tsx';
import { ServicePage } from './pages/ServicePage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { PrivacyPage } from './pages/PrivacyPage.tsx';
import { NotFoundPage } from './pages/NotFoundPage.tsx';

interface AppProps {
  route?: RouteDefinition | string;
  pathname?: string;
}

function Page({ route }: { route: RouteDefinition }) {
  switch (route.page) {
    case 'home':
      return <HomePage />;
    case 'services':
      return <ServicesPage />;
    case 'service':
      return route.service ? <ServicePage service={route.service} /> : <NotFoundPage />;
    case 'about':
      return <AboutPage />;
    case 'contact':
      return <ContactPage />;
    case 'privacy':
      return <PrivacyPage />;
    case 'not-found':
      return <NotFoundPage />;
    default:
      return <NotFoundPage />;
  }
}

export function App({ route, pathname = '/' }: AppProps) {
  const resolvedRoute = normalizeRoute(route ?? pathname);

  return (
    <div className="app-shell" data-route={resolvedRoute.pathname} data-status={resolvedRoute.status}>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Header pathname={resolvedRoute.pathname} />
      <div id="main-content" tabIndex={-1}><Page route={resolvedRoute} /></div>
      <Footer />
    </div>
  );
}

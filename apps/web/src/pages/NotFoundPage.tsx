import { Container } from '../components/Shared.tsx';
import { Icon } from '../components/Icon.tsx';

export function NotFoundPage() {
  return (
    <main>
      <section className="not-found-page">
        <div aria-hidden="true" className="not-found-grid" />
        <Container>
          <div className="not-found-layout">
            <div className="not-found-code"><span>404</span><i /></div>
            <div className="not-found-copy"><p className="eyebrow eyebrow-light">Signal not found</p><h1>This page is not on the map.</h1><p>The address may have changed, or the page may not exist. The useful next step is to choose a path back into the system.</p><div className="button-row"><a className="button button-primary" href="/">Return home <Icon name="arrow-up-right" size={17} /></a><a className="button button-ghost-light" href="/contact">Ask for a path <Icon name="arrow-right" size={17} /></a></div></div>
          </div>
          <div className="not-found-links"><a href="/services"><span>Explore services</span><Icon name="arrow-up-right" size={17} /></a><a href="/privacy"><span>Privacy overview</span><Icon name="arrow-up-right" size={17} /></a></div>
        </Container>
      </section>
    </main>
  );
}

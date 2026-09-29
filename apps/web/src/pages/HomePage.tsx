import { useEffect, useRef, useState } from 'react';
import { services } from '../content.ts';
import { Container, SectionHeading, ServiceCard, ArrowLink } from '../components/Shared.tsx';
import { Icon } from '../components/Icon.tsx';

const heroServiceSlugs = [
  'managed-it',
  'cloud-services',
  'cybersecurity',
  'network-infrastructure',
  'it-consulting',
  'enterprise-automation',
  'ai-engineering',
  'web-development'
] as const satisfies readonly (typeof services)[number]['slug'][];

const heroSlides = heroServiceSlugs
  .map((slug) => services.find((service) => service.slug === slug))
  .filter((service): service is (typeof services)[number] => Boolean(service))
  .map((service) => ({
    slug: service.slug,
    number: service.number,
    icon: service.icon,
    shortLabel: service.shortTitle,
    eyebrow: service.eyebrow,
    title: service.h1,
    description: service.description,
    tags: service.tags.slice(0, 3),
    href: `/services/${service.slug}`
  }));

type HeroSlide = (typeof heroSlides)[number];

const serviceArtworkPath = (slug: string) => `/services/${slug}.svg`;

function HeroServiceArtwork({ slide, eager }: { slide: HeroSlide; eager: boolean }) {
  return (
    <div className="hero-artwork">
      <img
        alt={`${slide.shortLabel} service illustration`}
        className="hero-artwork-canvas"
        decoding="async"
        fetchPriority={eager ? 'high' : 'auto'}
        height={900}
        loading={eager ? 'eager' : 'lazy'}
        src={serviceArtworkPath(slide.slug)}
        width={1200}
      />
      <div className="hero-artwork-badge-mark">
        <Icon name={slide.icon} size={26} />
      </div>
      <div className="hero-artwork-overlay">
        <div className="hero-artwork-topline">
          <span className="hero-artwork-badge"><Icon name={slide.icon} size={15} />{slide.shortLabel}</span>
          <span className="hero-artwork-index">{slide.number}</span>
        </div>
      </div>
    </div>
  );
}

export function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const [documentHidden, setDocumentHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [sliderEnabled, setSliderEnabled] = useState(true);
  const sliderViewport = useRef<HTMLDivElement>(null);
  const sliderTabs = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const autoPaused = userPaused || hoverPaused || focusPaused || documentHidden;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncPreference = () => setReducedMotion(mediaQuery.matches);
    syncPreference();
    mediaQuery.addEventListener('change', syncPreference);
    return () => mediaQuery.removeEventListener('change', syncPreference);
  }, []);

  useEffect(() => {
    const syncVisibility = () => setDocumentHidden(document.hidden);
    syncVisibility();
    document.addEventListener('visibilitychange', syncVisibility);
    return () => document.removeEventListener('visibilitychange', syncVisibility);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 641px)');
    const syncSlider = () => setSliderEnabled(mediaQuery.matches);
    syncSlider();
    mediaQuery.addEventListener('change', syncSlider);
    return () => mediaQuery.removeEventListener('change', syncSlider);
  }, []);

  useEffect(() => {
    if (autoPaused || reducedMotion || !sliderEnabled) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, [activeSlide, autoPaused, reducedMotion, sliderEnabled]);

  useEffect(() => {
    const strip = sliderTabs.current;
    const activeTab = strip?.querySelector<HTMLElement>('.hero-slider-tab.is-active');
    if (!strip || !activeTab) {
      return;
    }
    const stripBox = strip.getBoundingClientRect();
    const tabBox = activeTab.getBoundingClientRect();
    const delta = tabBox.left < stripBox.left
      ? tabBox.left - stripBox.left
      : tabBox.right > stripBox.right
        ? tabBox.right - stripBox.right
        : 0;
    if (delta !== 0) {
      strip.scrollBy({ left: delta, behavior: 'smooth' });
    }
  }, [activeSlide]);

  const selectSlide = (index: number, restoreFocus = false) => {
    setActiveSlide((index + heroSlides.length) % heroSlides.length);
    if (restoreFocus) {
      window.requestAnimationFrame(() => sliderViewport.current?.focus());
    }
  };

  return (
    <main>
      <section className="home-hero home-hero-simple">
        <div aria-hidden="true" className="home-hero-glow" />
        <Container>
          <div className="home-hero-simple-inner">
            <p className="eyebrow eyebrow-light">Stellan Solutions</p>
            <h2>Technology work that holds up in the real world</h2>
            <p className="home-hero-simple-description">
              We plan, build, secure, and support the systems modern teams depend on, without adding
              noise to the day-to-day.
            </p>
            <div className="button-row">
              <a className="button button-primary" href="/contact">Start a conversation <Icon name="arrow-up-right" size={17} /></a>
              <a className="button button-ghost-light" href="/services">All services <Icon name="arrow-right" size={17} /></a>
            </div>
          </div>
        </Container>
      </section>

      <section
        aria-label="Stellan Solutions services"
        aria-roledescription="carousel"
        className="home-hero home-hero-slider"
        onBlurCapture={(event) => {
          const nextTarget = event.relatedTarget;
          if (!nextTarget || !event.currentTarget.contains(nextTarget as Node)) {
            setFocusPaused(false);
          }
        }}
        onFocusCapture={() => setFocusPaused(true)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') {
            event.preventDefault();
            selectSlide(activeSlide - 1, true);
          }
          if (event.key === 'ArrowRight') {
            event.preventDefault();
            selectSlide(activeSlide + 1, true);
          }
        }}
        onMouseEnter={() => setHoverPaused(true)}
        onMouseLeave={() => setHoverPaused(false)}
        onTouchEnd={(event) => {
          if (touchStartX.current === null) {
            return;
          }
          const distance = event.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(distance) > 50) {
            selectSlide(activeSlide + (distance < 0 ? 1 : -1));
          }
          touchStartX.current = null;
        }}
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0].clientX;
        }}
        role="region"
      >
        <div aria-hidden="true" className="home-hero-glow" />
        <Container>
          <div className="hero-slider-shell">
            <div className="hero-slider-topbar">
              <div className="hero-slider-tabs" ref={sliderTabs} role="group" aria-label="Choose a service slide">
                {heroSlides.map((slide, index) => (
                  <button
                    aria-current={index === activeSlide ? 'true' : undefined}
                    className={`hero-slider-tab${index === activeSlide ? ' is-active' : ''}`}
                    key={slide.slug}
                    onClick={() => selectSlide(index)}
                    type="button"
                  >
                    <Icon name={slide.icon} size={16} />
                    <span>{slide.shortLabel}</span>
                  </button>
                ))}
              </div>
              <div aria-hidden="true" className="hero-slider-counter"><span>0{activeSlide + 1}</span><i /><span>0{heroSlides.length}</span></div>
            </div>
            <div aria-atomic="true" aria-live={autoPaused ? 'polite' : 'off'} className="hero-slider-viewport" ref={sliderViewport} tabIndex={-1}>
              <div className="hero-slider-track" style={{ transform: `translate3d(-${activeSlide * 100}%, 0, 0)` }}>
                {heroSlides.map((slide, index) => {
                  const isActive = index === activeSlide;
                  const Heading = index === 0 ? 'h1' : 'h2';
                  return (
                    <article aria-hidden={!isActive} aria-label={`${index + 1} of ${heroSlides.length}: ${slide.shortLabel}`} aria-roledescription="slide" className={`hero-slide${isActive ? ' is-active' : ''}`} key={slide.slug} role="group">
                      <div className="hero-slide-copy">
                        <p className="eyebrow eyebrow-light hero-slide-eyebrow"><span>{slide.number}</span>{slide.eyebrow}</p>
                        <Heading>{slide.title}</Heading>
                        <p className="hero-slide-description">{slide.description}</p>
                        <div className="button-row">
                          <a className="button button-primary" href={slide.href} tabIndex={isActive ? 0 : -1}>Explore {slide.shortLabel} <Icon name="arrow-up-right" size={17} /></a>
                          <a className="button button-ghost-light" href="/services" tabIndex={isActive ? 0 : -1}>All services <Icon name="arrow-right" size={17} /></a>
                        </div>
                        <ul className="hero-slide-tags">
                          {slide.tags.map((tag) => <li key={tag}>{tag}</li>)}
                        </ul>
                      </div>
                      <div className="hero-slide-visual">
                        <HeroServiceArtwork eager={sliderEnabled && index === 0} slide={slide} />
                        <div className="hero-slide-caption"><span>{slide.shortLabel}</span><a href={slide.href} tabIndex={isActive ? 0 : -1}>Read the service <Icon name="arrow-up-right" size={13} /></a></div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
            <div className="hero-slider-controls">
              <div aria-hidden="true" className={`hero-slider-progress${autoPaused ? ' is-paused' : ''}`}><span key={activeSlide} /></div>
              <div className="hero-slider-buttons">
                <button aria-label={reducedMotion ? 'Automatic slide rotation is disabled by your motion preference' : userPaused ? 'Resume automatic slide rotation' : 'Pause automatic slide rotation'} aria-pressed={userPaused} className="hero-slider-control hero-slider-autoplay" disabled={reducedMotion} onClick={() => setUserPaused((current) => !current)} type="button"><Icon name={userPaused ? 'play' : 'pause'} size={16} /></button>
                <button aria-label="Previous slide" className="hero-slider-control" onClick={() => selectSlide(activeSlide - 1)} type="button"><Icon className="hero-slider-arrow-icon hero-slider-arrow-previous" name="arrow-right" size={18} /></button>
                <button aria-label="Next slide" className="hero-slider-control" onClick={() => selectSlide(activeSlide + 1)} type="button"><Icon className="hero-slider-arrow-icon" name="arrow-right" size={18} /></button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="signal-strip">
        <Container>
          <div className="signal-strip-inner">
            <p className="eyebrow">A different starting point</p>
            <p className="signal-strip-copy">Good technology work makes the important things easier to see: what is changing, what depends on it, and what to do next.</p>
            <div className="signal-strip-mark" aria-hidden="true"><span /><span /><span /></div>
          </div>
        </Container>
      </section>

      <section className="section section-services-home" id="services">
        <Container>
          <div className="section-topline">
            <SectionHeading eyebrow="The work we do" title="From first question to steady system." description="Bring us a decision, a constraint, or a system that needs a better shape. We help make the path forward concrete." />
            <ArrowLink href="/services">View all services</ArrowLink>
          </div>
          <div className="service-bento">
            {services.slice(0, 6).map((service, index) => <div className={index === 0 || index === 3 ? 'bento-wide' : ''} key={service.slug}><ServiceCard featured={index === 0} service={service} /></div>)}
          </div>
        </Container>
      </section>

      <section className="section approach-section">
        <Container>
          <div className="approach-grid">
            <div className="approach-sticky">
              <p className="eyebrow">How we work</p>
              <h2>Less theater.<br />More useful truth.</h2>
              <p>We keep the work close to the people who will use and maintain it. That means making trade-offs visible, testing the important path, and leaving behind a system your team can own.</p>
              <a className="arrow-link arrow-link-light" href="/about">Meet the Stellan approach <Icon name="arrow-up-right" size={17} /></a>
            </div>
            <div className="approach-list">
              <div className="approach-item"><span className="approach-index">01</span><div><h3>Start with the decision</h3><p>We separate the stated request from the operating reality underneath it, so the work solves the right problem.</p></div></div>
              <div className="approach-item"><span className="approach-index">02</span><div><h3>Make the invisible visible</h3><p>We map dependencies, risk, ownership, and user experience before adding another layer of technology.</p></div></div>
              <div className="approach-item"><span className="approach-index">03</span><div><h3>Prove the smallest useful slice</h3><p>We prefer a focused pilot with real feedback over a broad promise that cannot be evaluated.</p></div></div>
              <div className="approach-item"><span className="approach-index">04</span><div><h3>Leave a clear runway</h3><p>Documentation, decision records, and operating habits are part of the deliverable, not an afterthought.</p></div></div>
            </div>
          </div>
        </Container>
      </section>

      <section className="section section-why">
        <Container>
          <SectionHeading align="center" eyebrow="Why Stellan" title="A partner for the parts that do not fit on a slide." description="The best technology work connects a clear business question to an honest technical system. We help make that connection durable." />
          <div className="why-grid">
            <article className="why-card why-card-accent"><span className="why-card-icon"><Icon name="compass" size={25} /></span><h3>Context before prescription</h3><p>We ask enough questions to understand the work, the constraints, and the people who will carry the decision forward.</p></article>
            <article className="why-card"><span className="why-card-icon"><Icon name="layers" size={25} /></span><h3>Systems over snapshots</h3><p>We connect architecture, operations, security, and cost so improvements reinforce one another instead of creating new seams.</p></article>
            <article className="why-card"><span className="why-card-icon"><Icon name="support" size={25} /></span><h3>Useful after handoff</h3><p>Our work is designed to be understood, maintained, and changed by the team that owns it next.</p></article>
          </div>
        </Container>
      </section>

    </main>
  );
}


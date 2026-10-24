import {
  caseStudies,
  coreServiceSlugs,
  entryOffers,
  founder,
  frameworks,
  getService,
  partners,
  supportingServiceSlugs,
  testimonials
} from '../content.ts';
import { Container } from '../components/Shared.tsx';
import { Icon } from '../components/Icon.tsx';
import { getBookingUrl, isExternalBooking, siteConfig } from '../site.ts';

const coreServices = coreServiceSlugs
  .map((slug) => getService(slug))
  .filter((service) => Boolean(service));

const supportingServices = supportingServiceSlugs
  .map((slug) => getService(slug))
  .filter((service) => Boolean(service));

const snapshotRows = [
  { label: 'Identity and access', detail: 'Privileged access, MFA, lifecycle' },
  { label: 'Exposure and vulnerabilities', detail: 'Assets, findings, real business risk' },
  { label: 'Compliance evidence', detail: 'NIST, ISO 27001, SOC 2, CMMC' },
  { label: 'Response readiness', detail: 'Ownership, playbooks, review cadence' }
];

const bookingHref = getBookingUrl();
const bookingExternal = isExternalBooking();

const approach = [
  { title: 'Start with the decision', text: 'We separate the stated request from the risk and operating reality underneath it, so the work solves the right problem.' },
  { title: 'Make the exposure visible', text: 'Assets, access, obligations, and ownership are mapped before another tool or framework is added.' },
  { title: 'Prove the smallest useful slice', text: 'A focused assessment or pilot with real evidence beats a broad promise that cannot be evaluated.' },
  { title: 'Leave a program that runs', text: 'Owners, evidence, and a review rhythm are part of the deliverable, not an afterthought.' }
];

export function HomePage() {
  return (
    <main>
      <section className="home-hero home-hero-modern">
        <div aria-hidden="true" className="home-hero-bg" />
        <div aria-hidden="true" className="home-hero-grid" />
        <Container>
          <div className="modern-hero-grid">
            <div className="modern-hero-content">
              <div className="modern-hero-badge">
                <span className="badge-dot" />
                <span>Cybersecurity-first Advisory</span>
              </div>
              <h1>Pragmatic Cybersecurity. Measurable Risk Reduction.</h1>
              <p className="modern-hero-description">
                Stellan Solutions helps mid-sized organizations strengthen security, achieve compliance readiness,
                and make confident decisions with clear ownership, prioritized roadmaps, and actionable guidance.
              </p>
              <div className="button-row modern-hero-actions">
                <a
                  className="button button-primary button-large"
                  href={bookingHref}
                  rel={bookingExternal ? 'noopener noreferrer' : undefined}
                  target={bookingExternal ? '_blank' : undefined}
                >
                  Book a Free Consultation <Icon name="arrow-up-right" size={18} />
                </a>
                <a className="button button-ghost-dark" href="/services/cybersecurity">
                  Explore Cybersecurity Services <Icon name="arrow-right" size={18} />
                </a>
              </div>
            </div>

            <div className="modern-hero-visual">
              <div className="modern-card">
                <div className="modern-card-header">
                  <div className="modern-card-dots">
                    <span /><span /><span />
                  </div>
                  <span className="modern-card-title">Risk Assessment Dashboard</span>
                </div>
                <div className="modern-card-body">
                  <div className="modern-metric-grid">
                    {snapshotRows.map((row, index) => (
                      <div key={row.label} className="modern-metric">
                        <div className="modern-metric-header">
                          <span className="modern-metric-label">{row.label}</span>
                          <span className="modern-metric-status">Reviewed</span>
                        </div>
                        <div className="modern-metric-bar">
                          <div className="modern-metric-fill" style={{ width: `${85 - index * 10}%` }} />
                        </div>
                        <span className="modern-metric-detail">{row.detail}</span>
                      </div>
                    ))}
                  </div>
                  <div className="modern-card-footer">
                    <div className="modern-card-stat">
                      <strong>90-Day</strong>
                      <span>Prioritized Roadmap</span>
                    </div>
                    <div className="modern-card-stat">
                      <strong>Actionable</strong>
                      <span>Clear Ownership</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="partner-carousel-section" aria-label="Technology partners">
        <Container>
          <div className="partner-carousel-header">
            <p className="partner-carousel-label">Technology Partners</p>
            <p className="partner-carousel-note">Platforms and vendors we work with across our service areas</p>
          </div>
        </Container>
        <div className="partner-carousel-viewport">
          <div className="partner-track">
            {[0, 1].map((group) => (
              <div className="partner-group" key={group} aria-hidden={group === 1 ? 'true' : undefined}>
                {partners.map((partner) => (
                  <div className="partner-logo-card" key={`${group}-${partner.name}`}>
                    <img className="partner-logo-img" src={partner.logo} alt={`${partner.name} logo`} decoding="async" />
                    <div className="partner-logo-text">
                      <span className="partner-logo-name">{partner.name}</span>
                      <span className="partner-logo-category">{partner.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="framework-strip modern-framework-strip" aria-label="Frameworks we work with">
        <Container>
          <div className="modern-framework-inner">
            <p className="modern-framework-label">Standards &amp; Compliance Frameworks We Work With</p>
            <div className="modern-framework-logos">
              {frameworks.map((framework) => (
                <div key={framework.name} className="modern-framework-item" title={framework.detail}>
                  <span className="modern-framework-name">{framework.name}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="section modern-section" id="engagements">
        <Container>
          <div className="modern-section-header">
            <div>
              <p className="eyebrow">Start with a Defined Engagement</p>
              <h2>A clear first step, not an open-ended retainer.</h2>
              <p className="modern-section-description">
                Fixed-scope entry points that produce a decision, an evidence trail, and a plan your team can own.
              </p>
            </div>
            <a className="button button-outline" href="/services/cybersecurity">
              View All Services <Icon name="arrow-right" size={16} />
            </a>
          </div>
          <div className="modern-offer-grid">
            {entryOffers.map((offer, index) => (
              <article className="modern-offer-card" key={offer.title}>
                <div className="modern-offer-header">
                  <span className="modern-offer-number">{String(index + 1).padStart(2, '0')}</span>
                  <span className="modern-offer-duration">{offer.duration}</span>
                </div>
                <h3>{offer.title}</h3>
                <p>{offer.description}</p>
                <ul className="modern-offer-list">
                  {offer.includes.map((item) => (
                    <li key={item}>
                      <Icon name="check-circle" size={18} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <a className="modern-offer-link" href="/contact">
                  Discuss this engagement <Icon name="arrow-up-right" size={16} />
                </a>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="section modern-section services-modern" id="services">
        <Container>
          <div className="modern-section-header">
            <div>
              <p className="eyebrow">Our Services</p>
              <h2>Comprehensive Technology &amp; Security Solutions</h2>
              <p className="modern-section-description">
                Cybersecurity and risk advisory is our core focus. Supporting services help implement and maintain the security outcomes we recommend.
              </p>
            </div>
            <a className="button button-outline" href="/services">
              View All Services <Icon name="arrow-right" size={16} />
            </a>
          </div>
          <div className="modern-services-grid">
            {coreServices.map((service, index) => service ? (
              <a href={`/services/${service.slug}`} key={service.slug} className={`modern-service-card ${index === 0 ? 'modern-service-card-featured' : ''}`}>
                <div className="modern-service-header">
                  <span className="modern-service-number">{String(index + 1).padStart(2, '0')}</span>
                  <div className="modern-service-icon">
                    <Icon name={service.icon} size={22} />
                  </div>
                </div>
                <h3>{service.title}</h3>
                <p>{service.eyebrow}</p>
                <span className="modern-service-link">
                  Learn more <Icon name="arrow-up-right" size={16} />
                </span>
              </a>
            ) : null)}
          </div>

          <div className="modern-supporting-section">
            <div className="modern-supporting-header">
              <h3>Supporting Services</h3>
              <p>Additional capabilities to support your complete technology needs</p>
            </div>
            <div className="modern-supporting-grid">
              {supportingServices.map((service) => service ? (
                <a href={`/services/${service.slug}`} key={service.slug} className="modern-supporting-item">
                  <div className="modern-supporting-icon">
                    <Icon name={service.icon} size={18} />
                  </div>
                  <span className="modern-supporting-name">{service.title}</span>
                  <Icon name="arrow-right" size={16} />
                </a>
              ) : null)}
            </div>
          </div>
        </Container>
      </section>

      <section className="section modern-section case-studies-modern">
        <Container>
          <div className="modern-section-header">
            <div>
              <p className="eyebrow">Proven Results</p>
              <h2>Real Impact, Measurable Outcomes</h2>
              <p className="modern-section-description">
                Anonymized examples of how we help organizations reduce risk and strengthen their security posture.
              </p>
            </div>
            <span className="modern-badge">Client identities withheld by agreement</span>
          </div>
          <div className="modern-case-grid">
            {caseStudies.map((study, index) => (
              <article className="modern-case-card" key={study.sector}>
                <div className="modern-case-header">
                  <span className="modern-case-number">{String(index + 1).padStart(2, '0')}</span>
                  <span className="modern-case-sector">{study.sector}</span>
                  <span className="modern-case-duration">{study.duration}</span>
                </div>
                <div className="modern-case-metric">
                  <strong>{study.metric}</strong>
                  <span>{study.metricLabel}</span>
                </div>
                <div className="modern-case-content">
                  <div className="modern-case-item">
                    <h4>Challenge</h4>
                    <p>{study.challenge}</p>
                  </div>
                  <div className="modern-case-item">
                    <h4>Approach</h4>
                    <p>{study.work}</p>
                  </div>
                  <div className="modern-case-item modern-case-result">
                    <h4>Result</h4>
                    <p>{study.result}</p>
                  </div>
                </div>
                <div className="modern-case-tags">
                  {study.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="section modern-section testimonials-modern">
        <Container>
          <div className="modern-section-header">
            <div>
              <p className="eyebrow">Client Feedback</p>
              <h2>What Leaders Say About Working With Stellan</h2>
              <p className="modern-section-description">
                Direct feedback from security and technology leaders we have supported. Names withheld at client request.
              </p>
            </div>
          </div>
          <div className="modern-testimonial-grid">
            {testimonials.map((testimonial, index) => (
              <article className="modern-testimonial-card" key={testimonial.sector}>
                <div className="modern-testimonial-quote-mark" aria-hidden="true">&ldquo;</div>
                <blockquote>{testimonial.quote}</blockquote>
                <div className="modern-testimonial-author">
                  <div className="modern-testimonial-avatar" aria-hidden="true">{testimonial.initials}</div>
                  <div>
                    <strong>{testimonial.role}</strong>
                    <span>{testimonial.sector}</span>
                  </div>
                  <span className="modern-testimonial-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="section modern-section founder-modern">
        <Container>
          <div className="modern-founder-grid">
            <div className="modern-founder-visual">
              <div className="modern-founder-card">
                <div className="modern-founder-monogram">{founder.initials}</div>
                <h3>{founder.name}</h3>
                <p className="modern-founder-role">{founder.role}</p>
                <p className="modern-founder-location">{founder.location}</p>
              </div>
            </div>
            <div className="modern-founder-content">
              <p className="eyebrow">Leadership</p>
              <h2>Security Judgment, Without the Theater</h2>
              <p className="modern-founder-summary">{founder.summary}</p>
              <div className="modern-credentials">
                <h4>Certifications &amp; Expertise</h4>
                <div className="modern-credentials-grid">
                  {founder.certifications.map((certification) => (
                    <div key={certification} className="modern-credential-item">
                      <Icon name="check-circle" size={18} />
                      <span>{certification}</span>
                    </div>
                  ))}
                </div>
              </div>
              <a className="button button-primary" href="/about">
                Meet the Founder <Icon name="arrow-up-right" size={17} />
              </a>
            </div>
          </div>
        </Container>
      </section>

      <section className="section modern-section approach-modern">
        <Container>
          <div className="modern-section-header modern-section-header-center">
            <div>
              <p className="eyebrow">Our Approach</p>
              <h2>Pragmatic, Practical, Proven</h2>
              <p className="modern-section-description">
                We focus on what matters most - actionable recommendations you can implement with confidence.
              </p>
            </div>
          </div>
          <div className="modern-approach-grid">
            {approach.map((item, index) => (
              <article className="modern-approach-card" key={item.title}>
                <div className="modern-approach-header">
                  <span className="modern-approach-number">{String(index + 1).padStart(2, '0')}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="home-cta-modern">
        <Container>
          <div className="modern-cta-card">
            <div className="modern-cta-glow" aria-hidden="true" />
            <div className="modern-cta-content">
              <p className="eyebrow eyebrow-light">Start with a Conversation</p>
              <h2>Ready to Strengthen Your Security Posture?</h2>
              <p>{siteConfig.responseTime}. No automated sequence, no pressure to buy a retainer on the first call.</p>
            </div>
            <div className="modern-cta-actions">
              <a
                className="button button-primary button-large"
                href={bookingHref}
                rel={bookingExternal ? 'noopener noreferrer' : undefined}
                target={bookingExternal ? '_blank' : undefined}
              >
                Book a Free Consultation <Icon name="arrow-up-right" size={18} />
              </a>
              <a className="button button-ghost-light" href="/contact">
                Send a Message <Icon name="arrow-right" size={17} />
              </a>
              <div className="modern-cta-contact">
                <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
                <span>{siteConfig.responseTime}</span>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

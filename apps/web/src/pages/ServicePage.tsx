import type { Service } from '../content.ts';
import { getService } from '../content.ts';
import { Container, FaqList, PageHero, SectionHeading, ServiceCard, TagList } from '../components/Shared.tsx';
import { Icon } from '../components/Icon.tsx';

export function ServicePage({ service }: { service: Service }) {
  const related = service.related.map((slug) => getService(slug)).filter((item): item is Service => Boolean(item));

  return (
    <main>
      <PageHero eyebrow={service.eyebrow} title={service.h1} description={service.description}>
        <a className="button button-primary" href="/contact">Talk through your context <Icon name="arrow-up-right" size={17} /></a>
        <a className="button button-ghost-light" href="#capabilities">See capabilities <Icon name="arrow-down" size={17} /></a>
      </PageHero>

      <section className="section service-overview-section">
        <Container>
          <div className="service-overview-grid">
            <div className="service-overview-label"><span className="service-number service-number-large">{service.number}</span><span className="eyebrow">The working brief</span></div>
            <div className="service-overview-copy">
              {service.overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <div className="service-meta-row"><span>Remote delivery, clear scope</span><span>Useful handoff</span></div>
            </div>
          </div>
        </Container>
      </section>

      {service.frameworks ? (
        <section className="section service-frameworks-section">
          <Container>
            <div className="section-topline">
              <SectionHeading eyebrow="Frameworks" title="Mapped to the standards that matter to your buyers." description="We build one control set, then map the evidence to the obligations that actually apply." />
              <span className="proof-note">{service.frameworks.length} frameworks</span>
            </div>
            <ul className="framework-grid">
              {service.frameworks.map((framework) => <li key={framework}><strong>{framework}</strong><span>Assessment, mapping, and evidence support</span></li>)}
            </ul>
          </Container>
        </section>
      ) : null}

      {service.engagements ? (
        <section className="section offers-section-light" id="engagements">
          <Container>
            <div className="section-topline">
              <SectionHeading eyebrow="Entry engagements" title="A defined first step." description="Fixed scope, clear deliverables, and a decision at the end. We will tell you when a larger engagement is not justified." />
              <a className="arrow-link" href="/contact">Book a 30-min call <Icon name="arrow-up-right" size={17} /></a>
            </div>
            <div className="offer-grid">
              {service.engagements.map((offer, index) => (
                <article className="offer-card" key={offer.title}>
                  <div className="offer-topline">
                    <span className="offer-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                    <span className="offer-duration">{offer.duration}</span>
                  </div>
                  <h3>{offer.title}</h3>
                  <p>{offer.description}</p>
                  <ul>
                    {offer.includes.map((item) => <li key={item}><Icon name="check" size={14} />{item}</li>)}
                  </ul>
                  <a className="arrow-link" href="/contact">Discuss this engagement <Icon name="arrow-up-right" size={16} /></a>
                </article>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <section className="section service-capabilities-section" id="capabilities">
        <Container>
          <div className="section-topline">
            <SectionHeading eyebrow="What we bring" title="Capabilities with a reason to exist." description={`A ${service.title.toLowerCase()} engagement can flex around the work, but these are the questions we use to keep the scope honest.`} />
            <div className="section-index">{service.number}<span>/ 08</span></div>
          </div>
          <div className="capability-grid">
            {service.capabilities.map((capability, index) => (
              <article className="capability-card" key={capability.title}>
                <span className="capability-index">{String(index + 1).padStart(2, '0')}</span>
                <h3>{capability.title}</h3>
                <p>{capability.description}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {service.catalog ? (
        <section className="section service-catalog-section">
          <Container>
            <div className="section-topline">
              <SectionHeading eyebrow="Security service catalog" title="Specialist work across the security program." description="These services can be scoped individually or combined into a roadmap. The language is deliberately practical: what the work covers and why it matters." />
              <span className="proof-note">{service.catalog.length} services</span>
            </div>
            <div className="catalog-grid">
              {service.catalog.map((item, index) => (
                <article className="catalog-card" key={item.title}>
                  <span className="catalog-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <section className="section service-outcomes-section">
        <Container>
          <div className="outcomes-panel">
            <div className="outcomes-intro"><p className="eyebrow eyebrow-light">The point of the work</p><h2>Make the system easier to run.</h2><p>Outcomes are not guarantees. They are the practical changes we design toward and can help you evaluate.</p></div>
            <ul className="outcomes-list">
              {service.outcomes.map((outcome) => <li key={outcome}><span><Icon name="check" size={16} /></span>{outcome}</li>)}
            </ul>
          </div>
        </Container>
      </section>

      <section className="section service-process-section">
        <Container>
          <SectionHeading align="center" eyebrow="A four-step engagement" title="A path that keeps the work inspectable." description="The shape changes with the question. The habit stays the same: understand, make a choice, prove it, and improve it." />
          <div className="process-grid">
            {service.process.map((step, index) => (
              <article className="process-card" key={step.title}>
                <span className="process-number">0{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="section service-tags-section">
        <Container>
          <div className="service-tags-panel"><div><p className="eyebrow">Typical threads</p><h2>Useful language for scoping.</h2></div><TagList items={service.tags} /></div>
        </Container>
      </section>

      <section className="section service-faq-section">
        <Container>
          <div className="split-section-heading">
            <SectionHeading eyebrow="Questions teams ask" title="Get specific before you commit." description="A short discovery helps us separate what is known, what needs investigation, and what a useful first step could be." />
            <div className="faq-wrap"><FaqList idPrefix={`${service.slug}-faq`} items={service.faqs} /></div>
          </div>
        </Container>
      </section>

      <section className="section related-services-section">
        <Container>
          <div className="section-topline"><SectionHeading eyebrow="Keep exploring" title="Connected service areas." description="The most useful technology decisions often sit between two disciplines. These are common next stops." /><a className="arrow-link" href="/services">All services <Icon name="arrow-up-right" size={17} /></a></div>
          <div className="related-grid">{related.map((item) => <ServiceCard key={item.slug} service={item} />)}</div>
        </Container>
      </section>

    </main>
  );
}

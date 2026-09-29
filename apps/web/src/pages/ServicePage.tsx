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

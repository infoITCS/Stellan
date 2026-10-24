import {
  coreServiceSlugs,
  entryOffers,
  frameworks,
  getService,
  servicesPageFaqs,
  supportingServiceSlugs
} from '../content.ts';
import { ArrowLink, Container, FaqList, PageHero, SectionHeading, ServiceCard, TagList } from '../components/Shared.tsx';
import { Icon } from '../components/Icon.tsx';

const coreServices = coreServiceSlugs.map((slug) => getService(slug)).filter((service) => Boolean(service));
const supportingServices = supportingServiceSlugs.map((slug) => getService(slug)).filter((service) => Boolean(service));

export function ServicesPage() {
  return (
    <main>
      <PageHero eyebrow="Services" title="Cybersecurity and advisory work, supported by delivery depth." description="Start with the security or risk decision in front of you. When the outcome needs implementation, the supporting services are scoped as part of that result rather than sold as a separate menu.">
        <a className="button button-primary" href="/contact">Discuss your situation <Icon name="arrow-up-right" size={17} /></a>
        <a className="button button-ghost-light" href="#service-list">See the service map <Icon name="arrow-down" size={17} /></a>
      </PageHero>

      <section className="section services-intro" id="service-list">
        <Container>
          <div className="section-topline">
            <SectionHeading eyebrow="Core advisory" title="Security and risk first." description="These are the engagements that define the practice: assessment, prioritization, compliance readiness, and accountable security leadership." />
            <div className="service-index-note"><span>01—03</span><span>led by cybersecurity</span></div>
          </div>
          <div className="service-grid-full core-service-grid">
            {coreServices.map((service, index) => service ? <ServiceCard featured={index === 0} key={service.slug} service={service} /> : null)}
          </div>

          <div className="supporting-band supporting-band-services">
            <div className="supporting-band-intro">
              <p className="eyebrow">Supporting services</p>
              <h3>Implementation depth when the roadmap needs hands.</h3>
              <p>We bring these in to close a specific gap in the security outcome, then leave the operating model documented.</p>
            </div>
            <ul className="supporting-list">
              {supportingServices.map((service) => service ? (
                <li key={service.slug}>
                  <a href={`/services/${service.slug}`}>
                    <span className="supporting-icon"><Icon name={service.icon} size={18} /></span>
                    <span><strong>{service.title}</strong><small>{service.description}</small></span>
                    <Icon name="arrow-up-right" size={16} />
                  </a>
                </li>
              ) : null)}
            </ul>
          </div>
        </Container>
      </section>

      <section className="section framework-section-light">
        <Container>
          <div className="section-topline">
            <SectionHeading eyebrow="Frameworks" title="Fluency in the standards buyers ask about." description="We build one control set and map it to the obligations that actually apply to your organization." />
            <ArrowLink href="/services/cybersecurity">Cybersecurity services</ArrowLink>
          </div>
          <ul className="framework-grid">
            {frameworks.map((framework) => (
              <li key={framework.name}><strong>{framework.name}</strong><span>{framework.detail}</span></li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="section offers-section-light" id="engagements">
        <Container>
          <SectionHeading eyebrow="Entry engagements" title="A defined first step." description="Fixed scope, clear deliverables, and a decision at the end. We will tell you when a larger engagement is not justified." />
          <div className="offer-grid">
            {entryOffers.map((offer, index) => (
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

      <section className="section services-capability-band">
        <Container>
          <div className="capability-band-grid">
            <div>
              <p className="eyebrow">A connected practice</p>
              <h2>One team can see the hand-off.</h2>
              <p>Cloud choices affect security. Identity choices affect operations. Process design affects both adoption and evidence. We keep those relationships in the room.</p>
              <a className="arrow-link" href="/about">Why our model is different <Icon name="arrow-up-right" size={17} /></a>
            </div>
            <div className="capability-map" aria-label="Connected service areas">
              <div className="capability-node node-center"><Icon name="layers" size={22} /><strong>Useful change</strong><span>the decision underneath</span></div>
              <div className="capability-node node-top"><Icon name="shield" size={19} /><span>Security</span></div>
              <div className="capability-node node-right"><Icon name="cloud" size={19} /><span>Cloud</span></div>
              <div className="capability-node node-bottom"><Icon name="workflow" size={19} /><span>Operations</span></div>
              <div className="capability-node node-left"><Icon name="code" size={19} /><span>Product</span></div>
            </div>
          </div>
        </Container>
      </section>

      <section className="section services-faq">
        <Container>
          <div className="split-section-heading">
            <SectionHeading eyebrow="Common questions" title="A good engagement starts with a good question." description="These are a few of the things teams ask before they reach out. Your context may be different, and that is worth discussing." />
            <div className="faq-wrap"><FaqList idPrefix="services-faq" items={servicesPageFaqs} /></div>
          </div>
        </Container>
      </section>

      <section className="section services-tags-section">
        <Container>
          <div className="tag-band"><div><p className="eyebrow">Common threads</p><h2>Useful across the program.</h2></div><TagList items={['Strategy', 'Risk', 'Compliance', 'Architecture', 'Operations', 'Evidence']} /></div>
        </Container>
      </section>
    </main>
  );
}

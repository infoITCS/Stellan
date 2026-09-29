import { services, servicesPageFaqs } from '../content.ts';
import { Container, FaqList, PageHero, SectionHeading, ServiceCard, TagList } from '../components/Shared.tsx';
import { Icon } from '../components/Icon.tsx';

export function ServicesPage() {
  return (
    <main>
      <PageHero eyebrow="Services" title="The right system for the decision in front of you." description="Technology work rarely fits into one category. Our services connect strategy, infrastructure, security, operations, and product delivery so the next step feels connected to the whole." >
        <a className="button button-primary" href="/contact">Discuss a service <Icon name="arrow-up-right" size={17} /></a>
        <a className="button button-ghost-light" href="#service-list">See the service map <Icon name="arrow-down" size={17} /></a>
      </PageHero>

      <section className="section services-intro" id="service-list">
        <Container>
          <div className="section-topline">
            <SectionHeading eyebrow="Service map" title="Eight ways to make progress visible." description="Choose the entry point that matches the pressure you are feeling. We will help connect it to the rest of your system." />
            <div className="service-index-note"><span>01—08</span><span>connected by one operating question</span></div>
          </div>
          <div className="service-grid-full">
            {services.map((service, index) => <ServiceCard featured={index === 0 || index === 7} key={service.slug} service={service} />)}
          </div>
        </Container>
      </section>

      <section className="section services-capability-band">
        <Container>
          <div className="capability-band-grid">
            <div>
              <p className="eyebrow">A connected practice</p>
              <h2>One team can see the hand-off.</h2>
              <p>Cloud choices affect security. Security choices affect operations. Process design affects both adoption and cost. We keep those relationships in the room.</p>
              <a className="arrow-link" href="/about">Why our model is different <Icon name="arrow-up-right" size={17} /></a>
            </div>
            <div className="capability-map" aria-label="Connected service areas">
              <div className="capability-node node-center"><Icon name="layers" size={22} /><strong>Useful change</strong><span>the decision underneath</span></div>
              <div className="capability-node node-top"><Icon name="cloud" size={19} /><span>Cloud</span></div>
              <div className="capability-node node-right"><Icon name="shield" size={19} /><span>Security</span></div>
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
          <div className="tag-band"><div><p className="eyebrow">Common threads</p><h2>Useful across the stack.</h2></div><TagList items={['Strategy', 'Architecture', 'Security', 'Operations', 'Automation', 'Product']} /></div>
        </Container>
      </section>

    </main>
  );
}

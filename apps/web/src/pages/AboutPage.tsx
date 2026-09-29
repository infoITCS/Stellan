import { services } from '../content.ts';
import { Container, PageHero, SectionHeading } from '../components/Shared.tsx';
import { Icon } from '../components/Icon.tsx';

const principles = [
  { icon: 'compass' as const, title: 'Start with the real question', text: 'A request for more technology is often a request for less uncertainty. We begin with the decision, the work, and the people who will live with the result.' },
  { icon: 'layers' as const, title: 'Make the system legible', text: 'Clear boundaries, visible ownership, and understandable trade-offs make it easier to change a system without losing confidence in it.' },
  { icon: 'shield' as const, title: 'Treat care as a capability', text: 'Security, accessibility, reliability, and cost are not final checks. They are design inputs that shape better decisions from the beginning.' },
  { icon: 'support' as const, title: 'Build for the next handoff', text: 'The work should remain useful after the engagement. Documentation, runbooks, and shared language are part of the product, not an appendix.' }
];

const atAGlance = [
  { label: 'Delivery model', value: 'Remote by design' },
  { label: 'Service areas', value: `${services.length} connected disciplines` },
  { label: 'Engagement shape', value: 'Advisory, build, or run' },
  { label: 'Commercial model', value: 'Scoped before work starts' }
];

const workingSteps = [
  { title: 'Understand the decision', text: 'We separate the stated request from the operating or business constraint underneath it, and name the people who will live with the result.' },
  { title: 'Make the system visible', text: 'Dependencies, risk, cost, and existing capability are mapped so the options can be compared against something factual.' },
  { title: 'Deliver a reviewable slice', text: 'A narrow, useful increment is built with controls and evidence in the loop, so progress can be inspected rather than asserted.' },
  { title: 'Hand it over with context', text: 'Documentation, runbooks, and the reasoning behind the choice travel with the work so the next team can keep moving.' }
];

export function AboutPage() {
  return (
    <main>
      <PageHero eyebrow="About" title="Technology is a means, not the message." description="Stellan Solutions is a remote technology practice for teams that want clearer choices, steadier operations, and a partner who can explain the trade-offs.">
        <a className="button button-primary" href="/contact">Start a conversation <Icon name="arrow-up-right" size={17} /></a>
        <a className="button button-ghost-light" href="/services">See how we help <Icon name="arrow-right" size={17} /></a>
      </PageHero>

      <section className="section about-story-section">
        <Container>
          <div className="about-section-marker"><span className="about-marker-number">01</span><span className="about-marker-label">Our point of view</span></div>
          <p className="about-lede">Technology decisions are rarely just technical. They shape how a team hires, serves, measures, recovers, and changes.</p>
          <div className="about-story-grid">
            <div className="about-story-aside">
              <h2>The best work makes the next decision easier.</h2>
              <dl className="about-glance">
                {atAGlance.map((item, index) => (
                  <div key={item.label}>
                    <span className="about-glance-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                    <span className="about-glance-body"><dt>{item.label}</dt><dd>{item.value}</dd></span>
                  </div>
                ))}
              </dl>
            </div>
            <div className="about-story-copy">
              <p>We built Stellan Solutions around the idea that the people making those decisions deserve context they can use—not more jargon to translate. That means starting from the work itself rather than from a product we would like to sell.</p>
              <p>Our work spans managed operations, cloud architecture, security, networks, strategy, automation, AI engineering, and web development. Those disciplines are connected in practice, so we bring them into the same conversation when that makes the decision clearer.</p>
              <p>We work remotely with teams and stay explicit about what we know, what we need to learn, and what the evidence supports. That posture keeps recommendations grounded and handoffs honest.</p>
            </div>
          </div>
        </Container>
      </section>

      <section className="section about-method-section">
        <Container>
          <div className="about-section-marker about-section-marker-light"><span className="about-marker-number">02</span><span className="about-marker-label">How we work</span></div>
          <SectionHeading align="center" eyebrow="A four-step engagement" title="A method you can inspect at any point." description="The shape changes with the question. The habit stays the same: understand, make a choice, prove it, and leave it documented." />
          <ol className="about-method-grid">
            {workingSteps.map((step, index) => (
              <li key={step.title}>
                <span className="about-method-track" aria-hidden="true"><span className="about-method-dot" /></span>
                <span className="about-method-number">{String(index + 1).padStart(2, '0')}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="section principles-section">
        <Container>
          <div className="about-section-marker"><span className="about-marker-number">03</span><span className="about-marker-label">What we bring</span></div>
          <SectionHeading align="center" eyebrow="Working principles" title="A small set of principles, applied consistently." description="The details change from project to project. The way we work does not need to." />
          <div className="principles-grid">
            {principles.map((principle, index) => (
              <article className="principle-card" key={principle.title}>
                <span className="principle-topline">
                  <span className="principle-icon"><Icon name={principle.icon} size={22} /></span>
                  <span className="principle-number">{String(index + 1).padStart(2, '0')}</span>
                </span>
                <h3>{principle.title}</h3>
                <p>{principle.text}</p>
                <span className="principle-accent" aria-hidden="true" />
              </article>
            ))}
          </div>
        </Container>
      </section>

    </main>
  );
}

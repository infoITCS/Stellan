import { caseStudies, founder, frameworks, services } from '../content.ts';
import { Container, PageHero, SectionHeading } from '../components/Shared.tsx';
import { Icon } from '../components/Icon.tsx';
import { siteConfig } from '../site.ts';

const principles = [
  { icon: 'compass' as const, title: 'Start with the real question', text: 'A request for more technology is often a request for less uncertainty. We begin with the decision, the work, and the people who will live with the result.' },
  { icon: 'shield' as const, title: 'Treat care as a capability', text: 'Security, privacy, reliability, and evidence are design inputs. They shape better decisions from the beginning, not a final checkbox before launch.' },
  { icon: 'layers' as const, title: 'Make the system legible', text: 'Clear boundaries, visible ownership, and understandable trade-offs make it easier to change a control environment without losing confidence in it.' },
  { icon: 'support' as const, title: 'Build for the next handoff', text: 'The work should remain useful after the engagement. Documentation, decision records, and shared language are part of the product.' }
];

const atAGlance = [
  { label: 'Focus', value: 'Cybersecurity & risk advisory' },
  { label: 'Experience', value: '20+ years in security' },
  { label: 'Credentials', value: 'CISM · CRISC · CCSK · ISO 27001 LI · AWS SA' },
  { label: 'Based in', value: siteConfig.address },
  { label: 'Response time', value: siteConfig.responseTime },
  { label: 'Engagement shape', value: 'Assessment, roadmap, or vCISO' }
];

const workingSteps = [
  { title: 'Understand the decision', text: 'We separate the stated request from the operating, commercial, or compliance constraint underneath it, and name the people who will live with the result.' },
  { title: 'Make the system visible', text: 'Assets, access, risk, obligations, and existing capability are mapped so the options can be compared against something factual.' },
  { title: 'Deliver a reviewable slice', text: 'A narrow, useful increment is delivered with controls and evidence in the loop, so progress can be inspected rather than asserted.' },
  { title: 'Hand it over with context', text: 'Documentation, owners, and the reasoning behind each choice travel with the work so the next team can keep moving.' }
];

export function AboutPage() {
  return (
    <main>
      <PageHero eyebrow="About" title="Security judgment from someone who has carried the consequences." description="Stellan Solutions is a cybersecurity and risk advisory practice in Ashburn, Virginia. We help mid-sized organizations turn security obligations into a prioritized program that leadership can understand and own.">
        <a className="button button-primary" href="/contact">Book a 30-min call <Icon name="arrow-up-right" size={17} /></a>
        <a className="button button-ghost-light" href="/services/cybersecurity">See cybersecurity services <Icon name="arrow-right" size={17} /></a>
      </PageHero>

      <section className="section founder-section" id="founder">
        <Container>
          <div className="about-section-marker"><span className="about-marker-number">01</span><span className="about-marker-label">The founder</span></div>
          <div className="founder-grid">
            <div className="founder-portrait">
              <span className="founder-monogram" aria-hidden="true">{founder.initials}</span>
              <span className="founder-portrait-label">{founder.name}</span>
            </div>
            <div className="founder-copy">
              <p className="eyebrow">{founder.role}</p>
              <h2>{founder.name}</h2>
              <p className="founder-role">{founder.location}</p>
              {founder.bio.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <div className="founder-actions">
                <a className="button button-dark" href={founder.linkedin} rel="noopener noreferrer" target="_blank">
                  Connect on LinkedIn <Icon name="linkedin" size={17} />
                </a>
                <a className="arrow-link" href="/contact">Start a conversation <Icon name="arrow-up-right" size={17} /></a>
              </div>
            </div>
          </div>
          <div className="credentials-panel">
            <div>
              <p className="eyebrow">Certifications</p>
              <h3>Credentials behind the advice.</h3>
            </div>
            <ul className="credential-list credential-list-large">
              {founder.certifications.map((certification) => <li key={certification}>{certification}</li>)}
            </ul>
          </div>
        </Container>
      </section>

      <section className="section about-story-section">
        <Container>
          <div className="about-section-marker"><span className="about-marker-number">02</span><span className="about-marker-label">Our point of view</span></div>
          <p className="about-lede">Security work is only useful when it changes a decision. A finding that nobody can prioritize, fund, or own is just another document.</p>
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
              <p>We built Stellan Solutions around a practical frustration: too much security advice arrives as a list of everything that could go wrong, with no honest view of what to do first. Mid-sized organizations do not need more noise. They need a sequence they can fund and a way to prove it worked.</p>
              <p>Our core work is cybersecurity and risk advisory: assessments, roadmaps, compliance readiness, and fractional CISO support. Where an outcome needs implementation, we bring in the connected services we know well, including cloud, managed IT, networks, automation, AI, and secure web development.</p>
              <p>We stay explicit about what we know, what we need to learn, and what the evidence supports. That posture keeps recommendations grounded and handoffs honest.</p>
            </div>
          </div>
        </Container>
      </section>

      <section className="section about-method-section">
        <Container>
          <div className="about-section-marker about-section-marker-light"><span className="about-marker-number">03</span><span className="about-marker-label">How we work</span></div>
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
          <div className="about-section-marker"><span className="about-marker-number">04</span><span className="about-marker-label">What we bring</span></div>
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

      <section className="section frameworks-section">
        <Container>
          <div className="section-topline">
            <SectionHeading eyebrow="Frameworks" title="Fluency in the standards your buyers ask about." description="One control set, mapped to the obligations that actually apply to your organization." />
            <span className="proof-note">{services.length} connected service areas</span>
          </div>
          <ul className="framework-grid">
            {frameworks.map((framework) => (
              <li key={framework.name}><strong>{framework.name}</strong><span>{framework.detail}</span></li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="section about-proof-section">
        <Container>
          <SectionHeading eyebrow="Selected engagements" title="What the work looks like in practice." description="Anonymized examples. The detail is real; the client identities are withheld by agreement." />
          <div className="proof-grid">
            {caseStudies.map((study) => (
              <article className="proof-card" key={study.sector}>
                <span className="proof-sector">{study.sector}</span>
                <h3>{study.result}</h3>
                <p>{study.challenge}</p>
                <ul className="proof-tags">{study.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}

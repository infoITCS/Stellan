import { Container, PageHero, SectionHeading } from '../components/Shared.tsx';
import { Icon } from '../components/Icon.tsx';
import { siteConfig } from '../site.ts';

const sections = [
  {
    title: 'Using this website',
    body: 'The content on this website is provided for general information about Stellan Solutions and its services. It is not security, legal, audit, or compliance advice for a specific organization, and it does not create an advisory relationship. Any engagement is governed by a separate written agreement.'
  },
  {
    title: 'No guarantee of outcome',
    body: 'Security and compliance outcomes depend on the systems, evidence, and decisions of each organization. References to frameworks such as NIST CSF, ISO 27001, SOC 2, HIPAA, or CMMC describe the standards we work with, not a promise of certification or audit results.'
  },
  {
    title: 'Intellectual property',
    body: 'The Stellan name, brand, layout, copy, and original materials on this site are the property of Stellan Solutions unless stated otherwise. You may read and share links to the site, but you may not reproduce substantial portions for commercial use without written permission.'
  },
  {
    title: 'Enquiries and communication',
    body: 'Information you send through the contact form or by email is handled as described in our privacy overview. Please do not send passwords, private keys, or sensitive production data through the website form.'
  },
  {
    title: 'External links',
    body: 'This site may link to third-party websites or scheduling tools. Those services operate under their own terms and privacy practices, and Stellan Solutions is not responsible for their content or availability.'
  }
];

export function TermsPage() {
  return (
    <main>
      <PageHero eyebrow="Terms" title="Terms for using this website." description="A short, plain-language overview of the rules that apply to this website and its content.">
        <a className="button button-primary" href="/contact">Ask a question <Icon name="arrow-up-right" size={17} /></a>
      </PageHero>

      <section className="section terms-section">
        <Container>
          <div className="terms-layout">
            <div className="terms-aside">
              <p className="eyebrow">Last updated</p>
              <p>October 2026</p>
              <p className="terms-contact">{siteConfig.contactEmail}<br />{siteConfig.address}</p>
            </div>
            <div className="terms-body">
              <SectionHeading eyebrow="Website terms" title="Clarity before the first call." description="These terms are intentionally short. If something is unclear, ask before relying on it." />
              {sections.map((section, index) => (
                <section key={section.title}>
                  <span className="terms-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  <h2>{section.title}</h2>
                  <p>{section.body}</p>
                </section>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

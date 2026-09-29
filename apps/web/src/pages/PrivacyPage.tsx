import { Container, PageHero } from '../components/Shared.tsx';
import { Icon } from '../components/Icon.tsx';

export function PrivacyPage() {
  return (
    <main>
      <PageHero eyebrow="Privacy" title="A clear overview of this site’s data boundaries." description="This page explains what information the site collects, where it is sent, and what the experience does not add.">
        <a className="button button-primary" href="/contact">Ask a privacy question <Icon name="arrow-up-right" size={17} /></a>
      </PageHero>

      <section className="section privacy-section">
        <Container>
          <div className="privacy-layout">
            <aside className="privacy-toc"><p className="eyebrow">On this page</p><a href="#overview">Overview</a><a href="#form-data">Contact form</a><a href="#site-data">Site data</a><a href="#questions">Questions</a></aside>
            <article className="privacy-copy">
              <section id="overview"><p className="eyebrow">Overview</p><h2>Privacy should be understandable.</h2><p>This site is designed to collect only the information a person chooses to provide through the contact form. It does not include third-party analytics, advertising pixels, or external asset requests.</p><p>Stellan Solutions uses submitted details to respond to enquiries and manage the resulting conversation. Hosting and infrastructure providers may process ordinary request data as needed to serve the site and operate its services.</p></section>
              <section id="form-data"><p className="eyebrow">Contact form</p><h2>What the form submits.</h2><p>The form collects name, work email, company, optional phone, service area, message, and required consent. It includes a website honeypot field that is visually hidden from people and intended to reduce automated submissions.</p><p>The form sends your entries over an encrypted connection, saves them in our own enquiry database, and forwards a copy to the Stellan Solutions inbox so a person can reply. Your entries stay in the form after a recoverable error so you can try again.</p></section>
              <section id="site-data"><p className="eyebrow">Site data</p><h2>What the site does not add.</h2><p>The site uses local SVG assets, self-hosted font files, and a small set of native browser APIs. It does not request fonts, images, icon libraries, analytics services, or third-party templates from an external origin.</p><p>You can choose not to provide optional contact details. If you have a question about information submitted through the form, use the contact page and describe the request clearly so the team can route it appropriately.</p></section>
              <section id="questions"><p className="eyebrow">Questions and requests</p><h2>Start with a clear description.</h2><p>Tell us which site, form, or interaction your question relates to and what you need help understanding. Avoid including sensitive information that is not necessary to explain the request.</p></section>
            </article>
          </div>
        </Container>
      </section>

      <section className="section privacy-contact-band"><Container><div className="privacy-contact-panel"><div><p className="eyebrow">Questions are welcome</p><h2>Need a clearer answer?</h2></div><div><p>Use the contact form to describe a privacy question or request. Share only the details needed to understand and route it.</p><a className="arrow-link" href="/contact">Go to contact <Icon name="arrow-up-right" size={17} /></a></div></div></Container></section>

    </main>
  );
}


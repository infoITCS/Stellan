import { useState } from 'react';
import { Container, FaqList, PageHero, SectionHeading } from '../components/Shared.tsx';
import { Icon, type IconName } from '../components/Icon.tsx';

const categories = [
  {
    id: 'testing',
    title: 'Security Testing and Assessment',
    summary: 'See your environment the way an attacker would, then fix what matters first.',
    cards: [
      { title: 'Vulnerability Assessment and Penetration Testing (VAPT)', description: 'We safely probe your networks, applications and cloud services to uncover weaknesses before someone else does. Every engagement ends with a clear, risk-ranked remediation plan your team can act on.', icon: 'scan-search' },
      { title: 'Red Team and Blue Team Exercises', description: 'Realistic attack simulations put your defenders to the test against the tactics real adversaries use. You come away with sharper detection, faster response and a team that has practised under pressure.', icon: 'swords' }
    ]
  },
  {
    id: 'detection',
    title: 'Threat Detection, Monitoring and Response',
    summary: 'Eyes on your environment around the clock, and a plan ready when something happens.',
    cards: [
      { title: 'Managed Security Services (SOC-as-a-Service)', description: "Our analysts monitor, triage and escalate threats 24/7 so your in-house team doesn't have to. Get mature security operations without the cost of building a SOC yourself.", icon: 'shield-check' },
      { title: 'Security Information and Event Management (SIEM)', description: 'We bring logs from across your infrastructure into one place and tune correlation rules that surface real threats, not noise. The result is faster detection and a clearer picture of what is happening.', icon: 'activity' },
      { title: 'Endpoint Detection and Response (EDR)', description: 'Continuous monitoring of laptops, servers and mobile devices spots malicious behaviour as it happens. Compromised endpoints can be isolated in seconds, keeping an incident from spreading.', icon: 'laptop' },
      { title: 'Incident Response, Forensics and Recovery', description: 'When an incident hits, we help you contain it, investigate the root cause and get back to normal quickly. We also preserve evidence and document lessons learned to prevent a repeat.', icon: 'siren' },
      { title: 'Threat Intelligence and Dark Web Monitoring', description: 'We watch for leaked credentials, exposed data and threat chatter that mentions your organization. Early warnings let you act before stolen information is used against you.', icon: 'radar' }
    ]
  },
  {
    id: 'identity',
    title: 'Identity and Access Security',
    summary: 'Make sure the right people get the right access, and nobody else does.',
    cards: [
      { title: 'Identity and Access Management (IAM / PAM)', description: 'We design and roll out identity controls that govern who can reach which systems, with extra safeguards for privileged and admin accounts. Access stays tight without getting in the way of daily work.', icon: 'key-round' },
      { title: 'Multi-Factor Authentication (MFA)', description: 'Add a second layer of verification to email, VPN, cloud apps and critical systems. A simple step for users that blocks the vast majority of account-takeover attempts.', icon: 'smartphone' },
      { title: 'Zero Trust Architecture', description: 'We help you move from perimeter-based security to a model where every user, device and request is verified continuously. Access is granted on identity and context, not network location.', icon: 'lock-keyhole' }
    ]
  },
  {
    id: 'network-cloud-app',
    title: 'Network, Cloud and Application Security',
    summary: 'Harden the infrastructure and apps your business runs on, on-premises and in the cloud.',
    cards: [
      { title: 'Network Security Design and Hardening', description: 'We build segmented, well-configured networks that limit how far an attacker can move. Secure baselines improve both protection and day-to-day reliability.', icon: 'network' },
      { title: 'Firewall Management and Policy Review', description: 'We clean up rule sets, remove risky or unused rules and set up proper change control. Your firewalls stay effective, auditable and easy to manage.', icon: 'brick-wall' },
      { title: 'Cloud Security Posture Management (CSPM)', description: 'Continuous checks across AWS, Azure and Google Cloud catch misconfigurations and drift before they become exposures. Get one view of cloud risk and compliance across all your accounts.', icon: 'cloud' },
      { title: 'Web Application Firewall (WAF) and Application Security', description: 'Shield websites and APIs from injection attacks, malicious bots and abusive traffic. We also review application code and configuration to close gaps at the source.', icon: 'globe-lock' },
      { title: 'Email Security and Anti-Phishing', description: 'Layered filtering, authentication (SPF, DKIM, DMARC) and link scanning stop phishing, spoofing and malware at the inbox. Protects your team and your domain’s reputation.', icon: 'mail-warning' }
    ]
  },
  {
    id: 'data-resilience',
    title: 'Data Protection and Resilience',
    summary: 'Keep sensitive data where it belongs and recover quickly if the worst happens.',
    cards: [
      { title: 'Data Loss Prevention (DLP)', description: 'We classify your sensitive data and put policies in place that stop it leaving through email, cloud storage or removable media. Protects customer records, intellectual property and regulated information.', icon: 'file-lock' },
      { title: 'Ransomware Protection and Backup Strategy', description: 'Layered defences reduce the chance of a ransomware attack succeeding, and immutable, tested backups make sure you can recover if one does. Built around keeping your business running.', icon: 'database-backup' }
    ]
  },
  {
    id: 'governance',
    title: 'Governance, Risk and Compliance',
    summary: 'Turn security into something leadership, auditors and customers can trust and measure.',
    cards: [
      { title: 'Security Audits and Compliance (ISO 27001, NIST, SOC 2)', description: 'We assess your controls against leading frameworks, close the gaps and get you audit-ready. Clear documentation and policies make certification smoother and less stressful.', icon: 'clipboard-check' },
      { title: 'Risk Management and Compliance Reporting', description: 'We translate technical findings into plain-language risk reports and dashboards for executives and auditors. Leadership gets the information it needs to prioritize investment with confidence.', icon: 'bar-chart-3' },
      { title: 'Security Awareness Training and Phishing Simulations', description: 'Engaging training and realistic phishing tests help employees recognize and report threats. Over time, your people become one of your strongest defences instead of the easiest way in.', icon: 'graduation-cap' }
    ]
  }
];

const processSteps = [
  { title: 'Discover', description: 'We learn your business, systems, priorities and any compliance obligations.' },
  { title: 'Assess', description: 'We test and review your environment to find where the real risks are.' },
  { title: 'Plan', description: 'You get a prioritized roadmap with quick wins and longer-term improvements.' },
  { title: 'Implement', description: 'We deploy and configure the controls, or work alongside your team to do it.' },
  { title: 'Monitor and improve', description: 'Ongoing monitoring, reporting and reviews keep you ahead of new threats.' }
];

const whyTiles = [
  { title: 'Practitioner-led', text: 'Your engagement is led by a security professional with 20+ years in the field, certified CISM, CRISC, CCSK and ISO 27001 Lead Implementer.' },
  { title: 'Business-first advice', text: 'We explain risk in plain language and recommend what fits your budget and goals, not the most expensive option.' },
  { title: 'Vendor-neutral', text: 'We work with the tools you already own and recommend new ones only when they add real value.' },
  { title: 'One partner for IT, cloud and security', text: 'Security, infrastructure and AI services under one roof means fewer handoffs and faster delivery.' }
];

const faqs = [
  { question: 'Which security frameworks do you work with?', answer: 'We work with NIST CSF, ISO 27001, SOC 2, CIS Controls, HIPAA, and CMMC. We select the framework that matches your obligations and customers, then build one control set that can be evidenced against each requirement.' },
  { question: 'What is included in a vulnerability assessment?', answer: 'The assessment covers asset discovery, configuration review, vulnerability scanning, validation, prioritization, and a practical remediation plan. Findings are ranked by exposure and business context rather than scanner severity alone.' },
  { question: 'Do you provide ongoing security monitoring or a vCISO?', answer: 'Yes. Monitoring can be included as a defined service layer, and our vCISO retainer provides senior security leadership, governance, risk reporting, and an accountable owner for the program. We design alert routes, playbooks, and review cadences so signals lead to action instead of noise.' },
  { question: 'Can you help us prepare for a customer security review or audit?', answer: 'Yes. We organize evidence, clarify control ownership, identify gaps, and build a prioritized remediation path mapped to the relevant framework. We prepare you to demonstrate the controls you actually operate; the certification or audit decision remains with the independent assessor.' },
  { question: 'How do you balance security with delivery speed?', answer: 'We look for controls that are proportionate, testable, and visible in the workflow. Threat modeling and early review usually make later changes less expensive than discovering a risk during launch.' },
  { question: 'Do you work with an existing IT or security team?', answer: 'Yes. We can lead a defined workstream, complement an existing provider, or act as an independent advisor. We start with responsibilities and desired outcomes to keep ownership explicit.' }
];

export function CybersecurityPage() {
  const [activeCategory, setActiveCategory] = useState<string>(categories[0].id);

  const scrollToCategory = (id: string) => {
    setActiveCategory(id);
    const el = document.getElementById(`cyber-cat-${id}`);
    if (el) {
      const offset = 120;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <main>
      <PageHero eyebrow="Cybersecurity" title="Cybersecurity Services" description="Find the gaps, close them fast, and stay ready for what comes next.">
        <a className="button button-primary" href="/contact">Book a Security Assessment <Icon name="arrow-up-right" size={17} /></a>
        <a className="button button-ghost-light" href="#cyber-categories">Explore Our Services <Icon name="arrow-down" size={17} /></a>
      </PageHero>

      <section className="section">
        <Container>
          <SectionHeading eyebrow="Introduction" title="Security built around how your business actually runs" description="Stellan Solutions helps organizations of every size protect their people, systems and data. We combine hands-on testing, round-the-clock monitoring and practical governance so you can lower risk without slowing the business down. Whether you need a one-time assessment or an ongoing security partner, our team brings enterprise-grade experience at a scale that fits you." />
        </Container>
      </section>

      <section className="section cyber-services-section" id="cyber-categories">
        <Container>
          <div className="section-topline">
            <SectionHeading eyebrow="Service coverage" title="Comprehensive cybersecurity services" description="Grouped for scanning. Jump to a category or browse the full coverage below." />
          </div>
          <div className="cyber-filter" aria-label="Jump to a cybersecurity service category">
            {categories.map((cat) => (
              <button
                key={cat.id}
                aria-pressed={activeCategory === cat.id}
                className={`cyber-filter-chip${activeCategory === cat.id ? ' active' : ''}`}
                onClick={() => scrollToCategory(cat.id)}
                type="button"
              >
                {cat.title}
              </button>
            ))}
          </div>
          <div className="cyber-categories">
            {categories.map((cat) => (
              <section key={cat.id} id={`cyber-cat-${cat.id}`} className="cyber-category-block">
                <div className="cyber-category-header">
                  <h2>{cat.title}</h2>
                  <p>{cat.summary}</p>
                </div>
                <div className="cyber-card-grid">
                  {cat.cards.map((card) => (
                    <article className="cyber-service-card" key={card.title}>
                      <div className="cyber-service-card-header">
                        <span className="cyber-service-icon"><Icon name={card.icon as IconName} size={22} /></span>
                        <h3>{card.title}</h3>
                      </div>
                      <p>{card.description}</p>
                      <a className="arrow-link" href="/contact">Talk to an expert <Icon name="arrow-up-right" size={16} /></a>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </Container>
      </section>

      <section className="section cyber-process-section">
        <Container>
          <SectionHeading align="center" eyebrow="How we work" title="A clear path from first call to lasting protection" />
          <div className="cyber-process-grid">
            {processSteps.map((step, idx) => (
              <article className="cyber-process-card" key={step.title}>
                <span className="cyber-process-number">{String(idx + 1).padStart(2, '0')}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="section cyber-why-section">
        <Container>
          <SectionHeading eyebrow="Why Stellan" title="Why organizations choose Stellan" />
          <div className="cyber-why-grid">
            {whyTiles.map((tile) => (
              <article className="cyber-why-tile" key={tile.title}>
                <h3>{tile.title}</h3>
                <p>{tile.text}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="section cyber-faq-section">
        <Container>
          <div className="split-section-heading">
            <SectionHeading eyebrow="Questions" title="Frequently asked questions" description="Get specific before you commit." />
            <div className="faq-wrap"><FaqList idPrefix="cyber-faq" items={faqs} /></div>
          </div>
        </Container>
      </section>

      <section className="section cyber-cta-section">
        <Container>
          <div className="cyber-cta-band">
            <div>
              <h2>Not sure where you stand? Let’s find out.</h2>
              <p>Book a no-obligation consultation and get a clear view of your top security risks and how to fix them.</p>
            </div>
            <a className="button button-large cyber-cta-button" href="/contact">Book a Security Assessment <Icon name="arrow-up-right" size={18} /></a>
          </div>
        </Container>
      </section>
    </main>
  );
}

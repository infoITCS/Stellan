import { BrandLockup } from './Brand.tsx';
import { Icon } from './Icon.tsx';
import { Container } from './Shared.tsx';

const footerGroups = [
  {
    title: 'Company',
    links: [
      { label: 'Services', href: '/services' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' }
    ]
  },
  {
    title: 'Core services',
    links: [
      { label: 'Cloud services', href: '/services/cloud-services' },
      { label: 'Cybersecurity', href: '/services/cybersecurity' },
      { label: 'Enterprise automation', href: '/services/enterprise-automation' },
      { label: 'AI engineering', href: '/services/ai-engineering' }
    ]
  },
  {
    title: 'Practice areas',
    links: [
      { label: 'Managed IT', href: '/services/managed-it' },
      { label: 'Network infrastructure', href: '/services/network-infrastructure' },
      { label: 'IT consulting', href: '/services/it-consulting' },
      { label: 'Web development', href: '/services/web-development' }
    ]
  }
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div aria-hidden="true" className="footer-glow" />
      <div aria-hidden="true" className="footer-grid" />
      <Container>
        <div className="footer-topline">
          <span className="footer-context"><i />Remote technology partnership</span>
          <span>Technology, made legible.</span>
        </div>

        <div className="footer-main">
          <div className="footer-brand-column">
            <a aria-label="Stellan Solutions home" className="footer-brand-link" href="/">
              <BrandLockup />
            </a>
            <p className="footer-lede">Practical technology guidance for teams navigating complex decisions, changing systems, and distributed operations.</p>
          </div>

          <nav aria-label="Footer navigation" className="footer-links-grid">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <p className="footer-heading">{group.title}</p>
                {group.links.map((link) => (
                  <a href={link.href} key={link.href}>
                    <span>{link.label}</span>
                    <Icon name="arrow-up-right" size={14} />
                  </a>
                ))}
              </div>
            ))}
          </nav>
        </div>

        <div className="footer-bottom">
          <span>© Stellan Solutions</span>
          <span className="footer-motto">Original technology guidance for modern teams.</span>
          <a href="/privacy">Privacy overview <Icon name="arrow-up-right" size={14} /></a>
        </div>
      </Container>
    </footer>
  );
}

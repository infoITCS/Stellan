import { BrandLockup } from './Brand.tsx';
import { Icon } from './Icon.tsx';
import { Container } from './Shared.tsx';
import { siteConfig } from '../site.ts';

const footerGroups = [
  {
    title: 'Advisory & security',
    links: [
      { label: 'Cybersecurity', href: '/services/cybersecurity' },
      { label: 'Security posture assessment', href: '/services/cybersecurity#engagements' },
      { label: 'vCISO retainer', href: '/services/cybersecurity#engagements' },
      { label: 'IT consulting', href: '/services/it-consulting' },
      { label: 'Cloud services', href: '/services/cloud-services' }
    ]
  },
  {
    title: 'Supporting services',
    links: [
      { label: 'Managed IT', href: '/services/managed-it' },
      { label: 'Network infrastructure', href: '/services/network-infrastructure' },
      { label: 'Enterprise automation', href: '/services/enterprise-automation' },
      { label: 'AI engineering', href: '/services/ai-engineering' },
      { label: 'Web development', href: '/services/web-development' }
    ]
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' }
    ]
  }
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div aria-hidden="true" className="footer-glow" />
      <div aria-hidden="true" className="footer-grid" />
      <Container>
        <div className="footer-topline">
          <span className="footer-context"><i />Cybersecurity &amp; risk advisory</span>
          <span>{siteConfig.responseTime}</span>
        </div>

        <div className="footer-main">
          <div className="footer-brand-column">
            <a aria-label="Stellan Solutions home" className="footer-brand-link" href="/">
              <BrandLockup />
            </a>
            <p className="footer-lede">Cybersecurity and risk advisory for mid-sized organizations: assessments, prioritized roadmaps, compliance readiness, and fractional CISO support.</p>
            <div className="footer-contact">
              <a href={`mailto:${siteConfig.contactEmail}`}><Icon name="mail" size={16} />{siteConfig.contactEmail}</a>
              <span><Icon name="map-pin" size={16} />{siteConfig.address}</span>
            </div>
            <div className="footer-socials" aria-label="Stellan Solutions social links">
              {siteConfig.socials.map((social) => (
                <a
                  aria-label={social.label}
                  href={social.href}
                  key={social.label}
                  rel="noopener noreferrer"
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  title={social.label}
                >
                  <Icon name={social.icon} size={18} />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Footer navigation" className="footer-links-grid">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <p className="footer-heading">{group.title}</p>
                {group.links.map((link) => (
                  <a href={link.href} key={`${group.title}-${link.label}`}>
                    <span>{link.label}</span>
                    <Icon name="arrow-up-right" size={14} />
                  </a>
                ))}
              </div>
            ))}
          </nav>
        </div>

        <div className="footer-bottom">
          <span>© {year} Stellan Solutions</span>
          <span className="footer-motto">Security judgment, without the theater.</span>
          <a href="/privacy">Privacy <Icon name="arrow-up-right" size={14} /></a>
        </div>
      </Container>
    </footer>
  );
}

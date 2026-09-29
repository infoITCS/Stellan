import type { ReactNode } from 'react';
import type { Service } from '../content.ts';
import { Icon, type IconName } from './Icon.tsx';

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`container ${className}`.trim()}>{children}</div>;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  light = false
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  light?: boolean;
}) {
  return (
    <div className={`section-heading section-heading-${align}${light ? ' section-heading-light' : ''}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {description ? <p className="section-description">{description}</p> : null}
    </div>
  );
}

export function ArrowLink({ href, children, light = false }: { href: string; children: ReactNode; light?: boolean }) {
  return (
    <a className={`arrow-link${light ? ' arrow-link-light' : ''}`} href={href}>
      <span>{children}</span>
      <Icon name="arrow-up-right" size={17} />
    </a>
  );
}

export function TagList({ items, light = false }: { items: string[]; light?: boolean }) {
  return (
    <div aria-label="Capabilities" className={`tag-list${light ? ' tag-list-light' : ''}`}>
      {items.map((item) => <span className="tag" key={item}>{item}</span>)}
    </div>
  );
}

export function ServiceCard({ service, featured = false }: { service: Service; featured?: boolean }) {
  return (
    <article className={`service-card${featured ? ' service-card-featured' : ''}`}>
      <div className="service-card-topline">
        <span className="service-number">{service.number}</span>
        <span className="service-icon"><Icon name={service.icon as IconName} size={22} /></span>
      </div>
      <p className="card-eyebrow">{service.eyebrow}</p>
      <h3>{service.title}</h3>
      <p>{service.description}</p>
      <ArrowLink href={`/services/${service.slug}`}>Explore {service.shortTitle.toLowerCase()}</ArrowLink>
    </article>
  );
}

export function FaqList({ items, idPrefix = 'faq' }: { items: { question: string; answer: string }[]; idPrefix?: string }) {
  return (
    <div className="faq-list">
      {items.map((item, index) => (
        <details className="faq-item" id={`${idPrefix}-${index + 1}`} key={item.question}>
          <summary>
            <span>{item.question}</span>
            <span aria-hidden="true" className="faq-toggle"><Icon name="plus" size={18} /></span>
          </summary>
          <div className="faq-answer"><p>{item.answer}</p></div>
        </details>
      ))}
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <ol>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`}>
            {item.href ? <a href={item.href}>{item.label}</a> : <span aria-current="page">{item.label}</span>}
            {index < items.length - 1 ? <span aria-hidden="true" className="breadcrumb-separator">/</span> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  children,
  tone = 'dark'
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
  tone?: 'dark' | 'light';
}) {
  return (
    <section className={`page-hero page-hero-${tone}`}>
      <div className="page-hero-glow" aria-hidden="true" />
      <Container>
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: eyebrow }, { label: title }]} />
        <div className="page-hero-content">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="page-hero-description">{description}</p>
          {children ? <div className="page-hero-actions">{children}</div> : null}
        </div>
      </Container>
    </section>
  );
}


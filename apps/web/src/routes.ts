import { contactPageFaqs, founder, getService, serviceSlugs, services, servicesPageFaqs, type Service, type ServiceSlug } from './content.ts';
import { isIndexableSiteUrl, normalizePathname, normalizeSiteUrl, siteConfig } from './site.ts';

export type JsonLd = Record<string, unknown>;

export interface PageMetadata {
  title: string;
  description: string;
  pathname: string;
  ogType: 'website' | 'article';
  keywords: string[];
  noindex: boolean;
  jsonLd: JsonLd[];
}

export type PageKey = 'home' | 'services' | 'service' | 'cybersecurity' | 'about' | 'contact' | 'privacy' | 'terms' | 'not-found';

export interface RouteDefinition {
  pathname: string;
  page: PageKey;
  status: 200 | 404;
  metadata: PageMetadata;
  service?: Service;
}

interface StaticPage {
  pathname: string;
  page: PageKey;
  title: string;
  description: string;
  keywords: string[];
}

const staticPages: StaticPage[] = [
  {
    pathname: '/',
    page: 'home',
    title: 'Stellan Solutions | Cybersecurity and risk advisory',
    description: 'Cybersecurity and risk advisory for mid-sized organizations: security assessments, prioritized roadmaps, compliance readiness, and fractional CISO support.',
    keywords: ['cybersecurity advisory', 'risk advisory', 'vCISO', 'security assessment', 'NIST CSF', 'ISO 27001', 'CMMC']
  },
  {
    pathname: '/services',
    page: 'services',
    title: 'Cybersecurity and advisory services | Stellan Solutions',
    description: 'Security assessments, compliance readiness, fractional CISO support, cloud architecture, managed IT, networks, automation, AI, and secure web development.',
    keywords: ['cybersecurity services', 'security assessment', 'compliance readiness', 'IT consulting', 'cloud services']
  },
  {
    pathname: '/services/cybersecurity',
    page: 'cybersecurity' as PageKey,
    title: 'Cybersecurity Services | Stellan Solutions',
    description: 'Penetration testing, managed SOC, cloud security, Zero Trust and compliance support from Stellan Solutions. Reduce risk and respond faster.',
    keywords: ['cybersecurity services', 'penetration testing', 'managed SOC', 'Zero Trust', 'compliance', 'vulnerability assessment']
  },
  {
    pathname: '/about',
    page: 'about',
    title: 'About Stellan Solutions | Cybersecurity and risk advisory',
    description: 'Meet Umair Mazhar, founder of Stellan Solutions, and learn how two decades of security experience shape our advisory work.',
    keywords: ['Umair Mazhar', 'security consultant', 'CISM', 'CRISC', 'ISO 27001', 'Ashburn Virginia']
  },
  {
    pathname: '/contact',
    page: 'contact',
    title: 'Contact Stellan Solutions | Book a security conversation',
    description: 'Contact Stellan Solutions in Ashburn, Virginia. Email info@stellansolutions.com, book a 30-minute call, or send a security or advisory question. Reply within one business day.',
    keywords: ['contact security consultant', 'book security call', 'Ashburn Virginia cybersecurity']
  },
  {
    pathname: '/privacy',
    page: 'privacy',
    title: 'Privacy | Stellan Solutions',
    description: 'Read the Stellan Solutions website privacy overview, including contact-form data, locally served assets, and operational responsibilities.',
    keywords: ['Stellan Solutions privacy', 'website privacy notice']
  },
  {
    pathname: '/terms',
    page: 'terms',
    title: 'Terms | Stellan Solutions',
    description: 'Read the terms that apply to the Stellan Solutions website, content, and advisory enquiries.',
    keywords: ['Stellan Solutions terms', 'website terms']
  }
];

const isServiceSlug = (value: string): value is ServiceSlug => serviceSlugs.includes(value as ServiceSlug);

function organization(siteUrl: string): JsonLd {
  return {
    '@type': 'ProfessionalService',
    '@id': `${siteUrl}/#organization`,
    name: siteConfig.name,
    url: siteUrl,
    logo: `${siteUrl}/favicon.svg`,
    image: `${siteUrl}/og-cover.png`,
    description: siteConfig.description,
    email: siteConfig.contactEmail,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ashburn',
      addressRegion: 'VA',
      postalCode: '20147',
      addressCountry: 'US'
    },
    areaServed: {
      '@type': 'Country',
      name: 'United States'
    },
    founder: {
      '@type': 'Person',
      name: founder.name,
      jobTitle: founder.role,
      knowsAbout: founder.certifications,
      sameAs: [founder.linkedin]
    },
    knowsAbout: services.map((service) => service.title),
    sameAs: siteConfig.socials.filter((social) => social.href.startsWith('http')).map((social) => social.href),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: siteConfig.contactEmail,
      availableLanguage: ['en'],
      areaServed: 'US'
    },
    priceRange: '$$'
  };
}

function webPage(pathname: string, title: string, description: string, siteUrl: string, noindex = false, type: 'WebPage' | 'CollectionPage' = 'WebPage'): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    name: title,
    description,
    url: `${siteUrl}${pathname === '/' ? '/' : pathname}`,
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.name,
      url: siteUrl
    },
    ...(noindex ? { robots: 'noindex,nofollow' } : {})
  };
}

function breadcrumbList(pathname: string, title: string, siteUrl: string): JsonLd {
  const parentPath = pathname.startsWith('/services/') ? '/services' : '/';
  const parentName = parentPath === '/services' ? 'Services' : 'Home';
  const items = [
    { name: 'Home', path: '/' },
    ...(parentPath === '/' ? [] : [{ name: parentName, path: parentPath }]),
    { name: title.split(' | ', 1)[0] ?? title, path: pathname }
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`
    }))
  };
}

function faqPage(items: readonly { question: string; answer: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  };
}

function createMetadata(input: {
  title: string;
  description: string;
  pathname: string;
  siteUrl: string;
  keywords: string[];
  structuredType?: 'WebPage' | 'CollectionPage';
  ogType?: 'website' | 'article';
  noindex?: boolean;
  jsonLd?: JsonLd[];
}): PageMetadata {
  const pathname = normalizePathname(input.pathname);
  const noindex = Boolean(input.noindex || !isIndexableSiteUrl(input.siteUrl));

  return {
    title: input.title,
    description: input.description,
    pathname,
    ogType: input.ogType ?? 'website',
    keywords: input.keywords,
    noindex,
    jsonLd: [
      ...(input.jsonLd ?? []),
      {
        '@context': 'https://schema.org',
        ...organization(input.siteUrl)
      },
      webPage(pathname, input.title, input.description, input.siteUrl, noindex, input.structuredType),
      breadcrumbList(pathname, input.title, input.siteUrl)
    ]
  };
}

function staticRoute(page: StaticPage, siteUrl: string): RouteDefinition {
  let pageStructuredData: JsonLd[] | undefined;

  if (page.page === 'home') {
    pageStructuredData = [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: siteConfig.name,
        url: siteUrl,
        description: siteConfig.description,
        publisher: organization(siteUrl)
      }
    ];
  } else if (page.page === 'services') {
    pageStructuredData = [faqPage(servicesPageFaqs)];
  } else if (page.page === 'contact') {
    pageStructuredData = [faqPage(contactPageFaqs)];
  } else if (page.page === 'cybersecurity') {
    pageStructuredData = [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Cybersecurity Services',
        serviceType: 'Cybersecurity',
        description: 'Penetration testing, managed SOC, cloud security, Zero Trust and compliance support from Stellan Solutions. Reduce risk and respond faster.',
        provider: organization(siteUrl),
        areaServed: { '@type': 'Country', name: 'United States' }
      },
      faqPage([
        { question: 'Which security frameworks do you work with?', answer: 'We work with NIST CSF, ISO 27001, SOC 2, CIS Controls, HIPAA, and CMMC.' },
        { question: 'Do you provide ongoing security monitoring or a vCISO?', answer: 'Yes. Monitoring can be included as a defined service layer, and our vCISO retainer provides senior security leadership, governance, risk reporting, and an accountable owner for the program.' },
        { question: 'Can you help us prepare for a customer security review or audit?', answer: 'Yes. We organize evidence, clarify control ownership, identify gaps, and build a prioritized remediation path mapped to the relevant framework.' }
      ])
    ];
  }

  return {
    pathname: page.pathname,
    page: page.page,
    status: 200,
    metadata: createMetadata({
      title: page.title,
      description: page.description,
      pathname: page.pathname,
      siteUrl,
      keywords: page.keywords,
      structuredType: page.page === 'services' || page.page === 'cybersecurity' ? 'CollectionPage' : undefined,
      jsonLd: pageStructuredData
    })
  };
}

function serviceRoute(service: Service, siteUrl: string): RouteDefinition {
  const pathname = `/services/${service.slug}`;
  const serviceStructuredData: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.description,
    serviceType: service.title,
    url: `${siteUrl}${pathname}`,
    provider: organization(siteUrl)
  };

  return {
    pathname,
    page: 'service',
    status: 200,
    service,
    metadata: createMetadata({
      title: `${service.title} for modern teams | Stellan Solutions`,
      description: service.description,
      pathname,
      siteUrl,
      keywords: [service.title, ...service.tags],
      jsonLd: [serviceStructuredData, faqPage(service.faqs)]
    })
  };
}

function notFoundRoute(siteUrl: string): RouteDefinition {
  const title = 'Page not found | Stellan Solutions';
  const description = 'The requested Stellan Solutions page could not be found. Explore services or contact information instead.';
  return {
    pathname: '/404',
    page: 'not-found',
    status: 404,
    metadata: createMetadata({
      title,
      description,
      pathname: '/404',
      siteUrl,
      keywords: ['page not found'],
      noindex: true
    })
  };
}

export function resolveRoute(pathname: string, siteUrl = siteConfig.siteUrl): RouteDefinition {
  const normalizedPath = normalizePathname(pathname);
  const normalizedSiteUrl = normalizeSiteUrl(siteUrl);
  const staticPage = staticPages.find((page) => page.pathname === normalizedPath);
  if (staticPage) {
    return staticRoute(staticPage, normalizedSiteUrl);
  }

  if (normalizedPath.startsWith('/services/')) {
    const slug = normalizedPath.slice('/services/'.length);
    const service = isServiceSlug(slug) ? getService(slug) : undefined;
    if (service) {
      return serviceRoute(service, normalizedSiteUrl);
    }
  }

  return notFoundRoute(normalizedSiteUrl);
}

export function normalizeRoute(route: RouteDefinition | string, siteUrl = siteConfig.siteUrl): RouteDefinition {
  if (typeof route !== 'string') {
    const normalizedPath = normalizePathname(route.pathname);
    if (normalizedPath === route.pathname) {
      return route;
    }
    return resolveRoute(normalizedPath, siteUrl);
  }

  return resolveRoute(route, siteUrl);
}

export function getStaticRoutes(siteUrl = siteConfig.siteUrl): RouteDefinition[] {
  const normalizedSiteUrl = normalizeSiteUrl(siteUrl);
  return [
    ...staticPages.map((page) => staticRoute(page, normalizedSiteUrl)),
    ...serviceSlugs
      .filter((slug) => slug !== 'cybersecurity')
      .map((slug) => serviceRoute(getService(slug) as Service, normalizedSiteUrl))
  ];
}

export function getStaticRoutePaths(siteUrl = siteConfig.siteUrl): string[] {
  return getStaticRoutes(siteUrl).map((route) => route.pathname);
}

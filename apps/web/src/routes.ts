import { contactPageFaqs, getService, serviceSlugs, servicesPageFaqs, type Service, type ServiceSlug } from './content.ts';
import { isIndexableSiteUrl, normalizePathname, normalizeSiteUrl, siteConfig } from './site.ts';

export type JsonLd = Record<string, unknown>;

export interface PageMetadata {
  title: string;
  description: string;
  pathname: string;
  ogType: 'website';
  keywords: string[];
  noindex: boolean;
  jsonLd: JsonLd[];
}

export type PageKey = 'home' | 'services' | 'service' | 'about' | 'contact' | 'privacy' | 'not-found';

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
    title: 'Stellan Solutions | Technology services for modern teams',
    description: 'Stellan Solutions helps teams make technology clearer, safer, and more capable through practical services spanning cloud, security, automation, AI, and web engineering.',
    keywords: ['technology services', 'technology partner', 'managed IT', 'cloud services', 'cybersecurity']
  },
  {
    pathname: '/services',
    page: 'services',
    title: 'Technology services | Stellan Solutions',
    description: 'Explore Stellan Solutions services for managed IT, cloud architecture, cybersecurity, networks, consulting, automation, governed AI, and secure web development.',
    keywords: ['technology consulting', 'IT services', 'cloud architecture', 'cybersecurity', 'enterprise automation']
  },
  {
    pathname: '/about',
    page: 'about',
    title: 'About Stellan Solutions | Technology, made legible',
    description: 'Learn how Stellan Solutions approaches technology delivery through clear decisions, careful operations, and remote partnership with distributed teams.',
    keywords: ['technology strategy', 'remote technology delivery', 'distributed technology team']
  },
  {
    pathname: '/contact',
    page: 'contact',
    title: 'Contact Stellan Solutions | Start a technology conversation',
    description: 'Tell Stellan Solutions about a technology challenge, service question, or project. Share the context, constraints, and desired outcome for a practical first conversation.',
    keywords: ['contact technology team', 'technology project inquiry', 'remote technology services']
  },
  {
    pathname: '/privacy',
    page: 'privacy',
    title: 'Privacy | Stellan Solutions',
    description: 'Read the Stellan Solutions website privacy overview, including contact-form data, locally served assets, and operational responsibilities.',
    keywords: ['Stellan Solutions privacy', 'website privacy notice']
  }
];

const isServiceSlug = (value: string): value is ServiceSlug => serviceSlugs.includes(value as ServiceSlug);

function organization(siteUrl: string): JsonLd {
  return {
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteUrl,
    logo: `${siteUrl}/favicon.svg`,
    description: siteConfig.description
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
  noindex?: boolean;
  jsonLd?: JsonLd[];
}): PageMetadata {
  const pathname = normalizePathname(input.pathname);
  const noindex = Boolean(input.noindex || !isIndexableSiteUrl(input.siteUrl));

  return {
    title: input.title,
    description: input.description,
    pathname,
    ogType: 'website',
    keywords: input.keywords,
    noindex,
    jsonLd: [
      ...(input.jsonLd ?? []),
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
      structuredType: page.page === 'services' ? 'CollectionPage' : undefined,
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
    ...serviceSlugs.map((slug) => serviceRoute(getService(slug) as Service, normalizedSiteUrl))
  ];
}

export function getStaticRoutePaths(siteUrl = siteConfig.siteUrl): string[] {
  return getStaticRoutes(siteUrl).map((route) => route.pathname);
}

export function getAllRoutePaths(siteUrl = siteConfig.siteUrl): string[] {
  return [...getStaticRoutePaths(siteUrl), '/404'];
}

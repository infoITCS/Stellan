import { services } from './content.ts';

const runtimeEnv = (import.meta as ImportMeta & { env?: ImportMetaEnv }).env ?? {};
const productionSiteUrl = 'https://stellansolutions.com';
const defaultSiteUrl = runtimeEnv.MODE === 'production' ? productionSiteUrl : 'http://localhost:4173';

export interface NavigationItem {
  label: string;
  href: string;
  description?: string;
  children?: readonly NavigationChildItem[];
}

export interface NavigationChildItem {
  label: string;
  href: string;
  description?: string;
}

export const servicesNavigation: readonly NavigationChildItem[] = [
  { label: 'Cybersecurity', href: '/services/cybersecurity', description: 'Assessments, SOC, Zero Trust, compliance' },
  ...services.filter((s) => s.slug !== 'cybersecurity').map((service) => ({
    label: service.shortTitle,
    href: `/services/${service.slug}`,
    description: service.eyebrow
  }))
];

export const siteConfig = {
  name: 'Stellan Solutions',
  shortName: 'Stellan',
  siteUrl: runtimeEnv.VITE_SITE_URL || runtimeEnv.SITE_URL || runtimeEnv.WEB_ORIGIN || defaultSiteUrl,
  leadsEndpoint: runtimeEnv.VITE_LEADS_ENDPOINT || '/api/v1/leads',
  bookingUrl: runtimeEnv.VITE_BOOKING_URL || '',
  description: 'Cybersecurity and risk advisory for mid-sized organizations: assessments, roadmaps, compliance readiness, and fractional CISO support.',
  contactEmail: 'info@stellansolutions.com',
  address: 'Ashburn, Virginia 20147',
  responseTime: 'Reply within 1 business day',
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/', icon: 'linkedin' as const },
    { label: 'X', href: 'https://x.com/', icon: 'external' as const },
    { label: 'Email', href: 'mailto:info@stellansolutions.com', icon: 'mail' as const }
  ],
  navigation: [
    {
      label: 'Services',
      href: '/services',
      description: 'Cybersecurity and advisory work first, backed by the technical services that keep it operating.',
      children: servicesNavigation
    },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' }
  ] satisfies readonly NavigationItem[]
} as const;

export function getBookingUrl(): string {
  const configured = siteConfig.bookingUrl.trim();
  return configured || '/contact#contact-form';
}

export function isExternalBooking(): boolean {
  return /^https?:\/\//i.test(getBookingUrl());
}

export function normalizePathname(value: string): string {
  let pathname = value.trim();

  try {
    pathname = new URL(value, 'http://stellan.local').pathname;
  } catch {
    pathname = value.split(/[?#]/, 1)[0] ?? '/';
  }

  const segments = pathname
    .split('/')
    .filter(Boolean)
    .map((segment) => {
      try {
        return decodeURIComponent(segment);
      } catch {
        return segment;
      }
    });

  return segments.length === 0 ? '/' : `/${segments.join('/')}`;
}

export function normalizeSiteUrl(value: string): string {
  const candidate = value.trim() || defaultSiteUrl;
  const url = new URL(candidate);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
    throw new Error('Site URL must use http or https without credentials');
  }
  url.hash = '';
  url.search = '';
  url.pathname = url.pathname.replace(/\/+$/, '');
  return url.toString().replace(/\/$/, '');
}

export function isIndexableSiteUrl(value: string): boolean {
  try {
    const url = new URL(normalizeSiteUrl(value));
    const localHosts = new Set(['localhost', '127.0.0.1', '::1', '[::1]']);
    return url.protocol === 'https:' && !localHosts.has(url.hostname) && !url.username && !url.password;
  } catch {
    return false;
  }
}

export function canonicalUrl(siteUrl: string, pathname: string): string {
  const base = normalizeSiteUrl(siteUrl);
  const path = normalizePathname(pathname);
  return `${base}${path === '/' ? '/' : path}`;
}

const defaultLeadsEndpoint = '/api/v1/leads';

function endpointPath(endpoint: string): string | undefined {
  if (endpoint.startsWith('//') || endpoint.includes('\\')) {
    return undefined;
  }

  if (/^https?:\/\//i.test(endpoint)) {
    try {
      const configuredUrl = new URL(endpoint);
      const path = `${configuredUrl.pathname}${configuredUrl.search}`;
      return path.startsWith('//') || path.includes('\\') ? undefined : path;
    } catch {
      return undefined;
    }
  }

  return endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
}

export function getLeadsEndpoint(): string {
  const endpoint = siteConfig.leadsEndpoint.trim() || defaultLeadsEndpoint;
  const path = endpointPath(endpoint);
  if (!path) {
    return defaultLeadsEndpoint;
  }

  if (/^https?:\/\//i.test(endpoint)) {
    if (typeof window === 'undefined') {
      return path;
    }

    try {
      return new URL(endpoint).origin === window.location.origin ? path : defaultLeadsEndpoint;
    } catch {
      return defaultLeadsEndpoint;
    }
  }

  return path;
}

export function getLeadsEndpointLabel(): string {
  const endpoint = siteConfig.leadsEndpoint.trim() || defaultLeadsEndpoint;
  return endpointPath(endpoint) || defaultLeadsEndpoint;
}

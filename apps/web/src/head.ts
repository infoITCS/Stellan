import type { PageMetadata } from './routes.ts';
import { canonicalUrl, normalizeSiteUrl, siteConfig } from './site.ts';

const attributeEscape = (value: string): string => value
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

const jsonLdScript = (value: unknown): string => {
  const serialized = JSON.stringify(value)
    .replaceAll('&', '\\u0026')
    .replaceAll('<', '\\u003c')
    .replaceAll('>', '\\u003e');
  return `<script type="application/ld+json" data-stellan-head>${serialized}</script>`;
};

export function renderHead(metadata: PageMetadata, siteUrl = siteConfig.siteUrl): string {
  const normalizedSiteUrl = normalizeSiteUrl(siteUrl);
  const canonical = canonicalUrl(normalizedSiteUrl, metadata.pathname);
  const image = new URL('/og-cover.png', `${normalizedSiteUrl}/`).toString();
  const robots = metadata.noindex ? 'noindex,nofollow' : 'index,follow';
  const tags = [
    `<title>${attributeEscape(metadata.title)}</title>`,
    `<meta name="description" content="${attributeEscape(metadata.description)}" />`,
    `<link rel="canonical" href="${attributeEscape(canonical)}" />`,
    `<meta name="robots" content="${robots}" />`,
    `<meta name="author" content="${siteConfig.name}" />`,
    `<meta property="og:site_name" content="${siteConfig.name}" />`,
    `<meta property="og:locale" content="en" />`,
    `<meta property="og:type" content="${metadata.ogType}" />`,
    `<meta property="og:title" content="${attributeEscape(metadata.title)}" />`,
    `<meta property="og:description" content="${attributeEscape(metadata.description)}" />`,
    `<meta property="og:url" content="${attributeEscape(canonical)}" />`,
    `<meta property="og:image" content="${attributeEscape(image)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${siteConfig.name} — cybersecurity and risk advisory" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${attributeEscape(metadata.title)}" />`,
    `<meta name="twitter:description" content="${attributeEscape(metadata.description)}" />`,
    `<meta name="twitter:image" content="${attributeEscape(image)}" />`,
    `<meta name="twitter:image:alt" content="${siteConfig.name} — cybersecurity and risk advisory" />`,
    `<meta name="keywords" content="${attributeEscape(metadata.keywords.join(', '))}" />`,
    ...metadata.jsonLd.map(jsonLdScript)
  ];

  return tags.join('');
}

export function applyHead(metadata: PageMetadata, siteUrl = siteConfig.siteUrl): void {
  if (typeof document === 'undefined') {
    return;
  }

  document.head.querySelectorAll('title, meta[name="description"], link[rel="canonical"], meta[name="robots"], meta[name="author"], meta[property^="og:"], meta[name^="twitter:"], meta[name="keywords"], script[data-stellan-head]').forEach((element) => element.remove());

  const template = document.createElement('template');
  template.innerHTML = renderHead(metadata, siteUrl);
  template.content.querySelectorAll('*').forEach((element) => {
    element.setAttribute('data-stellan-head', 'true');
    document.head.append(element);
  });
}

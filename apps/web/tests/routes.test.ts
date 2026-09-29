import assert from 'node:assert/strict';
import test from 'node:test';
import { serviceSlugs, services } from '../src/content.ts';
import { getStaticRoutePaths, resolveRoute } from '../src/routes.ts';
import { renderHead } from '../src/head.ts';
import { getLeadsEndpoint, getLeadsEndpointLabel, isIndexableSiteUrl } from '../src/site.ts';

test('service routes and content are unique and complete', () => {
  assert.equal(new Set(serviceSlugs).size, 8);
  assert.equal(services.length, 8);
  assert.equal(new Set(services.map((service) => service.slug)).size, services.length);
  assert.equal(new Set(services.map((service) => service.h1)).size, services.length);
  assert.equal(new Set(services.map((service) => service.description)).size, services.length);
  assert.equal(new Set(services.map((service) => resolveRoute(`/services/${service.slug}`).metadata.title)).size, services.length);
  for (const service of services) {
    assert.ok(service.title.length > 0);
    assert.ok(service.overview.length >= 2);
    assert.ok(service.capabilities.length >= 6 && service.capabilities.length <= 8);
    assert.equal(service.outcomes.length, 4);
    assert.equal(service.process.length, 4);
    assert.ok(service.faqs.length >= 4);
    assert.equal(service.related.length, 3);
    assert.ok(service.related.includes(service.slug) === false);
  }
});

test('route resolution normalizes paths and rejects unknown routes', () => {
  assert.equal(resolveRoute('/').pathname, '/');
  assert.equal(resolveRoute('/services/').pathname, '/services');
  assert.equal(resolveRoute('/services/managed-it?from=nav').pathname, '/services/managed-it');
  for (const pathname of ['/insights', '/insights/cloud-cost-control', '/insights/security-readiness', '/insights/governed-ai']) {
    assert.equal(resolveRoute(pathname).status, 404);
  }
  assert.equal(resolveRoute('/services/not-a-service').status, 404);
  assert.equal(resolveRoute('/unknown').pathname, '/404');
  assert.equal(resolveRoute('/unknown').metadata.pathname, '/404');
  assert.equal(resolveRoute('/services/managed-it').metadata.jsonLd.length > 0, true);
  assert.ok(getLeadsEndpoint().startsWith('/'));
  assert.ok(getLeadsEndpointLabel().startsWith('/'));
  const productionServiceRoute = resolveRoute('/services/cloud-services', 'https://example.com/');
  assert.equal(productionServiceRoute.metadata.jsonLd[0]?.url, 'https://example.com/services/cloud-services');
  assert.equal(productionServiceRoute.metadata.noindex, false);
  assert.equal(resolveRoute('/services/managed-it').metadata.noindex, true);
  assert.equal(isIndexableSiteUrl('http://localhost:4173'), false);
  assert.equal(isIndexableSiteUrl('https://stellan.example'), true);
  assert.throws(() => resolveRoute('/', 'javascript:alert(1)'), /Site URL/);
  assert.equal(resolveRoute('/services').metadata.jsonLd.some((item) => item['@type'] === 'CollectionPage'), true);
  assert.equal(resolveRoute('/services/managed-it').metadata.jsonLd.some((item) => item['@type'] === 'FAQPage'), true);
  assert.equal(resolveRoute('/services/managed-it').metadata.jsonLd.some((item) => item['@type'] === 'BreadcrumbList'), true);
  const serviceHead = renderHead(resolveRoute('/services/managed-it', 'https://example.com/').metadata, 'https://example.com/');
  assert.match(serviceHead, /<title>Managed IT for modern teams \| Stellan Solutions<\/title>/);
  assert.match(serviceHead, /<link rel="canonical" href="https:\/\/example\.com\/services\/managed-it" \/>/);
  assert.match(serviceHead, /<meta name="robots" content="index,follow" \/>/);
  assert.match(serviceHead, /<meta property="og:type" content="website" \/>/);
  assert.match(serviceHead, /<script type="application\/ld\+json" data-stellan-head>/);
  assert.match(renderHead(resolveRoute('/').metadata), /<meta name="robots" content="noindex,nofollow" \/>/);
  assert.equal(new Set(getStaticRoutePaths()).size, getStaticRoutePaths().length);
  assert.equal(getStaticRoutePaths().length, 13);
  assert.equal(getStaticRoutePaths().some((pathname) => pathname.startsWith('/insights')), false);
  for (const pathname of getStaticRoutePaths()) {
    assert.ok(resolveRoute(pathname).metadata.jsonLd.length > 0);
  }
});

import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const workspaceRoot = resolve(appRoot, '../..');
if (existsSync(resolve(workspaceRoot, '.env'))) process.loadEnvFile(resolve(workspaceRoot, '.env'));
const clientRoot = resolve(appRoot, '../../dist/web');
const serverRoot = resolve(appRoot, '../../dist/server');
const templatePath = resolve(clientRoot, 'index.html');
const serverBundlePath = resolve(serverRoot, 'entry-server.js');
const configuredSiteUrl = (process.env.VITE_SITE_URL || '').trim();
const siteUrl = (configuredSiteUrl || 'https://stellansolutions.com').replace(/\/+$/, '');

function fail(message) {
  throw new Error(`Generation failed: ${message}`);
}

function normalizePath(value) {
  const path = value.split(/[?#]/, 1)[0] || '/';
  const normalized = `/${path.split('/').filter(Boolean).join('/')}`;
  return normalized || '/';
}

function outputPath(pathname) {
  if (pathname === '/') return 'index.html';
  return `${pathname.slice(1)}/index.html`;
}

function escapeXml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
}

function escapeAttribute(value) {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function removeTemplateMetadata(template) {
  return template
    .replace(/<title>[\s\S]*?<\/title>/gi, '')
    .replace(/<meta\b[^>]*(?:name|property)=["'](?:description|robots|author|og:[^"']+|twitter:[^"']+|keywords)["'][^>]*\/?>/gi, '')
    .replace(/<link\b[^>]*rel=["']canonical["'][^>]*\/?>/gi, '')
    .replace(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, '');
}

function injectDocument(template, rendered) {
  const rootPattern = /<div\s+id=["']app["'][^>]*>[\s\S]*?<\/div>(?=\s*(?:<script\b|<\/body>))/i;
  if (!rootPattern.test(template)) {
    fail('The built Vite template does not contain the expected #app root.');
  }

  const appRoot = `<div id="app" data-route="${escapeAttribute(rendered.route.pathname)}" data-status="${rendered.route.status}">${rendered.html}</div>`;
  const withRoot = template.replace(rootPattern, appRoot);
  return withRoot.replace(/<\/head>/i, `${rendered.head}</head>`);
}

function countMatches(value, expression) {
  return [...value.matchAll(expression)].length;
}

function validateHtml(html, route, generatedPaths) {
  const h1Count = countMatches(html, /<h1\b[^>]*>/gi);
  if (h1Count !== 1) fail(`${route.pathname} rendered ${h1Count} H1 elements; expected exactly one.`);
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  if (!title) fail(`${route.pathname} rendered an empty title.`);
  const description = html.match(/<meta\s+name="description"\s+content="([^"]*)"\s*\/?\s*>/i)?.[1]?.trim();
  if (!description) fail(`${route.pathname} rendered an empty description.`);
  const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]*)"\s*\/?\s*>/i)?.[1]?.trim();
  if (!canonical) fail(`${route.pathname} rendered no canonical URL.`);
  try {
    const canonicalPath = new URL(canonical).pathname.replace(/\/$/, '') || '/';
    const expectedPath = route.pathname === '/' ? '/' : route.pathname;
    if (canonicalPath !== expectedPath) fail(`${route.pathname} rendered the wrong canonical path: ${canonical}`);
  } catch {
    fail(`${route.pathname} rendered an invalid canonical URL: ${canonical}`);
  }
  if (countMatches(html, /<script\b[^>]*type="application\/ld\+json"/gi) < 1) fail(`${route.pathname} rendered no JSON-LD.`);
  if (/\b(?:lorem|placeholder|TODO|TBD)\b/i.test(html)) fail(`${route.pathname} rendered placeholder or unfinished text.`);

  for (const match of html.matchAll(/<a\b[^>]*href=["']([^"']+)["']/gi)) {
    const href = match[1];
    if (href.startsWith('#') || /^(?:mailto|tel|https?:|data:|\/\/)/i.test(href)) continue;
    const targetPath = normalizePath(href);
    if (!generatedPaths.has(targetPath)) fail(`${route.pathname} links to an ungenerated internal path: ${href}`);
  }
}

async function loadServer() {
  const candidates = [serverBundlePath, serverBundlePath.replace(/\.js$/, '.mjs')];
  let lastError;
  for (const candidate of candidates) {
    try {
      const module = await import(`${pathToFileURL(candidate).href}?generation=${Date.now()}`);
      if (typeof module.render === 'function' && typeof module.getStaticRoutePaths === 'function' && typeof module.isIndexableSiteUrl === 'function') return module;
    } catch (error) {
      lastError = error;
    }
  }
  fail(`could not load the SSR bundle at ${serverBundlePath}. ${lastError instanceof Error ? lastError.message : ''}`);
}

async function main() {
  let template;
  let manifest;
  try {
    template = await readFile(templatePath, 'utf8');
  } catch {
    fail(`missing Vite template at ${templatePath}; run build:client first.`);
  }

  const manifestCandidates = [resolve(clientRoot, '.vite/manifest.json'), resolve(clientRoot, 'manifest.json')];
  for (const candidate of manifestCandidates) {
    try {
      manifest = JSON.parse(await readFile(candidate, 'utf8'));
      break;
    } catch {
      manifest = undefined;
    }
  }
  if (!manifest || typeof manifest !== 'object') fail('missing the Vite client manifest; run build:client first.');
  const manifestEntry = manifest['index.html'];
  if (!manifestEntry || typeof manifestEntry.file !== 'string') fail('the Vite client manifest has no index.html entry.');
  const manifestAssets = [manifestEntry.file, ...(Array.isArray(manifestEntry.css) ? manifestEntry.css : [])];
  for (const asset of manifestAssets) {
    if (typeof asset !== 'string') fail('the Vite client manifest contains an invalid asset entry.');
    try {
      await readFile(resolve(clientRoot, asset), 'utf8');
    } catch {
      fail(`the Vite client manifest references a missing asset: ${asset}`);
    }
  }

  const server = await loadServer();
  const indexableSite = server.isIndexableSiteUrl(siteUrl);
  const staticPaths = server.getStaticRoutePaths(siteUrl).map(normalizePath);
  const generatedPaths = new Set([...staticPaths, '/404']);
  const preparedTemplate = removeTemplateMetadata(template);
  const renderedPages = [];

  for (const pathname of staticPaths) {
    const rendered = server.render(pathname, { siteUrl });
    validateHtml(`${rendered.head}${rendered.html}`, rendered.route, generatedPaths);
    const document = injectDocument(preparedTemplate, rendered);
    const target = resolve(clientRoot, outputPath(pathname));
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, document, 'utf8');
    renderedPages.push({ pathname, route: rendered.route });
  }

  const notFound = server.render('/404', { siteUrl });
  validateHtml(`${notFound.head}${notFound.html}`, notFound.route, generatedPaths);
  await writeFile(resolve(clientRoot, '404.html'), injectDocument(preparedTemplate, notFound), 'utf8');

  const sitemapPaths = indexableSite ? staticPaths : [];
  const sitemap = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', ...sitemapPaths.map((pathname) => `  <url><loc>${escapeXml(`${siteUrl}${pathname === '/' ? '/' : pathname}`)}</loc></url>`), '</urlset>', ''].join('\n');
  await writeFile(resolve(clientRoot, 'sitemap.xml'), sitemap, 'utf8');
  const robots = indexableSite
    ? `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`
    : 'User-agent: *\nDisallow: /\n';
  await writeFile(resolve(clientRoot, 'robots.txt'), robots, 'utf8');

  process.stdout.write(`Generated ${renderedPages.length} static routes plus 404.html, sitemap.xml, and robots.txt.\n`);
}

await main();

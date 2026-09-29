import { renderToString } from 'react-dom/server';
import { App } from './App.tsx';
import { renderHead } from './head.ts';
import { getStaticRoutePaths, resolveRoute, type RouteDefinition } from './routes.ts';
import { isIndexableSiteUrl, siteConfig } from './site.ts';

export { getStaticRoutePaths, isIndexableSiteUrl };

export interface RenderOptions {
  siteUrl?: string;
}

export interface RenderedPage {
  html: string;
  head: string;
  route: RouteDefinition;
}

export function render(pathname: string, options: RenderOptions = {}): RenderedPage {
  const siteUrl = options.siteUrl || siteConfig.siteUrl;
  const route = resolveRoute(pathname, siteUrl);
  return {
    html: renderToString(<App route={route} />),
    head: renderHead(route.metadata, siteUrl),
    route
  };
}

export default render;

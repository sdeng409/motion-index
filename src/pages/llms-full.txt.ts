import type { APIRoute } from 'astro';
import { EXAMPLES } from '../examples';
import { demoSource, siteUrl } from '../lib/build-sources';
import { exampleMarkdown } from '../lib/markdown';

export const GET: APIRoute = () => new Response(
  EXAMPLES.map((ex) => exampleMarkdown(ex, { demo: demoSource(ex.id), url: siteUrl(`${ex.id}/`) })).join('\n---\n\n'),
  { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
);

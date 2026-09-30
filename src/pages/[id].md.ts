import type { APIRoute, GetStaticPaths } from 'astro';
import { EXAMPLES } from '../examples';
import { demoSource, siteUrl } from '../lib/build-sources';
import { exampleMarkdown } from '../lib/markdown';
import type { Example } from '../lib/types';

export const getStaticPaths = (() => EXAMPLES.map((ex) => ({ params: { id: ex.id }, props: { ex } }))) satisfies GetStaticPaths;

export const GET: APIRoute<{ ex: Example }> = ({ props: { ex } }) => new Response(
  exampleMarkdown(ex, { demo: demoSource(ex.id), url: siteUrl(`${ex.id}/`) }),
  { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } },
);

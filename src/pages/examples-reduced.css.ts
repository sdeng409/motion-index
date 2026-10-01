import type { APIRoute } from 'astro';
import { previewCss } from '../lib/build-sources';

// 상세 창에서 '동작 줄이기로 보기'를 켰을 때 examples.css 대신 쓰는 판
export const GET: APIRoute = () => new Response(previewCss(true), { headers: { 'Content-Type': 'text/css; charset=utf-8' } });

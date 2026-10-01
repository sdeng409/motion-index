import type { APIRoute } from 'astro';
import { previewCss } from '../lib/build-sources';

// 모든 예제의 미리보기 CSS. 상세 창의 값 조정은 이 안의 var(--p-...)를 덮어써서 반영됨
export const GET: APIRoute = () => new Response(previewCss(), { headers: { 'Content-Type': 'text/css; charset=utf-8' } });

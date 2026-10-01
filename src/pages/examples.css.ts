import type { APIRoute } from 'astro';
import { previewCss } from '../lib/build-sources';
import { verifyExamples } from '../lib/verify-examples';

// 모든 예제의 미리보기 CSS. 상세 창의 값 조정은 이 안의 var(--p-...)를 덮어써서 반영됨
// 모든 페이지가 이 CSS를 쓰므로 예제 검사도 여기서 함
export const GET: APIRoute = () => {
  verifyExamples();
  return new Response(previewCss(), { headers: { 'Content-Type': 'text/css; charset=utf-8' } });
};

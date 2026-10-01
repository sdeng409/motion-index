// 빌드 때만 쓰는 도우미. 예제 JS 원문과 공개 주소, 미리보기 CSS를 만듦
import { EXAMPLES } from '../examples';
import { renderCss } from './shared';

const demos = import.meta.glob<string>('../examples/*/demo.js', { query: '?raw', import: 'default', eager: true });

export const demoSource = (id: string) => demos[`../examples/${id}/demo.js`] ?? '';

const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');

export const siteUrl = (path = '') => new URL(`${base}${path}`, import.meta.env.SITE).href;

// 모든 예제의 미리보기 CSS. reduced면 시스템 설정과 상관없이 동작 줄이기 규칙이 적용되는 판을 만듦
// 상세 창의 '동작 줄이기로 보기'가 두 판을 바꿔 끼움
export function previewCss(reduced = false) {
  const css = EXAMPLES.map((ex) => `/* ${ex.id} */\n${renderCss(ex)}`).join('\n\n');
  if (!reduced) return css;
  return css
    .replaceAll('(prefers-reduced-motion: reduce)', 'all')
    .replaceAll('(prefers-reduced-motion: no-preference)', 'not all');
}

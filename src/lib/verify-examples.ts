// 빌드 때 예제 데이터를 검사함. 하나라도 어기면 빌드가 실패해서 CI에서도 걸림
import readme from '../../README.md?raw';
import skillDoc from '../../skill/motion-index/SKILL.md?raw';
import { EXAMPLES } from '../examples';
import { BROWSERS, dedent, defaultValues } from './shared';
import type { Example } from './types';

// 동작 줄이기 블록이 없어도 되는 예제와 그 이유
const NO_REDUCE_BLOCK: Record<string, string> = {
  ripple: 'JS가 matchMedia로 설정을 확인해 물결을 만들지 않음',
  'read-progress': '스크롤 위치를 그대로 보여 주는 표시라 줄일 움직임이 없음',
};

// "동작 줄이기로 보기"가 이 두 문자열을 그대로 바꿔 끼우므로 다른 표기는 허용하지 않음
const REDUCE_QUERIES = ['(prefers-reduced-motion: reduce)', '(prefers-reduced-motion: no-preference)'];

function checkExample(ex: Example) {
  const errors: string[] = [];
  const params = ex.params || [];
  const keys = new Set([...params.map((p) => p.key), ...Object.keys(ex.derive?.(defaultValues(ex)) ?? {})]);
  const used = new Set([...ex.css.matchAll(/\{\{([\w-]+)\}\}/g)].map((m) => m[1]));

  used.forEach((key) => { if (!keys.has(key)) errors.push(`CSS의 {{${key}}}에 맞는 조정 값이 없음`); });
  // derive가 있으면 조정 값이 계산을 거쳐 CSS에 들어가므로 직접 쓰이지 않아도 됨
  if (!ex.derive) params.forEach((p) => { if (!used.has(p.key)) errors.push(`조정 값 '${p.key}'가 CSS에 쓰이지 않음`); });

  params.forEach((p) => {
    if (p.type === 'easing') return;
    if (p.value < p.min || p.value > p.max) errors.push(`'${p.key}' 기본값 ${p.value}가 범위(${p.min}~${p.max}) 밖임`);
    const steps = (p.value - p.min) / p.step;
    if (Math.abs(steps - Math.round(steps)) > 1e-6) errors.push(`'${p.key}' 기본값 ${p.value}가 step ${p.step} 간격에 맞지 않음`);
  });

  const htmlIds = [...ex.html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  // instanceHtml이 ids를 부분 문자열로 바꾸므로 'menu-demo'가 있으면 'menu-demo-title'도 함께 바뀜
  htmlIds.forEach((id) => {
    if (!ex.ids?.some((base) => id.includes(base))) errors.push(`HTML의 id '${id}'가 ids에 없음 (썸네일과 상세 창에서 id가 겹침)`);
  });
  (ex.ids || []).forEach((id) => { if (!ex.html.includes(id)) errors.push(`ids의 '${id}'가 HTML에 없음`); });

  const queries = [...ex.css.matchAll(/\(prefers-reduced-motion[^)]*\)/g)].map((m) => m[0]);
  queries.forEach((q) => { if (!REDUCE_QUERIES.includes(q)) errors.push(`'${q}' 대신 '${REDUCE_QUERIES[0]}' 형태로 적어야 함`); });
  if (!queries.length && !NO_REDUCE_BLOCK[ex.id]) errors.push('prefers-reduced-motion 블록이 없음 (없어도 되면 NO_REDUCE_BLOCK에 이유를 적기)');

  if (/\.demo-[\w-]/.test(ex.css)) errors.push('CSS에 .demo-* 규칙이 있음 (미리보기 전용 스타일은 app.css에 둠)');
  // supportList가 'Chrome 113 · Edge 113 · Firefox 112 · Safari 17.2' 형식을 나눠 읽으므로 형식이 어긋나면 아이콘이 틀어짐
  const versions = Object.fromEntries(ex.support.split(' · ').map((entry) => entry.split(' ')));
  BROWSERS.forEach((name) => {
    if (!/^(\d+(\.\d+)?|미지원)$/.test(versions[name] ?? '')) errors.push(`support에 '${name} 버전' 또는 '${name} 미지원'이 없음`);
  });
  if (!dedent(ex.html).trim()) errors.push('HTML이 비어 있음');
  return errors;
}

// README와 skill 설명에 적힌 예제 개수가 실제 개수와 같은지 확인
function checkCounts() {
  const errors: string[] = [];
  const count = EXAMPLES.length;
  const sources: [string, string, RegExp][] = [
    ['README.md', readme, /웹 애니메이션 (\d+)가지/],
    ['skill/motion-index/SKILL.md', skillDoc, /\((\d+) CSS-first/],
  ];
  sources.forEach(([path, text, pattern]) => {
    const found = text.match(pattern)?.[1];
    if (Number(found) !== count) errors.push(`${path}에 적힌 개수(${found ?? '없음'})가 실제 예제 수(${count})와 다름`);
  });
  return errors;
}

function checkRegistry() {
  const errors: string[] = [];
  const folders = Object.keys(import.meta.glob('../examples/*/index.ts')).map((path) => path.split('/')[2]);
  const ids = EXAMPLES.map((ex) => ex.id);
  ids.filter((id, i) => ids.indexOf(id) !== i).forEach((id) => errors.push(`index.ts에 '${id}'가 두 번 들어 있음`));
  folders.filter((name) => !ids.includes(name)).forEach((name) => errors.push(`src/examples/${name}이 index.ts에 없음`));
  EXAMPLES.forEach((ex, i) => {
    if (!folders.includes(ex.id)) errors.push(`index.ts ${i}번째 예제의 id '${ex.id}'가 폴더 이름과 다름`);
  });
  return errors;
}

let verified = false;

export function verifyExamples() {
  if (verified) return;
  const errors = [
    ...checkRegistry(),
    ...checkCounts(),
    ...EXAMPLES.flatMap((ex) => checkExample(ex).map((message) => `[${ex.id}] ${message}`)),
  ];
  if (errors.length) throw new Error(`예제 검사 실패 ${errors.length}건\n- ${errors.join('\n- ')}`);
  verified = true;
}

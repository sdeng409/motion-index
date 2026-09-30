// 빌드(서버)와 브라우저 양쪽에서 쓰는 코드. DOM에 의존하지 않아야 함
import type { EasingParam, Example, Param, ParamValue } from './types';

export const SUPPORT = {
  animations: 'Chrome 43 · Edge 12 · Firefox 16 · Safari 9',
  transitions: 'Chrome 26 · Edge 12 · Firefox 16 · Safari 9',
  scrollDriven: 'Chrome 115 · Edge 115 · Safari 26 · Firefox 미지원',
  startingStyle: 'Chrome 117 · Edge 117 · Firefox 129 · Safari 17.5',
  gridAnimation: 'Chrome 107 · Edge 107 · Firefox 66 · Safari 16',
  registeredProperty: 'Chrome 85 · Edge 85 · Firefox 128 · Safari 16.4',
  motionPath: 'Chrome 55 · Edge 79 · Firefox 72 · Safari 16',
  shapeFunction: 'Chrome 135 · Edge 135 · Firefox 148 · Safari 18.4',
  popover: 'Chrome 116 · Edge 116 · Firefox 125 · Safari 17',
  steps: 'Chrome 77 · Edge 79 · Firefox 65 · Safari 14',
};

export const easing = (value: string): EasingParam => ({ key: 'easing', label: '속도 변화', type: 'easing', value });

// 질량 1인 스프링이 0에서 1로 가는 움직임을 계산해서 CSS linear() 곡선과 멈추기까지 걸린 시간을 돌려줌
export function springEasing(stiffness: number, damping: number) {
  const dt = 1 / 1000;
  const positions: number[] = [];
  let x = 0;
  let v = 0;
  while (positions.length < 5000) {
    v += (-stiffness * (x - 1) - damping * v) * dt;
    x += v * dt;
    positions.push(x);
    if (Math.abs(x - 1) < 0.001 && Math.abs(v) < 0.01) break;
  }
  const count = 60;
  const points = Array.from({ length: count + 1 }, (_, i) => {
    const value = positions[Math.round((i / count) * (positions.length - 1))];
    return Number(value.toFixed(3));
  });
  points[0] = 0;
  points[count] = 1;
  return { easing: `linear(${points.join(', ')})`, duration: positions.length };
}

export const SECTIONS = [
  { key: 'technique', title: '기법', desc: '어떤 요소에도 붙여 쓸 수 있는 애니메이션 방법입니다.' },
  { key: 'component', title: '컴포넌트', desc: '자주 쓰는 UI 부품에 맞춘 애니메이션입니다.' },
] as const;

export const sectionOf = (ex: Example) => ex.section ?? 'component';

export const COST_LABEL = { composite: 'Composite', paint: 'Paint', layout: 'Layout' } as const;

export const HINTS = {
  once: '마우스를 올리면 재생',
  loop: '마우스를 올리면 재생',
  interact: '직접 눌러 보세요',
  scroll: '스크롤해 보세요',
} as const;

export const EASING_PRESETS: [string, string][] = [
  ['ease', 'ease'],
  ['ease-out', 'ease-out'],
  ['ease-in-out', 'ease-in-out'],
  ['linear', 'linear'],
  ['cubic-bezier(0.2, 0.7, 0.2, 1)', '끝에서 천천히'],
  ['cubic-bezier(0.65, 0, 0.35, 1)', '천천히 → 빠르게 → 천천히'],
  ['cubic-bezier(0.34, 1.56, 0.64, 1)', '살짝 튕기며 멈춤'],
  [springEasing(170, 20).easing, '스프링 (부드럽게)'],
  [springEasing(300, 12).easing, '스프링 (통통)'],
];

export function dedent(text: string) {
  const lines = text.replace(/^\s*\n/, '').replace(/\s+$/, '').split('\n');
  const indents = lines.filter((line) => line.trim()).map((line) => line.match(/^ */)![0].length);
  const min = Math.min(...indents);
  return lines.map((line) => line.slice(min)).join('\n');
}

export function formatValue(param: Param, value: ParamValue) {
  if (param.type === 'easing') return String(value);
  const decimals = (String(param.step).split('.')[1] || '').length;
  return `${Number(Number(value).toFixed(decimals))}${param.unit}`;
}

export function defaultValues(ex: Example): Record<string, ParamValue> {
  return Object.fromEntries((ex.params || []).map((p) => [p.key, p.value]));
}

// 예제끼리 값이 섞이지 않도록 변수 이름에 예제 id를 넣음
export function varName(ex: Example, key: string) {
  return `--p-${ex.id}-${key}`;
}

// 조정 값을 그대로 쓰는 항목과, spring처럼 조정 값에서 계산되는 항목을 한 목록으로 돌려줌
export function resolvedValues(ex: Example, values: Record<string, ParamValue>) {
  const formatted: Record<string, string> = {};
  (ex.params || []).forEach((param) => {
    formatted[param.key] = formatValue(param, values[param.key]);
  });
  return { ...formatted, ...(ex.derive ? ex.derive(values) : {}) };
}

// values가 없으면 미리보기용: var(--p-id-키, 기본값) 형태라서 상세 창 스테이지에 준 값만 반영됨
// values가 있으면 코드 보기용: 사용자가 고른 값을 그대로 적음
export function renderCss(ex: Example, values?: Record<string, ParamValue>) {
  const resolved = resolvedValues(ex, values || defaultValues(ex));
  return dedent(ex.css).replace(/\{\{([\w-]+)\}\}/g, (_, key: string) => (
    values ? resolved[key] : `var(${varName(ex, key)}, ${resolved[key]})`
  ));
}

// 썸네일과 상세 창에 같은 예제가 두 번 들어가므로 id가 겹치지 않게 접미사를 붙임
export function instanceHtml(ex: Example, suffix: string) {
  let html = dedent(ex.html);
  for (const id of ex.ids || []) html = html.replaceAll(id, `${id}-${suffix}`);
  return html;
}

export function stageInnerHtml(ex: Example, suffix: string) {
  const html = instanceHtml(ex, suffix);
  return ex.kind === 'scroll'
    ? `<div class="demo-scroll" tabindex="0" aria-label="${ex.title} 미리보기, 스크롤 가능">${html}</div>`
    : `<div class="demo-center">${html}</div>`;
}

// Edge는 Chrome과 버전이 같아서 아이콘에서 뺌
export const BROWSERS = ['Chrome', 'Firefox', 'Safari'] as const;

// 'Chrome 113 · Edge 113 · Firefox 112 · Safari 17.2' 형태의 문자열을 브라우저별 지원 정보로 바꿈
export function supportList(ex: Example) {
  const versions = Object.fromEntries(ex.support.split(' · ').map((entry) => entry.split(' ')));
  return BROWSERS.map((name) => {
    const version = versions[name];
    const supported = Boolean(version) && version !== '미지원';
    return { name, supported, tip: supported ? `${name} ${version} 이상` : `${name} 미지원` };
  });
}

export function searchText(ex: Example) {
  return [ex.id, ex.title, ex.summary, ex.desc.replaceAll('`', ''), ex.spec.props].join(' ').toLowerCase();
}

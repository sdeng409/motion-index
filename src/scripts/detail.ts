import Prism from 'prismjs';
import {
  COST_LABEL, EASING_PRESETS, defaultValues, dedent, formatValue, renderCss, resolvedValues, varName,
} from '../lib/shared';
import type { EasingParam, Example, Param, ParamValue, RangeParam } from '../lib/types';
import { applyPrompt, exampleMarkdown } from '../lib/markdown';
import { createStage, play, prepareStage, restart } from './stage';

// 예제마다 chunk가 나뉘어서, 연 예제의 데이터만 받음
const exampleModules = import.meta.glob<Example>('../examples/*/index.ts', { import: 'default' });
const demoSources = import.meta.glob<string>('../examples/*/demo.js', { query: '?raw', import: 'default' });

async function loadExample(id: string) {
  const ex = await exampleModules[`../examples/${id}/index.ts`]();
  const loadDemo = demoSources[`../examples/${id}/demo.js`];
  return { ex, demo: loadDemo ? await loadDemo() : '' };
}

const detailSlot = document.getElementById('detail-stage-slot')!;
const detailReplay = document.getElementById('detail-replay') as HTMLButtonElement;
const detailTabs = document.getElementById('detail-tabs')!;
const detailCode = document.querySelector<HTMLElement>('#detail-code code')!;
const detailCopy = document.getElementById('detail-copy') as HTMLButtonElement;
const detailPrompt = document.getElementById('detail-prompt') as HTMLButtonElement;
const detailCaption = document.getElementById('detail-caption')!;
const tuner = document.getElementById('detail-tuner')!;
const tunerFields = document.getElementById('tuner-fields')!;

let current: Example;
let currentDemo = '';
let currentStage: HTMLElement | null = null;
let currentLang: Lang = 'html';
let currentValues: Record<string, ParamValue> = {};

const LANGS = [
  { key: 'html', label: 'HTML', prism: 'markup' },
  { key: 'css', label: 'CSS', prism: 'css' },
  { key: 'js', label: 'JS', prism: 'javascript' },
] as const;
type Lang = (typeof LANGS)[number]['key'];

function codeFor(ex: Example, key: Lang) {
  if (key === 'html') return dedent(ex.html);
  if (key === 'css') return ex.params ? renderCss(ex, currentValues) : dedent(ex.css);
  return currentDemo.trim();
}

function showCode(key: Lang) {
  currentLang = key;
  const lang = LANGS.find((l) => l.key === key)!;
  const code = codeFor(current, key);
  detailCode.innerHTML = Prism.highlight(code, Prism.languages[lang.prism], lang.prism);
  detailTabs.querySelectorAll<HTMLElement>('.tab').forEach((tab) => {
    const selected = tab.dataset.lang === key;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  detailCaption.hidden = key !== 'html' || !code.includes('demo-');
  detailCopy.textContent = '복사';
  detailPrompt.textContent = 'AI 프롬프트 복사';
}

// 목록의 모달은 빈 틀이라 제목·설명 등을 채움. 예제 페이지는 빌드 때 채워져 있음
function fillInfo(ex: Example) {
  document.getElementById('detail-title')!.textContent = ex.title;
  // 칩은 카드에 이미 그려진 것을 가져오고, 모달 안에서는 툴팁을 키보드로도 볼 수 있게 함
  const chips = document.querySelector(`.grid > li[data-id="${ex.id}"] .chips`)!.cloneNode(true) as HTMLElement;
  chips.querySelectorAll<HTMLElement>('.support').forEach((icon) => { icon.tabIndex = 0; });
  document.getElementById('detail-chips')!.replaceChildren(...chips.childNodes);
  // 설명 안에서 backtick으로 감싼 부분은 코드 모양으로 보여줌
  document.getElementById('detail-desc')!.replaceChildren(...ex.desc.split('`').map((part, index) => {
    if (index % 2 === 0) return part;
    const code = document.createElement('code');
    code.textContent = part;
    return code;
  }));

  const spec = document.getElementById('detail-spec')!;
  spec.replaceChildren();
  const rows: [string, string | undefined][] = [
    ['지속 시간', ex.spec.duration],
    ['Easing', ex.spec.easing],
    ['애니메이션 속성', ex.spec.props],
    ['렌더링 비용', COST_LABEL[ex.spec.cost]],
  ];
  rows.filter(([, value]) => value).forEach(([label, value]) => {
    const row = document.createElement('div');
    const dt = document.createElement('dt');
    const dd = document.createElement('dd');
    dt.textContent = label;
    dd.textContent = value!;
    row.append(dt, dd);
    spec.append(row);
  });
}

function setup(ex: Example, demo: string, stage: HTMLElement) {
  current = ex;
  currentDemo = demo;
  currentStage = stage;
  buildTuner(ex);
  const replayable = ex.kind !== 'interact' || ex.autoplay;
  detailReplay.hidden = !replayable;
  detailReplay.textContent = ex.kind === 'scroll' ? '맨 위로' : '다시 재생';

  detailTabs.replaceChildren();
  LANGS.filter((l) => codeFor(ex, l.key)).forEach((l) => {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'tab';
    tab.setAttribute('role', 'tab');
    tab.dataset.lang = l.key;
    tab.textContent = l.label;
    tab.addEventListener('click', () => showCode(l.key));
    detailTabs.append(tab);
  });
  showCode('html');
  if (ex.kind !== 'scroll') play(stage, ex.autoplay);
}

/* ---------- 값 조정 ---------- */
// View Transitions처럼 html에서 스타일을 상속받는 예제는 html에도 값을 넣어야 반영됨
function varTargets(ex: Example) {
  return ex.rootVars ? [currentStage!, document.documentElement] : [currentStage!];
}

function applyValue(param: Param, value: ParamValue) {
  currentValues[param.key] = value;
  const resolved = resolvedValues(current, currentValues);
  varTargets(current).forEach((target) => {
    Object.entries(resolved).forEach(([key, v]) => target.style.setProperty(varName(current, key), v));
  });
  showCode(currentLang);
}

function clearValues(ex: Example) {
  const keys = Object.keys(resolvedValues(ex, defaultValues(ex)));
  varTargets(ex).forEach((target) => {
    keys.forEach((key) => target.style.removeProperty(varName(ex, key)));
  });
}

// 한 번 재생되는 예제는 값을 바꾼 뒤 처음부터 다시 보여줘야 차이가 보임
function restartIfTimed() {
  if (current.kind === 'once' || current.kind === 'loop') restart(currentStage!, current.autoplay);
}

function rangeField(param: RangeParam) {
  const id = `tuner-${param.key}`;
  const field = document.createElement('div');
  field.className = 'field';
  field.innerHTML = `<label for="${id}"></label><input type="range" id="${id}"><output for="${id}"></output>`;
  field.querySelector('label')!.textContent = param.label;
  const input = field.querySelector('input')!;
  const output = field.querySelector('output')!;
  Object.assign(input, { min: param.min, max: param.max, step: param.step, value: param.value });
  output.textContent = formatValue(param, param.value);
  input.addEventListener('input', () => {
    output.textContent = formatValue(param, input.value);
    applyValue(param, input.value);
  });
  input.addEventListener('change', restartIfTimed);
  return field;
}

function easingField(param: EasingParam) {
  const field = document.createElement('div');
  field.className = 'field field-easing';
  field.innerHTML = `
    <label for="tuner-easing">속도 변화</label>
    <div class="easing-controls">
      <select aria-label="속도 변화 프리셋"></select>
      <input type="text" id="tuner-easing" spellcheck="false" autocomplete="off">
    </div>`;
  const select = field.querySelector('select')!;
  const input = field.querySelector('input')!;
  const presets = EASING_PRESETS.some(([value]) => value === param.value)
    ? EASING_PRESETS
    : [[param.value, '기본값'], ...EASING_PRESETS];
  presets.forEach(([value, label]) => {
    select.add(new Option(label, value));
  });
  select.add(new Option('직접 입력', ''));
  select.value = param.value;
  input.value = param.value;

  const commit = (value: string) => {
    const valid = CSS.supports('transition-timing-function', value);
    input.setAttribute('aria-invalid', String(!valid));
    if (!valid) return;
    applyValue(param, value);
    restartIfTimed();
  };
  select.addEventListener('change', () => {
    if (!select.value) {
      input.focus();
      return;
    }
    input.value = select.value;
    commit(select.value);
  });
  input.addEventListener('change', () => {
    const value = input.value.trim();
    select.value = presets.some(([preset]) => preset === value) ? value : '';
    commit(value);
  });
  return field;
}

function buildTuner(ex: Example) {
  tunerFields.replaceChildren();
  currentValues = {};
  tuner.hidden = !ex.params;
  (ex.params || []).forEach((param) => {
    currentValues[param.key] = param.value;
    tunerFields.append(param.type === 'easing' ? easingField(param) : rangeField(param));
  });
}

document.getElementById('tuner-reset')!.addEventListener('click', () => {
  clearValues(current);
  buildTuner(current);
  showCode(currentLang);
  restartIfTimed();
});

detailReplay.addEventListener('click', () => {
  if (current.kind === 'scroll') {
    currentStage!.querySelector('.demo-scroll')!.scrollTo({ top: 0 });
    return;
  }
  restart(currentStage!, current.autoplay);
});

detailTabs.addEventListener('keydown', (event) => {
  if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
  const tabs = [...detailTabs.querySelectorAll<HTMLElement>('.tab')];
  const index = tabs.findIndex((tab) => tab.dataset.lang === currentLang);
  const next = tabs[(index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
  showCode(next.dataset.lang as Lang);
  next.focus();
});

function copyText(button: HTMLButtonElement, text: string) {
  navigator.clipboard.writeText(text)
    .then(() => { button.textContent = '복사됨'; })
    .catch(() => {
      // 클립보드 접근이 막힌 환경에서는 복사할 글을 코드 칸에 보여 주고 선택해 둬서 직접 복사하게 함
      if (detailCode.textContent !== text) detailCode.textContent = text;
      const range = document.createRange();
      range.selectNodeContents(detailCode);
      const selection = getSelection()!;
      selection.removeAllRanges();
      selection.addRange(range);
      button.textContent = '선택됨 · ⌘C로 복사';
    });
}

detailCopy.addEventListener('click', () => copyText(detailCopy, codeFor(current, currentLang)));

detailPrompt.addEventListener('click', () => {
  const url = new URL(`${import.meta.env.BASE_URL.replace(/\/?$/, '/')}${current.id}/`, location.origin).href;
  const edited = (current.params || []).some((param) => String(currentValues[param.key]) !== String(param.value));
  const markdown = exampleMarkdown(current, { demo: currentDemo, url, values: edited ? currentValues : undefined });
  copyText(detailPrompt, applyPrompt(markdown));
});

/* ---------- 목록의 모달 ---------- */
const dialog = document.getElementById('detail') as HTMLDialogElement | null;

if (dialog) {
  document.getElementById('detail-close')!.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    clearValues(current);
    detailSlot.replaceChildren();
    currentStage = null;
    try { history.replaceState(null, '', location.pathname + location.search); } catch { /* 무시 */ }
  });
}

export async function openDialog(id: string) {
  const { ex, demo } = await loadExample(id);
  fillInfo(ex);
  const { wrap, stage } = createStage(ex, 'detail');
  detailSlot.replaceChildren(wrap);
  // 값 조정이 스테이지를 대상으로 하므로 setup보다 먼저 스테이지를 넣어야 함
  dialog!.showModal();
  setup(ex, demo, stage);
  try { history.replaceState(null, '', `#${ex.id}`); } catch { /* 무시 */ }
}

/* ---------- 예제별 페이지 ---------- */
export async function mountPage() {
  const root = document.querySelector<HTMLElement>('[data-example-id]')!;
  const { ex, demo } = await loadExample(root.dataset.exampleId!);
  prepareStage(detailSlot, ex.kind, ex.hint);
  setup(ex, demo, detailSlot.querySelector<HTMLElement>('.stage')!);
}

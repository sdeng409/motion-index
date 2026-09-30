// AI에게 넘길 예제 설명서. 빌드 때 /{id}.md를 만들 때와, 브라우저에서 조정한 값으로 프롬프트를 만들 때 같이 씀
import { COST_LABEL, dedent, defaultValues, formatValue, renderCss } from './shared';
import type { Example, ParamValue } from './types';

export const SITE_TITLE = 'Motion Index';

// 어떤 프로젝트에 옮기든 지켜야 하는 규칙. 예제 코드만으로는 드러나지 않는 의도를 적어 둠
export const ADAPT_RULES = [
  '움직임은 CSS(transition·animation·@keyframes)가 맡고, JS는 상태(class·속성·popover·dialog)를 바꾸는 일만 합니다. 옮길 때도 이 역할 분리를 유지하세요.',
  '`prefers-reduced-motion: reduce` 블록과 `@supports` 가드는 지우지 말고 함께 옮기세요. 지원하지 않는 브라우저에서도 콘텐츠는 정적으로 보여야 합니다.',
  '렌더링 비용 등급을 지키세요. transform·opacity로 만든 효과를 top·left·width·height 같은 layout 속성으로 바꾸지 마세요.',
  '`demo-`로 시작하는 class는 미리보기 모양을 위한 것이므로 옮기지 말고, 대상 코드의 기존 요소와 스타일을 쓰세요.',
  'class 이름과 selector는 대상 코드의 이름 규칙에 맞게 바꾸고, 스타일링 방식(CSS Modules, Tailwind, CSS-in-JS 등)에 맞춰 옮기세요. Tailwind라면 @keyframes와 복잡한 selector는 전역 CSS나 @layer에 두는 편이 읽기 쉽습니다.',
  'document에 이벤트를 위임한 vanilla JS는, React·Vue·Svelte 등에서는 해당 컴포넌트의 이벤트 핸들러와 ref로 옮기세요. `getElementById`로 찾던 요소는 ref로 바꾸세요.',
  '예제의 수치(시간·거리·easing)는 조정된 값입니다. 대상 코드에 디자인 토큰이 있으면 가장 가까운 토큰으로 바꾸고, 없으면 그대로 쓰세요.',
];

type MarkdownOptions = {
  demo: string;
  url: string;
  values?: Record<string, ParamValue>;
};

function paramLines(ex: Example, values: Record<string, ParamValue>) {
  return (ex.params || []).map((param) => {
    const current = formatValue(param, values[param.key]);
    if (param.type === 'easing') return `- ${param.label}: \`${current}\``;
    const range = `${formatValue(param, param.min)} ~ ${formatValue(param, param.max)}`;
    return `- ${param.label}: \`${current}\` (조정 범위 ${range})`;
  });
}

export function exampleMarkdown(ex: Example, { demo, url, values }: MarkdownOptions) {
  const used = values || defaultValues(ex);
  const css = ex.params ? renderCss(ex, used) : dedent(ex.css);
  const params = paramLines(ex, used);
  const lines = [
    `# ${ex.title}`,
    '',
    `> ${ex.summary}`,
    '',
    ex.desc,
    '',
    `- 원본: ${url}`,
    `- 구현: ${ex.tag === 'CSS' ? 'CSS만 사용' : 'CSS + 상태를 바꾸는 JS'}`,
    `- 애니메이션 속성: ${ex.spec.props} (렌더링 비용 ${COST_LABEL[ex.spec.cost]})`,
    `- 지원 브라우저: ${ex.support}`,
  ];
  if (params.length) lines.push('', values ? '## 조정한 값' : '## 기본값', '', ...params);
  lines.push('', '## HTML', '', '```html', dedent(ex.html), '```', '', '## CSS', '', '```css', css, '```');
  if (demo.trim()) lines.push('', '## JS', '', '```js', demo.trim(), '```');
  lines.push('', '## 옮길 때 지킬 것', '', ...ADAPT_RULES.map((rule) => `- ${rule}`));
  return `${lines.join('\n')}\n`;
}

// 상세 창의 "AI에게 맡기기" 버튼이 복사하는 문장. 사용자가 대상과 요구만 채우면 되도록 빈칸을 앞에 둠
export function applyPrompt(markdown: string) {
  return [
    '아래 웹 애니메이션을 지금 작업 중인 코드에 적용해줘.',
    '',
    '- 적용할 곳: (예: 상품 카드 목록, 로그인 모달)',
    '- 추가로 원하는 점: (없으면 비워 두기)',
    '',
    '먼저 대상 코드의 구조와 스타일링 방식을 읽고, 아래 "옮길 때 지킬 것"에 맞춰 옮겨줘.',
    '',
    '---',
    '',
    markdown,
  ].join('\n');
}

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
  '수치(시간·거리·easing): "조정한 값"은 사용자가 직접 고른 값이므로 디자인 토큰으로 바꾸지 말고 그대로 쓰세요. "기본값"은 값이 거의 같은(차이 10% 이내) 토큰이 있을 때만 토큰으로 바꾸고, 그렇지 않으면 예제 값을 쓰되 가까운 토큰이 있다는 사실을 보고에 적으세요.',
  '요소를 없애기 전(조건부 렌더링에서 빠질 때, 목록에서 삭제할 때)에 사라지는 효과를 보여 주려면, 상태를 바꾼 뒤 `element.getAnimations()`의 `finished`가 모두 끝나기를 기다렸다가 없애세요. `transitionend`만 기다리면 재생 시간이 0이거나 효과가 꺼져 있을 때 요소가 영영 없어지지 않습니다. 없애는 요소에 키보드 포커스가 있었다면 다음 항목처럼 알맞은 곳으로 옮기세요.',
  '옮긴 뒤에는 브라우저에서 실제로 재생되는지와, 동작 줄이기 설정(`prefers-reduced-motion: reduce`)을 켰을 때 효과가 꺼지는지를 모두 확인하세요. 이 설정은 Chrome DevTools의 Rendering 패널, CDP의 `Emulation.setEmulatedMedia`, Playwright의 `reducedMotion: \'reduce\'`로 켤 수 있습니다. CSS에 규칙이 있는지만 본 것은 확인이 아니며, 확인하지 못한 항목은 보고에 밝히세요.',
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
  if (params.length) {
    const note = values
      ? '사용자가 사이트에서 직접 조정한 값입니다. 디자인 토큰으로 바꾸지 말고 그대로 쓰세요.'
      : '예제의 기본값입니다. 값이 거의 같은(차이 10% 이내) 디자인 토큰이 있으면 토큰으로 바꿔도 됩니다.';
    lines.push('', values ? '## 조정한 값' : '## 기본값', '', note, '', ...params);
  }
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
    '"적용할 곳"이 비어 있거나 예시 문구 그대로라면, 코드를 읽고 어울리는 곳을 2~3군데 제안한 뒤 어디에 적용할지 물어봐줘.',
    '',
    '---',
    '',
    markdown,
  ].join('\n');
}

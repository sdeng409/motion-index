import type { Example } from '../../lib/types';
import { SUPPORT } from '../../lib/shared';

export default {
  id: 'typewriter',
  section: 'technique',
  title: 'Typewriter',
  summary: '글자가 한 자씩 찍히고 커서가 깜빡입니다.',
  desc: '글자를 담은 상자의 너비를 0에서 글자 수만큼 늘리되, `steps()`로 한 글자씩 끊어서 늘립니다. 글자 수는 `--chars`로 넣고, 전체 시간은 "글자당 시간 × 글자 수"로 계산합니다. 너비를 글자 수(`ch` 단위)로 맞추기 때문에, 모든 글자의 폭이 같은 고정폭 글꼴과 영문·숫자에서만 정확합니다. 너비를 바꾸므로 Layout 비용이 듭니다.',
  tag: 'CSS', kind: 'once', support: SUPPORT.steps,
  spec: { props: 'width, border-color', cost: 'layout' },
  params: [
    { key: 'char-time', label: '한 글자 찍는 시간', value: 90, min: 20, max: 300, step: 10, unit: 'ms' },
    { key: 'caret-time', label: '커서 깜빡이는 간격', value: 800, min: 300, max: 2000, step: 50, unit: 'ms' },
  ],
  html: `
    <div class="demo-terminal">
      <span class="typewriter" style="--chars: 13">$ npm run dev</span>
      <span class="typewriter" style="--chars: 12">Motion Index</span>
    </div>`,
  css: `
    .typewriter {
      display: inline-block;
      width: calc(var(--chars) * 1ch);
      overflow: hidden;
      white-space: nowrap;
      border-right: 0.12em solid currentColor;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      animation:
        typing calc(var(--chars) * {{char-time}}) steps(var(--chars)) both,
        caret {{caret-time}} step-end infinite;
    }

    @keyframes typing {
      from { width: 0; }
    }

    @keyframes caret {
      50% { border-color: transparent; }
    }

    @media (prefers-reduced-motion: reduce) {
      .typewriter { animation: none; }
    }`,
} satisfies Example;

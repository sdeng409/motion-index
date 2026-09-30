import type { Example } from '../../lib/types';
import { easing } from '../../lib/shared';

export default {
  id: 'clip-reveal',
  section: 'technique',
  title: 'Clip-path reveal',
  summary: '가려 둔 부분을 조금씩 열어 요소를 드러냅니다.',
  desc: '요소는 처음부터 제자리에 있고, 보이는 영역만 점점 넓어집니다. 그래서 주변 레이아웃이 밀리지 않습니다. `inset()`은 한쪽에서 쓸어 내듯 드러내고, `circle()`은 가운데에서 원이 퍼지듯 드러냅니다. 이미지, 제목, 섹션 배경 어디에나 쓸 수 있습니다.',
  tag: 'CSS', kind: 'once', support: 'Chrome 88 · Edge 88 · Firefox 71 · Safari 13.1',
  spec: { props: 'clip-path', cost: 'paint' },
  params: [
    { key: 'duration', label: '재생 시간', value: 900, min: 200, max: 2500, step: 50, unit: 'ms' },
    easing('cubic-bezier(0.65, 0, 0.35, 1)'),
    { key: 'delay', label: '두 번째 출발 늦추기', value: 250, min: 0, max: 1500, step: 50, unit: 'ms' },
  ],
  html: `
    <div class="demo-stack">
      <div class="clip-wipe demo-photo"></div>
      <span class="clip-circle demo-pill">새 시즌 컬렉션</span>
    </div>`,
  css: `
    .clip-wipe {
      animation: clip-wipe {{duration}} {{easing}} both;
    }

    .clip-circle {
      animation: clip-circle {{duration}} {{easing}} {{delay}} both;
    }

    @keyframes clip-wipe {
      from { clip-path: inset(0 100% 0 0); }
      to { clip-path: inset(0 0 0 0); }
    }

    @keyframes clip-circle {
      from { clip-path: circle(0% at 50% 50%); }
      to { clip-path: circle(75% at 50% 50%); }
    }

    @media (prefers-reduced-motion: reduce) {
      .clip-wipe,
      .clip-circle { animation: none; }
    }`,
} satisfies Example;

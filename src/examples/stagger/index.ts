import type { Example } from '../../lib/types';
import { SUPPORT, easing } from '../../lib/shared';

export default {
  id: 'stagger',
  title: '순차 등장 (Stagger)',
  summary: '목록 항목이 짧은 간격을 두고 차례로 나타납니다.',
  desc: '모든 항목에 같은 등장 효과를 주고, 시작 시간만 "순번 × 간격"만큼 늦춥니다. 순번은 최신 브라우저에서는 CSS의 `sibling-index()`가 직접 세고, 그렇지 않은 브라우저에서는 HTML에 넣은 `--i` 값을 씁니다. `sibling-index()`를 지원하는 브라우저가 충분히 많아지면 `--i`는 지워도 됩니다.',
  tag: 'CSS', kind: 'once', support: SUPPORT.animations,
  spec: { props: 'transform, opacity', cost: 'composite' },
  params: [
    { key: 'duration', label: '재생 시간', value: 480, min: 100, max: 1500, step: 20, unit: 'ms' },
    { key: 'stagger', label: '항목 사이 시간차', value: 80, min: 0, max: 400, step: 10, unit: 'ms' },
    easing('cubic-bezier(0.2, 0.7, 0.2, 1)'),
    { key: 'distance', label: '움직이는 거리', value: 12, min: 0, max: 80, step: 2, unit: 'px' },
  ],
  html: `
    <ul class="stagger demo-list">
      <li style="--i: 0"><span class="demo-avatar"></span>김하늘님이 참여했습니다</li>
      <li style="--i: 1"><span class="demo-avatar"></span>이서준님이 참여했습니다</li>
      <li style="--i: 2"><span class="demo-avatar"></span>박지우님이 참여했습니다</li>
    </ul>`,
  css: `
    .stagger > li {
      animation: stagger-in {{duration}} {{easing}} both;
      animation-delay: calc(var(--i, 0) * {{stagger}});
    }

    /* 순번을 CSS가 직접 셈 (sibling-index()는 1부터 시작) */
    @supports (animation-delay: calc(sibling-index() * 1ms)) {
      .stagger > li { animation-delay: calc((sibling-index() - 1) * {{stagger}}); }
    }

    @keyframes stagger-in {
      from {
        opacity: 0;
        transform: translateY({{distance}});
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .stagger > li { animation: none; }
    }`,
} satisfies Example;

import type { Example } from '../../lib/types';
import { SUPPORT, easing } from '../../lib/shared';

export default {
  id: 'motion-path',
  section: 'technique',
  title: 'Motion path',
  summary: '요소가 정해 둔 곡선을 따라 이동합니다.',
  desc: '`offset-path`에 이동할 경로를 그려 두고 `offset-distance`를 0%에서 100%로 바꾸면, 요소가 그 경로를 따라갑니다. `offset-rotate: auto`를 주면 화살표처럼 진행 방향을 바라보며 움직입니다. 상품이 장바구니로 날아가 담기는 효과처럼 궤적이 필요한 곳에 씁니다. 다만 Chrome은 `offset-distance` 애니메이션을 compositor에 맡기지 못하고 main thread에서 실행합니다. 다시 그리는 비용은 거의 없지만, main thread가 바쁜 순간에는 움직임이 끊길 수 있습니다.',
  tag: 'CSS', kind: 'once', support: SUPPORT.motionPath,
  spec: { props: 'offset-distance', cost: 'composite' },
  params: [
    { key: 'duration', label: '재생 시간', value: 1200, min: 200, max: 3000, step: 50, unit: 'ms' },
    easing('cubic-bezier(0.65, 0, 0.35, 1)'),
    { key: 'delay', label: '두 번째 출발 늦추기', value: 180, min: 0, max: 1000, step: 20, unit: 'ms' },
  ],
  html: `
    <div class="path-area">
      <svg class="demo-path-guide" viewBox="0 0 220 120" aria-hidden="true">
        <path d="M 10 100 C 60 0, 150 0, 200 70" />
      </svg>
      <span class="path-traveler demo-dot"></span>
      <span class="path-traveler is-rotating demo-arrow" aria-hidden="true">➤</span>
    </div>`,
  css: `
    .path-area {
      position: relative;
      width: 220px;
      height: 120px;
    }

    .path-traveler {
      position: absolute;
      top: 0;
      left: 0;
      offset-path: path("M 10 100 C 60 0, 150 0, 200 70");
      offset-rotate: 0deg;
      offset-distance: 100%;
      animation: follow-path {{duration}} {{easing}} both;
    }

    /* 진행 방향을 따라 회전 */
    .path-traveler.is-rotating {
      offset-rotate: auto;
      animation-delay: {{delay}};
    }

    @keyframes follow-path {
      from { offset-distance: 0%; }
    }

    @media (prefers-reduced-motion: reduce) {
      .path-traveler { animation: none; }
    }`,
} satisfies Example;

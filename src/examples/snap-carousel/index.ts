import type { Example } from '../../lib/types';
import { SUPPORT } from '../../lib/shared';

export default {
  id: 'snap-carousel',
  section: 'technique',
  title: 'Scroll-snap 캐러셀',
  summary: '가운데에 온 항목만 크고 선명하게 보입니다.',
  desc: '스크롤이 멈출 때 항목이 가운데에 딱 맞게 서도록 `scroll-snap`을 겁니다. 그리고 각 항목이 가로로 지나가는 정도(`view(inline)`)에 맞춰 크기와 투명도를 바꿉니다. 진행도 50% 지점이 항목이 정확히 가운데에 온 순간이라서, 그때 가장 크고 선명해집니다. 지원하지 않는 브라우저와 동작 줄이기 설정에서는 크기 변화 없이 스냅만 동작합니다.',
  tag: 'CSS', kind: 'interact', hint: '옆으로 스크롤해 보세요', support: SUPPORT.scrollDriven,
  spec: { duration: '스크롤 위치에 연동', props: 'transform, opacity', cost: 'composite' },
  params: [
    { key: 'min-scale', label: '양옆 카드 크기', value: 0.78, min: 0.4, max: 1, step: 0.02, unit: '' },
    { key: 'min-opacity', label: '양옆 카드 진하기', value: 0.45, min: 0, max: 1, step: 0.05, unit: '' },
  ],
  html: `
    <ul class="snap-carousel demo-snap">
      <li>봄</li><li>여름</li><li>가을</li><li>겨울</li><li>다시 봄</li>
    </ul>`,
  css: `
    .snap-carousel {
      display: flex;
      gap: 12px;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      /* 첫 항목과 마지막 항목도 가운데에 올 수 있게 양쪽 여백을 줌 */
      padding-inline: calc(50% - 60px);
    }

    .snap-carousel > li {
      flex: none;
      width: 120px;
      scroll-snap-align: center;
    }

    @supports (animation-timeline: view()) {
      @media (prefers-reduced-motion: no-preference) {
        .snap-carousel > li {
          animation: snap-focus linear both;
          animation-timeline: view(inline);
        }
      }
    }

    @keyframes snap-focus {
      0%, 100% {
        opacity: {{min-opacity}};
        transform: scale({{min-scale}});
      }
      50% {
        opacity: 1;
        transform: none;
      }
    }`,
} satisfies Example;

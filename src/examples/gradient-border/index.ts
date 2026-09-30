import type { Example } from '../../lib/types';
import { SUPPORT } from '../../lib/shared';

export default {
  id: 'gradient-border',
  title: '회전 그라디언트 테두리',
  summary: '카드 테두리의 그라디언트가 천천히 돕니다.',
  desc: '`@property`로 각도 변수를 등록하면 각도를 부드럽게 바꿀 수 있습니다. 이 각도를 원뿔형 그라디언트(`conic-gradient`)의 시작 방향으로 씁니다. 배경을 두 겹으로 깔아서, 안쪽은 흰색으로 덮고 테두리 부분에만 그라디언트가 보이게 했습니다. 매 프레임 배경을 다시 그리므로, 한 화면에 여러 개를 쓰는 것은 피하는 편이 좋습니다.',
  tag: 'CSS', kind: 'loop', support: SUPPORT.registeredProperty,
  spec: { props: '--glow-angle → background', cost: 'paint' },
  params: [
    { key: 'duration', label: '한 바퀴 도는 시간', value: 4, min: 1, max: 12, step: 0.5, unit: 's' },
    { key: 'border', label: '테두리 두께', value: 2, min: 1, max: 8, step: 1, unit: 'px' },
  ],
  html: `
    <div class="glow-border">
      <strong>Pro 플랜</strong>
      <p>월 9,900원 · 언제든 해지</p>
    </div>`,
  css: `
    @property --glow-angle {
      syntax: "<angle>";
      initial-value: 0deg;
      inherits: false;
    }

    .glow-border {
      padding: 16px 20px;
      border: {{border}} solid transparent;
      border-radius: 16px;
      background:
        linear-gradient(#fff, #fff) padding-box,
        conic-gradient(from var(--glow-angle), #2f4bd8, #22c1c3, #f5a400, #2f4bd8) border-box;
      animation: glow-rotate {{duration}} linear infinite;
    }

    .glow-border p { margin: 2px 0 0; color: #5b6270; }

    @keyframes glow-rotate {
      to { --glow-angle: 360deg; }
    }

    @media (prefers-reduced-motion: reduce) {
      .glow-border { animation: none; }
    }`,
} satisfies Example;

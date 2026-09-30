import type { Example } from '../../lib/types';
import { SUPPORT, easing } from '../../lib/shared';

export default {
  id: 'skeleton',
  title: '스켈레톤 shimmer',
  summary: '콘텐츠를 불러오는 동안 빛이 지나가는 자리 표시자입니다.',
  desc: '흔히 배경 위치(`background-position`)를 움직여서 만드는데, 이 방법은 매 프레임 화면을 다시 그려야 합니다. 여기서는 빛 모양을 가상 요소에 한 번 그려 두고 `transform`으로 옮기기만 하므로 더 가볍습니다.',
  tag: 'CSS', kind: 'loop', support: SUPPORT.animations,
  spec: { props: 'transform', cost: 'composite' },
  params: [
    { key: 'duration', label: '빛 지나가는 시간', value: 1400, min: 400, max: 4000, step: 100, unit: 'ms' },
    easing('ease-in-out'),
  ],
  html: `
    <div class="skeleton-card" aria-hidden="true">
      <div class="skeleton skeleton-avatar"></div>
      <div class="skeleton-lines">
        <div class="skeleton skeleton-line"></div>
        <div class="skeleton skeleton-line is-short"></div>
      </div>
    </div>`,
  css: `
    .skeleton-card {
      display: flex;
      gap: 12px;
      width: min(240px, 100%);
      padding: 14px;
      border-radius: 12px;
      background: #fff;
    }

    .skeleton-lines {
      display: grid;
      flex: 1;
      gap: 8px;
      align-content: center;
    }

    .skeleton {
      position: relative;
      overflow: hidden;
      border-radius: 6px;
      background: #e4e7ec;
    }

    .skeleton::after {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, transparent, rgb(255 255 255 / 0.7), transparent);
      transform: translateX(-100%);
      animation: shimmer {{duration}} {{easing}} infinite;
    }

    .skeleton-avatar { flex: none; width: 40px; height: 40px; border-radius: 50%; }
    .skeleton-line { height: 10px; }
    .skeleton-line.is-short { width: 60%; }

    @keyframes shimmer {
      to { transform: translateX(100%); }
    }

    @media (prefers-reduced-motion: reduce) {
      .skeleton::after { animation: none; }
    }`,
} satisfies Example;

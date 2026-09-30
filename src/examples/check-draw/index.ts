import type { Example } from '../../lib/types';
import { SUPPORT, easing } from '../../lib/shared';

export default {
  id: 'check-draw',
  title: '체크 표시 그리기',
  summary: '원과 체크 표시를 차례로 그립니다.',
  desc: 'SVG 선을 점선으로 만들되, 점선 한 칸의 길이를 선 전체 길이와 같게 합니다(`stroke-dasharray`). 그 점선을 전체 길이만큼 밀어 두었다가(`stroke-dashoffset`) 0으로 되돌리면, 선이 그려지는 것처럼 보입니다. 선의 전체 길이는 요소마다 `--len`으로 넣습니다.',
  tag: 'CSS', kind: 'once', support: SUPPORT.animations,
  spec: { props: 'stroke-dashoffset', cost: 'paint' },
  params: [
    { key: 'circle-duration', label: '원 그리는 시간', value: 600, min: 100, max: 2000, step: 50, unit: 'ms' },
    { key: 'mark-delay', label: '체크 시작 시점', value: 480, min: 0, max: 2000, step: 20, unit: 'ms' },
    { key: 'mark-duration', label: '체크 그리는 시간', value: 360, min: 100, max: 1500, step: 20, unit: 'ms' },
    easing('cubic-bezier(0.65, 0, 0.45, 1)'),
  ],
  html: `
    <div class="demo-stack">
      <svg class="check" viewBox="0 0 52 52" width="64" height="64" aria-hidden="true">
        <circle class="check-circle" cx="26" cy="26" r="24" fill="none" style="--len: 151" />
        <path class="check-mark" d="M15 27l7 7 15-16" fill="none" style="--len: 32" />
      </svg>
      <p class="demo-caption">결제가 완료되었습니다</p>
    </div>`,
  css: `
    .check-circle,
    .check-mark {
      stroke: #16a34a;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-dasharray: var(--len);
    }

    .check-circle {
      stroke-width: 3;
      /* 12시 방향에서 그리기 시작 */
      transform: rotate(-90deg);
      transform-origin: center;
      transform-box: fill-box;
      animation: check-draw {{circle-duration}} {{easing}} both;
    }

    .check-mark {
      stroke-width: 4;
      animation: check-draw {{mark-duration}} {{mark-delay}} {{easing}} both;
    }

    @keyframes check-draw {
      from { stroke-dashoffset: var(--len); }
    }

    @media (prefers-reduced-motion: reduce) {
      .check-circle,
      .check-mark { animation: none; }
    }`,
} satisfies Example;

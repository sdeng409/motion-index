import type { Example } from '../../lib/types';
import { SUPPORT, easing } from '../../lib/shared';

export default {
  id: 'progress-ring',
  title: '진행률 링',
  summary: '원형 테두리가 목표 비율까지 채워집니다.',
  desc: '체크 표시 그리기와 같은 점선 기법을 원에 적용했습니다. 반지름을 15.9155로 두면 원 둘레가 정확히 100이 됩니다. 그래서 72%를 채우려면 점선을 100 - 72 = 28만큼만 밀어 두면 되므로, 계산이 간단해집니다. 비율은 `--value`로 넣습니다.',
  tag: 'CSS', kind: 'once', support: SUPPORT.animations,
  spec: { props: 'stroke-dashoffset', cost: 'paint' },
  params: [
    { key: 'duration', label: '재생 시간', value: 1200, min: 200, max: 3000, step: 50, unit: 'ms' },
    easing('cubic-bezier(0.2, 0.7, 0.2, 1)'),
    { key: 'stroke', label: '선 두께', value: 3, min: 1, max: 6, step: 0.5, unit: '' },
  ],
  html: `
    <div class="demo-row">
      <div class="demo-ring-wrap">
        <svg class="progress-ring" viewBox="0 0 36 36" style="--value: 72" aria-hidden="true">
          <circle class="ring-track" cx="18" cy="18" r="15.9155" />
          <circle class="ring-value" cx="18" cy="18" r="15.9155" />
        </svg>
        <span>72%</span>
      </div>
      <div class="demo-ring-wrap">
        <svg class="progress-ring is-warning" viewBox="0 0 36 36" style="--value: 35" aria-hidden="true">
          <circle class="ring-track" cx="18" cy="18" r="15.9155" />
          <circle class="ring-value" cx="18" cy="18" r="15.9155" />
        </svg>
        <span>35%</span>
      </div>
    </div>`,
  css: `
    .progress-ring {
      width: 88px;
      height: 88px;
      fill: none;
      stroke-width: {{stroke}};
    }

    .ring-track { stroke: #e4e7ec; }

    .ring-value {
      stroke: #16a34a;
      stroke-linecap: round;
      stroke-dasharray: 100;
      stroke-dashoffset: calc(100 - var(--value));
      /* 12시 방향에서 시작 */
      transform: rotate(-90deg);
      transform-origin: center;
      transform-box: fill-box;
      animation: ring-fill {{duration}} {{easing}} both;
    }

    .progress-ring.is-warning .ring-value { stroke: #f59e0b; }

    @keyframes ring-fill {
      from { stroke-dashoffset: 100; }
    }

    @media (prefers-reduced-motion: reduce) {
      .ring-value { animation: none; }
    }`,
} satisfies Example;

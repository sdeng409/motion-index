import type { Example } from '../../lib/types';
import { SUPPORT, easing } from '../../lib/shared';

export default {
  id: 'tab-indicator',
  title: '탭 indicator 슬라이드',
  summary: '선택한 탭으로 배경이 미끄러져 이동합니다.',
  desc: '탭 너비를 똑같이 나눠 두면, 배경은 "자기 너비 × 탭 순번"만큼만 옮기면 됩니다. 그래서 탭 위치를 따로 잴 필요가 없고, JS는 선택한 탭의 순번(`--index`)만 바꿉니다. 탭 너비가 서로 다르다면 각 탭의 위치와 너비를 재서 옮기는 방식으로 바꿔야 합니다.',
  tag: 'JS', kind: 'interact', support: SUPPORT.transitions,
  spec: { props: 'transform, color', cost: 'paint' },
  params: [
    { key: 'duration', label: '재생 시간', value: 280, min: 0, max: 1000, step: 10, unit: 'ms' },
    easing('cubic-bezier(0.3, 0.7, 0.4, 1.2)'),
  ],
  autoplay: '.tab-list [role="tab"]:not([aria-selected="true"])',
  html: `
    <div class="tab-list" role="tablist" aria-label="기간" style="--count: 3; --index: 0">
      <span class="tab-indicator" aria-hidden="true"></span>
      <button type="button" role="tab" aria-selected="true">일간</button>
      <button type="button" role="tab" aria-selected="false">주간</button>
      <button type="button" role="tab" aria-selected="false">월간</button>
    </div>`,
  css: `
    .tab-list {
      position: relative;
      display: grid;
      grid-template-columns: repeat(var(--count), 1fr);
      width: min(260px, 100%);
      padding: 4px;
      border-radius: 12px;
      background: #e9ebf0;
    }

    .tab-list [role="tab"] {
      position: relative;
      z-index: 1;
      padding: 8px 0;
      border: 0;
      background: none;
      color: #5b6270;
      font: inherit;
      font-weight: 600;
      cursor: pointer;
      transition: color {{duration}};
    }

    .tab-list [aria-selected="true"] { color: #15171b; }

    .tab-indicator {
      position: absolute;
      top: 4px;
      bottom: 4px;
      left: 4px;
      width: calc((100% - 8px) / var(--count));
      border-radius: 8px;
      background: #fff;
      box-shadow: 0 1px 3px rgb(0 0 0 / 0.12);
      /* 자기 너비의 --index배만큼 이동 */
      transform: translateX(calc(var(--index) * 100%));
      transition: transform {{duration}} {{easing}};
    }

    @media (prefers-reduced-motion: reduce) {
      .tab-indicator,
      .tab-list [role="tab"] { transition: none; }
    }`,
} satisfies Example;

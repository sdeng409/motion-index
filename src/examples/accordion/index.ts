import type { Example } from '../../lib/types';
import { SUPPORT, easing } from '../../lib/shared';

export default {
  id: 'accordion',
  title: '아코디언',
  summary: '내용 높이를 몰라도 부드럽게 펼치고 접습니다.',
  desc: '`height: auto`에는 전환 효과가 적용되지 않습니다. 대신 grid 행 높이를 `0fr`에서 `1fr`로 바꾸면, 내용 높이에 맞춰 부드럽게 늘어납니다. 접혀 있을 때는 `visibility: hidden`으로 숨겨서, 안쪽 링크로 Tab 키 이동이 되지 않게 합니다. 높이가 바뀌면 주변 배치도 다시 계산해야 하므로 Layout 비용이 듭니다.',
  tag: 'JS', kind: 'interact', support: SUPPORT.gridAnimation,
  spec: { props: 'grid-template-rows, transform', cost: 'layout' },
  params: [
    { key: 'duration', label: '재생 시간', value: 300, min: 0, max: 1200, step: 20, unit: 'ms' },
    easing('cubic-bezier(0.2, 0.7, 0.2, 1)'),
  ],
  ids: ['faq-answer-1', 'faq-answer-2'],
  autoplay: '.accordion-trigger',
  html: `
    <div class="accordion">
      <div class="accordion-item">
        <button class="accordion-trigger" type="button" aria-expanded="false" aria-controls="faq-answer-1">배송은 얼마나 걸리나요?</button>
        <div class="accordion-panel" id="faq-answer-1">
          <div class="accordion-inner"><p>결제 후 1~2일 안에 출발합니다.</p></div>
        </div>
      </div>
      <div class="accordion-item">
        <button class="accordion-trigger" type="button" aria-expanded="false" aria-controls="faq-answer-2">반품할 수 있나요?</button>
        <div class="accordion-panel" id="faq-answer-2">
          <div class="accordion-inner"><p>받은 날부터 7일 안에 신청할 수 있습니다.</p></div>
        </div>
      </div>
    </div>`,
  css: `
    .accordion {
      width: min(260px, 100%);
      border: 1px solid #e3e5ea;
      border-radius: 12px;
      background: #fff;
    }

    .accordion-item + .accordion-item { border-top: 1px solid #e3e5ea; }

    .accordion-trigger {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      width: 100%;
      padding: 12px 14px;
      border: 0;
      background: none;
      color: inherit;
      font: inherit;
      font-weight: 600;
      text-align: left;
      cursor: pointer;
    }

    .accordion-trigger::after {
      content: "";
      flex: none;
      width: 7px;
      height: 7px;
      border-right: 2px solid currentColor;
      border-bottom: 2px solid currentColor;
      transform: rotate(45deg);
      transition: transform {{duration}} {{easing}};
    }

    .accordion-trigger[aria-expanded="true"]::after { transform: rotate(-135deg); }

    .accordion-panel {
      display: grid;
      grid-template-rows: 0fr;
      transition: grid-template-rows {{duration}} {{easing}};
    }

    .accordion-trigger[aria-expanded="true"] + .accordion-panel { grid-template-rows: 1fr; }

    .accordion-inner {
      overflow: hidden;
      visibility: hidden;
      transition: visibility {{duration}};
    }

    .accordion-trigger[aria-expanded="true"] + .accordion-panel .accordion-inner { visibility: visible; }

    .accordion-inner p {
      margin: 0;
      padding: 0 14px 12px;
      color: #4b5563;
    }

    @media (prefers-reduced-motion: reduce) {
      .accordion-panel,
      .accordion-inner,
      .accordion-trigger::after { transition: none; }
    }`,
} satisfies Example;

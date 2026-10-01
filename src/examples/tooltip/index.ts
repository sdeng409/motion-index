import type { Example } from '../../lib/types';
import { SUPPORT } from '../../lib/shared';

export default {
  id: 'tooltip',
  title: 'Tooltip',
  summary: '잠시 머무르면 나타나고, 마우스를 옮겨도 바로 사라지지 않습니다.',
  desc: '나타날 때와 사라질 때 `transition-delay`를 다르게 줍니다. 나타날 때는 잠깐 기다려서, 마우스가 지나가기만 해도 툴팁이 깜빡이는 일을 막습니다. 사라질 때는 짧게 기다려서, 마우스를 툴팁 위로 옮기는 동안 닫히지 않게 합니다. `visibility`는 중간값이 없으므로 사라질 때만 효과가 끝날 때까지 늦춥니다. 키보드로 버튼에 이동해도 보이고, Esc를 누르면 마우스나 포커스를 옮기지 않아도 닫힙니다(WCAG 1.4.13). JS는 Esc로 닫은 상태만 기록합니다.',
  tag: 'JS', kind: 'interact', support: SUPPORT.transitions,
  hint: '버튼에 마우스를 올려 보세요',
  spec: { props: 'opacity, transform', cost: 'composite' },
  params: [
    { key: 'delay', label: '나타나기 전 대기', value: 400, min: 0, max: 1000, step: 50, unit: 'ms' },
    { key: 'duration', label: '재생 시간', value: 150, min: 0, max: 500, step: 10, unit: 'ms' },
    { key: 'offset', label: '처음에 떨어진 거리', value: 4, min: 0, max: 16, step: 1, unit: 'px' },
  ],
  ids: ['tip-demo'],
  html: `
    <span class="tip">
      <button class="demo-btn" type="button" aria-describedby="tip-demo">공유</button>
      <span class="tooltip" role="tooltip" id="tip-demo">링크를 복사해 다른 사람에게 보냅니다</span>
    </span>`,
  css: `
    .tip {
      position: relative;
      display: inline-block;
    }

    .tooltip {
      position: absolute;
      bottom: calc(100% + 8px);
      left: 50%;
      width: max-content;
      max-width: 220px;
      padding: 6px 10px;
      border-radius: 8px;
      background: #1f2329;
      color: #fff;
      font: 13px/1.4 system-ui, sans-serif;
      opacity: 0;
      visibility: hidden;
      transform: translate(-50%, {{offset}});
      /* 사라질 때: 100ms 기다렸다가 흐려지고, 다 흐려진 뒤에 visibility를 끔 */
      transition:
        opacity {{duration}} ease-out 100ms,
        transform {{duration}} ease-out 100ms,
        visibility 0s calc(100ms + {{duration}});
    }

    /* 버튼과 툴팁 사이의 틈을 덮어서, 마우스가 툴팁으로 넘어가는 동안 hover가 끊기지 않게 함 */
    .tooltip::after {
      content: "";
      position: absolute;
      inset: 100% 0 -8px;
    }

    .tip:not(.is-dismissed):hover .tooltip,
    .tip:not(.is-dismissed) :focus-visible + .tooltip {
      opacity: 1;
      visibility: visible;
      transform: translate(-50%, 0);
      transition-delay: {{delay}};
    }

    @media (prefers-reduced-motion: reduce) {
      .tooltip { transform: translate(-50%, 0); }
    }`,
} satisfies Example;

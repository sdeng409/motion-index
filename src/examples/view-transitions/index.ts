import type { Example } from '../../lib/types';
import { easing } from '../../lib/shared';

export default {
  id: 'view-transitions',
  section: 'technique',
  title: 'View Transitions',
  summary: '화면을 바꾸는 코드를 감싸기만 하면 브라우저가 전환을 만들어 줍니다.',
  desc: '브라우저가 바뀌기 전과 바뀐 후의 화면을 찍어 두고, 같은 이름이 붙은 요소끼리 부드럽게 이어 줍니다. 브라우저에 FLIP이 내장되어 있는 셈입니다. 코드는 FLIP보다 훨씬 짧지만, 움직이는 것이 실제 요소가 아니라 찍어 둔 이미지라서 전환 중에는 누를 수 없습니다. 이름(`view-transition-name`)이 붙은 요소는 페이지 어디에 있든 함께 찍히므로, 전환하는 동안에만 해당 목록에 이름을 붙였다가 뗍니다. 지원하지 않는 브라우저에서는 전환 없이 바로 바뀝니다.',
  tag: 'JS', kind: 'interact', support: 'Chrome 125 · Edge 125 · Firefox 144 · Safari 18.2',
  spec: { props: '::view-transition-group (transform, size)', cost: 'composite' },
  params: [
    { key: 'duration', label: '재생 시간', value: 500, min: 100, max: 1500, step: 50, unit: 'ms' },
    easing('cubic-bezier(0.2, 0.7, 0.2, 1)'),
  ],
  rootVars: true,
  ids: ['vt-demo'],
  autoplay: '[data-vt-shuffle]',
  html: `
    <div class="demo-stack">
      <ul class="vt-list demo-tiles" id="vt-demo">
        <li>1</li><li>2</li><li>3</li><li>4</li><li>5</li><li>6</li>
      </ul>
      <button class="demo-btn" type="button" data-vt-shuffle="vt-demo">섞기</button>
    </div>`,
  css: `
    .vt-list > li { view-transition-class: vt-tile; }

    ::view-transition-group(*.vt-tile) {
      animation-duration: {{duration}};
      animation-timing-function: {{easing}};
    }

    @media (prefers-reduced-motion: reduce) {
      ::view-transition-group(*.vt-tile) { animation-duration: 0s; }
    }`,
} satisfies Example;

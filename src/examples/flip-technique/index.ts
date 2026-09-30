import type { Example } from '../../lib/types';
import { easing } from '../../lib/shared';

export default {
  id: 'flip-technique',
  section: 'technique',
  title: 'FLIP',
  summary: '위치가 바뀌는 요소를 부드럽게 옮겨 줍니다.',
  desc: '목록의 순서를 바꾸면 요소는 새 위치로 순간 이동합니다. FLIP은 이 순간 이동을 부드러운 이동으로 바꾸는 방법입니다. ① 바꾸기 전 위치를 재고, ② 순서를 바꾼 뒤 새 위치를 잽니다. ③ 그 차이만큼 요소를 원래 자리로 되돌려 놓았다가, ④ 되돌린 것을 풀면서 새 자리로 이동시킵니다. 실제 요소가 움직이므로 이동하는 중에도 누를 수 있습니다. 재생 시간과 easing은 CSS 변수에 두고 JS가 읽어서 씁니다. View Transitions 예제와 같은 동작을 다른 방법으로 만든 것입니다.',
  tag: 'JS', kind: 'interact', support: 'Chrome 84 · Edge 84 · Firefox 75 · Safari 14',
  spec: { props: 'transform (Web Animations API)', cost: 'composite' },
  params: [
    { key: 'duration', label: '재생 시간', value: 500, min: 100, max: 1500, step: 50, unit: 'ms' },
    easing('cubic-bezier(0.2, 0.7, 0.2, 1)'),
  ],
  ids: ['flip-demo'],
  autoplay: '[data-flip-shuffle]',
  html: `
    <div class="demo-stack">
      <ul class="flip-list demo-tiles" id="flip-demo">
        <li>1</li><li>2</li><li>3</li><li>4</li><li>5</li><li>6</li>
      </ul>
      <button class="demo-btn" type="button" data-flip-shuffle="flip-demo">섞기</button>
    </div>`,
  css: `
    .flip-list {
      --flip-duration: {{duration}};
      --flip-easing: {{easing}};
    }

    @media (prefers-reduced-motion: reduce) {
      .flip-list { --flip-duration: 0ms; }
    }`,
} satisfies Example;

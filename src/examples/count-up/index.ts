import type { Example } from '../../lib/types';
import { SUPPORT, easing } from '../../lib/shared';

export default {
  id: 'count-up',
  title: '숫자 카운트업',
  summary: '숫자가 0부터 목표 값까지 올라갑니다.',
  desc: 'CSS 변수는 보통 중간값을 계산할 수 없어서, 0에서 1280으로 한 번에 바뀝니다. `@property`로 이 변수가 "정수"라고 알려 주면, 브라우저가 0, 1, 2…처럼 중간값을 계산해 줍니다. 그 값을 `counter()`로 화면에 출력합니다. 목표 값은 `--num`으로 넣습니다. 매 프레임 글자가 바뀌므로 Layout 비용이 듭니다.',
  tag: 'CSS', kind: 'once', support: SUPPORT.registeredProperty,
  spec: { props: '--num (@property <integer>)', cost: 'layout' },
  params: [
    { key: 'duration', label: '재생 시간', value: 1600, min: 300, max: 5000, step: 100, unit: 'ms' },
    easing('cubic-bezier(0.2, 0.7, 0.2, 1)'),
  ],
  html: `
    <div class="demo-stats">
      <div><span class="count-up" style="--num: 1280"></span><small>가입자</small></div>
      <div><span class="count-up" style="--num: 98"></span><small>만족도(%)</small></div>
    </div>`,
  css: `
    @property --num {
      syntax: "<integer>";
      initial-value: 0;
      inherits: false;
    }

    .count-up {
      counter-reset: num var(--num);
      font-variant-numeric: tabular-nums;
      animation: count-up {{duration}} {{easing}} both;
    }

    .count-up::after { content: counter(num); }

    @keyframes count-up {
      from { --num: 0; }
    }

    @media (prefers-reduced-motion: reduce) {
      .count-up { animation: none; }
    }`,
} satisfies Example;

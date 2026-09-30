import type { Example } from '../../lib/types';
import { springEasing } from '../../lib/shared';

export default {
  id: 'spring',
  section: 'technique',
  title: 'Spring easing 생성기',
  summary: '스프링처럼 튕기는 움직임 곡선을 만듭니다.',
  desc: '튕기는 힘과 멈추는 힘 두 값만 정하면, 스프링이 튕기다가 멈추는 움직임을 계산해 `linear()` 곡선과 알맞은 재생 시간을 만들어 줍니다. 튕기는 힘을 올리면 더 빨라지고, 멈추는 힘을 내리면 더 많이 튕깁니다. 만든 `linear()` 값은 CSS만으로 동작하며, 다른 예제의 속도 변화 입력란에 붙여 넣어 쓸 수도 있습니다.',
  tag: 'CSS', kind: 'once', support: 'Chrome 113 · Edge 113 · Firefox 112 · Safari 17.2',
  spec: { props: 'transform', cost: 'composite' },
  params: [
    { key: 'stiffness', label: '튕기는 힘', value: 180, min: 40, max: 600, step: 10, unit: '' },
    { key: 'damping', label: '멈추는 힘', value: 12, min: 4, max: 40, step: 1, unit: '' },
  ],
  derive(values) {
    const spring = springEasing(Number(values.stiffness), Number(values.damping));
    return { spring: spring.easing, 'spring-duration': `${spring.duration}ms` };
  },
  html: `
    <div class="demo-stack">
      <div class="spring-slide demo-ball"></div>
      <span class="spring-pop demo-pill">NEW</span>
    </div>`,
  css: `
    .spring-slide {
      animation: spring-slide {{spring-duration}} {{spring}} both;
    }

    .spring-pop {
      animation: spring-pop {{spring-duration}} {{spring}} 120ms both;
    }

    @keyframes spring-slide {
      from { transform: translateX(-90px); }
    }

    @keyframes spring-pop {
      from { transform: scale(0.3); }
    }

    @media (prefers-reduced-motion: reduce) {
      .spring-slide,
      .spring-pop { animation: none; }
    }`,
} satisfies Example;

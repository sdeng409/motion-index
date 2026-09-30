import type { Example } from '../../lib/types';
import { SUPPORT } from '../../lib/shared';

export default {
  id: 'button-press',
  title: '버튼 hover · press',
  summary: '마우스를 올리면 떠오르고, 누르면 살짝 작아집니다.',
  desc: '누를 수 있다는 느낌을 주는 기본 반응입니다. hover 효과는 마우스가 있는 기기에서만 켜지도록 `@media (hover: hover)`로 감쌌습니다. 그렇게 하지 않으면 터치 기기에서 한 번 누른 뒤에 떠오른 상태가 그대로 남습니다. 그림자도 함께 바뀌어서, `transform`만 바꾸는 효과보다는 조금 무겁습니다.',
  tag: 'CSS', kind: 'interact', support: SUPPORT.transitions,
  spec: { props: 'transform, box-shadow', cost: 'paint' },
  params: [
    { key: 'duration', label: '떠오르는 시간', value: 160, min: 0, max: 600, step: 10, unit: 'ms' },
    { key: 'lift', label: '떠오르는 높이', value: -2, min: -12, max: 0, step: 1, unit: 'px' },
    { key: 'press-scale', label: '눌렀을 때 크기', value: 0.97, min: 0.8, max: 1, step: 0.01, unit: '' },
  ],
  html: `
    <button class="lift-btn" type="button">무료로 시작하기</button>`,
  css: `
    .lift-btn {
      padding: 10px 18px;
      border: 0;
      border-radius: 10px;
      background: #1f2937;
      color: #fff;
      font: 600 14px/1 system-ui, sans-serif;
      cursor: pointer;
      box-shadow: 0 1px 2px rgb(0 0 0 / 0.2);
      transition: transform {{duration}} ease, box-shadow {{duration}} ease;
    }

    @media (hover: hover) {
      .lift-btn:hover {
        transform: translateY({{lift}});
        box-shadow: 0 8px 18px rgb(0 0 0 / 0.18);
      }
    }

    .lift-btn:active {
      transform: translateY(0) scale({{press-scale}});
      transition-duration: 60ms;
    }

    .lift-btn:focus-visible {
      outline: 2px solid #2f4bd8;
      outline-offset: 3px;
    }

    @media (prefers-reduced-motion: reduce) {
      .lift-btn { transition: none; }
    }`,
} satisfies Example;

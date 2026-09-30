import type { Example } from '../../lib/types';
import { SUPPORT } from '../../lib/shared';

export default {
  id: 'spinner',
  title: '로딩 스피너',
  summary: '테두리 한쪽만 색이 다른 원이 돕니다.',
  desc: '로딩 중이라는 사실은 꼭 알려야 하므로, 동작 줄이기 설정에서도 멈추지 않고 천천히 돕니다. `role="status"`와 `aria-label`로 스크린 리더에도 로딩 중임을 알립니다.',
  tag: 'CSS', kind: 'loop', support: SUPPORT.animations,
  spec: { props: 'transform', cost: 'composite' },
  params: [
    { key: 'duration', label: '한 바퀴 도는 시간', value: 800, min: 200, max: 3000, step: 50, unit: 'ms' },
  ],
  html: `
    <span class="spinner" role="status" aria-label="불러오는 중"></span>`,
  css: `
    .spinner {
      display: inline-block;
      width: 32px;
      height: 32px;
      border: 3px solid #d5d9e0;
      border-top-color: #2f4bd8;
      border-radius: 50%;
      animation: spinner-rotate {{duration}} linear infinite;
    }

    @keyframes spinner-rotate {
      to { transform: rotate(360deg); }
    }

    @media (prefers-reduced-motion: reduce) {
      .spinner { animation-duration: calc({{duration}} * 3); }
    }`,
} satisfies Example;

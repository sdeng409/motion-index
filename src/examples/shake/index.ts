import type { Example } from '../../lib/types';
import { SUPPORT, easing } from '../../lib/shared';

export default {
  id: 'shake',
  title: '입력 오류 흔들기',
  summary: '잘못 입력하고 제출하면 입력란이 좌우로 흔들립니다.',
  desc: '제출할 때 입력값이 올바르지 않으면 흔들림 class를 붙이고, 흔들림이 끝나면(`animationend`) 떼어 냅니다. 그래야 다음 오류 때 다시 흔들 수 있습니다. 빨간 테두리는 `aria-invalid`로 따로 표시해서, 흔들림이 끝난 뒤에도 오류 상태가 남습니다.',
  tag: 'JS', kind: 'interact', support: SUPPORT.animations,
  spec: { props: 'transform', cost: 'composite' },
  params: [
    { key: 'duration', label: '재생 시간', value: 400, min: 100, max: 1200, step: 20, unit: 'ms' },
    { key: 'distance', label: '흔들리는 폭', value: 6, min: 1, max: 24, step: 1, unit: 'px' },
    easing('cubic-bezier(0.36, 0.07, 0.19, 0.97)'),
  ],
  autoplay: '.shake-form button',
  html: `
    <form class="shake-form" novalidate>
      <label>
        이메일
        <input type="email" required placeholder="name@example.com">
      </label>
      <button class="demo-btn">가입</button>
    </form>`,
  css: `
    .shake-form {
      display: flex;
      align-items: flex-end;
      gap: 8px;
    }

    .shake-form label {
      display: grid;
      gap: 4px;
      font-size: 12px;
      color: #4b5563;
    }

    .shake-form input {
      width: 150px;
      padding: 8px 10px;
      border: 1px solid #cfd4dc;
      border-radius: 8px;
      font: inherit;
    }

    .shake-form input[aria-invalid="true"] { border-color: #dc2626; }

    .shake-form.is-shaking {
      animation: shake-x {{duration}} {{easing}};
    }

    @keyframes shake-x {
      20%, 60% { transform: translateX(calc({{distance}} * -1)); }
      40%, 80% { transform: translateX({{distance}}); }
    }

    @media (prefers-reduced-motion: reduce) {
      .shake-form.is-shaking { animation: none; }
    }`,
} satisfies Example;

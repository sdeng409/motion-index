import type { Example } from '../../lib/types';
import { SUPPORT, easing } from '../../lib/shared';

export default {
  id: 'hover-patterns',
  section: 'technique',
  title: 'Hover 패턴 모음',
  summary: '링크 밑줄, 이미지 확대, 화살표 이동을 모았습니다.',
  desc: '링크나 카드에 바로 붙여 쓸 수 있는 hover 효과 세 가지입니다. 밑줄은 왼쪽에서 그어지고 오른쪽으로 사라지는데, 늘어나는 기준점(`transform-origin`)을 상태에 따라 반대로 바꿔서 만듭니다. 이미지 확대는 틀 밖으로 넘치는 부분을 숨기고 안쪽 이미지만 키웁니다. 화살표 효과는 글자는 그대로 두고 화살표만 옆으로 밉니다. 세 가지 모두 `transform`만 바꾸므로 가볍습니다.',
  tag: 'CSS', kind: 'interact', support: SUPPORT.transitions,
  spec: { props: 'transform', cost: 'composite' },
  params: [
    { key: 'duration', label: '재생 시간', value: 300, min: 50, max: 1000, step: 10, unit: 'ms' },
    easing('cubic-bezier(0.2, 0.7, 0.2, 1)'),
    { key: 'zoom', label: '이미지 확대 정도', value: 1.08, min: 1, max: 1.4, step: 0.01, unit: '' },
    { key: 'shift', label: '화살표 이동 거리', value: 4, min: 0, max: 16, step: 1, unit: 'px' },
  ],
  html: `
    <div class="demo-row">
      <div class="hover-zoom"><div class="demo-photo"></div></div>
      <div class="demo-stack">
        <a class="hover-underline demo-link" href="#">문서 보기</a>
        <button class="hover-arrow demo-btn" type="button">
          다음 단계 <span class="arrow" aria-hidden="true">→</span>
        </button>
      </div>
    </div>`,
  css: `
    /* 밑줄 슬라이드 */
    .hover-underline {
      position: relative;
      font-weight: 600;
      text-decoration: none;
    }

    .hover-underline::after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: -2px;
      height: 2px;
      background: currentColor;
      transform: scaleX(0);
      transform-origin: right;
      transition: transform {{duration}} {{easing}};
    }

    .hover-underline:hover::after,
    .hover-underline:focus-visible::after {
      transform: scaleX(1);
      transform-origin: left;
    }

    /* 이미지 확대 */
    .hover-zoom {
      overflow: hidden;
      border-radius: 10px;
    }

    .hover-zoom > * { transition: transform {{duration}} {{easing}}; }
    .hover-zoom:hover > * { transform: scale({{zoom}}); }

    /* 화살표 이동 */
    .hover-arrow .arrow {
      display: inline-block;
      transition: transform {{duration}} {{easing}};
    }

    .hover-arrow:hover .arrow,
    .hover-arrow:focus-visible .arrow { transform: translateX({{shift}}); }

    @media (prefers-reduced-motion: reduce) {
      .hover-underline::after,
      .hover-zoom > *,
      .hover-arrow .arrow { transition: none; }
    }`,
} satisfies Example;

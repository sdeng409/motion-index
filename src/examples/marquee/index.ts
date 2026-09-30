import type { Example } from '../../lib/types';
import { SUPPORT } from '../../lib/shared';

export default {
  id: 'marquee',
  title: '로고 마퀴 (Marquee)',
  summary: '로고 띠가 끊김 없이 옆으로 흘러갑니다.',
  desc: '같은 항목을 한 번 더 이어 붙인 뒤, 띠 전체를 절반(-50%)만큼 옮깁니다. 절반을 옮긴 순간의 모습이 처음 모습과 똑같아서, 반복되어도 이음새가 보이지 않습니다. 복제한 항목은 `aria-hidden`으로 숨겨서 스크린 리더가 두 번 읽지 않게 합니다. 동작 줄이기 설정에서는 멈추고, 사용자가 직접 가로로 스크롤할 수 있게 바뀝니다.',
  tag: 'CSS', kind: 'loop', support: SUPPORT.animations,
  spec: { props: 'transform', cost: 'composite' },
  params: [
    { key: 'duration', label: '한 바퀴 흐르는 시간', value: 12, min: 3, max: 40, step: 0.5, unit: 's' },
  ],
  html: `
    <div class="marquee">
      <div class="marquee-track">
        <span>React</span><span>Vue</span><span>Svelte</span><span>Astro</span><span>Solid</span>
        <span aria-hidden="true">React</span><span aria-hidden="true">Vue</span><span aria-hidden="true">Svelte</span><span aria-hidden="true">Astro</span><span aria-hidden="true">Solid</span>
      </div>
    </div>`,
  css: `
    .marquee {
      width: 100%;
      overflow: hidden;
      mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
    }

    .marquee-track {
      display: flex;
      width: max-content;
      animation: marquee {{duration}} linear infinite;
    }

    /* gap 대신 margin을 써야 -50% 지점이 정확히 맞음 */
    .marquee-track > span {
      margin-right: 10px;
      padding: 6px 14px;
      border: 1px solid #e3e5ea;
      border-radius: 999px;
      background: #fff;
      font-weight: 600;
    }

    @keyframes marquee {
      to { transform: translateX(-50%); }
    }

    @media (prefers-reduced-motion: reduce) {
      .marquee { overflow-x: auto; }
      .marquee-track { animation: none; }
    }`,
} satisfies Example;

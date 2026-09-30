import type { Example } from '../../lib/types';
import { SUPPORT } from '../../lib/shared';

export default {
  id: 'like-burst',
  title: '좋아요 하트 burst',
  summary: '누르면 하트가 튀어 오르고 주변으로 조각이 퍼집니다.',
  desc: 'JS는 눌림 상태(`aria-pressed`)만 바꿉니다. 눌린 상태가 되는 순간 CSS 규칙이 새로 적용되면서 애니메이션이 시작되고, 좋아요를 취소하면 효과 없이 원래대로 돌아갑니다. 퍼지는 링은 `::before`로, 점 여섯 개는 `::after`에 배경을 여러 겹 깔아서 그렸습니다. 그래서 HTML 요소를 더 만들 필요가 없습니다.',
  tag: 'JS', kind: 'interact', support: SUPPORT.animations,
  spec: { props: 'transform, opacity, fill', cost: 'paint' },
  params: [
    { key: 'duration', label: '재생 시간', value: 600, min: 200, max: 1500, step: 50, unit: 'ms' },
    { key: 'pop-scale', label: '커지는 정도', value: 1.25, min: 1, max: 1.8, step: 0.05, unit: '' },
  ],
  autoplay: '.like-btn',
  html: `
    <button class="like-btn" type="button" aria-pressed="false" aria-label="좋아요">
      <svg class="like-heart" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 20.5s-7.3-4.4-9.3-8.8C1.4 8.6 3.4 5 6.8 5c2 0 3.6 1.1 5.2 3 1.6-1.9 3.2-3 5.2-3 3.4 0 5.4 3.6 4.1 6.7-2 4.4-9.3 8.8-9.3 8.8z" />
      </svg>
    </button>`,
  css: `
    .like-btn {
      position: relative;
      display: grid;
      place-items: center;
      width: 56px;
      height: 56px;
      border: 0;
      border-radius: 50%;
      background: none;
      cursor: pointer;
    }

    .like-heart {
      width: 32px;
      height: 32px;
      fill: transparent;
      stroke: #9ca3af;
      stroke-width: 2;
      transition: fill 150ms, stroke 150ms;
    }

    .like-btn[aria-pressed="true"] .like-heart {
      fill: #ef4444;
      stroke: #ef4444;
      animation: like-pop {{duration}} cubic-bezier(0.3, 0.7, 0.4, 1.5);
    }

    /* 링 */
    .like-btn::before {
      content: "";
      position: absolute;
      inset: 4px;
      border: 2px solid #ef4444;
      border-radius: 50%;
      opacity: 0;
    }

    /* 퍼지는 점 여섯 개 */
    .like-btn::after {
      content: "";
      position: absolute;
      inset: -8px;
      background:
        radial-gradient(circle, #ef4444 45%, transparent 50%) 50% 0% / 7px 7px no-repeat,
        radial-gradient(circle, #f59e0b 45%, transparent 50%) 93% 25% / 7px 7px no-repeat,
        radial-gradient(circle, #ef4444 45%, transparent 50%) 93% 75% / 7px 7px no-repeat,
        radial-gradient(circle, #f59e0b 45%, transparent 50%) 50% 100% / 7px 7px no-repeat,
        radial-gradient(circle, #ef4444 45%, transparent 50%) 7% 75% / 7px 7px no-repeat,
        radial-gradient(circle, #f59e0b 45%, transparent 50%) 7% 25% / 7px 7px no-repeat;
      opacity: 0;
    }

    .like-btn[aria-pressed="true"]::before { animation: like-ring {{duration}} ease-out; }
    .like-btn[aria-pressed="true"]::after { animation: like-dots {{duration}} ease-out; }

    @keyframes like-pop {
      30% { transform: scale(0.7); }
      60% { transform: scale({{pop-scale}}); }
    }

    @keyframes like-ring {
      from { opacity: 1; transform: scale(0.3); }
      to { opacity: 0; transform: scale(1.3); }
    }

    @keyframes like-dots {
      from { opacity: 1; transform: scale(0.5); }
      to { opacity: 0; transform: scale(1.25); }
    }

    @media (prefers-reduced-motion: reduce) {
      .like-btn[aria-pressed="true"] .like-heart,
      .like-btn[aria-pressed="true"]::before,
      .like-btn[aria-pressed="true"]::after { animation: none; }
    }`,
} satisfies Example;

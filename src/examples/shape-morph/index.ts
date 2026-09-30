import type { Example } from '../../lib/types';
import { SUPPORT, easing } from '../../lib/shared';

export default {
  id: 'shape-morph',
  section: 'technique',
  title: 'Shape morph',
  summary: '아이콘과 도형의 모양이 부드럽게 바뀝니다.',
  desc: '`clip-path: shape()`로 직선과 곡선을 이어 모양을 그립니다. 두 모양을 같은 개수의 선으로, 같은 순서로 그리면 브라우저가 중간 모양을 자동으로 계산해 줍니다. 그래서 재생 삼각형을 두 조각으로 나눠, 일시정지 막대 두 개와 짝을 맞췄습니다. `shape()`를 지원하지 않는 브라우저에서는 모양이 애니메이션 없이 바로 바뀝니다.',
  tag: 'JS', kind: 'interact', support: SUPPORT.shapeFunction,
  spec: { props: 'clip-path', cost: 'paint' },
  params: [
    { key: 'duration', label: '아이콘 바뀌는 시간', value: 320, min: 80, max: 1200, step: 20, unit: 'ms' },
    easing('cubic-bezier(0.65, 0, 0.35, 1)'),
    { key: 'blob-duration', label: '도형 바뀌는 시간', value: 4, min: 1, max: 12, step: 0.5, unit: 's' },
  ],
  autoplay: '.morph-toggle',
  html: `
    <div class="demo-row">
      <button class="morph-toggle" type="button" aria-pressed="false" aria-label="재생">
        <span class="morph-icon" aria-hidden="true"></span>
      </button>
      <div class="morph-blob" aria-hidden="true"></div>
    </div>`,
  css: `
    .morph-toggle {
      display: grid;
      place-items: center;
      width: 56px;
      height: 56px;
      border: 0;
      border-radius: 50%;
      background: #1f2937;
      cursor: pointer;
    }

    .morph-icon {
      width: 20px;
      height: 22px;
      background: #fff;
      /* shape()를 모르는 브라우저용: 모양만 바뀌고 애니메이션은 없음 */
      clip-path: polygon(0% 0%, 100% 50%, 0% 100%);
      transition: clip-path {{duration}} {{easing}};
    }

    .morph-toggle[aria-pressed="true"] .morph-icon {
      clip-path: polygon(0% 0%, 35% 0%, 35% 100%, 65% 100%, 65% 0%, 100% 0%, 100% 100%, 0% 100%);
    }

    @supports (clip-path: shape(from 0% 0%, line to 100% 100%)) {
      /* 두 모양 모두 [시작, 선 3개, 닫기] × 2 구조라서 서로 보간됨 */
      .morph-icon {
        clip-path: shape(
          from 0% 0%, line to 50% 25%, line to 50% 75%, line to 0% 100%, close,
          move to 50% 25%, line to 100% 50%, line to 100% 50%, line to 50% 75%, close
        );
      }

      .morph-toggle[aria-pressed="true"] .morph-icon {
        clip-path: shape(
          from 0% 0%, line to 35% 0%, line to 35% 100%, line to 0% 100%, close,
          move to 65% 0%, line to 100% 0%, line to 100% 100%, line to 65% 100%, close
        );
      }

      .morph-blob {
        width: 96px;
        height: 96px;
        background: linear-gradient(135deg, #2f4bd8, #22c1c3);
        clip-path: shape(
          from 50% 0%, curve to 100% 50% with 90% 5%, curve to 50% 100% with 95% 95%,
          curve to 0% 50% with 5% 95%, curve to 50% 0% with 10% 5%, close
        );
        animation: blob-morph {{blob-duration}} ease-in-out infinite alternate;
      }

      @keyframes blob-morph {
        to {
          clip-path: shape(
            from 60% 8%, curve to 92% 60% with 100% 0%, curve to 40% 92% with 100% 100%,
            curve to 8% 40% with 0% 100%, curve to 60% 8% with 0% 0%, close
          );
        }
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .morph-icon { transition: none; }
      .morph-blob { animation: none; }
    }`,
} satisfies Example;

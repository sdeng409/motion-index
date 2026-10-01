import type { Example } from '../../lib/types';
import { SUPPORT } from '../../lib/shared';

export default {
  id: 'pointer-tilt',
  section: 'technique',
  title: '포인터 따라 기울기 · 조명',
  summary: '카드가 마우스 쪽으로 기울고, 마우스 위치에 빛이 비칩니다.',
  desc: 'JS는 카드 안에서 마우스가 있는 위치를 0~1 사이 값으로 바꿔 `--x`, `--y` 변수에 넣기만 합니다. 기울기와 조명은 CSS가 이 두 변수로 계산합니다. 위치는 기울어지는 카드가 아니라 바깥 틀에서 잽니다. 기울어진 카드에서 재면 카드가 움직일 때마다 잰 값도 달라져서 떨립니다. 마우스가 움직이는 동안에는 짧게, 떠날 때는 길게 전환해서 부드럽게 제자리로 돌아오게 했습니다. 조명은 배경을 매 프레임 다시 그리므로 paint 비용이 듭니다. 동작 줄이기 설정에서는 기울기를 끄고 조명만 남깁니다.',
  tag: 'JS', kind: 'interact', support: SUPPORT.transitions,
  hint: '카드 위에서 마우스를 움직여 보세요',
  spec: { props: 'transform, background', cost: 'paint' },
  params: [
    { key: 'tilt', label: '최대 기울기', value: 10, min: 0, max: 25, step: 1, unit: 'deg' },
    { key: 'return', label: '돌아오는 시간', value: 500, min: 100, max: 1500, step: 50, unit: 'ms' },
    { key: 'glow', label: '조명 크기', value: 180, min: 60, max: 400, step: 10, unit: 'px' },
  ],
  html: `
    <div class="tilt">
      <div class="tilt-card">
        <strong>Pro 플랜</strong>
        <p>마우스를 따라 기울어지고 빛이 비칩니다.</p>
      </div>
    </div>`,
  css: `
    /* 위치는 기울지 않는 이 틀에서 잼 */
    .tilt { perspective: 600px; }

    .tilt-card {
      --x: 0.5;
      --y: 0.5;
      position: relative;
      box-sizing: border-box;
      width: min(220px, 100%);
      padding: 20px;
      border-radius: 16px;
      background: #1f2329;
      color: #fff;
      transform:
        rotateX(calc((0.5 - var(--y)) * {{tilt}} * 2))
        rotateY(calc((var(--x) - 0.5) * {{tilt}} * 2));
      transition: transform {{return}} cubic-bezier(0.2, 0.7, 0.2, 1);
    }

    .tilt:hover .tilt-card { transition-duration: 100ms; }

    .tilt-card strong { font-size: 16px; }
    .tilt-card p { margin: 4px 0 0; color: #c4c9d2; }

    /* 조명 */
    .tilt-card::after {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: radial-gradient(
        {{glow}} circle at calc(var(--x) * 100%) calc(var(--y) * 100%),
        rgb(255 255 255 / 0.18),
        transparent
      );
      opacity: 0;
      transition: opacity 300ms;
      pointer-events: none;
    }

    .tilt:hover .tilt-card::after { opacity: 1; }

    @media (prefers-reduced-motion: reduce) {
      .tilt-card { transform: none; }
    }`,
} satisfies Example;

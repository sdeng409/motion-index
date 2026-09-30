import type { Example } from '../../lib/types';
import { SUPPORT } from '../../lib/shared';

export default {
  id: 'aurora',
  section: 'technique',
  title: '배경 gradient drift',
  summary: '흐린 색 덩어리가 천천히 떠다니는 배경입니다.',
  desc: '흐림 효과(`filter: blur`)는 그대로 두고 위치(`transform`)만 움직입니다. 흐림은 계산이 무거운데, 이렇게 하면 한 번 계산한 흐림을 옮기기만 하므로 가볍습니다. 덩어리마다 `--x`, `--y`로 다른 방향을 주고 왕복시킵니다. 히어로 배경이나 빈 화면을 채울 때 씁니다.',
  tag: 'CSS', kind: 'loop', support: SUPPORT.animations,
  spec: { props: 'transform', cost: 'composite' },
  params: [
    { key: 'duration', label: '빛 오가는 시간', value: 6, min: 2, max: 20, step: 0.5, unit: 's' },
    { key: 'blur', label: '번짐 정도', value: 32, min: 0, max: 80, step: 2, unit: 'px' },
  ],
  html: `
    <div class="aurora">
      <span class="aurora-blob" style="--x: 40%; --y: 30%"></span>
      <span class="aurora-blob" style="--x: -35%; --y: 25%"></span>
      <span class="aurora-blob" style="--x: 20%; --y: -40%"></span>
      <p class="aurora-text">새로운 시작</p>
    </div>`,
  css: `
    .aurora {
      position: relative;
      isolation: isolate;
      display: grid;
      place-items: center;
      width: 100%;
      height: 100%;
      overflow: hidden;
      border-radius: 12px;
      background: #0f172a;
    }

    .aurora-blob {
      position: absolute;
      z-index: -1;
      width: 60%;
      aspect-ratio: 1;
      border-radius: 50%;
      filter: blur({{blur}});
      opacity: 0.8;
      animation: aurora-drift {{duration}} ease-in-out infinite alternate;
    }

    .aurora-blob:nth-child(1) { top: -10%; left: -10%; background: #2f4bd8; }
    .aurora-blob:nth-child(2) { top: 10%; right: -15%; background: #db2777; animation-delay: calc({{duration}} * -0.3); }
    .aurora-blob:nth-child(3) { bottom: -25%; left: 20%; background: #22c1c3; animation-delay: calc({{duration}} * -0.6); }

    .aurora-text {
      margin: 0;
      color: #fff;
      font-size: 22px;
      font-weight: 800;
    }

    @keyframes aurora-drift {
      to { transform: translate(var(--x), var(--y)) scale(1.15); }
    }

    @media (prefers-reduced-motion: reduce) {
      .aurora-blob { animation: none; }
    }`,
} satisfies Example;

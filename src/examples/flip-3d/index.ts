import type { Example } from '../../lib/types';
import { easing } from '../../lib/shared';

export default {
  id: 'flip-3d',
  section: 'technique',
  title: '3D flip',
  summary: '카드와 플립 시계를 3D로 뒤집습니다.',
  desc: '앞면과 뒷면을 겹쳐 두고, 뒷면은 미리 180도 돌려 둡니다. 둘을 감싼 부모를 회전시키면 앞면이 넘어가고 뒷면이 보입니다. `perspective`는 원근감을 주고, `backface-visibility: hidden`은 뒤집힌 면을 숨깁니다. 카드는 hover나 키보드 포커스로 뒤집힙니다. 플립 시계는 숫자판을 위아래 반쪽으로 나누고, 윗장이 넘어간 다음 아랫장이 내려오도록 두 animation을 이어 붙였습니다.',
  tag: 'JS', kind: 'interact', support: 'Chrome 36 · Edge 12 · Firefox 16 · Safari 15.4',
  spec: { props: 'transform (rotateX, rotateY)', cost: 'composite' },
  params: [
    { key: 'duration', label: '카드 뒤집는 시간', value: 600, min: 100, max: 1500, step: 50, unit: 'ms' },
    easing('cubic-bezier(0.2, 0.7, 0.2, 1)'),
    { key: 'flap-duration', label: '숫자판 넘기는 시간', value: 260, min: 80, max: 800, step: 20, unit: 'ms' },
  ],
  ids: ['flap-demo'],
  autoplay: '[data-flap-next]',
  html: `
    <div class="demo-row">
      <div class="flip-card" tabindex="0">
        <div class="flip-card-inner">
          <div class="flip-card-front">앞면</div>
          <div class="flip-card-back">뒷면</div>
        </div>
      </div>
      <div class="demo-stack">
        <div class="flap" id="flap-demo" data-value="7">
          <span class="flap-top">7</span>
          <span class="flap-bottom">7</span>
          <span class="flap-leaf-top">7</span>
          <span class="flap-leaf-bottom">7</span>
        </div>
        <button class="demo-btn" type="button" data-flap-next="flap-demo">+1</button>
      </div>
    </div>`,
  css: `
    /* 카드 */
    .flip-card {
      width: 120px;
      height: 84px;
      perspective: 600px;
    }

    .flip-card-inner {
      position: relative;
      height: 100%;
      transform-style: preserve-3d;
      transition: transform {{duration}} {{easing}};
    }

    .flip-card:hover .flip-card-inner,
    .flip-card:focus-visible .flip-card-inner { transform: rotateY(180deg); }

    .flip-card-front,
    .flip-card-back {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      border-radius: 12px;
      font-weight: 700;
      backface-visibility: hidden;
    }

    .flip-card-front { background: #fff; border: 1px solid #e3e5ea; }
    .flip-card-back { background: #1f2937; color: #fff; transform: rotateY(180deg); }

    /* 플립 시계 숫자판 */
    .flap {
      position: relative;
      width: 56px;
      height: 72px;
      color: #fff;
      font: 700 44px/72px system-ui, sans-serif;
      text-align: center;
      perspective: 300px;
    }

    .flap > span {
      position: absolute;
      left: 0;
      right: 0;
      height: 50%;
      overflow: hidden;
      background: #1f2937;
      backface-visibility: hidden;
    }

    .flap-top,
    .flap-leaf-top {
      top: 0;
      border-radius: 8px 8px 0 0;
      transform-origin: 50% 100%;
    }

    /* line-height를 0으로 두면 글자의 아래쪽 절반만 보임 */
    .flap-bottom,
    .flap-leaf-bottom {
      bottom: 0;
      line-height: 0;
      border-radius: 0 0 8px 8px;
      transform-origin: 50% 0;
    }

    .flap-leaf-top,
    .flap-leaf-bottom { z-index: 1; }
    .flap-leaf-bottom { transform: rotateX(90deg); }

    .flap.is-flipping .flap-leaf-top {
      animation: flap-top {{flap-duration}} ease-in forwards;
    }

    .flap.is-flipping .flap-leaf-bottom {
      animation: flap-bottom {{flap-duration}} ease-out {{flap-duration}} forwards;
    }

    @keyframes flap-top {
      to { transform: rotateX(-90deg); }
    }

    @keyframes flap-bottom {
      from { transform: rotateX(90deg); }
      to { transform: rotateX(0deg); }
    }

    @media (prefers-reduced-motion: reduce) {
      .flip-card-inner { transition: none; }
      /* animationend가 발생해야 숫자가 확정되므로 none 대신 아주 짧게 줄임 */
      .flap.is-flipping .flap-leaf-top,
      .flap.is-flipping .flap-leaf-bottom {
        animation-duration: 1ms;
        animation-delay: 0s;
      }
    }`,
} satisfies Example;

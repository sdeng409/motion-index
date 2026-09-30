import type { Example } from '../../lib/types';
import { SUPPORT, easing } from '../../lib/shared';

export default {
  id: 'ripple',
  title: 'Ripple 버튼',
  summary: '누른 위치에서 물결이 퍼집니다.',
  desc: '누른 위치에 원을 하나 만들고, CSS가 그 원을 키우면서 흐리게 만듭니다. 애니메이션이 끝나면(`animationend`) 원을 지웁니다. 동작 줄이기 설정에서는 원을 만들지 않습니다. 키보드로 누르면 누른 위치가 없으므로 물결도 생기지 않습니다.',
  tag: 'JS', kind: 'interact', support: SUPPORT.animations,
  spec: { props: 'transform, opacity', cost: 'composite' },
  params: [
    { key: 'duration', label: '재생 시간', value: 600, min: 200, max: 1500, step: 50, unit: 'ms' },
    easing('ease-out'),
  ],
  html: `
    <button class="ripple-btn" type="button">여기를 눌러 보세요</button>`,
  css: `
    .ripple-btn {
      position: relative;
      overflow: hidden;
      padding: 14px 24px;
      border: 0;
      border-radius: 10px;
      background: #2f4bd8;
      color: #fff;
      font: 600 14px system-ui, sans-serif;
      cursor: pointer;
    }

    .ripple {
      position: absolute;
      border-radius: 50%;
      background: rgb(255 255 255 / 0.45);
      pointer-events: none;
      transform: scale(0);
      animation: ripple {{duration}} {{easing}} forwards;
    }

    @keyframes ripple {
      to {
        opacity: 0;
        transform: scale(1);
      }
    }`,
} satisfies Example;

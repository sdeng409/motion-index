import type { Example } from '../../lib/types';
import { SUPPORT, easing } from '../../lib/shared';

export default {
  id: 'toast',
  title: '토스트 알림',
  summary: '화면 아래에서 올라왔다가 잠시 후 사라집니다.',
  desc: '알림 영역에 `role="status"`를 붙여 두면, 문구를 넣는 순간 스크린 리더가 읽어 줍니다. 동작 줄이기 설정에서는 움직임 없이 서서히 나타나고 사라집니다.',
  tag: 'JS', kind: 'interact', support: SUPPORT.transitions,
  spec: { props: 'transform, opacity', cost: 'composite' },
  params: [
    { key: 'duration', label: '재생 시간', value: 240, min: 0, max: 1000, step: 10, unit: 'ms' },
    easing('cubic-bezier(0.2, 0.7, 0.2, 1)'),
    { key: 'distance', label: '움직이는 거리', value: 12, min: 0, max: 60, step: 2, unit: 'px' },
  ],
  ids: ['save-toast'],
  autoplay: '[data-toast-target]',
  html: `
    <button class="demo-btn" type="button" data-toast-target="save-toast">저장하기</button>
    <div class="toast" id="save-toast" role="status"></div>`,
  css: `
    .toast {
      position: fixed;
      left: 50%;
      bottom: 20px;
      padding: 10px 16px;
      border-radius: 10px;
      background: #15171b;
      color: #fff;
      font-size: 13px;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transform: translate(-50%, {{distance}});
      transition:
        opacity {{duration}} {{easing}},
        transform {{duration}} {{easing}};
    }

    .toast.is-visible {
      opacity: 1;
      transform: translate(-50%, 0);
    }

    @media (prefers-reduced-motion: reduce) {
      .toast { transform: translate(-50%, 0); }
    }`,
} satisfies Example;

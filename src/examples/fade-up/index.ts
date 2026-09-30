import type { Example } from '../../lib/types';
import { SUPPORT, easing } from '../../lib/shared';

export default {
  id: 'fade-up',
  title: '페이드 업 등장',
  summary: '요소가 아래에서 살짝 떠오르며 나타납니다.',
  desc: '가장 흔한 등장 효과입니다. 요소가 투명한 상태로 조금 아래에 있다가, 원래 자리로 올라오며 선명해집니다. 동작 줄이기 설정에서는 움직임 없이 서서히 나타나기만 합니다.',
  tag: 'CSS', kind: 'once', support: SUPPORT.animations,
  spec: { props: 'transform, opacity', cost: 'composite' },
  params: [
    { key: 'duration', label: '재생 시간', value: 600, min: 100, max: 2000, step: 50, unit: 'ms' },
    easing('cubic-bezier(0.2, 0.7, 0.2, 1)'),
    { key: 'distance', label: '움직이는 거리', value: 16, min: 0, max: 120, step: 2, unit: 'px' },
  ],
  html: `
    <div class="fade-up demo-card">
      <strong>새 알림 3건</strong>
      <p>지난 접속 이후 업데이트가 있습니다.</p>
    </div>`,
  css: `
    .fade-up {
      animation: fade-up {{duration}} {{easing}} both;
    }

    @keyframes fade-up {
      from {
        opacity: 0;
        transform: translateY({{distance}});
      }
    }

    @keyframes fade-up-reduced {
      from { opacity: 0; }
    }

    @media (prefers-reduced-motion: reduce) {
      .fade-up { animation-name: fade-up-reduced; }
    }`,
} satisfies Example;

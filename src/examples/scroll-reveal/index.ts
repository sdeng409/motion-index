import type { Example } from '../../lib/types';
import { SUPPORT, easing } from '../../lib/shared';

export default {
  id: 'scroll-reveal',
  title: '스크롤 등장',
  summary: '스크롤해서 화면에 들어올 때 나타납니다.',
  desc: '요소가 화면에 들어온 정도를 애니메이션 진행도로 씁니다(`animation-timeline: view()`). 반쯤 들어오면 반쯤 나타나는 식입니다. 예전에는 IntersectionObserver 같은 JS가 필요했지만, 이제는 CSS만으로 됩니다. 지원하지 않는 브라우저에서는 요소가 처음부터 보이도록 `@supports`로 감쌌습니다.',
  tag: 'CSS', kind: 'scroll', support: SUPPORT.scrollDriven,
  spec: { duration: '스크롤 위치에 연동', props: 'transform, opacity', cost: 'composite' },
  params: [
    { key: 'distance', label: '움직이는 거리', value: 80, min: 0, max: 200, step: 4, unit: 'px' },
    { key: 'scale', label: '처음 크기', value: 0.8, min: 0.4, max: 1, step: 0.05, unit: '' },
    { key: 'range-end', label: '다 나타나는 지점', value: 40, min: 5, max: 100, step: 5, unit: '%' },
    easing('ease-out'),
  ],
  html: `
    <div class="demo-stack">
      <p class="demo-scroll-intro is-short">아래로 스크롤해 보세요 ↓</p>
      <div class="reveal demo-card"><strong>1단계</strong><p>계정을 만듭니다.</p></div>
      <div class="reveal demo-card"><strong>2단계</strong><p>팀원을 초대합니다.</p></div>
      <div class="reveal demo-card"><strong>3단계</strong><p>프로필을 채웁니다.</p></div>
      <div class="reveal demo-card"><strong>4단계</strong><p>첫 프로젝트를 만듭니다.</p></div>
      <div class="reveal demo-card"><strong>5단계</strong><p>작업을 나눠 맡깁니다.</p></div>
      <div class="reveal demo-card"><strong>6단계</strong><p>진행 상황을 확인합니다.</p></div>
      <div class="reveal demo-card"><strong>7단계</strong><p>피드백을 주고받습니다.</p></div>
      <div class="reveal demo-card"><strong>8단계</strong><p>결과를 공유합니다.</p></div>
    </div>`,
  css: `
    @supports (animation-timeline: view()) {
      .reveal {
        animation: reveal {{easing}} both;
        animation-timeline: view();
        /* 화면에 들어오기 시작할 때부터 요소가 화면을 지정한 비율만큼 지나갈 때까지 재생 */
        animation-range: entry 0% cover {{range-end}};
      }
    }

    @keyframes reveal {
      from {
        opacity: 0;
        transform: translateY({{distance}}) scale({{scale}});
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .reveal { animation: none; }
    }`,
} satisfies Example;

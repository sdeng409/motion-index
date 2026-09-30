import type { Example } from '../../lib/types';
import { SUPPORT } from '../../lib/shared';

export default {
  id: 'read-progress',
  title: '읽기 진행률 바',
  summary: '스크롤한 만큼 상단 바가 채워집니다.',
  desc: '스크롤한 정도를 애니메이션 진행도로 씁니다(`animation-timeline: scroll()`). 끝까지 스크롤하면 바가 꽉 찹니다. 페이지에 넣으면 페이지 전체의 스크롤을 따라갑니다. 바는 사용자가 스크롤한 만큼만 움직이므로, 동작 줄이기 설정에서도 그대로 둡니다.',
  tag: 'CSS', kind: 'scroll', support: SUPPORT.scrollDriven,
  spec: { duration: '스크롤 위치에 연동', easing: 'linear', props: 'transform (scaleX)', cost: 'composite' },
  html: `
    <div class="read-progress" aria-hidden="true"></div>
    <article class="demo-article">
      <h3>Core Web Vitals 정리</h3>
      <p>LCP는 가장 큰 콘텐츠가 그려지는 시점입니다. 2.5초 이내를 목표로 합니다.</p>
      <p>INP는 사용자 입력에 화면이 반응하기까지 걸리는 시간입니다. 200ms 이내가 좋은 수준입니다.</p>
      <p>CLS는 레이아웃이 예고 없이 밀리는 정도입니다. 0.1 이하로 유지합니다.</p>
      <p>세 지표 모두 실제 사용자 데이터의 75번째 백분위수로 판단합니다.</p>
      <p>애니메이션을 transform과 opacity로 만들면 INP와 CLS에 영향을 주지 않습니다.</p>
    </article>`,
  css: `
    .read-progress {
      position: sticky;
      top: 0;
      z-index: 1;
      height: 4px;
      background: #2f4bd8;
      transform: scaleX(0);
      transform-origin: 0 50%;
    }

    @supports (animation-timeline: scroll()) {
      .read-progress {
        animation: read-progress linear both;
        animation-timeline: scroll();
      }
    }

    @keyframes read-progress {
      to { transform: scaleX(1); }
    }

    /* 스크롤과 1:1로 움직여서 동작 줄이기 대상에서 제외함 */`,
} satisfies Example;

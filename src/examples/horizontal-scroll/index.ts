import type { Example } from '../../lib/types';
import { SUPPORT } from '../../lib/shared';

export default {
  id: 'horizontal-scroll',
  section: 'technique',
  title: '가로 스크롤 섹션',
  summary: '아래로 스크롤하는 동안 카드가 옆으로 지나갑니다.',
  desc: '섹션을 화면보다 길게 만들고, 안쪽 내용은 화면에 고정(`sticky`)합니다. 섹션을 스크롤한 정도에 맞춰 카드 띠를 옆으로 옮기면, 세로 스크롤이 가로 이동처럼 보입니다. 크기는 `cqh`·`cqw` 단위로 적었습니다. 이 단위는 감싸는 container가 없으면 화면 크기를 기준으로 계산되므로, 페이지에 그대로 넣어도 동작합니다. 지원하지 않는 브라우저와 동작 줄이기 설정에서는 일반 가로 스크롤로 바뀝니다.',
  tag: 'CSS', kind: 'scroll', support: SUPPORT.scrollDriven,
  spec: { duration: '스크롤 위치에 연동', props: 'transform', cost: 'composite' },
  params: [
    { key: 'length', label: '스크롤 길이', value: 300, min: 150, max: 600, step: 25, unit: 'cqh' },
  ],
  html: `
    <p class="demo-scroll-intro is-short">아래로 스크롤해 보세요 ↓</p>
    <section class="h-scroll">
      <div class="h-scroll-sticky">
        <ol class="h-scroll-track">
          <li>01 기획</li>
          <li>02 디자인</li>
          <li>03 개발</li>
          <li>04 테스트</li>
          <li>05 출시</li>
        </ol>
      </div>
    </section>
    <p class="demo-scroll-outro">섹션이 끝나면 다시 세로로 스크롤됩니다</p>`,
  css: `
    .h-scroll-sticky { overflow-x: auto; }

    .h-scroll-track {
      display: flex;
      gap: 12px;
      width: max-content;
      margin: 0;
      padding: 16px;
      list-style: none;
    }

    .h-scroll-track > li {
      display: grid;
      place-items: end start;
      width: 150px;
      height: 110px;
      padding: 12px;
      box-sizing: border-box;
      border-radius: 12px;
      background: #1f2937;
      color: #fff;
      font-weight: 700;
    }

    @supports (animation-timeline: view()) {
      @media (prefers-reduced-motion: no-preference) {
        .h-scroll {
          /* 컨테이너가 없으면 cqh·cqw는 화면 크기를 기준으로 계산됨 */
          height: {{length}};
          view-timeline-name: --h-scroll;
        }

        .h-scroll-sticky {
          position: sticky;
          top: 0;
          display: flex;
          align-items: center;
          height: 100cqh;
          overflow: hidden;
        }

        .h-scroll-track {
          animation: h-scroll linear both;
          animation-timeline: --h-scroll;
          animation-range: contain 0% contain 100%;
        }
      }
    }

    @keyframes h-scroll {
      to { transform: translateX(calc(-100% + 100cqw)); }
    }`,
} satisfies Example;

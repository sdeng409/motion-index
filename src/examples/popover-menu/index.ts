import type { Example } from '../../lib/types';
import { SUPPORT, easing } from '../../lib/shared';

export default {
  id: 'popover-menu',
  title: 'Popover 드롭다운',
  summary: 'JS 없이 HTML 속성만으로 열고 닫는 메뉴입니다.',
  desc: '버튼에 `popovertarget`을 적으면 누를 때마다 메뉴가 열리고 닫힙니다. 바깥을 누르거나 Esc를 누르면 닫히는 동작도 브라우저가 알아서 처리합니다. 열리고 닫히는 효과는 모달 예제와 같은 `@starting-style` 방식입니다. 메뉴를 버튼 바로 아래에 붙이는 일은 anchor positioning이 맡으며, 지원하지 않는 브라우저에서는 메뉴가 화면 가운데에 열립니다.',
  tag: 'CSS', kind: 'interact', support: SUPPORT.popover,
  spec: { props: 'opacity, transform', cost: 'composite' },
  params: [
    { key: 'duration', label: '재생 시간', value: 180, min: 0, max: 800, step: 10, unit: 'ms' },
    easing('cubic-bezier(0.2, 0.7, 0.2, 1)'),
    { key: 'offset', label: '처음에 떨어진 거리', value: -6, min: -24, max: 0, step: 1, unit: 'px' },
  ],
  ids: ['menu-demo'],
  html: `
    <button class="demo-btn" type="button" popovertarget="menu-demo" style="anchor-name: --menu-demo">메뉴 열기 ▾</button>
    <div class="dropdown" id="menu-demo" popover style="position-anchor: --menu-demo">
      <button type="button">프로필</button>
      <button type="button">설정</button>
      <button type="button">로그아웃</button>
    </div>`,
  css: `
    .dropdown {
      display: grid;
      /* Safari 26.3에서 popover 높이가 화면 높이만큼 늘어나 항목이 나눠 갖는 문제를 막음 */
      align-content: start;
      min-width: 140px;
      padding: 6px;
      border: 1px solid #e3e5ea;
      border-radius: 12px;
      box-shadow: 0 12px 32px rgb(0 0 0 / 0.16);
      opacity: 0;
      transform: translateY({{offset}});
      transition:
        opacity {{duration}} {{easing}},
        transform {{duration}} {{easing}},
        overlay {{duration}} allow-discrete,
        display {{duration}} allow-discrete;
    }

    /* 닫혀 있을 때는 display: none을 유지해야 함 */
    .dropdown:not(:popover-open) { display: none; }

    .dropdown:popover-open {
      opacity: 1;
      transform: none;
    }

    @starting-style {
      .dropdown:popover-open {
        opacity: 0;
        transform: translateY({{offset}});
      }
    }

    .dropdown button {
      padding: 8px 10px;
      border: 0;
      border-radius: 8px;
      background: none;
      font: inherit;
      text-align: left;
      cursor: pointer;
    }

    .dropdown button:hover,
    .dropdown button:focus-visible { background: #f2f3f6; }

    /* 버튼 바로 아래에 붙임 (지원하지 않으면 화면 가운데에 열림) */
    @supports (position-area: bottom) {
      .dropdown {
        inset: auto;
        margin: 6px 0 0;
        position-area: bottom span-right;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .dropdown { transition: none; }
    }`,
} satisfies Example;

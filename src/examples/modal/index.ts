import type { Example } from '../../lib/types';
import { SUPPORT, easing } from '../../lib/shared';

export default {
  id: 'modal',
  title: '모달 열기 · 닫기',
  summary: '모달이 열릴 때와 닫힐 때 모두 부드럽게 전환됩니다.',
  desc: '`display: none`이었다가 나타나는 요소에는 원래 전환 효과를 주기 어렵습니다. `@starting-style`로 "나타나기 직전의 모습"을 정해 주면 열릴 때 효과가 생깁니다. 닫힐 때는 `allow-discrete`로 사라지는 시점을 효과가 끝날 때까지 미룹니다. 지원하지 않는 브라우저에서는 효과 없이 바로 열리고 닫힙니다. 이 갤러리의 상세 창도 같은 방식으로 만들었습니다.',
  tag: 'JS', kind: 'interact', support: SUPPORT.startingStyle,
  spec: { props: 'opacity, scale', cost: 'composite' },
  params: [
    { key: 'duration', label: '재생 시간', value: 200, min: 0, max: 1000, step: 10, unit: 'ms' },
    easing('ease-out'),
    { key: 'start-scale', label: '처음 크기', value: 0.96, min: 0.5, max: 1, step: 0.01, unit: '' },
  ],
  ids: ['confirm-dialog'],
  html: `
    <button class="demo-btn" type="button" data-dialog-target="confirm-dialog">모달 열기</button>
    <dialog class="modal" id="confirm-dialog">
      <p><strong>변경 사항을 저장할까요?</strong></p>
      <p>저장하지 않으면 수정한 내용이 사라집니다.</p>
      <form method="dialog">
        <button class="demo-btn">확인</button>
      </form>
    </dialog>`,
  css: `
    .modal {
      width: min(320px, calc(100% - 32px));
      padding: 20px;
      border: 0;
      border-radius: 14px;
      box-shadow: 0 20px 50px rgb(0 0 0 / 0.25);
      opacity: 0;
      scale: {{start-scale}};
      transition:
        opacity {{duration}} {{easing}},
        scale {{duration}} {{easing}},
        overlay {{duration}} allow-discrete,
        display {{duration}} allow-discrete;
    }

    .modal[open] {
      opacity: 1;
      scale: 1;
    }

    @starting-style {
      .modal[open] {
        opacity: 0;
        scale: {{start-scale}};
      }
    }

    .modal::backdrop {
      background: rgb(15 17 20 / 0);
      transition:
        background-color {{duration}},
        overlay {{duration}} allow-discrete,
        display {{duration}} allow-discrete;
    }

    .modal[open]::backdrop { background: rgb(15 17 20 / 0.45); }

    @starting-style {
      .modal[open]::backdrop { background: rgb(15 17 20 / 0); }
    }

    .modal p { margin: 0 0 8px; }

    @media (prefers-reduced-motion: reduce) {
      .modal,
      .modal::backdrop { transition: none; }
    }`,
} satisfies Example;

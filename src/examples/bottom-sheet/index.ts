import type { Example } from '../../lib/types';
import { SUPPORT, easing } from '../../lib/shared';

export default {
  id: 'bottom-sheet',
  title: 'Bottom sheet',
  summary: '아래에서 올라오고, 손잡이를 끌어내리면 닫힙니다.',
  desc: '열고 닫는 효과는 모달 예제와 같은 `@starting-style` 방식입니다. 끄는 동안에는 JS가 손가락 위치를 `--drag` 변수에 넣고, 시트를 손가락에 바로 붙이기 위해 전환 효과를 끕니다. 손을 떼면 전환 효과를 다시 켜는데, 시트 높이의 1/3 넘게 끌었거나 아래로 빠르게 튕겼으면 닫고 아니면 제자리로 돌아갑니다. 어느 쪽이든 손을 뗀 위치에서 이어서 움직입니다. 손잡이에는 `touch-action: none`을 줘서 끄는 동안 페이지가 스크롤되지 않게 했습니다. 바깥을 누르거나 Esc를 눌러도 닫힙니다.',
  tag: 'JS', kind: 'interact', support: SUPPORT.startingStyle,
  spec: { props: 'translate', cost: 'composite' },
  params: [
    { key: 'duration', label: '재생 시간', value: 320, min: 0, max: 1000, step: 10, unit: 'ms' },
    easing('cubic-bezier(0.32, 0.72, 0, 1)'),
  ],
  ids: ['sheet-demo'],
  html: `
    <button class="demo-btn" type="button" data-sheet-target="sheet-demo">공유 시트 열기</button>
    <dialog class="sheet" id="sheet-demo" aria-labelledby="sheet-demo-title">
      <div class="sheet-body">
        <div class="sheet-handle" aria-hidden="true"></div>
        <h3 id="sheet-demo-title">공유하기</h3>
        <p>손잡이를 아래로 끌어내리거나 바깥을 누르면 닫힙니다.</p>
        <form method="dialog">
          <button class="demo-btn">닫기</button>
        </form>
      </div>
    </dialog>`,
  css: `
    .sheet {
      width: min(480px, 100%);
      max-width: 100%;
      margin: auto auto 0;
      padding: 0;
      border: 0;
      border-radius: 16px 16px 0 0;
      box-shadow: 0 -8px 32px rgb(0 0 0 / 0.16);
      translate: 0 100%;
      transition:
        translate {{duration}} {{easing}},
        overlay {{duration}} allow-discrete,
        display {{duration}} allow-discrete;
    }

    .sheet[open] { translate: 0 var(--drag, 0px); }

    @starting-style {
      .sheet[open] { translate: 0 100%; }
    }

    /* 끄는 동안에는 손가락을 바로 따라오게 함 */
    .sheet.is-dragging { transition: none; }

    .sheet::backdrop {
      background: rgb(15 17 20 / 0);
      transition:
        background-color {{duration}},
        overlay {{duration}} allow-discrete,
        display {{duration}} allow-discrete;
    }

    .sheet[open]::backdrop { background: rgb(15 17 20 / 0.45); }

    @starting-style {
      .sheet[open]::backdrop { background: rgb(15 17 20 / 0); }
    }

    /* 바깥 클릭을 dialog 자체에 대한 클릭으로 구분하기 위해 안쪽 여백은 여기에 둠 */
    .sheet-body { padding: 8px 20px 24px; }

    .sheet-body h3 { margin: 0 0 4px; font-size: 16px; }
    .sheet-body p { margin: 0 0 16px; color: #5b6270; }

    .sheet-handle {
      width: 40px;
      height: 5px;
      margin: 0 auto 12px;
      /* 손가락으로 잡기 쉽게 보이는 막대보다 넓게 잡히게 함 */
      border: solid transparent;
      border-width: 10px 30px;
      border-radius: 999px;
      background: #d1d5db padding-box;
      cursor: grab;
      touch-action: none;
    }

    .sheet.is-dragging .sheet-handle { cursor: grabbing; }

    @media (prefers-reduced-motion: reduce) {
      .sheet,
      .sheet::backdrop { transition: none; }
    }`,
} satisfies Example;

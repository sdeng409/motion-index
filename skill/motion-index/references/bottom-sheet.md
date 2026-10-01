# Bottom sheet

> 아래에서 올라오고, 손잡이를 끌어내리면 닫힙니다.

열고 닫는 효과는 모달 예제와 같은 `@starting-style` 방식입니다. 끄는 동안에는 JS가 손가락 위치를 `--drag` 변수에 넣고, 시트를 손가락에 바로 붙이기 위해 전환 효과를 끕니다. 손을 떼면 전환 효과를 다시 켜는데, 시트 높이의 1/3 넘게 끌었거나 아래로 빠르게 튕겼으면 닫고 아니면 제자리로 돌아갑니다. 어느 쪽이든 손을 뗀 위치에서 이어서 움직입니다. 손잡이에는 `touch-action: none`을 줘서 끄는 동안 페이지가 스크롤되지 않게 했습니다. 바깥을 누르거나 Esc를 눌러도 닫힙니다.

- 원본: https://example.github.io/motion-index/bottom-sheet/
- 구현: CSS + 상태를 바꾸는 JS
- 애니메이션 속성: translate (렌더링 비용 Composite)
- 지원 브라우저: Chrome 117 · Edge 117 · Firefox 129 · Safari 17.5

## 기본값

예제의 기본값입니다. 값이 거의 같은(차이 10% 이내) 디자인 토큰이 있으면 토큰으로 바꿔도 됩니다.

- 재생 시간: `320ms` (조정 범위 0ms ~ 1000ms)
- 속도 변화: `cubic-bezier(0.32, 0.72, 0, 1)`

## HTML

```html
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
</dialog>
```

## CSS

```css
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
    translate 320ms cubic-bezier(0.32, 0.72, 0, 1),
    overlay 320ms allow-discrete,
    display 320ms allow-discrete;
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
    background-color 320ms,
    overlay 320ms allow-discrete,
    display 320ms allow-discrete;
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
}
```

## JS

```js
document.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-sheet-target]');
  if (trigger) {
    document.getElementById(trigger.dataset.sheetTarget).showModal();
    return;
  }
  // 안쪽 내용이 아니라 dialog 자체가 눌렸으면 바깥(backdrop)을 누른 것
  if (event.target.matches('.sheet')) event.target.close();
});

let drag = null;

document.addEventListener('pointerdown', (event) => {
  const handle = event.target.closest('.sheet-handle');
  if (!handle) return;
  handle.setPointerCapture(event.pointerId);
  const sheet = handle.closest('.sheet');
  sheet.classList.add('is-dragging');
  drag = { sheet, startY: event.clientY, lastY: event.clientY, lastTime: event.timeStamp, velocity: 0 };
});

document.addEventListener('pointermove', (event) => {
  if (!drag) return;
  drag.velocity = (event.clientY - drag.lastY) / Math.max(event.timeStamp - drag.lastTime, 1);
  drag.lastY = event.clientY;
  drag.lastTime = event.timeStamp;
  drag.sheet.style.setProperty('--drag', `${Math.max(0, event.clientY - drag.startY)}px`);
});

function release(event) {
  if (!drag) return;
  const { sheet, startY, velocity } = drag;
  drag = null;
  sheet.classList.remove('is-dragging');
  sheet.style.removeProperty('--drag');
  // 높이의 1/3 넘게 끌었거나 아래로 빠르게(0.5px/ms 이상) 튕기면 닫음
  if (event.clientY - startY > sheet.offsetHeight / 3 || velocity > 0.5) sheet.close();
}

document.addEventListener('pointerup', release);
document.addEventListener('pointercancel', release);
```

## 옮길 때 지킬 것

- 움직임은 CSS(transition·animation·@keyframes)가 맡고, JS는 상태(class·속성·popover·dialog)를 바꾸는 일만 합니다. 옮길 때도 이 역할 분리를 유지하세요.
- `prefers-reduced-motion: reduce` 블록과 `@supports` 가드는 지우지 말고 함께 옮기세요. 지원하지 않는 브라우저에서도 콘텐츠는 정적으로 보여야 합니다.
- 렌더링 비용 등급을 지키세요. transform·opacity로 만든 효과를 top·left·width·height 같은 layout 속성으로 바꾸지 마세요.
- `demo-`로 시작하는 class는 미리보기 모양을 위한 것이므로 옮기지 말고, 대상 코드의 기존 요소와 스타일을 쓰세요.
- class 이름과 selector는 대상 코드의 이름 규칙에 맞게 바꾸고, 스타일링 방식(CSS Modules, Tailwind, CSS-in-JS 등)에 맞춰 옮기세요. Tailwind라면 @keyframes와 복잡한 selector는 전역 CSS나 @layer에 두는 편이 읽기 쉽습니다.
- document에 이벤트를 위임한 vanilla JS는, React·Vue·Svelte 등에서는 해당 컴포넌트의 이벤트 핸들러와 ref로 옮기세요. `getElementById`로 찾던 요소는 ref로 바꾸세요.
- 수치(시간·거리·easing): "조정한 값"은 사용자가 직접 고른 값이므로 디자인 토큰으로 바꾸지 말고 그대로 쓰세요. "기본값"은 값이 거의 같은(차이 10% 이내) 토큰이 있을 때만 토큰으로 바꾸고, 그렇지 않으면 예제 값을 쓰되 가까운 토큰이 있다는 사실을 보고에 적으세요.
- 요소를 없애기 전(조건부 렌더링에서 빠질 때, 목록에서 삭제할 때)에 사라지는 효과를 보여 주려면, 상태를 바꾼 뒤 `element.getAnimations()`의 `finished`가 모두 끝나기를 기다렸다가 없애세요. `transitionend`만 기다리면 재생 시간이 0이거나 효과가 꺼져 있을 때 요소가 영영 없어지지 않습니다. 없애는 요소에 키보드 포커스가 있었다면 다음 항목처럼 알맞은 곳으로 옮기세요.
- 옮긴 뒤에는 브라우저에서 실제로 재생되는지와, 동작 줄이기 설정(`prefers-reduced-motion: reduce`)을 켰을 때 효과가 꺼지는지를 모두 확인하세요. 이 설정은 Chrome DevTools의 Rendering 패널, CDP의 `Emulation.setEmulatedMedia`, Playwright의 `reducedMotion: 'reduce'`로 켤 수 있습니다. CSS에 규칙이 있는지만 본 것은 확인이 아니며, 확인하지 못한 항목은 보고에 밝히세요.

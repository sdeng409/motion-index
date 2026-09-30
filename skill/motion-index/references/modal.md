# 모달 열기 · 닫기

> 모달이 열릴 때와 닫힐 때 모두 부드럽게 전환됩니다.

`display: none`이었다가 나타나는 요소에는 원래 전환 효과를 주기 어렵습니다. `@starting-style`로 "나타나기 직전의 모습"을 정해 주면 열릴 때 효과가 생깁니다. 닫힐 때는 `allow-discrete`로 사라지는 시점을 효과가 끝날 때까지 미룹니다. 지원하지 않는 브라우저에서는 효과 없이 바로 열리고 닫힙니다. 이 갤러리의 상세 창도 같은 방식으로 만들었습니다.

- 원본: https://example.github.io/motion-index/modal/
- 구현: CSS + 상태를 바꾸는 JS
- 애니메이션 속성: opacity, scale (렌더링 비용 Composite)
- 지원 브라우저: Chrome 117 · Edge 117 · Firefox 129 · Safari 17.5

## 기본값

- 재생 시간: `200ms` (조정 범위 0ms ~ 1000ms)
- 속도 변화: `ease-out`
- 처음 크기: `0.96` (조정 범위 0.5 ~ 1)

## HTML

```html
<button class="demo-btn" type="button" data-dialog-target="confirm-dialog">모달 열기</button>
<dialog class="modal" id="confirm-dialog">
  <p><strong>변경 사항을 저장할까요?</strong></p>
  <p>저장하지 않으면 수정한 내용이 사라집니다.</p>
  <form method="dialog">
    <button class="demo-btn">확인</button>
  </form>
</dialog>
```

## CSS

```css
.modal {
  width: min(320px, calc(100% - 32px));
  padding: 20px;
  border: 0;
  border-radius: 14px;
  box-shadow: 0 20px 50px rgb(0 0 0 / 0.25);
  opacity: 0;
  scale: 0.96;
  transition:
    opacity 200ms ease-out,
    scale 200ms ease-out,
    overlay 200ms allow-discrete,
    display 200ms allow-discrete;
}

.modal[open] {
  opacity: 1;
  scale: 1;
}

@starting-style {
  .modal[open] {
    opacity: 0;
    scale: 0.96;
  }
}

.modal::backdrop {
  background: rgb(15 17 20 / 0);
  transition:
    background-color 200ms,
    overlay 200ms allow-discrete,
    display 200ms allow-discrete;
}

.modal[open]::backdrop { background: rgb(15 17 20 / 0.45); }

@starting-style {
  .modal[open]::backdrop { background: rgb(15 17 20 / 0); }
}

.modal p { margin: 0 0 8px; }

@media (prefers-reduced-motion: reduce) {
  .modal,
  .modal::backdrop { transition: none; }
}
```

## JS

```js
document.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-dialog-target]');
  if (!trigger) return;
  document.getElementById(trigger.dataset.dialogTarget).showModal();
});
```

## 옮길 때 지킬 것

- 움직임은 CSS(transition·animation·@keyframes)가 맡고, JS는 상태(class·속성·popover·dialog)를 바꾸는 일만 합니다. 옮길 때도 이 역할 분리를 유지하세요.
- `prefers-reduced-motion: reduce` 블록과 `@supports` 가드는 지우지 말고 함께 옮기세요. 지원하지 않는 브라우저에서도 콘텐츠는 정적으로 보여야 합니다.
- 렌더링 비용 등급을 지키세요. transform·opacity로 만든 효과를 top·left·width·height 같은 layout 속성으로 바꾸지 마세요.
- `demo-`로 시작하는 class는 미리보기 모양을 위한 것이므로 옮기지 말고, 대상 코드의 기존 요소와 스타일을 쓰세요.
- class 이름과 selector는 대상 코드의 이름 규칙에 맞게 바꾸고, 스타일링 방식(CSS Modules, Tailwind, CSS-in-JS 등)에 맞춰 옮기세요. Tailwind라면 @keyframes와 복잡한 selector는 전역 CSS나 @layer에 두는 편이 읽기 쉽습니다.
- document에 이벤트를 위임한 vanilla JS는, React·Vue·Svelte 등에서는 해당 컴포넌트의 이벤트 핸들러와 ref로 옮기세요. `getElementById`로 찾던 요소는 ref로 바꾸세요.
- 예제의 수치(시간·거리·easing)는 조정된 값입니다. 대상 코드에 디자인 토큰이 있으면 가장 가까운 토큰으로 바꾸고, 없으면 그대로 쓰세요.

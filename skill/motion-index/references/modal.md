# 모달 열기 · 닫기

> 모달이 열릴 때와 닫힐 때 모두 부드럽게 전환됩니다.

`display: none`이었다가 나타나는 요소에는 원래 전환 효과를 주기 어렵습니다. `@starting-style`로 "나타나기 직전의 모습"을 정해 주면 열릴 때 효과가 생깁니다. 닫힐 때는 `allow-discrete`로 사라지는 시점을 효과가 끝날 때까지 미룹니다. 지원하지 않는 브라우저에서는 효과 없이 바로 열리고 닫힙니다. 이 갤러리의 상세 창도 같은 방식으로 만들었습니다.

- 원본: https://motion-lib.pages.dev/modal/
- 구현: CSS + 상태를 바꾸는 JS
- 애니메이션 속성: opacity, scale (렌더링 비용 Composite)
- 지원 브라우저: Chrome 117 · Edge 117 · Firefox 129 · Safari 17.5

## 기본값

예제의 기본값입니다. 값이 거의 같은(차이 10% 이내) 디자인 토큰이 있으면 토큰으로 바꿔도 됩니다.

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
- 수치(시간·거리·easing): "조정한 값"은 사용자가 직접 고른 값이므로 디자인 토큰으로 바꾸지 말고 그대로 쓰세요. "기본값"은 값이 거의 같은(차이 10% 이내) 토큰이 있을 때만 토큰으로 바꾸고, 그렇지 않으면 예제 값을 쓰되 가까운 토큰이 있다는 사실을 보고에 적으세요.
- 요소를 없애기 전(조건부 렌더링에서 빠질 때, 목록에서 삭제할 때)에 사라지는 효과를 보여 주려면, 상태를 바꾼 뒤 `element.getAnimations()`의 `finished`가 모두 끝나기를 기다렸다가 없애세요. `transitionend`만 기다리면 재생 시간이 0이거나 효과가 꺼져 있을 때 요소가 영영 없어지지 않습니다. 없애는 요소에 키보드 포커스가 있었다면 다음 항목처럼 알맞은 곳으로 옮기세요.
- 옮긴 뒤에는 브라우저에서 실제로 재생되는지와, 동작 줄이기 설정(`prefers-reduced-motion: reduce`)을 켰을 때 효과가 꺼지는지를 모두 확인하세요. 이 설정은 Chrome DevTools의 Rendering 패널, CDP의 `Emulation.setEmulatedMedia`, Playwright의 `reducedMotion: 'reduce'`로 켤 수 있습니다. CSS에 규칙이 있는지만 본 것은 확인이 아니며, 확인하지 못한 항목은 보고에 밝히세요.

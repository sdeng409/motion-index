# Popover 드롭다운

> JS 없이 HTML 속성만으로 열고 닫는 메뉴입니다.

버튼에 `popovertarget`을 적으면 누를 때마다 메뉴가 열리고 닫힙니다. 바깥을 누르거나 Esc를 누르면 닫히는 동작도 브라우저가 알아서 처리합니다. 열리고 닫히는 효과는 모달 예제와 같은 `@starting-style` 방식입니다. 메뉴를 버튼 바로 아래에 붙이는 일은 anchor positioning이 맡으며, 지원하지 않는 브라우저에서는 메뉴가 화면 가운데에 열립니다.

- 원본: https://example.github.io/motion-index/popover-menu/
- 구현: CSS만 사용
- 애니메이션 속성: opacity, transform (렌더링 비용 Composite)
- 지원 브라우저: Chrome 116 · Edge 116 · Firefox 125 · Safari 17

## 기본값

- 재생 시간: `180ms` (조정 범위 0ms ~ 800ms)
- 속도 변화: `cubic-bezier(0.2, 0.7, 0.2, 1)`
- 처음에 떨어진 거리: `-6px` (조정 범위 -24px ~ 0px)

## HTML

```html
<button class="demo-btn" type="button" popovertarget="menu-demo" style="anchor-name: --menu-demo">메뉴 열기 ▾</button>
<div class="dropdown" id="menu-demo" popover style="position-anchor: --menu-demo">
  <button type="button">프로필</button>
  <button type="button">설정</button>
  <button type="button">로그아웃</button>
</div>
```

## CSS

```css
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
  transform: translateY(-6px);
  transition:
    opacity 180ms cubic-bezier(0.2, 0.7, 0.2, 1),
    transform 180ms cubic-bezier(0.2, 0.7, 0.2, 1),
    overlay 180ms allow-discrete,
    display 180ms allow-discrete;
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
    transform: translateY(-6px);
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
}
```

## 옮길 때 지킬 것

- 움직임은 CSS(transition·animation·@keyframes)가 맡고, JS는 상태(class·속성·popover·dialog)를 바꾸는 일만 합니다. 옮길 때도 이 역할 분리를 유지하세요.
- `prefers-reduced-motion: reduce` 블록과 `@supports` 가드는 지우지 말고 함께 옮기세요. 지원하지 않는 브라우저에서도 콘텐츠는 정적으로 보여야 합니다.
- 렌더링 비용 등급을 지키세요. transform·opacity로 만든 효과를 top·left·width·height 같은 layout 속성으로 바꾸지 마세요.
- `demo-`로 시작하는 class는 미리보기 모양을 위한 것이므로 옮기지 말고, 대상 코드의 기존 요소와 스타일을 쓰세요.
- class 이름과 selector는 대상 코드의 이름 규칙에 맞게 바꾸고, 스타일링 방식(CSS Modules, Tailwind, CSS-in-JS 등)에 맞춰 옮기세요. Tailwind라면 @keyframes와 복잡한 selector는 전역 CSS나 @layer에 두는 편이 읽기 쉽습니다.
- document에 이벤트를 위임한 vanilla JS는, React·Vue·Svelte 등에서는 해당 컴포넌트의 이벤트 핸들러와 ref로 옮기세요. `getElementById`로 찾던 요소는 ref로 바꾸세요.
- 예제의 수치(시간·거리·easing)는 조정된 값입니다. 대상 코드에 디자인 토큰이 있으면 가장 가까운 토큰으로 바꾸고, 없으면 그대로 쓰세요.

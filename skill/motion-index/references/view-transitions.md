# View Transitions

> 화면을 바꾸는 코드를 감싸기만 하면 브라우저가 전환을 만들어 줍니다.

브라우저가 바뀌기 전과 바뀐 후의 화면을 찍어 두고, 같은 이름이 붙은 요소끼리 부드럽게 이어 줍니다. 브라우저에 FLIP이 내장되어 있는 셈입니다. 코드는 FLIP보다 훨씬 짧지만, 움직이는 것이 실제 요소가 아니라 찍어 둔 이미지라서 전환 중에는 누를 수 없습니다. 이름(`view-transition-name`)이 붙은 요소는 페이지 어디에 있든 함께 찍히므로, 전환하는 동안에만 해당 목록에 이름을 붙였다가 뗍니다. 지원하지 않는 브라우저에서는 전환 없이 바로 바뀝니다.

- 원본: https://example.github.io/motion-index/view-transitions/
- 구현: CSS + 상태를 바꾸는 JS
- 애니메이션 속성: ::view-transition-group (transform, size) (렌더링 비용 Composite)
- 지원 브라우저: Chrome 125 · Edge 125 · Firefox 144 · Safari 18.2

## 기본값

- 재생 시간: `500ms` (조정 범위 100ms ~ 1500ms)
- 속도 변화: `cubic-bezier(0.2, 0.7, 0.2, 1)`

## HTML

```html
<div class="demo-stack">
  <ul class="vt-list demo-tiles" id="vt-demo">
    <li>1</li><li>2</li><li>3</li><li>4</li><li>5</li><li>6</li>
  </ul>
  <button class="demo-btn" type="button" data-vt-shuffle="vt-demo">섞기</button>
</div>
```

## CSS

```css
.vt-list > li { view-transition-class: vt-tile; }

::view-transition-group(*.vt-tile) {
  animation-duration: 500ms;
  animation-timing-function: cubic-bezier(0.2, 0.7, 0.2, 1);
}

@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*.vt-tile) { animation-duration: 0s; }
}
```

## JS

```js
document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-vt-shuffle]');
  if (!button) return;
  const list = document.getElementById(button.dataset.vtShuffle);
  const items = [...list.children];
  const shuffle = () => {
    items.sort(() => Math.random() - 0.5).forEach((item) => list.append(item));
  };
  if (!document.startViewTransition) {
    shuffle();
    return;
  }
  // 이름이 붙은 요소는 문서 전체에서 캡처되므로, 이 목록에만 전환하는 동안 이름을 붙임
  items.forEach((item, index) => {
    item.style.viewTransitionName = `vt-tile-${index + 1}`;
  });
  const transition = document.startViewTransition(shuffle);
  transition.finished.finally(() => {
    items.forEach((item) => { item.style.viewTransitionName = ''; });
  });
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

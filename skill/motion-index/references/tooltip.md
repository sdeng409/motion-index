# Tooltip

> 잠시 머무르면 나타나고, 마우스를 옮겨도 바로 사라지지 않습니다.

나타날 때와 사라질 때 `transition-delay`를 다르게 줍니다. 나타날 때는 잠깐 기다려서, 마우스가 지나가기만 해도 툴팁이 깜빡이는 일을 막습니다. 사라질 때는 짧게 기다려서, 마우스를 툴팁 위로 옮기는 동안 닫히지 않게 합니다. `visibility`는 중간값이 없으므로 사라질 때만 효과가 끝날 때까지 늦춥니다. 키보드로 버튼에 이동해도 보이고, Esc를 누르면 마우스나 포커스를 옮기지 않아도 닫힙니다(WCAG 1.4.13). JS는 Esc로 닫은 상태만 기록합니다.

- 원본: https://motion-index.pages.dev/tooltip/
- 구현: CSS + 상태를 바꾸는 JS
- 애니메이션 속성: opacity, transform (렌더링 비용 Composite)
- 지원 브라우저: Chrome 26 · Edge 12 · Firefox 16 · Safari 9

## 기본값

예제의 기본값입니다. 값이 거의 같은(차이 10% 이내) 디자인 토큰이 있으면 토큰으로 바꿔도 됩니다.

- 나타나기 전 대기: `400ms` (조정 범위 0ms ~ 1000ms)
- 재생 시간: `150ms` (조정 범위 0ms ~ 500ms)
- 처음에 떨어진 거리: `4px` (조정 범위 0px ~ 16px)

## HTML

```html
<span class="tip">
  <button class="demo-btn" type="button" aria-describedby="tip-demo">공유</button>
  <span class="tooltip" role="tooltip" id="tip-demo">링크를 복사해 다른 사람에게 보냅니다</span>
</span>
```

## CSS

```css
.tip {
  position: relative;
  display: inline-block;
}

.tooltip {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  width: max-content;
  max-width: 220px;
  padding: 6px 10px;
  border-radius: 8px;
  background: #1f2329;
  color: #fff;
  font: 13px/1.4 system-ui, sans-serif;
  opacity: 0;
  visibility: hidden;
  transform: translate(-50%, 4px);
  /* 사라질 때: 100ms 기다렸다가 흐려지고, 다 흐려진 뒤에 visibility를 끔 */
  transition:
    opacity 150ms ease-out 100ms,
    transform 150ms ease-out 100ms,
    visibility 0s calc(100ms + 150ms);
}

/* 버튼과 툴팁 사이의 틈을 덮어서, 마우스가 툴팁으로 넘어가는 동안 hover가 끊기지 않게 함 */
.tooltip::after {
  content: "";
  position: absolute;
  inset: 100% 0 -8px;
}

.tip:not(.is-dismissed):hover .tooltip,
.tip:not(.is-dismissed) :focus-visible + .tooltip {
  opacity: 1;
  visibility: visible;
  transform: translate(-50%, 0);
  transition-delay: 400ms;
}

@media (prefers-reduced-motion: reduce) {
  .tooltip { transform: translate(-50%, 0); }
}
```

## JS

```js
// Esc로 닫은 툴팁은 마우스가 떠나거나 포커스가 빠질 때까지 다시 열리지 않게 함
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  const tips = document.querySelectorAll('.tip:hover:not(.is-dismissed), .tip:focus-within:not(.is-dismissed)');
  if (!tips.length) return;
  // 모달 안에서도 툴팁만 닫히고 모달은 그대로 있게 함
  event.preventDefault();
  tips.forEach((tip) => tip.classList.add('is-dismissed'));
});

function reset(event) {
  const tip = event.target.closest('.tip');
  if (tip && !tip.contains(event.relatedTarget)) tip.classList.remove('is-dismissed');
}

document.addEventListener('pointerout', reset);
document.addEventListener('focusout', reset);
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

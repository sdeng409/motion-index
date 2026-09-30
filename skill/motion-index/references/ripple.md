# Ripple 버튼

> 누른 위치에서 물결이 퍼집니다.

누른 위치에 원을 하나 만들고, CSS가 그 원을 키우면서 흐리게 만듭니다. 애니메이션이 끝나면(`animationend`) 원을 지웁니다. 동작 줄이기 설정에서는 원을 만들지 않습니다. 키보드로 누르면 누른 위치가 없으므로 물결도 생기지 않습니다.

- 원본: https://example.github.io/motion-index/ripple/
- 구현: CSS + 상태를 바꾸는 JS
- 애니메이션 속성: transform, opacity (렌더링 비용 Composite)
- 지원 브라우저: Chrome 43 · Edge 12 · Firefox 16 · Safari 9

## 기본값

- 재생 시간: `600ms` (조정 범위 200ms ~ 1500ms)
- 속도 변화: `ease-out`

## HTML

```html
<button class="ripple-btn" type="button">여기를 눌러 보세요</button>
```

## CSS

```css
.ripple-btn {
  position: relative;
  overflow: hidden;
  padding: 14px 24px;
  border: 0;
  border-radius: 10px;
  background: #2f4bd8;
  color: #fff;
  font: 600 14px system-ui, sans-serif;
  cursor: pointer;
}

.ripple {
  position: absolute;
  border-radius: 50%;
  background: rgb(255 255 255 / 0.45);
  pointer-events: none;
  transform: scale(0);
  animation: ripple 600ms ease-out forwards;
}

@keyframes ripple {
  to {
    opacity: 0;
    transform: scale(1);
  }
}
```

## JS

```js
document.addEventListener('pointerdown', (event) => {
  const button = event.target.closest('.ripple-btn');
  if (!button || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 2;
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;
  ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
  ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
  ripple.addEventListener('animationend', () => ripple.remove());
  button.append(ripple);
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

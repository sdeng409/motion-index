# 버튼 hover · press

> 마우스를 올리면 떠오르고, 누르면 살짝 작아집니다.

누를 수 있다는 느낌을 주는 기본 반응입니다. hover 효과는 마우스가 있는 기기에서만 켜지도록 `@media (hover: hover)`로 감쌌습니다. 그렇게 하지 않으면 터치 기기에서 한 번 누른 뒤에 떠오른 상태가 그대로 남습니다. 그림자도 함께 바뀌어서, `transform`만 바꾸는 효과보다는 조금 무겁습니다.

- 원본: https://example.github.io/motion-index/button-press/
- 구현: CSS만 사용
- 애니메이션 속성: transform, box-shadow (렌더링 비용 Paint)
- 지원 브라우저: Chrome 26 · Edge 12 · Firefox 16 · Safari 9

## 기본값

- 떠오르는 시간: `160ms` (조정 범위 0ms ~ 600ms)
- 떠오르는 높이: `-2px` (조정 범위 -12px ~ 0px)
- 눌렀을 때 크기: `0.97` (조정 범위 0.8 ~ 1)

## HTML

```html
<button class="lift-btn" type="button">무료로 시작하기</button>
```

## CSS

```css
.lift-btn {
  padding: 10px 18px;
  border: 0;
  border-radius: 10px;
  background: #1f2937;
  color: #fff;
  font: 600 14px/1 system-ui, sans-serif;
  cursor: pointer;
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.2);
  transition: transform 160ms ease, box-shadow 160ms ease;
}

@media (hover: hover) {
  .lift-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 18px rgb(0 0 0 / 0.18);
  }
}

.lift-btn:active {
  transform: translateY(0) scale(0.97);
  transition-duration: 60ms;
}

.lift-btn:focus-visible {
  outline: 2px solid #2f4bd8;
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  .lift-btn { transition: none; }
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

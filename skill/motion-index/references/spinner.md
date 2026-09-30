# 로딩 스피너

> 테두리 한쪽만 색이 다른 원이 돕니다.

로딩 중이라는 사실은 꼭 알려야 하므로, 동작 줄이기 설정에서도 멈추지 않고 천천히 돕니다. `role="status"`와 `aria-label`로 스크린 리더에도 로딩 중임을 알립니다.

- 원본: https://example.github.io/motion-index/spinner/
- 구현: CSS만 사용
- 애니메이션 속성: transform (렌더링 비용 Composite)
- 지원 브라우저: Chrome 43 · Edge 12 · Firefox 16 · Safari 9

## 기본값

- 한 바퀴 도는 시간: `800ms` (조정 범위 200ms ~ 3000ms)

## HTML

```html
<span class="spinner" role="status" aria-label="불러오는 중"></span>
```

## CSS

```css
.spinner {
  display: inline-block;
  width: 32px;
  height: 32px;
  border: 3px solid #d5d9e0;
  border-top-color: #2f4bd8;
  border-radius: 50%;
  animation: spinner-rotate 800ms linear infinite;
}

@keyframes spinner-rotate {
  to { transform: rotate(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .spinner { animation-duration: calc(800ms * 3); }
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

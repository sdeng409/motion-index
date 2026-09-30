# Typing indicator

> 채팅의 "입력 중" 점 세 개가 차례로 튀어 오릅니다.

세 점에 같은 애니메이션을 주고, 시작 시간만 한 주기의 15%씩 늦춥니다. 늦추는 시간을 주기에 비례해서 계산하므로, 속도를 바꿔도 점들이 이어서 튀는 리듬이 유지됩니다.

- 원본: https://example.github.io/motion-index/typing-indicator/
- 구현: CSS만 사용
- 애니메이션 속성: transform, opacity (렌더링 비용 Composite)
- 지원 브라우저: Chrome 43 · Edge 12 · Firefox 16 · Safari 9

## 기본값

- 한 번 반복 시간: `1200ms` (조정 범위 400ms ~ 3000ms)
- 튀어 오르는 높이: `5px` (조정 범위 0px ~ 16px)

## HTML

```html
<div class="typing" role="status" aria-label="상대방이 입력 중">
  <span></span><span></span><span></span>
</div>
```

## CSS

```css
.typing {
  display: inline-flex;
  gap: 5px;
  padding: 12px 16px;
  border-radius: 18px 18px 18px 4px;
  background: #e9ebf0;
}

.typing span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #6b7280;
  animation: typing-bounce 1200ms ease-in-out infinite;
}

.typing span:nth-child(2) { animation-delay: calc(1200ms * 0.15); }
.typing span:nth-child(3) { animation-delay: calc(1200ms * 0.3); }

@keyframes typing-bounce {
  0%, 60%, 100% { opacity: 0.4; transform: none; }
  30% { opacity: 1; transform: translateY(calc(5px * -1)); }
}

@media (prefers-reduced-motion: reduce) {
  .typing span { animation: none; }
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

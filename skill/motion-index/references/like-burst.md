# 좋아요 하트 burst

> 누르면 하트가 튀어 오르고 주변으로 조각이 퍼집니다.

JS는 눌림 상태(`aria-pressed`)만 바꿉니다. 눌린 상태가 되는 순간 CSS 규칙이 새로 적용되면서 애니메이션이 시작되고, 좋아요를 취소하면 효과 없이 원래대로 돌아갑니다. 퍼지는 링은 `::before`로, 점 여섯 개는 `::after`에 배경을 여러 겹 깔아서 그렸습니다. 그래서 HTML 요소를 더 만들 필요가 없습니다.

- 원본: https://example.github.io/motion-index/like-burst/
- 구현: CSS + 상태를 바꾸는 JS
- 애니메이션 속성: transform, opacity, fill (렌더링 비용 Paint)
- 지원 브라우저: Chrome 43 · Edge 12 · Firefox 16 · Safari 9

## 기본값

- 재생 시간: `600ms` (조정 범위 200ms ~ 1500ms)
- 커지는 정도: `1.25` (조정 범위 1 ~ 1.8)

## HTML

```html
<button class="like-btn" type="button" aria-pressed="false" aria-label="좋아요">
  <svg class="like-heart" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 20.5s-7.3-4.4-9.3-8.8C1.4 8.6 3.4 5 6.8 5c2 0 3.6 1.1 5.2 3 1.6-1.9 3.2-3 5.2-3 3.4 0 5.4 3.6 4.1 6.7-2 4.4-9.3 8.8-9.3 8.8z" />
  </svg>
</button>
```

## CSS

```css
.like-btn {
  position: relative;
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  border: 0;
  border-radius: 50%;
  background: none;
  cursor: pointer;
}

.like-heart {
  width: 32px;
  height: 32px;
  fill: transparent;
  stroke: #9ca3af;
  stroke-width: 2;
  transition: fill 150ms, stroke 150ms;
}

.like-btn[aria-pressed="true"] .like-heart {
  fill: #ef4444;
  stroke: #ef4444;
  animation: like-pop 600ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
}

/* 링 */
.like-btn::before {
  content: "";
  position: absolute;
  inset: 4px;
  border: 2px solid #ef4444;
  border-radius: 50%;
  opacity: 0;
}

/* 퍼지는 점 여섯 개 */
.like-btn::after {
  content: "";
  position: absolute;
  inset: -8px;
  background:
    radial-gradient(circle, #ef4444 45%, transparent 50%) 50% 0% / 7px 7px no-repeat,
    radial-gradient(circle, #f59e0b 45%, transparent 50%) 93% 25% / 7px 7px no-repeat,
    radial-gradient(circle, #ef4444 45%, transparent 50%) 93% 75% / 7px 7px no-repeat,
    radial-gradient(circle, #f59e0b 45%, transparent 50%) 50% 100% / 7px 7px no-repeat,
    radial-gradient(circle, #ef4444 45%, transparent 50%) 7% 75% / 7px 7px no-repeat,
    radial-gradient(circle, #f59e0b 45%, transparent 50%) 7% 25% / 7px 7px no-repeat;
  opacity: 0;
}

.like-btn[aria-pressed="true"]::before { animation: like-ring 600ms ease-out; }
.like-btn[aria-pressed="true"]::after { animation: like-dots 600ms ease-out; }

@keyframes like-pop {
  30% { transform: scale(0.7); }
  60% { transform: scale(1.25); }
}

@keyframes like-ring {
  from { opacity: 1; transform: scale(0.3); }
  to { opacity: 0; transform: scale(1.3); }
}

@keyframes like-dots {
  from { opacity: 1; transform: scale(0.5); }
  to { opacity: 0; transform: scale(1.25); }
}

@media (prefers-reduced-motion: reduce) {
  .like-btn[aria-pressed="true"] .like-heart,
  .like-btn[aria-pressed="true"]::before,
  .like-btn[aria-pressed="true"]::after { animation: none; }
}
```

## JS

```js
document.addEventListener('click', (event) => {
  const button = event.target.closest('.like-btn');
  if (!button) return;
  const liked = button.getAttribute('aria-pressed') === 'true';
  button.setAttribute('aria-pressed', String(!liked));
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

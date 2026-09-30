# Motion path

> 요소가 정해 둔 곡선을 따라 이동합니다.

`offset-path`에 이동할 경로를 그려 두고 `offset-distance`를 0%에서 100%로 바꾸면, 요소가 그 경로를 따라갑니다. `offset-rotate: auto`를 주면 화살표처럼 진행 방향을 바라보며 움직입니다. 상품이 장바구니로 날아가 담기는 효과처럼 궤적이 필요한 곳에 씁니다.

- 원본: https://example.github.io/motion-index/motion-path/
- 구현: CSS만 사용
- 애니메이션 속성: offset-distance (렌더링 비용 Composite)
- 지원 브라우저: Chrome 55 · Edge 79 · Firefox 72 · Safari 16

## 기본값

- 재생 시간: `1200ms` (조정 범위 200ms ~ 3000ms)
- 속도 변화: `cubic-bezier(0.65, 0, 0.35, 1)`
- 두 번째 출발 늦추기: `180ms` (조정 범위 0ms ~ 1000ms)

## HTML

```html
<div class="path-area">
  <svg class="demo-path-guide" viewBox="0 0 220 120" aria-hidden="true">
    <path d="M 10 100 C 60 0, 150 0, 200 70" />
  </svg>
  <span class="path-traveler demo-dot"></span>
  <span class="path-traveler is-rotating demo-arrow" aria-hidden="true">➤</span>
</div>
```

## CSS

```css
.path-area {
  position: relative;
  width: 220px;
  height: 120px;
}

.path-traveler {
  position: absolute;
  top: 0;
  left: 0;
  offset-path: path("M 10 100 C 60 0, 150 0, 200 70");
  offset-rotate: 0deg;
  offset-distance: 100%;
  animation: follow-path 1200ms cubic-bezier(0.65, 0, 0.35, 1) both;
}

/* 진행 방향을 따라 회전 */
.path-traveler.is-rotating {
  offset-rotate: auto;
  animation-delay: 180ms;
}

@keyframes follow-path {
  from { offset-distance: 0%; }
}

@media (prefers-reduced-motion: reduce) {
  .path-traveler { animation: none; }
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

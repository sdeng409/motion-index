# Hover 패턴 모음

> 링크 밑줄, 이미지 확대, 화살표 이동을 모았습니다.

링크나 카드에 바로 붙여 쓸 수 있는 hover 효과 세 가지입니다. 밑줄은 왼쪽에서 그어지고 오른쪽으로 사라지는데, 늘어나는 기준점(`transform-origin`)을 상태에 따라 반대로 바꿔서 만듭니다. 이미지 확대는 틀 밖으로 넘치는 부분을 숨기고 안쪽 이미지만 키웁니다. 화살표 효과는 글자는 그대로 두고 화살표만 옆으로 밉니다. 세 가지 모두 `transform`만 바꾸므로 가볍습니다.

- 원본: https://motion-index.pages.dev/hover-patterns/
- 구현: CSS만 사용
- 애니메이션 속성: transform (렌더링 비용 Composite)
- 지원 브라우저: Chrome 26 · Edge 12 · Firefox 16 · Safari 9

## 기본값

예제의 기본값입니다. 값이 거의 같은(차이 10% 이내) 디자인 토큰이 있으면 토큰으로 바꿔도 됩니다.

- 재생 시간: `300ms` (조정 범위 50ms ~ 1000ms)
- 속도 변화: `cubic-bezier(0.2, 0.7, 0.2, 1)`
- 이미지 확대 정도: `1.08` (조정 범위 1 ~ 1.4)
- 화살표 이동 거리: `4px` (조정 범위 0px ~ 16px)

## HTML

```html
<div class="demo-row">
  <div class="hover-zoom"><div class="demo-photo"></div></div>
  <div class="demo-stack">
    <a class="hover-underline demo-link" href="#">문서 보기</a>
    <button class="hover-arrow demo-btn" type="button">
      다음 단계 <span class="arrow" aria-hidden="true">→</span>
    </button>
  </div>
</div>
```

## CSS

```css
/* 밑줄 슬라이드 */
.hover-underline {
  position: relative;
  font-weight: 600;
  text-decoration: none;
}

.hover-underline::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -2px;
  height: 2px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 300ms cubic-bezier(0.2, 0.7, 0.2, 1);
}

.hover-underline:hover::after,
.hover-underline:focus-visible::after {
  transform: scaleX(1);
  transform-origin: left;
}

/* 이미지 확대 */
.hover-zoom {
  overflow: hidden;
  border-radius: 10px;
}

.hover-zoom > * { transition: transform 300ms cubic-bezier(0.2, 0.7, 0.2, 1); }
.hover-zoom:hover > * { transform: scale(1.08); }

/* 화살표 이동 */
.hover-arrow .arrow {
  display: inline-block;
  transition: transform 300ms cubic-bezier(0.2, 0.7, 0.2, 1);
}

.hover-arrow:hover .arrow,
.hover-arrow:focus-visible .arrow { transform: translateX(4px); }

@media (prefers-reduced-motion: reduce) {
  .hover-underline::after,
  .hover-zoom > *,
  .hover-arrow .arrow { transition: none; }
}
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

# Spring easing 생성기

> 스프링처럼 튕기는 움직임 곡선을 만듭니다.

튕기는 힘과 멈추는 힘 두 값만 정하면, 스프링이 튕기다가 멈추는 움직임을 계산해 `linear()` 곡선과 알맞은 재생 시간을 만들어 줍니다. 튕기는 힘을 올리면 더 빨라지고, 멈추는 힘을 내리면 더 많이 튕깁니다. 만든 `linear()` 값은 CSS만으로 동작하며, 다른 예제의 속도 변화 입력란에 붙여 넣어 쓸 수도 있습니다.

- 원본: https://example.github.io/motion-index/spring/
- 구현: CSS만 사용
- 애니메이션 속성: transform (렌더링 비용 Composite)
- 지원 브라우저: Chrome 113 · Edge 113 · Firefox 112 · Safari 17.2

## 기본값

- 튕기는 힘: `180` (조정 범위 40 ~ 600)
- 멈추는 힘: `12` (조정 범위 4 ~ 40)

## HTML

```html
<div class="demo-stack">
  <div class="spring-slide demo-ball"></div>
  <span class="spring-pop demo-pill">NEW</span>
</div>
```

## CSS

```css
.spring-slide {
  animation: spring-slide 1203ms linear(0, 0.038, 0.13, 0.257, 0.405, 0.559, 0.708, 0.844, 0.961, 1.055, 1.125, 1.173, 1.199, 1.207, 1.2, 1.18, 1.154, 1.123, 1.092, 1.061, 1.033, 1.008, 0.989, 0.974, 0.964, 0.959, 0.957, 0.959, 0.962, 0.968, 0.974, 0.981, 0.987, 0.993, 0.998, 1.002, 1.005, 1.007, 1.008, 1.009, 1.009, 1.008, 1.007, 1.005, 1.004, 1.003, 1.001, 1, 1, 0.999, 0.999, 0.998, 0.998, 0.998, 0.998, 0.999, 0.999, 0.999, 0.999, 1, 1) both;
}

.spring-pop {
  animation: spring-pop 1203ms linear(0, 0.038, 0.13, 0.257, 0.405, 0.559, 0.708, 0.844, 0.961, 1.055, 1.125, 1.173, 1.199, 1.207, 1.2, 1.18, 1.154, 1.123, 1.092, 1.061, 1.033, 1.008, 0.989, 0.974, 0.964, 0.959, 0.957, 0.959, 0.962, 0.968, 0.974, 0.981, 0.987, 0.993, 0.998, 1.002, 1.005, 1.007, 1.008, 1.009, 1.009, 1.008, 1.007, 1.005, 1.004, 1.003, 1.001, 1, 1, 0.999, 0.999, 0.998, 0.998, 0.998, 0.998, 0.999, 0.999, 0.999, 0.999, 1, 1) 120ms both;
}

@keyframes spring-slide {
  from { transform: translateX(-90px); }
}

@keyframes spring-pop {
  from { transform: scale(0.3); }
}

@media (prefers-reduced-motion: reduce) {
  .spring-slide,
  .spring-pop { animation: none; }
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

# 진행률 링

> 원형 테두리가 목표 비율까지 채워집니다.

체크 표시 그리기와 같은 점선 기법을 원에 적용했습니다. 반지름을 15.9155로 두면 원 둘레가 정확히 100이 됩니다. 그래서 72%를 채우려면 점선을 100 - 72 = 28만큼만 밀어 두면 되므로, 계산이 간단해집니다. 비율은 `--value`로 넣습니다.

- 원본: https://motion-index.pages.dev/progress-ring/
- 구현: CSS만 사용
- 애니메이션 속성: stroke-dashoffset (렌더링 비용 Paint)
- 지원 브라우저: Chrome 43 · Edge 12 · Firefox 16 · Safari 9

## 기본값

예제의 기본값입니다. 값이 거의 같은(차이 10% 이내) 디자인 토큰이 있으면 토큰으로 바꿔도 됩니다.

- 재생 시간: `1200ms` (조정 범위 200ms ~ 3000ms)
- 속도 변화: `cubic-bezier(0.2, 0.7, 0.2, 1)`
- 선 두께: `3` (조정 범위 1 ~ 6)

## HTML

```html
<div class="demo-row">
  <div class="demo-ring-wrap">
    <svg class="progress-ring" viewBox="0 0 36 36" style="--value: 72" aria-hidden="true">
      <circle class="ring-track" cx="18" cy="18" r="15.9155" />
      <circle class="ring-value" cx="18" cy="18" r="15.9155" />
    </svg>
    <span>72%</span>
  </div>
  <div class="demo-ring-wrap">
    <svg class="progress-ring is-warning" viewBox="0 0 36 36" style="--value: 35" aria-hidden="true">
      <circle class="ring-track" cx="18" cy="18" r="15.9155" />
      <circle class="ring-value" cx="18" cy="18" r="15.9155" />
    </svg>
    <span>35%</span>
  </div>
</div>
```

## CSS

```css
.progress-ring {
  width: 88px;
  height: 88px;
  fill: none;
  stroke-width: 3;
}

.ring-track { stroke: #e4e7ec; }

.ring-value {
  stroke: #16a34a;
  stroke-linecap: round;
  stroke-dasharray: 100;
  stroke-dashoffset: calc(100 - var(--value));
  /* 12시 방향에서 시작 */
  transform: rotate(-90deg);
  transform-origin: center;
  transform-box: fill-box;
  animation: ring-fill 1200ms cubic-bezier(0.2, 0.7, 0.2, 1) both;
}

.progress-ring.is-warning .ring-value { stroke: #f59e0b; }

@keyframes ring-fill {
  from { stroke-dashoffset: 100; }
}

@media (prefers-reduced-motion: reduce) {
  .ring-value { animation: none; }
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

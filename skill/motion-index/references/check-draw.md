# 체크 표시 그리기

> 원과 체크 표시를 차례로 그립니다.

SVG 선을 점선으로 만들되, 점선 한 칸의 길이를 선 전체 길이와 같게 합니다(`stroke-dasharray`). 그 점선을 전체 길이만큼 밀어 두었다가(`stroke-dashoffset`) 0으로 되돌리면, 선이 그려지는 것처럼 보입니다. 선의 전체 길이는 요소마다 `--len`으로 넣습니다.

- 원본: https://example.github.io/motion-index/check-draw/
- 구현: CSS만 사용
- 애니메이션 속성: stroke-dashoffset (렌더링 비용 Paint)
- 지원 브라우저: Chrome 43 · Edge 12 · Firefox 16 · Safari 9

## 기본값

- 원 그리는 시간: `600ms` (조정 범위 100ms ~ 2000ms)
- 체크 시작 시점: `480ms` (조정 범위 0ms ~ 2000ms)
- 체크 그리는 시간: `360ms` (조정 범위 100ms ~ 1500ms)
- 속도 변화: `cubic-bezier(0.65, 0, 0.45, 1)`

## HTML

```html
<div class="demo-stack">
  <svg class="check" viewBox="0 0 52 52" width="64" height="64" aria-hidden="true">
    <circle class="check-circle" cx="26" cy="26" r="24" fill="none" style="--len: 151" />
    <path class="check-mark" d="M15 27l7 7 15-16" fill="none" style="--len: 32" />
  </svg>
  <p class="demo-caption">결제가 완료되었습니다</p>
</div>
```

## CSS

```css
.check-circle,
.check-mark {
  stroke: #16a34a;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: var(--len);
}

.check-circle {
  stroke-width: 3;
  /* 12시 방향에서 그리기 시작 */
  transform: rotate(-90deg);
  transform-origin: center;
  transform-box: fill-box;
  animation: check-draw 600ms cubic-bezier(0.65, 0, 0.45, 1) both;
}

.check-mark {
  stroke-width: 4;
  animation: check-draw 360ms 480ms cubic-bezier(0.65, 0, 0.45, 1) both;
}

@keyframes check-draw {
  from { stroke-dashoffset: var(--len); }
}

@media (prefers-reduced-motion: reduce) {
  .check-circle,
  .check-mark { animation: none; }
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

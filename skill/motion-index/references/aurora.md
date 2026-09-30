# 배경 gradient drift

> 흐린 색 덩어리가 천천히 떠다니는 배경입니다.

흐림 효과(`filter: blur`)는 그대로 두고 위치(`transform`)만 움직입니다. 흐림은 계산이 무거운데, 이렇게 하면 한 번 계산한 흐림을 옮기기만 하므로 가볍습니다. 덩어리마다 `--x`, `--y`로 다른 방향을 주고 왕복시킵니다. 히어로 배경이나 빈 화면을 채울 때 씁니다.

- 원본: https://example.github.io/motion-index/aurora/
- 구현: CSS만 사용
- 애니메이션 속성: transform (렌더링 비용 Composite)
- 지원 브라우저: Chrome 43 · Edge 12 · Firefox 16 · Safari 9

## 기본값

- 빛 오가는 시간: `6s` (조정 범위 2s ~ 20s)
- 번짐 정도: `32px` (조정 범위 0px ~ 80px)

## HTML

```html
<div class="aurora">
  <span class="aurora-blob" style="--x: 40%; --y: 30%"></span>
  <span class="aurora-blob" style="--x: -35%; --y: 25%"></span>
  <span class="aurora-blob" style="--x: 20%; --y: -40%"></span>
  <p class="aurora-text">새로운 시작</p>
</div>
```

## CSS

```css
.aurora {
  position: relative;
  isolation: isolate;
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 12px;
  background: #0f172a;
}

.aurora-blob {
  position: absolute;
  z-index: -1;
  width: 60%;
  aspect-ratio: 1;
  border-radius: 50%;
  filter: blur(32px);
  opacity: 0.8;
  animation: aurora-drift 6s ease-in-out infinite alternate;
}

.aurora-blob:nth-child(1) { top: -10%; left: -10%; background: #2f4bd8; }
.aurora-blob:nth-child(2) { top: 10%; right: -15%; background: #db2777; animation-delay: calc(6s * -0.3); }
.aurora-blob:nth-child(3) { bottom: -25%; left: 20%; background: #22c1c3; animation-delay: calc(6s * -0.6); }

.aurora-text {
  margin: 0;
  color: #fff;
  font-size: 22px;
  font-weight: 800;
}

@keyframes aurora-drift {
  to { transform: translate(var(--x), var(--y)) scale(1.15); }
}

@media (prefers-reduced-motion: reduce) {
  .aurora-blob { animation: none; }
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

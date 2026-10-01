# 포인터 따라 기울기 · 조명

> 카드가 마우스 쪽으로 기울고, 마우스 위치에 빛이 비칩니다.

JS는 카드 안에서 마우스가 있는 위치를 0~1 사이 값으로 바꿔 `--x`, `--y` 변수에 넣기만 합니다. 기울기와 조명은 CSS가 이 두 변수로 계산합니다. 위치는 기울어지는 카드가 아니라 바깥 틀에서 잽니다. 기울어진 카드에서 재면 카드가 움직일 때마다 잰 값도 달라져서 떨립니다. 마우스가 움직이는 동안에는 짧게, 떠날 때는 길게 전환해서 부드럽게 제자리로 돌아오게 했습니다. 조명은 배경을 매 프레임 다시 그리므로 paint 비용이 듭니다. 동작 줄이기 설정에서는 기울기를 끄고 조명만 남깁니다.

- 원본: https://example.github.io/motion-index/pointer-tilt/
- 구현: CSS + 상태를 바꾸는 JS
- 애니메이션 속성: transform, background (렌더링 비용 Paint)
- 지원 브라우저: Chrome 26 · Edge 12 · Firefox 16 · Safari 9

## 기본값

예제의 기본값입니다. 값이 거의 같은(차이 10% 이내) 디자인 토큰이 있으면 토큰으로 바꿔도 됩니다.

- 최대 기울기: `10deg` (조정 범위 0deg ~ 25deg)
- 돌아오는 시간: `500ms` (조정 범위 100ms ~ 1500ms)
- 조명 크기: `180px` (조정 범위 60px ~ 400px)

## HTML

```html
<div class="tilt">
  <div class="tilt-card">
    <strong>Pro 플랜</strong>
    <p>마우스를 따라 기울어지고 빛이 비칩니다.</p>
  </div>
</div>
```

## CSS

```css
/* 위치는 기울지 않는 이 틀에서 잼 */
.tilt { perspective: 600px; }

.tilt-card {
  --x: 0.5;
  --y: 0.5;
  position: relative;
  box-sizing: border-box;
  width: min(220px, 100%);
  padding: 20px;
  border-radius: 16px;
  background: #1f2329;
  color: #fff;
  transform:
    rotateX(calc((0.5 - var(--y)) * 10deg * 2))
    rotateY(calc((var(--x) - 0.5) * 10deg * 2));
  transition: transform 500ms cubic-bezier(0.2, 0.7, 0.2, 1);
}

.tilt:hover .tilt-card { transition-duration: 100ms; }

.tilt-card strong { font-size: 16px; }
.tilt-card p { margin: 4px 0 0; color: #c4c9d2; }

/* 조명 */
.tilt-card::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(
    180px circle at calc(var(--x) * 100%) calc(var(--y) * 100%),
    rgb(255 255 255 / 0.18),
    transparent
  );
  opacity: 0;
  transition: opacity 300ms;
  pointer-events: none;
}

.tilt:hover .tilt-card::after { opacity: 1; }

@media (prefers-reduced-motion: reduce) {
  .tilt-card { transform: none; }
}
```

## JS

```js
document.addEventListener('pointermove', (event) => {
  const frame = event.target.closest('.tilt');
  if (!frame) return;
  const rect = frame.getBoundingClientRect();
  const card = frame.querySelector('.tilt-card');
  card.style.setProperty('--x', ((event.clientX - rect.left) / rect.width).toFixed(3));
  card.style.setProperty('--y', ((event.clientY - rect.top) / rect.height).toFixed(3));
});

// 마우스가 틀 밖으로 나가면 가운데 값으로 돌아가서 카드가 제자리로 돌아옴
document.addEventListener('pointerout', (event) => {
  const frame = event.target.closest('.tilt');
  if (!frame || frame.contains(event.relatedTarget)) return;
  const card = frame.querySelector('.tilt-card');
  card.style.removeProperty('--x');
  card.style.removeProperty('--y');
});
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

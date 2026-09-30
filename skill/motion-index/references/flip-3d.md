# 3D flip

> 카드와 플립 시계를 3D로 뒤집습니다.

앞면과 뒷면을 겹쳐 두고, 뒷면은 미리 180도 돌려 둡니다. 둘을 감싼 부모를 회전시키면 앞면이 넘어가고 뒷면이 보입니다. `perspective`는 원근감을 주고, `backface-visibility: hidden`은 뒤집힌 면을 숨깁니다. 카드는 hover나 키보드 포커스로 뒤집힙니다. 플립 시계는 숫자판을 위아래 반쪽으로 나누고, 윗장이 넘어간 다음 아랫장이 내려오도록 두 animation을 이어 붙였습니다.

- 원본: https://example.github.io/motion-index/flip-3d/
- 구현: CSS + 상태를 바꾸는 JS
- 애니메이션 속성: transform (rotateX, rotateY) (렌더링 비용 Composite)
- 지원 브라우저: Chrome 36 · Edge 12 · Firefox 16 · Safari 15.4

## 기본값

- 카드 뒤집는 시간: `600ms` (조정 범위 100ms ~ 1500ms)
- 속도 변화: `cubic-bezier(0.2, 0.7, 0.2, 1)`
- 숫자판 넘기는 시간: `260ms` (조정 범위 80ms ~ 800ms)

## HTML

```html
<div class="demo-row">
  <div class="flip-card" tabindex="0">
    <div class="flip-card-inner">
      <div class="flip-card-front">앞면</div>
      <div class="flip-card-back">뒷면</div>
    </div>
  </div>
  <div class="demo-stack">
    <div class="flap" id="flap-demo" data-value="7">
      <span class="flap-top">7</span>
      <span class="flap-bottom">7</span>
      <span class="flap-leaf-top">7</span>
      <span class="flap-leaf-bottom">7</span>
    </div>
    <button class="demo-btn" type="button" data-flap-next="flap-demo">+1</button>
  </div>
</div>
```

## CSS

```css
/* 카드 */
.flip-card {
  width: 120px;
  height: 84px;
  perspective: 600px;
}

.flip-card-inner {
  position: relative;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 600ms cubic-bezier(0.2, 0.7, 0.2, 1);
}

.flip-card:hover .flip-card-inner,
.flip-card:focus-visible .flip-card-inner { transform: rotateY(180deg); }

.flip-card-front,
.flip-card-back {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  border-radius: 12px;
  font-weight: 700;
  backface-visibility: hidden;
}

.flip-card-front { background: #fff; border: 1px solid #e3e5ea; }
.flip-card-back { background: #1f2937; color: #fff; transform: rotateY(180deg); }

/* 플립 시계 숫자판 */
.flap {
  position: relative;
  width: 56px;
  height: 72px;
  color: #fff;
  font: 700 44px/72px system-ui, sans-serif;
  text-align: center;
  perspective: 300px;
}

.flap > span {
  position: absolute;
  left: 0;
  right: 0;
  height: 50%;
  overflow: hidden;
  background: #1f2937;
  backface-visibility: hidden;
}

.flap-top,
.flap-leaf-top {
  top: 0;
  border-radius: 8px 8px 0 0;
  transform-origin: 50% 100%;
}

/* line-height를 0으로 두면 글자의 아래쪽 절반만 보임 */
.flap-bottom,
.flap-leaf-bottom {
  bottom: 0;
  line-height: 0;
  border-radius: 0 0 8px 8px;
  transform-origin: 50% 0;
}

.flap-leaf-top,
.flap-leaf-bottom { z-index: 1; }
.flap-leaf-bottom { transform: rotateX(90deg); }

.flap.is-flipping .flap-leaf-top {
  animation: flap-top 260ms ease-in forwards;
}

.flap.is-flipping .flap-leaf-bottom {
  animation: flap-bottom 260ms ease-out 260ms forwards;
}

@keyframes flap-top {
  to { transform: rotateX(-90deg); }
}

@keyframes flap-bottom {
  from { transform: rotateX(90deg); }
  to { transform: rotateX(0deg); }
}

@media (prefers-reduced-motion: reduce) {
  .flip-card-inner { transition: none; }
  /* animationend가 발생해야 숫자가 확정되므로 none 대신 아주 짧게 줄임 */
  .flap.is-flipping .flap-leaf-top,
  .flap.is-flipping .flap-leaf-bottom {
    animation-duration: 1ms;
    animation-delay: 0s;
  }
}
```

## JS

```js
document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-flap-next]');
  if (!button) return;
  const flap = document.getElementById(button.dataset.flapNext);
  if (flap.classList.contains('is-flipping')) return;
  const current = Number(flap.dataset.value);
  const next = (current + 1) % 10;
  const [top, bottom, leafTop, leafBottom] = flap.children;
  top.textContent = next;
  bottom.textContent = current;
  leafTop.textContent = current;
  leafBottom.textContent = next;
  flap.dataset.value = next;
  flap.classList.add('is-flipping');
});

document.addEventListener('animationend', (event) => {
  if (event.animationName !== 'flap-bottom') return;
  const flap = event.target.parentElement;
  const [, bottom, leafTop] = flap.children;
  bottom.textContent = flap.dataset.value;
  leafTop.textContent = flap.dataset.value;
  flap.classList.remove('is-flipping');
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

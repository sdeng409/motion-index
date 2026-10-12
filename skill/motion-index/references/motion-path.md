# Motion path

> 요소가 정해 둔 곡선을 따라 이동합니다.

`offset-path`에 이동할 경로를 그려 두고 `offset-distance`를 0%에서 100%로 바꾸면, 요소가 그 경로를 따라갑니다. `offset-rotate: auto`를 주면 화살표처럼 진행 방향을 바라보며 움직입니다. 상품이 장바구니로 날아가 담기는 효과처럼 궤적이 필요한 곳에 씁니다. 다만 Chrome은 `offset-distance` 애니메이션을 compositor에 맡기지 못하고 main thread에서 실행합니다. 다시 그리는 비용은 거의 없지만, main thread가 바쁜 순간에는 움직임이 끊길 수 있습니다. 영역 안에 마우스로 선을 그리면, JS가 그린 점들을 부드러운 곡선 `path()` 문자열로 바꿔 `offset-path`에 넣고 처음부터 다시 재생합니다. 영역에는 `touch-action: none`을 줘서 터치로 그리는 동안 페이지가 스크롤되지 않게 했습니다.

- 원본: https://motion-lib.pages.dev/motion-path/
- 구현: CSS + 상태를 바꾸는 JS
- 애니메이션 속성: offset-distance (렌더링 비용 Composite)
- 지원 브라우저: Chrome 55 · Edge 79 · Firefox 72 · Safari 16

## 기본값

예제의 기본값입니다. 값이 거의 같은(차이 10% 이내) 디자인 토큰이 있으면 토큰으로 바꿔도 됩니다.

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
  cursor: crosshair;
  touch-action: none;
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

## JS

```js
// 영역 안에서 그린 선을 path 문자열로 바꿔 offset-path에 넣음
const MIN_GAP = 6; // 이보다 가까운 점은 버림. 점이 너무 촘촘하면 화살표가 떨림
let drawing = null;

function toLocal(area, event) {
  const rect = area.getBoundingClientRect();
  // 썸네일처럼 크기가 줄어든 경우에도 CSS 좌표(220×120)에 맞추기 위한 비율
  const ratio = area.offsetWidth / rect.width;
  return [(event.clientX - rect.left) * ratio, (event.clientY - rect.top) * ratio];
}

// 점들을 Catmull-Rom 방식으로 이어 부드러운 곡선(C)으로 만듦
function toPath(points) {
  const round = (n) => Math.round(n * 10) / 10;
  let d = `M ${points[0].map(round).join(' ')}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${[...c1, ...c2, ...p2].map(round).join(' ')}`;
  }
  return d;
}

document.addEventListener('pointerdown', (event) => {
  const area = event.target.closest('.path-area');
  if (!area) return;
  area.setPointerCapture(event.pointerId);
  drawing = { area, points: [toLocal(area, event)] };
});

document.addEventListener('pointermove', (event) => {
  if (!drawing) return;
  const { area, points } = drawing;
  const point = toLocal(area, event);
  const last = points[points.length - 1];
  if (Math.hypot(point[0] - last[0], point[1] - last[1]) < MIN_GAP) return;
  points.push(point);
  if (points.length >= 3) area.querySelector('.demo-path-guide path').setAttribute('d', toPath(points));
});

function finish() {
  if (!drawing) return;
  const { area, points } = drawing;
  drawing = null;
  // 클릭만 하고 끝난 경우는 원래 곡선을 그대로 둠
  if (points.length < 3) return;
  const path = `path("${toPath(points)}")`;
  area.querySelectorAll('.path-traveler').forEach((traveler) => {
    traveler.style.offsetPath = path;
    // 새 경로에서 처음부터 다시 재생
    traveler.style.animation = 'none';
    void traveler.offsetWidth;
    traveler.style.animation = '';
  });
}

document.addEventListener('pointerup', finish);
document.addEventListener('pointercancel', finish);
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

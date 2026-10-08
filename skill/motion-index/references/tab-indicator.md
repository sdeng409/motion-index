# 탭 indicator 슬라이드

> 선택한 탭으로 배경이 미끄러져 이동합니다.

탭 너비를 똑같이 나눠 두면, 배경은 "자기 너비 × 탭 순번"만큼만 옮기면 됩니다. 그래서 탭 위치를 따로 잴 필요가 없고, JS는 선택한 탭의 순번(`--index`)만 바꿉니다. 탭 너비가 서로 다르다면 각 탭의 위치와 너비를 재서 옮기는 방식으로 바꿔야 합니다.

- 원본: https://motion-index.pages.dev/tab-indicator/
- 구현: CSS + 상태를 바꾸는 JS
- 애니메이션 속성: transform, color (렌더링 비용 Paint)
- 지원 브라우저: Chrome 26 · Edge 12 · Firefox 16 · Safari 9

## 기본값

예제의 기본값입니다. 값이 거의 같은(차이 10% 이내) 디자인 토큰이 있으면 토큰으로 바꿔도 됩니다.

- 재생 시간: `280ms` (조정 범위 0ms ~ 1000ms)
- 속도 변화: `cubic-bezier(0.3, 0.7, 0.4, 1.2)`

## HTML

```html
<div class="tab-list" role="tablist" aria-label="기간" style="--count: 3; --index: 0">
  <span class="tab-indicator" aria-hidden="true"></span>
  <button type="button" role="tab" aria-selected="true">일간</button>
  <button type="button" role="tab" aria-selected="false">주간</button>
  <button type="button" role="tab" aria-selected="false">월간</button>
</div>
```

## CSS

```css
.tab-list {
  position: relative;
  display: grid;
  grid-template-columns: repeat(var(--count), 1fr);
  width: min(260px, 100%);
  padding: 4px;
  border-radius: 12px;
  background: #e9ebf0;
}

.tab-list [role="tab"] {
  position: relative;
  z-index: 1;
  padding: 8px 0;
  border: 0;
  background: none;
  color: #5b6270;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  transition: color 280ms;
}

.tab-list [aria-selected="true"] { color: #15171b; }

.tab-indicator {
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 4px;
  width: calc((100% - 8px) / var(--count));
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.12);
  /* 자기 너비의 --index배만큼 이동 */
  transform: translateX(calc(var(--index) * 100%));
  transition: transform 280ms cubic-bezier(0.3, 0.7, 0.4, 1.2);
}

@media (prefers-reduced-motion: reduce) {
  .tab-indicator,
  .tab-list [role="tab"] { transition: none; }
}
```

## JS

```js
document.addEventListener('click', (event) => {
  const tab = event.target.closest('.tab-list [role="tab"]');
  if (!tab) return;
  const list = tab.parentElement;
  const tabs = [...list.querySelectorAll('[role="tab"]')];
  tabs.forEach((item) => item.setAttribute('aria-selected', String(item === tab)));
  list.style.setProperty('--index', tabs.indexOf(tab));
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

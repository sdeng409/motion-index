# 탭 indicator 슬라이드

> 선택한 탭으로 배경이 미끄러져 이동합니다.

탭 너비를 똑같이 나눠 두면, 배경은 "자기 너비 × 탭 순번"만큼만 옮기면 됩니다. 그래서 탭 위치를 따로 잴 필요가 없고, JS는 선택한 탭의 순번(`--index`)만 바꿉니다. 탭 너비가 서로 다르다면 각 탭의 위치와 너비를 재서 옮기는 방식으로 바꿔야 합니다.

- 원본: https://example.github.io/motion-index/tab-indicator/
- 구현: CSS + 상태를 바꾸는 JS
- 애니메이션 속성: transform (렌더링 비용 Composite)
- 지원 브라우저: Chrome 26 · Edge 12 · Firefox 16 · Safari 9

## 기본값

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
- 예제의 수치(시간·거리·easing)는 조정된 값입니다. 대상 코드에 디자인 토큰이 있으면 가장 가까운 토큰으로 바꾸고, 없으면 그대로 쓰세요.

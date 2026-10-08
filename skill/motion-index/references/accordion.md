# 아코디언

> 내용 높이를 몰라도 부드럽게 펼치고 접습니다.

`height: auto`에는 전환 효과가 적용되지 않습니다. 대신 grid 행 높이를 `0fr`에서 `1fr`로 바꾸면, 내용 높이에 맞춰 부드럽게 늘어납니다. 접혀 있을 때는 `visibility: hidden`으로 숨겨서, 안쪽 링크로 Tab 키 이동이 되지 않게 합니다. 높이가 바뀌면 주변 배치도 다시 계산해야 하므로 Layout 비용이 듭니다.

- 원본: https://motion-index.pages.dev/accordion/
- 구현: CSS + 상태를 바꾸는 JS
- 애니메이션 속성: grid-template-rows, transform (렌더링 비용 Layout)
- 지원 브라우저: Chrome 107 · Edge 107 · Firefox 66 · Safari 16

## 기본값

예제의 기본값입니다. 값이 거의 같은(차이 10% 이내) 디자인 토큰이 있으면 토큰으로 바꿔도 됩니다.

- 재생 시간: `300ms` (조정 범위 0ms ~ 1200ms)
- 속도 변화: `cubic-bezier(0.2, 0.7, 0.2, 1)`

## HTML

```html
<div class="accordion">
  <div class="accordion-item">
    <button class="accordion-trigger" type="button" aria-expanded="false" aria-controls="faq-answer-1">배송은 얼마나 걸리나요?</button>
    <div class="accordion-panel" id="faq-answer-1">
      <div class="accordion-inner"><p>결제 후 1~2일 안에 출발합니다.</p></div>
    </div>
  </div>
  <div class="accordion-item">
    <button class="accordion-trigger" type="button" aria-expanded="false" aria-controls="faq-answer-2">반품할 수 있나요?</button>
    <div class="accordion-panel" id="faq-answer-2">
      <div class="accordion-inner"><p>받은 날부터 7일 안에 신청할 수 있습니다.</p></div>
    </div>
  </div>
</div>
```

## CSS

```css
.accordion {
  width: min(260px, 100%);
  border: 1px solid #e3e5ea;
  border-radius: 12px;
  background: #fff;
}

.accordion-item + .accordion-item { border-top: 1px solid #e3e5ea; }

.accordion-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 12px 14px;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
}

.accordion-trigger::after {
  content: "";
  flex: none;
  width: 7px;
  height: 7px;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: rotate(45deg);
  transition: transform 300ms cubic-bezier(0.2, 0.7, 0.2, 1);
}

.accordion-trigger[aria-expanded="true"]::after { transform: rotate(-135deg); }

.accordion-panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 300ms cubic-bezier(0.2, 0.7, 0.2, 1);
}

.accordion-trigger[aria-expanded="true"] + .accordion-panel { grid-template-rows: 1fr; }

.accordion-inner {
  overflow: hidden;
  visibility: hidden;
  transition: visibility 300ms;
}

.accordion-trigger[aria-expanded="true"] + .accordion-panel .accordion-inner { visibility: visible; }

.accordion-inner p {
  margin: 0;
  padding: 0 14px 12px;
  color: #4b5563;
}

@media (prefers-reduced-motion: reduce) {
  .accordion-panel,
  .accordion-inner,
  .accordion-trigger::after { transition: none; }
}
```

## JS

```js
document.addEventListener('click', (event) => {
  const trigger = event.target.closest('.accordion-trigger');
  if (!trigger) return;
  const expanded = trigger.getAttribute('aria-expanded') === 'true';
  trigger.setAttribute('aria-expanded', String(!expanded));
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

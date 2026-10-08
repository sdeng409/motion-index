# Typewriter

> 글자가 한 자씩 찍히고 커서가 깜빡입니다.

글자를 담은 상자의 너비를 0에서 글자 수만큼 늘리되, `steps()`로 한 글자씩 끊어서 늘립니다. 글자 수는 `--chars`로 넣고, 전체 시간은 "글자당 시간 × 글자 수"로 계산합니다. 너비를 글자 수(`ch` 단위)로 맞추기 때문에, 모든 글자의 폭이 같은 고정폭 글꼴과 영문·숫자에서만 정확합니다. 너비를 바꾸므로 Layout 비용이 듭니다.

- 원본: https://motion-index.pages.dev/typewriter/
- 구현: CSS만 사용
- 애니메이션 속성: width, border-color (렌더링 비용 Layout)
- 지원 브라우저: Chrome 77 · Edge 79 · Firefox 65 · Safari 14

## 기본값

예제의 기본값입니다. 값이 거의 같은(차이 10% 이내) 디자인 토큰이 있으면 토큰으로 바꿔도 됩니다.

- 한 글자 찍는 시간: `90ms` (조정 범위 20ms ~ 300ms)
- 커서 깜빡이는 간격: `800ms` (조정 범위 300ms ~ 2000ms)

## HTML

```html
<div class="demo-terminal">
  <span class="typewriter" style="--chars: 13">$ npm run dev</span>
  <span class="typewriter" style="--chars: 12">Motion Index</span>
</div>
```

## CSS

```css
.typewriter {
  display: inline-block;
  width: calc(var(--chars) * 1ch);
  overflow: hidden;
  white-space: nowrap;
  border-right: 0.12em solid currentColor;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  animation:
    typing calc(var(--chars) * 90ms) steps(var(--chars)) both,
    caret 800ms step-end infinite;
}

@keyframes typing {
  from { width: 0; }
}

@keyframes caret {
  50% { border-color: transparent; }
}

@media (prefers-reduced-motion: reduce) {
  .typewriter { animation: none; }
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

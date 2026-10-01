# Shape morph

> 아이콘과 도형의 모양이 부드럽게 바뀝니다.

`clip-path: shape()`로 직선과 곡선을 이어 모양을 그립니다. 두 모양을 같은 개수의 선으로, 같은 순서로 그리면 브라우저가 중간 모양을 자동으로 계산해 줍니다. 그래서 재생 삼각형을 두 조각으로 나눠, 일시정지 막대 두 개와 짝을 맞췄습니다. `shape()`를 지원하지 않는 브라우저에서는 모양이 애니메이션 없이 바로 바뀝니다. `clip-path` 애니메이션은 매 프레임 다시 그리므로, blob처럼 무한 반복하는 효과는 화면에 보일 때만 재생하는 편이 좋습니다. 화면 밖에 있어도 계속 다시 그려지기 때문입니다.

- 원본: https://example.github.io/motion-index/shape-morph/
- 구현: CSS + 상태를 바꾸는 JS
- 애니메이션 속성: clip-path (렌더링 비용 Paint)
- 지원 브라우저: Chrome 135 · Edge 135 · Firefox 148 · Safari 18.4

## 기본값

예제의 기본값입니다. 값이 거의 같은(차이 10% 이내) 디자인 토큰이 있으면 토큰으로 바꿔도 됩니다.

- 아이콘 바뀌는 시간: `320ms` (조정 범위 80ms ~ 1200ms)
- 속도 변화: `cubic-bezier(0.65, 0, 0.35, 1)`
- 도형 바뀌는 시간: `4s` (조정 범위 1s ~ 12s)

## HTML

```html
<div class="demo-row">
  <button class="morph-toggle" type="button" aria-pressed="false" aria-label="재생">
    <span class="morph-icon" aria-hidden="true"></span>
  </button>
  <div class="morph-blob" aria-hidden="true"></div>
</div>
```

## CSS

```css
.morph-toggle {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  border: 0;
  border-radius: 50%;
  background: #1f2937;
  cursor: pointer;
}

.morph-icon {
  width: 20px;
  height: 22px;
  background: #fff;
  /* shape()를 모르는 브라우저용: 모양만 바뀌고 애니메이션은 없음 */
  clip-path: polygon(0% 0%, 100% 50%, 0% 100%);
  transition: clip-path 320ms cubic-bezier(0.65, 0, 0.35, 1);
}

.morph-toggle[aria-pressed="true"] .morph-icon {
  clip-path: polygon(0% 0%, 35% 0%, 35% 100%, 65% 100%, 65% 0%, 100% 0%, 100% 100%, 0% 100%);
}

@supports (clip-path: shape(from 0% 0%, line to 100% 100%)) {
  /* 두 모양 모두 [시작, 선 3개, 닫기] × 2 구조라서 서로 보간됨 */
  .morph-icon {
    clip-path: shape(
      from 0% 0%, line to 50% 25%, line to 50% 75%, line to 0% 100%, close,
      move to 50% 25%, line to 100% 50%, line to 100% 50%, line to 50% 75%, close
    );
  }

  .morph-toggle[aria-pressed="true"] .morph-icon {
    clip-path: shape(
      from 0% 0%, line to 35% 0%, line to 35% 100%, line to 0% 100%, close,
      move to 65% 0%, line to 100% 0%, line to 100% 100%, line to 65% 100%, close
    );
  }

  .morph-blob {
    width: 96px;
    height: 96px;
    background: linear-gradient(135deg, #2f4bd8, #22c1c3);
    clip-path: shape(
      from 50% 0%, curve to 100% 50% with 90% 5%, curve to 50% 100% with 95% 95%,
      curve to 0% 50% with 5% 95%, curve to 50% 0% with 10% 5%, close
    );
    animation: blob-morph 4s ease-in-out infinite alternate;
  }

  @keyframes blob-morph {
    to {
      clip-path: shape(
        from 60% 8%, curve to 92% 60% with 100% 0%, curve to 40% 92% with 100% 100%,
        curve to 8% 40% with 0% 100%, curve to 60% 8% with 0% 0%, close
      );
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .morph-icon { transition: none; }
  .morph-blob { animation: none; }
}
```

## JS

```js
document.addEventListener('click', (event) => {
  const button = event.target.closest('.morph-toggle');
  if (!button) return;
  const playing = button.getAttribute('aria-pressed') === 'true';
  button.setAttribute('aria-pressed', String(!playing));
  button.setAttribute('aria-label', playing ? '재생' : '일시정지');
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

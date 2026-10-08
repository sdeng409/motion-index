# 토스트 알림

> 화면 아래에서 올라왔다가 잠시 후 사라집니다.

알림 영역에 `role="status"`를 붙여 두면, 문구를 넣는 순간 스크린 리더가 읽어 줍니다. 사라지는 효과가 끝나면 문구를 비워서, 다음 알림이 같은 문구여도 다시 읽히게 합니다. 끝나기를 기다릴 때는 `transitionend` 대신 `getAnimations()`를 쓰므로 재생 시간이 0이어도 문구가 남지 않습니다. 동작 줄이기 설정에서는 움직임 없이 서서히 나타나고 사라집니다.

- 원본: https://motion-lib.pages.dev/toast/
- 구현: CSS + 상태를 바꾸는 JS
- 애니메이션 속성: transform, opacity (렌더링 비용 Composite)
- 지원 브라우저: Chrome 26 · Edge 12 · Firefox 16 · Safari 9

## 기본값

예제의 기본값입니다. 값이 거의 같은(차이 10% 이내) 디자인 토큰이 있으면 토큰으로 바꿔도 됩니다.

- 재생 시간: `240ms` (조정 범위 0ms ~ 1000ms)
- 속도 변화: `cubic-bezier(0.2, 0.7, 0.2, 1)`
- 움직이는 거리: `12px` (조정 범위 0px ~ 60px)

## HTML

```html
<button class="demo-btn" type="button" data-toast-target="save-toast">저장하기</button>
<div class="toast" id="save-toast" role="status"></div>
```

## CSS

```css
.toast {
  position: fixed;
  left: 50%;
  bottom: 20px;
  padding: 10px 16px;
  border-radius: 10px;
  background: #15171b;
  color: #fff;
  font-size: 13px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transform: translate(-50%, 12px);
  transition:
    opacity 240ms cubic-bezier(0.2, 0.7, 0.2, 1),
    transform 240ms cubic-bezier(0.2, 0.7, 0.2, 1);
}

.toast.is-visible {
  opacity: 1;
  transform: translate(-50%, 0);
}

@media (prefers-reduced-motion: reduce) {
  .toast { transform: translate(-50%, 0); }
}
```

## JS

```js
const timers = new WeakMap();

function hide(toast) {
  toast.classList.remove('is-visible');
  // 사라지는 효과가 끝나면 문구를 비워서, 숨은 문구가 남지 않고 다음 알림이 다시 읽히게 함
  Promise.allSettled(toast.getAnimations().map((animation) => animation.finished)).then(() => {
    if (!toast.classList.contains('is-visible')) toast.textContent = '';
  });
}

document.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-toast-target]');
  if (!trigger) return;
  const toast = document.getElementById(trigger.dataset.toastTarget);
  toast.textContent = '저장했습니다';
  toast.classList.add('is-visible');
  clearTimeout(timers.get(toast));
  timers.set(toast, setTimeout(() => hide(toast), 2400));
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

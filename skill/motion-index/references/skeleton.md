# 스켈레톤 shimmer

> 콘텐츠를 불러오는 동안 빛이 지나가는 자리 표시자입니다.

흔히 배경 위치(`background-position`)를 움직여서 만드는데, 이 방법은 매 프레임 화면을 다시 그려야 합니다. 여기서는 빛 모양을 가상 요소에 한 번 그려 두고 `transform`으로 옮기기만 하므로 더 가볍습니다.

- 원본: https://example.github.io/motion-index/skeleton/
- 구현: CSS만 사용
- 애니메이션 속성: transform (렌더링 비용 Composite)
- 지원 브라우저: Chrome 43 · Edge 12 · Firefox 16 · Safari 9

## 기본값

- 빛 지나가는 시간: `1400ms` (조정 범위 400ms ~ 4000ms)
- 속도 변화: `ease-in-out`

## HTML

```html
<div class="skeleton-card" aria-hidden="true">
  <div class="skeleton skeleton-avatar"></div>
  <div class="skeleton-lines">
    <div class="skeleton skeleton-line"></div>
    <div class="skeleton skeleton-line is-short"></div>
  </div>
</div>
```

## CSS

```css
.skeleton-card {
  display: flex;
  gap: 12px;
  width: min(240px, 100%);
  padding: 14px;
  border-radius: 12px;
  background: #fff;
}

.skeleton-lines {
  display: grid;
  flex: 1;
  gap: 8px;
  align-content: center;
}

.skeleton {
  position: relative;
  overflow: hidden;
  border-radius: 6px;
  background: #e4e7ec;
}

.skeleton::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgb(255 255 255 / 0.7), transparent);
  transform: translateX(-100%);
  animation: shimmer 1400ms ease-in-out infinite;
}

.skeleton-avatar { flex: none; width: 40px; height: 40px; border-radius: 50%; }
.skeleton-line { height: 10px; }
.skeleton-line.is-short { width: 60%; }

@keyframes shimmer {
  to { transform: translateX(100%); }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton::after { animation: none; }
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

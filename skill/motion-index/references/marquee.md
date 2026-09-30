# 로고 마퀴 (Marquee)

> 로고 띠가 끊김 없이 옆으로 흘러갑니다.

같은 항목을 한 번 더 이어 붙인 뒤, 띠 전체를 절반(-50%)만큼 옮깁니다. 절반을 옮긴 순간의 모습이 처음 모습과 똑같아서, 반복되어도 이음새가 보이지 않습니다. 복제한 항목은 `aria-hidden`으로 숨겨서 스크린 리더가 두 번 읽지 않게 합니다. 동작 줄이기 설정에서는 멈추고, 사용자가 직접 가로로 스크롤할 수 있게 바뀝니다.

- 원본: https://example.github.io/motion-index/marquee/
- 구현: CSS만 사용
- 애니메이션 속성: transform (렌더링 비용 Composite)
- 지원 브라우저: Chrome 43 · Edge 12 · Firefox 16 · Safari 9

## 기본값

- 한 바퀴 흐르는 시간: `12s` (조정 범위 3s ~ 40s)

## HTML

```html
<div class="marquee">
  <div class="marquee-track">
    <span>React</span><span>Vue</span><span>Svelte</span><span>Astro</span><span>Solid</span>
    <span aria-hidden="true">React</span><span aria-hidden="true">Vue</span><span aria-hidden="true">Svelte</span><span aria-hidden="true">Astro</span><span aria-hidden="true">Solid</span>
  </div>
</div>
```

## CSS

```css
.marquee {
  width: 100%;
  overflow: hidden;
  mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
}

.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee 12s linear infinite;
}

/* gap 대신 margin을 써야 -50% 지점이 정확히 맞음 */
.marquee-track > span {
  margin-right: 10px;
  padding: 6px 14px;
  border: 1px solid #e3e5ea;
  border-radius: 999px;
  background: #fff;
  font-weight: 600;
}

@keyframes marquee {
  to { transform: translateX(-50%); }
}

@media (prefers-reduced-motion: reduce) {
  .marquee { overflow-x: auto; }
  .marquee-track { animation: none; }
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

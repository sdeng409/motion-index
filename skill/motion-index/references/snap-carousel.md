# Scroll-snap 캐러셀

> 가운데에 온 항목만 크고 선명하게 보입니다.

스크롤이 멈출 때 항목이 가운데에 딱 맞게 서도록 `scroll-snap`을 겁니다. 그리고 각 항목이 가로로 지나가는 정도(`view(inline)`)에 맞춰 크기와 투명도를 바꿉니다. 진행도 50% 지점이 항목이 정확히 가운데에 온 순간이라서, 그때 가장 크고 선명해집니다. 지원하지 않는 브라우저와 동작 줄이기 설정에서는 크기 변화 없이 스냅만 동작합니다.

- 원본: https://example.github.io/motion-index/snap-carousel/
- 구현: CSS만 사용
- 애니메이션 속성: transform, opacity (렌더링 비용 Composite)
- 지원 브라우저: Chrome 115 · Edge 115 · Safari 26 · Firefox 미지원

## 기본값

- 양옆 카드 크기: `0.78` (조정 범위 0.4 ~ 1)
- 양옆 카드 진하기: `0.45` (조정 범위 0 ~ 1)

## HTML

```html
<ul class="snap-carousel demo-snap">
  <li>봄</li><li>여름</li><li>가을</li><li>겨울</li><li>다시 봄</li>
</ul>
```

## CSS

```css
.snap-carousel {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  /* 첫 항목과 마지막 항목도 가운데에 올 수 있게 양쪽 여백을 줌 */
  padding-inline: calc(50% - 60px);
}

.snap-carousel > li {
  flex: none;
  width: 120px;
  scroll-snap-align: center;
}

@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .snap-carousel > li {
      animation: snap-focus linear both;
      animation-timeline: view(inline);
    }
  }
}

@keyframes snap-focus {
  0%, 100% {
    opacity: 0.45;
    transform: scale(0.78);
  }
  50% {
    opacity: 1;
    transform: none;
  }
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

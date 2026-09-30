# 읽기 진행률 바

> 스크롤한 만큼 상단 바가 채워집니다.

스크롤한 정도를 애니메이션 진행도로 씁니다(`animation-timeline: scroll()`). 끝까지 스크롤하면 바가 꽉 찹니다. 페이지에 넣으면 페이지 전체의 스크롤을 따라갑니다. 바는 사용자가 스크롤한 만큼만 움직이므로, 동작 줄이기 설정에서도 그대로 둡니다.

- 원본: https://example.github.io/motion-index/read-progress/
- 구현: CSS만 사용
- 애니메이션 속성: transform (scaleX) (렌더링 비용 Composite)
- 지원 브라우저: Chrome 115 · Edge 115 · Safari 26 · Firefox 미지원

## HTML

```html
<div class="read-progress" aria-hidden="true"></div>
<article class="demo-article">
  <h3>Core Web Vitals 정리</h3>
  <p>LCP는 가장 큰 콘텐츠가 그려지는 시점입니다. 2.5초 이내를 목표로 합니다.</p>
  <p>INP는 사용자 입력에 화면이 반응하기까지 걸리는 시간입니다. 200ms 이내가 좋은 수준입니다.</p>
  <p>CLS는 레이아웃이 예고 없이 밀리는 정도입니다. 0.1 이하로 유지합니다.</p>
  <p>세 지표 모두 실제 사용자 데이터의 75번째 백분위수로 판단합니다.</p>
  <p>애니메이션을 transform과 opacity로 만들면 INP와 CLS에 영향을 주지 않습니다.</p>
</article>
```

## CSS

```css
.read-progress {
  position: sticky;
  top: 0;
  z-index: 1;
  height: 4px;
  background: #2f4bd8;
  transform: scaleX(0);
  transform-origin: 0 50%;
}

@supports (animation-timeline: scroll()) {
  .read-progress {
    animation: read-progress linear both;
    animation-timeline: scroll();
  }
}

@keyframes read-progress {
  to { transform: scaleX(1); }
}

/* 스크롤과 1:1로 움직여서 동작 줄이기 대상에서 제외함 */
```

## 옮길 때 지킬 것

- 움직임은 CSS(transition·animation·@keyframes)가 맡고, JS는 상태(class·속성·popover·dialog)를 바꾸는 일만 합니다. 옮길 때도 이 역할 분리를 유지하세요.
- `prefers-reduced-motion: reduce` 블록과 `@supports` 가드는 지우지 말고 함께 옮기세요. 지원하지 않는 브라우저에서도 콘텐츠는 정적으로 보여야 합니다.
- 렌더링 비용 등급을 지키세요. transform·opacity로 만든 효과를 top·left·width·height 같은 layout 속성으로 바꾸지 마세요.
- `demo-`로 시작하는 class는 미리보기 모양을 위한 것이므로 옮기지 말고, 대상 코드의 기존 요소와 스타일을 쓰세요.
- class 이름과 selector는 대상 코드의 이름 규칙에 맞게 바꾸고, 스타일링 방식(CSS Modules, Tailwind, CSS-in-JS 등)에 맞춰 옮기세요. Tailwind라면 @keyframes와 복잡한 selector는 전역 CSS나 @layer에 두는 편이 읽기 쉽습니다.
- document에 이벤트를 위임한 vanilla JS는, React·Vue·Svelte 등에서는 해당 컴포넌트의 이벤트 핸들러와 ref로 옮기세요. `getElementById`로 찾던 요소는 ref로 바꾸세요.
- 예제의 수치(시간·거리·easing)는 조정된 값입니다. 대상 코드에 디자인 토큰이 있으면 가장 가까운 토큰으로 바꾸고, 없으면 그대로 쓰세요.

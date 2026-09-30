# 스크롤 등장

> 스크롤해서 화면에 들어올 때 나타납니다.

요소가 화면에 들어온 정도를 애니메이션 진행도로 씁니다(`animation-timeline: view()`). 반쯤 들어오면 반쯤 나타나는 식입니다. 예전에는 IntersectionObserver 같은 JS가 필요했지만, 이제는 CSS만으로 됩니다. 지원하지 않는 브라우저에서는 요소가 처음부터 보이도록 `@supports`로 감쌌습니다.

- 원본: https://example.github.io/motion-index/scroll-reveal/
- 구현: CSS만 사용
- 애니메이션 속성: transform, opacity (렌더링 비용 Composite)
- 지원 브라우저: Chrome 115 · Edge 115 · Safari 26 · Firefox 미지원

## 기본값

- 움직이는 거리: `80px` (조정 범위 0px ~ 200px)
- 처음 크기: `0.8` (조정 범위 0.4 ~ 1)
- 다 나타나는 지점: `40%` (조정 범위 5% ~ 100%)
- 속도 변화: `ease-out`

## HTML

```html
<div class="demo-stack">
  <p class="demo-scroll-intro is-short">아래로 스크롤해 보세요 ↓</p>
  <div class="reveal demo-card"><strong>1단계</strong><p>계정을 만듭니다.</p></div>
  <div class="reveal demo-card"><strong>2단계</strong><p>팀원을 초대합니다.</p></div>
  <div class="reveal demo-card"><strong>3단계</strong><p>프로필을 채웁니다.</p></div>
  <div class="reveal demo-card"><strong>4단계</strong><p>첫 프로젝트를 만듭니다.</p></div>
  <div class="reveal demo-card"><strong>5단계</strong><p>작업을 나눠 맡깁니다.</p></div>
  <div class="reveal demo-card"><strong>6단계</strong><p>진행 상황을 확인합니다.</p></div>
  <div class="reveal demo-card"><strong>7단계</strong><p>피드백을 주고받습니다.</p></div>
  <div class="reveal demo-card"><strong>8단계</strong><p>결과를 공유합니다.</p></div>
</div>
```

## CSS

```css
@supports (animation-timeline: view()) {
  .reveal {
    animation: reveal ease-out both;
    animation-timeline: view();
    /* 화면에 들어오기 시작할 때부터 요소가 화면을 지정한 비율만큼 지나갈 때까지 재생 */
    animation-range: entry 0% cover 40%;
  }
}

@keyframes reveal {
  from {
    opacity: 0;
    transform: translateY(80px) scale(0.8);
  }
}

@media (prefers-reduced-motion: reduce) {
  .reveal { animation: none; }
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

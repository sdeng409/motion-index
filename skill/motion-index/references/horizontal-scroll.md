# 가로 스크롤 섹션

> 아래로 스크롤하는 동안 카드가 옆으로 지나갑니다.

섹션을 화면보다 길게 만들고, 안쪽 내용은 화면에 고정(`sticky`)합니다. 섹션을 스크롤한 정도에 맞춰 카드 띠를 옆으로 옮기면, 세로 스크롤이 가로 이동처럼 보입니다. 크기는 `cqh`·`cqw` 단위로 적었습니다. 이 단위는 감싸는 container가 없으면 화면 크기를 기준으로 계산되므로, 페이지에 그대로 넣어도 동작합니다. 지원하지 않는 브라우저와 동작 줄이기 설정에서는 일반 가로 스크롤로 바뀝니다.

- 원본: https://example.github.io/motion-index/horizontal-scroll/
- 구현: CSS만 사용
- 애니메이션 속성: transform (렌더링 비용 Composite)
- 지원 브라우저: Chrome 115 · Edge 115 · Safari 26 · Firefox 미지원

## 기본값

예제의 기본값입니다. 값이 거의 같은(차이 10% 이내) 디자인 토큰이 있으면 토큰으로 바꿔도 됩니다.

- 스크롤 길이: `300cqh` (조정 범위 150cqh ~ 600cqh)

## HTML

```html
<p class="demo-scroll-intro is-short">아래로 스크롤해 보세요 ↓</p>
<section class="h-scroll">
  <div class="h-scroll-sticky">
    <ol class="h-scroll-track">
      <li>01 기획</li>
      <li>02 디자인</li>
      <li>03 개발</li>
      <li>04 테스트</li>
      <li>05 출시</li>
    </ol>
  </div>
</section>
<p class="demo-scroll-outro">섹션이 끝나면 다시 세로로 스크롤됩니다</p>
```

## CSS

```css
.h-scroll-sticky { overflow-x: auto; }

.h-scroll-track {
  display: flex;
  gap: 12px;
  width: max-content;
  margin: 0;
  padding: 16px;
  list-style: none;
}

.h-scroll-track > li {
  display: grid;
  place-items: end start;
  width: 150px;
  height: 110px;
  padding: 12px;
  box-sizing: border-box;
  border-radius: 12px;
  background: #1f2937;
  color: #fff;
  font-weight: 700;
}

@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .h-scroll {
      /* 컨테이너가 없으면 cqh·cqw는 화면 크기를 기준으로 계산됨 */
      height: 300cqh;
      view-timeline-name: --h-scroll;
    }

    .h-scroll-sticky {
      position: sticky;
      top: 0;
      display: flex;
      align-items: center;
      height: 100cqh;
      overflow: hidden;
    }

    .h-scroll-track {
      animation: h-scroll linear both;
      animation-timeline: --h-scroll;
      animation-range: contain 0% contain 100%;
    }
  }
}

@keyframes h-scroll {
  to { transform: translateX(calc(-100% + 100cqw)); }
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

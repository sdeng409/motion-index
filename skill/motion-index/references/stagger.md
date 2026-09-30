# 순차 등장 (Stagger)

> 목록 항목이 짧은 간격을 두고 차례로 나타납니다.

모든 항목에 같은 등장 효과를 주고, 시작 시간만 "순번 × 간격"만큼 늦춥니다. 순번은 최신 브라우저에서는 CSS의 `sibling-index()`가 직접 세고, 그렇지 않은 브라우저에서는 HTML에 넣은 `--i` 값을 씁니다. `sibling-index()`를 지원하는 브라우저가 충분히 많아지면 `--i`는 지워도 됩니다.

- 원본: https://example.github.io/motion-index/stagger/
- 구현: CSS만 사용
- 애니메이션 속성: transform, opacity (렌더링 비용 Composite)
- 지원 브라우저: Chrome 43 · Edge 12 · Firefox 16 · Safari 9

## 기본값

- 재생 시간: `480ms` (조정 범위 100ms ~ 1500ms)
- 항목 사이 시간차: `80ms` (조정 범위 0ms ~ 400ms)
- 속도 변화: `cubic-bezier(0.2, 0.7, 0.2, 1)`
- 움직이는 거리: `12px` (조정 범위 0px ~ 80px)

## HTML

```html
<ul class="stagger demo-list">
  <li style="--i: 0"><span class="demo-avatar"></span>김하늘님이 참여했습니다</li>
  <li style="--i: 1"><span class="demo-avatar"></span>이서준님이 참여했습니다</li>
  <li style="--i: 2"><span class="demo-avatar"></span>박지우님이 참여했습니다</li>
</ul>
```

## CSS

```css
.stagger > li {
  animation: stagger-in 480ms cubic-bezier(0.2, 0.7, 0.2, 1) both;
  animation-delay: calc(var(--i, 0) * 80ms);
}

/* 순번을 CSS가 직접 셈 (sibling-index()는 1부터 시작) */
@supports (animation-delay: calc(sibling-index() * 1ms)) {
  .stagger > li { animation-delay: calc((sibling-index() - 1) * 80ms); }
}

@keyframes stagger-in {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .stagger > li { animation: none; }
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

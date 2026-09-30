# 단어 단위 텍스트 reveal

> 단어가 하나씩 아래에서 올라옵니다.

단어마다 넘치는 부분을 숨기는 틀(`overflow: hidden`)을 씌우고, 안쪽 글자를 틀 아래에서 위로 올립니다. 글자가 틀 밖에 있는 동안에는 보이지 않아서, 바닥에서 솟아오르는 것처럼 보입니다. 단어 순서는 `--i`로 넣습니다. 동작 줄이기 설정에서는 움직임 없이 서서히 나타나기만 합니다.

- 원본: https://example.github.io/motion-index/word-reveal/
- 구현: CSS만 사용
- 애니메이션 속성: transform (렌더링 비용 Composite)
- 지원 브라우저: Chrome 43 · Edge 12 · Firefox 16 · Safari 9

## 기본값

- 재생 시간: `700ms` (조정 범위 200ms ~ 2000ms)
- 단어 사이 시간차: `70ms` (조정 범위 0ms ~ 300ms)
- 속도 변화: `cubic-bezier(0.2, 0.7, 0.2, 1)`

## HTML

```html
<div>
  <p class="word-reveal demo-headline">
    <span class="word"><span style="--i: 0">작은</span></span>
    <span class="word"><span style="--i: 1">움직임이</span></span>
    <span class="word"><span style="--i: 2">경험을</span></span>
    <span class="word"><span style="--i: 3">바꿉니다</span></span>
  </p>
  <p class="word-reveal demo-sub">
    <span class="word"><span style="--i: 4">단어마다</span></span>
    <span class="word"><span style="--i: 5">조금씩</span></span>
    <span class="word"><span style="--i: 6">늦게</span></span>
    <span class="word"><span style="--i: 7">올라옵니다</span></span>
  </p>
</div>
```

## CSS

```css
.word-reveal .word {
  display: inline-block;
  overflow: hidden;
  /* 받침이나 descender가 잘리지 않게 아래쪽 여유를 줌 */
  padding-bottom: 0.1em;
  margin-bottom: -0.1em;
  vertical-align: top;
}

.word-reveal .word > span {
  display: inline-block;
  animation: word-up 700ms cubic-bezier(0.2, 0.7, 0.2, 1) both;
  animation-delay: calc(var(--i, 0) * 70ms);
}

@keyframes word-up {
  from { transform: translateY(110%); }
}

@keyframes word-fade {
  from { opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .word-reveal .word > span { animation-name: word-fade; }
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

# Odometer 숫자 롤링

> 자리마다 숫자가 굴러가며 새 값으로 바뀝니다.

자리마다 0부터 9까지 세로로 적힌 숫자 띠를 두고, 보여줄 숫자(`--d`)만큼 띠를 위로 올립니다. 띠는 줄바꿈 문자(`\A`)를 넣은 가상 요소로 만들어서 HTML이 길어지지 않습니다. JS는 자리마다 `--d` 값만 바꾸고, 굴러가는 움직임은 CSS가 맡습니다. 가격, 방문자 수, 날짜 표시에 쓸 수 있습니다.

- 원본: https://example.github.io/motion-index/odometer/
- 구현: CSS + 상태를 바꾸는 JS
- 애니메이션 속성: transform (렌더링 비용 Composite)
- 지원 브라우저: Chrome 26 · Edge 12 · Firefox 16 · Safari 9

## 기본값

- 재생 시간: `900ms` (조정 범위 100ms ~ 2500ms)
- 속도 변화: `cubic-bezier(0.2, 0.7, 0.2, 1)`
- 자릿수 사이 시간차: `60ms` (조정 범위 0ms ~ 300ms)

## HTML

```html
<div class="demo-stack">
  <span class="odometer" id="odo-demo" role="img" aria-label="12,800원">
    <span class="odo-digit" style="--d: 1; --i: 0"></span><span class="odo-digit" style="--d: 2; --i: 1"></span><span class="odo-sep">,</span><span class="odo-digit" style="--d: 8; --i: 2"></span><span class="odo-digit" style="--d: 0; --i: 3"></span><span class="odo-digit" style="--d: 0; --i: 4"></span><span class="odo-sep">원</span>
  </span>
  <button class="demo-btn" type="button" data-odometer-target="odo-demo">금액 바꾸기</button>
</div>
```

## CSS

```css
.odometer {
  display: inline-flex;
  font: 700 32px/1.2 system-ui, sans-serif;
  font-variant-numeric: tabular-nums;
}

.odo-digit {
  height: 1.2em;
  overflow: hidden;
}

/* 0~9를 세로로 쌓은 띠를 --d 칸만큼 위로 올림 */
.odo-digit::before {
  content: "0\A 1\A 2\A 3\A 4\A 5\A 6\A 7\A 8\A 9";
  display: block;
  white-space: pre;
  transform: translateY(calc(var(--d, 0) * -1.2em));
  transition: transform 900ms cubic-bezier(0.2, 0.7, 0.2, 1);
  transition-delay: calc(var(--i, 0) * 60ms);
}

@media (prefers-reduced-motion: reduce) {
  .odo-digit::before { transition: none; }
}
```

## JS

```js
document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-odometer-target]');
  if (!button) return;
  const odometer = document.getElementById(button.dataset.odometerTarget);
  const digits = [...odometer.querySelectorAll('.odo-digit')];
  const min = 10 ** (digits.length - 1);
  const value = min + Math.floor(Math.random() * 9 * min);
  const text = String(value);
  digits.forEach((digit, index) => digit.style.setProperty('--d', text[index]));
  odometer.setAttribute('aria-label', `${value.toLocaleString('ko-KR')}원`);
});
```

## 옮길 때 지킬 것

- 움직임은 CSS(transition·animation·@keyframes)가 맡고, JS는 상태(class·속성·popover·dialog)를 바꾸는 일만 합니다. 옮길 때도 이 역할 분리를 유지하세요.
- `prefers-reduced-motion: reduce` 블록과 `@supports` 가드는 지우지 말고 함께 옮기세요. 지원하지 않는 브라우저에서도 콘텐츠는 정적으로 보여야 합니다.
- 렌더링 비용 등급을 지키세요. transform·opacity로 만든 효과를 top·left·width·height 같은 layout 속성으로 바꾸지 마세요.
- `demo-`로 시작하는 class는 미리보기 모양을 위한 것이므로 옮기지 말고, 대상 코드의 기존 요소와 스타일을 쓰세요.
- class 이름과 selector는 대상 코드의 이름 규칙에 맞게 바꾸고, 스타일링 방식(CSS Modules, Tailwind, CSS-in-JS 등)에 맞춰 옮기세요. Tailwind라면 @keyframes와 복잡한 selector는 전역 CSS나 @layer에 두는 편이 읽기 쉽습니다.
- document에 이벤트를 위임한 vanilla JS는, React·Vue·Svelte 등에서는 해당 컴포넌트의 이벤트 핸들러와 ref로 옮기세요. `getElementById`로 찾던 요소는 ref로 바꾸세요.
- 예제의 수치(시간·거리·easing)는 조정된 값입니다. 대상 코드에 디자인 토큰이 있으면 가장 가까운 토큰으로 바꾸고, 없으면 그대로 쓰세요.

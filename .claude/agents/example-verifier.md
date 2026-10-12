---
name: example-verifier
description: Motion Index 예제(src/examples/*)를 추가하거나 고친 뒤 검증한다. 정적 검사(pnpm verify), Chrome DevTools MCP로 실제 실행 검사, 판단이 필요한 항목 검토를 차례로 하고 PASS/FAIL/SKIP 표로 보고한다. 파일은 고치지 않는다. 검사할 예제 id 목록을 프롬프트로 받는다.
tools: Read, Grep, Glob, Bash, mcp__chrome-devtools__new_page, mcp__chrome-devtools__navigate_page, mcp__chrome-devtools__close_page, mcp__chrome-devtools__list_pages, mcp__chrome-devtools__select_page, mcp__chrome-devtools__evaluate_script, mcp__chrome-devtools__take_snapshot, mcp__chrome-devtools__take_screenshot, mcp__chrome-devtools__list_console_messages, mcp__chrome-devtools__click, mcp__chrome-devtools__hover, mcp__chrome-devtools__press_key, mcp__chrome-devtools__performance_start_trace, mcp__chrome-devtools__performance_stop_trace
---

너는 Motion Index 예제 검증 담당이다. 프롬프트로 받은 예제 id마다 아래 1~3단계를 순서대로 하고, 마지막에 보고 형식대로 결과를 낸다.

## 지켜야 할 것

- **파일을 고치지 않는다.** 문제를 찾으면 위치(`파일:줄`)와 고칠 방향만 적는다.
- **확인하지 못한 것은 SKIP으로 적고 이유를 쓴다.** 코드를 읽어서 추정한 내용을 PASS로 적지 않는다. 런타임 항목은 브라우저에서 실제로 잰 값만 근거로 쓴다.
- 브라우저 페이지는 항상 `isolatedContext: "verify"`로 새로 열고, 끝나면 연 페이지를 모두 닫는다. 사용자가 이미 열어 둔 탭은 건드리지 않는다.
- 측정 파일은 `.claude/tmp/`에 저장하고 끝나면 지운다(이 폴더는 gitignore 대상).

## 0. 준비

1. `curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/motion-index/`가 200이 아니면 `pnpm dev`를 실행한다(자동으로 백그라운드에서 뜬다). 다시 200이 나올 때까지 확인한다.
2. 페이지 콘솔에 `504 (Outdated Optimize Dep)`가 보이면 Vite 캐시가 낡은 것이다. `pnpm exec astro dev stop` 후 `pnpm dev`로 다시 띄우고 페이지를 새로 연다. 이 상태에서 잰 값은 모두 버린다.

## 1단계: 정적 검사

`pnpm verify`를 실행한다(타입 검사 → 빌드 중 예제 검사 → skill references 동기화 비교). 실패하면 출력에 나온 항목을 그대로 FAIL로 옮긴다. 이 단계가 실패해도 2·3단계는 계속한다.

## 2단계: 런타임 검사

예제 데이터는 `src/examples/{id}/index.ts`에서 `kind`, `autoplay`, `hint`, `spec.cost`, `params`를 먼저 읽어 둔다. URL 기준은 `http://localhost:4321/motion-index/`이다.

### 재생하는 방법
여러 항목에서 "재생"이라고 하면 아래 방법을 쓴다.
- `once`/`loop`: `#detail-replay`를 클릭한다.
- `interact`: `autoplay`가 있으면 그 요소를 클릭한다. 없으면 `hint`에 적힌 조작을 한다. hover 예제는 먼저 마우스를 스테이지 밖(예: `h1`)으로 `hover`해 둔 뒤 대상에 `hover`한다. 이미 hover 상태면 전환이 시작되지 않는다.

### 애니메이션 기록
도구 호출 사이에 수백 ms가 지나므로, 짧은 전환은 재생 뒤에 재면 이미 끝나 있다. **재생하기 전에** 아래를 실행해 시작 순간을 기록하고, 재생한 뒤 `window.__runs`를 읽는다.
```js
(root = '#detail-stage-slot .stage') => {
  window.__runs = [];
  const el = document.querySelector(root) ?? document.body;
  const log = (e) => window.__runs.push(...e.target.getAnimations()
    .filter((a) => (a.transitionProperty ?? a.animationName) === (e.propertyName ?? e.animationName))
    .map((a) => { const t = a.effect.getComputedTiming(); return { name: e.propertyName ?? e.animationName, delay: t.delay, active: t.activeDuration }; }));
  el.addEventListener('transitionrun', log);
  el.addEventListener('animationstart', log);
  return 'ok';
}
```
`active`는 delay를 뺀 재생 시간이다. 대기 시간이 의도인 예제(예: tooltip의 나타나기 전 대기)는 `delay`도 함께 본다.

### 값 조정 슬라이더 바꾸기
조작 도구로는 range 입력을 옮길 수 없으므로 아래로 바꾸고, 바뀐 값이 computed style에 반영됐는지 확인한다.
```js
(key, value) => {
  const input = document.getElementById(`tuner-${key}`);
  input.value = value;
  input.dispatchEvent(new Event('input'));
  input.dispatchEvent(new Event('change'));
  return input.value;
}
```

### 2-1. 콘솔 오류
`{id}/`와 `#{id}`(목록의 모달)를 열고 `list_console_messages`(types: error, warn)를 본다. vite 연결 debug 메시지는 무시한다.

### 2-2. 썸네일 크기
목록 페이지(`/motion-index/`)에서 실행한다. `kind`가 scroll이면 SKIP. hover나 클릭으로 나타나는 요소는 나타난 상태에서도 한 번 더 잰다.
```js
(id) => {
  const stage = document.querySelector(`li[data-id="${id}"] .stage`).getBoundingClientRect();
  // absolute로 밖에 뜨는 요소(툴팁 등)도 잡도록 하위 요소를 모두 잼. 숨겨진 요소는 크기가 0이라 제외함
  return [...document.querySelectorAll(`li[data-id="${id}"] .demo-center *`)].filter((el) => el.getClientRects().length).map((el) => {
    const r = el.getBoundingClientRect();
    return { el: el.className, fits: r.left >= stage.left - 1 && r.right <= stage.right + 1 && r.top >= stage.top - 1 && r.bottom <= stage.bottom + 1 };
  });
}
```
하나라도 `fits: false`면 FAIL.

### 2-3. 목록에서 저절로 재생되지 않음
목록 페이지를 열고 마우스를 올리지 않은 채 1초 기다린 뒤 실행한다.
```js
(id) => document.getAnimations().filter((a) => a.playState === 'running'
  && a.timeline === document.timeline
  && a.effect?.target?.closest?.(`li[data-id="${id}"]`)).length
```
0이 아니면 FAIL. 목록 페이지가 매 프레임 다시 그려지는 원인이 된다(shape-morph 사례).

### 2-4. 동작 줄이기 대응
예제 페이지(`{id}/`)에서 상세 창의 "동작 줄이기로 보기" 체크박스(`#detail-reduce`)를 쓴다. 이 체크박스는 미리보기 CSS와 `matchMedia` 응답을 동작 줄이기 상태로 바꾼다.
1. 체크를 끈 상태에서 "애니메이션 기록"을 건 뒤 재생하고, `window.__runs`를 읽는다.
2. `#detail-reduce`를 클릭해 켜고 700ms 기다린 뒤, 기록을 다시 걸고 같은 방법으로 재생해 읽는다.
3. 켠 쪽에서 움직임(transform·translate·scale 등 위치나 크기가 바뀌는 속성)이 사라졌거나 재생 시간이 눈에 띄게 줄었으면 PASS다. 페이드(opacity)만 남는 것은 괜찮다. 둘이 같으면 FAIL. `src/lib/verify-examples.ts`의 `NO_REDUCE_BLOCK`에 사유가 적힌 예제는 그 사유가 맞는지만 확인한다.

### 2-5. 렌더링 비용 실측
`spec.cost`가 실제와 맞는지 잰다. 백그라운드 탭에서는 화면을 그리지 않으므로 이 항목은 `new_page`를 `background` 없이(앞으로 띄워서) 연다.
1. 재생 시간 param이 300ms보다 짧으면, "값 조정 슬라이더 바꾸기"로 300ms 이상으로 늘린 뒤 측정한다.
2. `performance_start_trace`(reload: false, autoStop: false) → "재생하는 방법"대로 재생 → 1.5초 대기 → `performance_stop_trace`(filePath: `.claude/tmp/trace-{id}.json`).
3. `node .claude/verify/trace-cost.mjs .claude/tmp/trace-{id}.json`의 `verdict`를 `spec.cost`와 비교한다. 다르면 FAIL로 적고 Layout/Paint 횟수를 근거로 붙인다.
   - 기준: 재생 내내 Layout이 반복되면 layout, Paint만 반복되면 paint, 둘 다 몇 번에 그치면 composite. (spinner=composite, progress-ring=paint, accordion=layout으로 검증한 기준)
   - `interact` 예제처럼 재생이 한 번 눌러서 끝나는 경우, 측정 구간 안에 실제 효과가 들어갔는지 확인한다.

### 2-6. 복사한 코드만으로 동작
`{id}.md`를 열고 아래를 실행한다. 사이트의 스타일과 스크립트 없이, 복사 대상 코드만 빈 문서에 넣는다.
```js
async () => {
  const md = await (await fetch(location.href)).text();
  const block = (lang) => md.match(new RegExp('```' + lang + '\\n([\\s\\S]*?)\\n```'))?.[1] ?? '';
  document.open();
  document.write(`<!doctype html><html><head><meta charset="utf-8"><style>${block('css')}</style></head><body>${block('html')}<script>${block('js')}<\/script></body></html>`);
  document.close();
  return 'ok';
}
```
그다음 "애니메이션 기록"을 `'body'`로 걸고 예제를 재생(클릭·hover 등)한 뒤, `window.__runs`가 1개 이상인지와 콘솔 오류가 없는지 본다. `kind`가 scroll이면 스크롤 컨테이너가 없으므로 SKIP하고 이유를 적는다.

### 2-7. 키보드 조작
예제 페이지에는 예제보다 앞에 포커스를 받는 요소(지원 브라우저 아이콘 등)가 있다. 먼저 아래로 스테이지 안의 포커스 가능한 요소를 찾고, 그 바로 앞 요소에 `focus()`한 뒤 `press_key`로 Tab 이동과 Enter/Space 실행이 되는지 본다.
```js
() => [...document.querySelectorAll('#detail-stage-slot .stage :is(a[href], button, input, select, textarea, summary, [tabindex]:not([tabindex="-1"]))')]
  .map((el) => el.outerHTML.slice(0, 80))
``` Esc를 쓰는 예제(dialog, popover, tooltip)는 목록의 모달 안에서도 열어 Esc가 안쪽 요소부터 닫는지 확인한다.

## 3단계: 판단 검사

코드를 읽고 판단한다. 비교 대상으로 같은 성격의 기존 예제(형제 예제)를 하나 이상 골라 이름을 적는다.

- **비용과 속성:** `spec.props`가 CSS에서 실제로 움직이는 속성과 맞는지. 2-5 결과와 함께 본다.
- **지원 범위:** `support`가 실제로 쓴 CSS·JS 기능 중 가장 늦게 지원된 기능을 반영하는지. 반영하지 못했으면 어떤 기능(예: `:focus-visible`)이 빠졌는지 적는다.
- **이식 원칙:** demo.js가 `document`에 이벤트를 위임하는지(썸네일과 상세 창에 같은 예제가 두 번 있음), JS가 상태(class·속성·popover·dialog)만 바꾸고 움직임은 CSS가 맡는지, 동작 줄이기 확인에 `matchMedia('(prefers-reduced-motion: reduce)')`를 정확히 이 문자열로 쓰는지.
- **설명문:** `desc`가 형제 예제와 같은 문체(평서문 '-니다')이고, 동작 원리와 옮길 때 주의할 점을 담는지. 코드 이름은 backtick으로 감쌌는지.
- **형제 예제와의 일관성:** 이름 규칙, param 이름(`duration`, `easing` 등), 구조가 형제 예제와 어긋나지 않는지.

## 보고 형식

예제마다 표 하나를 쓴다.

| 항목 | 결과 | 근거 |
|---|---|---|
| 1 정적 검사 | PASS/FAIL | 명령 출력 요약 |
| 2-1 콘솔 오류 | ... | ... |
| ... | ... | ... |
| 3 지원 범위 | ... | ... |

표 아래에 FAIL 항목만 모아 "고칠 곳"을 `파일:줄`과 함께 적는다. SKIP이 있으면 이유를 적는다. 전체가 PASS여도 표는 생략하지 않는다.

# Motion Index

실무에서 자주 쓰는 웹 애니메이션 39가지를 모은 갤러리입니다. 모든 예제는 순수 HTML·CSS와 vanilla JS로 작성되어 어떤 프레임워크에도 옮길 수 있습니다.

## 개발

```sh
pnpm install
pnpm dev      # http://localhost:4321/motion-index/
pnpm check    # 타입 검사
pnpm build    # dist/ 생성
pnpm skill    # 빌드 후 skill/motion-index/references 갱신
```

## 구조

- `src/examples/{id}/index.ts`: 예제 데이터(설명, 조정 값, HTML, CSS 템플릿). CSS의 `{{key}}`는 조정 값 자리입니다.
- `src/examples/{id}/demo.js`: 예제의 JS. 페이지에서 실행되는 코드이자 복사용 코드의 원본입니다.
- `src/examples/index.ts`: 목록 순서.
- 빌드 결과
  - `/`: 목록과 상세 모달
  - `/{id}/`: 예제별 페이지
  - `/{id}.md`, `/llms.txt`, `/llms-full.txt`: AI가 읽는 설명서

## AI로 적용하기

- 상세 창의 **AI 프롬프트 복사**: 조정한 값이 반영된 코드와 옮길 때 지킬 규칙을 복사합니다. 어떤 AI 도구에든 붙여 넣으면 됩니다.
- **Claude Code skill**: `skill/motion-index`를 `~/.claude/skills/`에 연결하면, "이 애니메이션을 지금 코드에 적용해줘" 같은 요청에서 예제를 찾아 옮깁니다.

  ```sh
  ln -s "$PWD/skill/motion-index" ~/.claude/skills/motion-index
  ```

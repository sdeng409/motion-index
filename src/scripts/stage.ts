import { HINTS, SUPPORT, stageInnerHtml } from '../lib/shared';
import type { Example } from '../lib/types';

export const noHover = matchMedia('(hover: none)').matches;
const scrollSupported = CSS.supports('animation-timeline: scroll()');

type Kind = Example['kind'];

export function restHint(kind: Kind) {
  return (kind === 'once' || kind === 'loop') && noHover ? '탭하면 재생' : HINTS[kind];
}

export function play(stage: HTMLElement, autoplay?: string) {
  stage.classList.add('is-playing');
  if (autoplay) stage.querySelector<HTMLElement>(autoplay)?.click();
}

export function stop(stage: HTMLElement) {
  stage.classList.remove('is-playing');
}

export function restart(stage: HTMLElement, autoplay?: string) {
  stop(stage);
  void stage.offsetWidth; // 애니메이션을 처음부터 다시 시작시키기 위한 강제 reflow
  play(stage, autoplay);
}

// 빌드 때 만든 스테이지(카드, 예제 페이지)에서 브라우저에 따라 달라지는 부분만 고침
export function prepareStage(wrap: Element, kind: Kind, customHint?: string) {
  const hint = wrap.querySelector('.stage-hint');
  if (hint && !customHint) hint.textContent = restHint(kind);
  const note = wrap.querySelector<HTMLElement>('[data-scroll-note]');
  if (note) note.hidden = scrollSupported;
}

// 목록의 모달처럼 스테이지를 새로 만들어야 할 때 쓰는 Stage.astro와 같은 구조
export function createStage(ex: Example, suffix: string) {
  const wrap = document.createElement('div');
  wrap.className = 'stage-wrap';
  const stage = document.createElement('div');
  stage.className = 'stage';
  stage.dataset.kind = ex.kind;
  stage.innerHTML = stageInnerHtml(ex, suffix);
  const hint = document.createElement('span');
  hint.className = 'stage-hint';
  hint.textContent = ex.hint || restHint(ex.kind);
  wrap.append(stage, hint);
  if (ex.support === SUPPORT.scrollDriven && !scrollSupported) {
    const note = document.createElement('p');
    note.className = 'stage-note';
    note.textContent = '이 브라우저는 scroll-driven animation을 지원하지 않습니다. @supports 덕분에 콘텐츠는 정적으로 보입니다.';
    wrap.append(note);
  }
  return { wrap, stage };
}

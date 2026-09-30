import type { Example } from '../lib/types';
import { play, prepareStage, restart, restHint, stop } from './stage';

if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.getElementById('motion-note')!.hidden = false;
}

/* ---------- 썸네일 ---------- */
document.querySelectorAll<HTMLLIElement>('.grid > li').forEach((item) => {
  const kind = item.dataset.kind as Example['kind'];
  const autoplay = item.dataset.autoplay;
  const wrap = item.querySelector('.stage-wrap')!;
  const stage = item.querySelector<HTMLElement>('.stage')!;
  const hint = item.querySelector('.stage-hint')!;
  prepareStage(wrap, kind, item.dataset.hint);
  if (kind === 'scroll') return;

  stage.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse') play(stage, autoplay);
  });
  stage.addEventListener('pointerleave', (event) => {
    if (event.pointerType === 'mouse') stop(stage);
  });
  // 터치에는 hover가 없으므로 탭으로 재생과 정지를 바꿈
  stage.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse') return;
    if (kind === 'interact') stage.classList.add('is-playing');
    else if (stage.classList.contains('is-playing')) stop(stage);
    else restart(stage, autoplay);
  });
  stage.addEventListener('focusin', () => stage.classList.add('is-playing'));
  stage.addEventListener('focusout', (event) => {
    if (!stage.contains(event.relatedTarget as Node | null)) stop(stage);
  });
  if (kind === 'once' || kind === 'loop') {
    stage.addEventListener('animationstart', () => { hint.textContent = '재생 중'; });
    const observer = new MutationObserver(() => {
      if (!stage.classList.contains('is-playing')) hint.textContent = restHint(kind);
    });
    observer.observe(stage, { attributes: true, attributeFilter: ['class'] });
  }
});

/* ---------- 검색·필터 ---------- */
const searchInput = document.getElementById('search') as HTMLInputElement;
const filterButtons = document.querySelectorAll<HTMLButtonElement>('.filter button');
let activeFilter = 'all';

function applyFilter() {
  const words = searchInput.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
  let total = 0;
  document.querySelectorAll<HTMLElement>('.shelf').forEach((shelf) => {
    let visible = 0;
    shelf.querySelectorAll<HTMLLIElement>('.grid > li').forEach((item) => {
      const match = (activeFilter === 'all' || item.dataset.tag === activeFilter)
        && words.every((word) => item.dataset.search!.includes(word));
      item.hidden = !match;
      if (match) visible += 1;
    });
    shelf.hidden = visible === 0;
    shelf.querySelector('.shelf-count')!.textContent = String(visible);
    total += visible;
  });
  document.getElementById('empty')!.hidden = total > 0;
}

searchInput.addEventListener('input', applyFilter);
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter!;
    filterButtons.forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
    applyFilter();
  });
});

/* ---------- 상세 모달 ---------- */
// 상세 창 코드(값 조정, 코드 강조)는 처음 열 때 불러옴. 링크는 예제별 페이지로 가므로 JS가 없어도 볼 수 있음
async function openDetail(id: string) {
  const { openDialog } = await import('./detail');
  await openDialog(id);
}

document.querySelectorAll<HTMLAnchorElement>('.card-open').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    openDetail(link.closest('li')!.dataset.id!);
  });
});

const initialId = location.hash.slice(1);
if (initialId && document.querySelector(`.grid > li[data-id="${CSS.escape(initialId)}"]`)) openDetail(initialId);

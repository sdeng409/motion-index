document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-flip-shuffle]');
  if (!button) return;
  const list = document.getElementById(button.dataset.flipShuffle);
  const items = [...list.children];
  const style = getComputedStyle(list);
  const duration = parseFloat(style.getPropertyValue('--flip-duration'));
  const easing = style.getPropertyValue('--flip-easing').trim();

  // First: 바뀌기 전 위치
  const first = new Map(items.map((item) => [item, item.getBoundingClientRect()]));

  // DOM 변경
  items.sort(() => Math.random() - 0.5).forEach((item) => list.append(item));

  // Last → Invert → Play
  items.forEach((item) => {
    const last = item.getBoundingClientRect();
    const dx = first.get(item).left - last.left;
    const dy = first.get(item).top - last.top;
    if (!dx && !dy) return;
    item.animate(
      [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }],
      { duration, easing },
    );
  });
});

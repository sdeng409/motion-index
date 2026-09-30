document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-vt-shuffle]');
  if (!button) return;
  const list = document.getElementById(button.dataset.vtShuffle);
  const items = [...list.children];
  const shuffle = () => {
    items.sort(() => Math.random() - 0.5).forEach((item) => list.append(item));
  };
  if (!document.startViewTransition) {
    shuffle();
    return;
  }
  // 이름이 붙은 요소는 문서 전체에서 캡처되므로, 이 목록에만 전환하는 동안 이름을 붙임
  items.forEach((item, index) => {
    item.style.viewTransitionName = `vt-tile-${index + 1}`;
  });
  const transition = document.startViewTransition(shuffle);
  transition.finished.finally(() => {
    items.forEach((item) => { item.style.viewTransitionName = ''; });
  });
});

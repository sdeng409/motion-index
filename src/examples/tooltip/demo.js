// Esc로 닫은 툴팁은 마우스가 떠나거나 포커스가 빠질 때까지 다시 열리지 않게 함
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  const tips = document.querySelectorAll('.tip:hover:not(.is-dismissed), .tip:focus-within:not(.is-dismissed)');
  if (!tips.length) return;
  // 모달 안에서도 툴팁만 닫히고 모달은 그대로 있게 함
  event.preventDefault();
  tips.forEach((tip) => tip.classList.add('is-dismissed'));
});

function reset(event) {
  const tip = event.target.closest('.tip');
  if (tip && !tip.contains(event.relatedTarget)) tip.classList.remove('is-dismissed');
}

document.addEventListener('pointerout', reset);
document.addEventListener('focusout', reset);

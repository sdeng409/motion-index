document.addEventListener('pointermove', (event) => {
  const frame = event.target.closest('.tilt');
  if (!frame) return;
  const rect = frame.getBoundingClientRect();
  const card = frame.querySelector('.tilt-card');
  card.style.setProperty('--x', ((event.clientX - rect.left) / rect.width).toFixed(3));
  card.style.setProperty('--y', ((event.clientY - rect.top) / rect.height).toFixed(3));
});

// 마우스가 틀 밖으로 나가면 가운데 값으로 돌아가서 카드가 제자리로 돌아옴
document.addEventListener('pointerout', (event) => {
  const frame = event.target.closest('.tilt');
  if (!frame || frame.contains(event.relatedTarget)) return;
  const card = frame.querySelector('.tilt-card');
  card.style.removeProperty('--x');
  card.style.removeProperty('--y');
});

const timers = new WeakMap();

function hide(toast) {
  toast.classList.remove('is-visible');
  // 사라지는 효과가 끝나면 문구를 비워서, 숨은 문구가 남지 않고 다음 알림이 다시 읽히게 함
  Promise.allSettled(toast.getAnimations().map((animation) => animation.finished)).then(() => {
    if (!toast.classList.contains('is-visible')) toast.textContent = '';
  });
}

document.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-toast-target]');
  if (!trigger) return;
  const toast = document.getElementById(trigger.dataset.toastTarget);
  toast.textContent = '저장했습니다';
  toast.classList.add('is-visible');
  clearTimeout(timers.get(toast));
  timers.set(toast, setTimeout(() => hide(toast), 2400));
});

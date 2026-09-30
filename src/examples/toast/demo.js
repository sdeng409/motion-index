const timers = new WeakMap();

document.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-toast-target]');
  if (!trigger) return;
  const toast = document.getElementById(trigger.dataset.toastTarget);
  toast.textContent = '저장했습니다';
  toast.classList.add('is-visible');
  clearTimeout(timers.get(toast));
  timers.set(toast, setTimeout(() => toast.classList.remove('is-visible'), 2400));
});

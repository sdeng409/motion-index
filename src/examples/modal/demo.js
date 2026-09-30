document.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-dialog-target]');
  if (!trigger) return;
  document.getElementById(trigger.dataset.dialogTarget).showModal();
});

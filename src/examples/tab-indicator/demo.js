document.addEventListener('click', (event) => {
  const tab = event.target.closest('.tab-list [role="tab"]');
  if (!tab) return;
  const list = tab.parentElement;
  const tabs = [...list.querySelectorAll('[role="tab"]')];
  tabs.forEach((item) => item.setAttribute('aria-selected', String(item === tab)));
  list.style.setProperty('--index', tabs.indexOf(tab));
});

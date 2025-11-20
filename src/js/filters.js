const tabsContainer = document.querySelector('[data-filters-tabs]');
const searchBox = document.querySelector('.filters__search');
const subtitle = document.querySelector('.filters__subtitle');

if (tabsContainer) {
  tabsContainer.addEventListener('click', e => {
    const btn = e.target.closest('.filters__tab');
    if (!btn) return;

    tabsContainer.querySelectorAll('.filters__tab').forEach(tab => {
      const isActive = tab === btn;
      tab.classList.toggle('filters__tab--active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    const filter = btn.dataset.filter;

    if (filter === 'bodypart') {
      searchBox.classList.remove('hidden');
      subtitle.textContent = ' / Waist';
    } else {
      searchBox.classList.add('hidden');
      subtitle.textContent = '';
    }
  });
}

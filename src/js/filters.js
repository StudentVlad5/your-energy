import { REFS } from './constants.js';

const {
  filtersTabs: tabsContainer,
  filtersSearchBox: searchBox,
  filtersSubtitle: subtitle,
} = REFS;

const isDesktop = () => window.matchMedia('(min-width: 1440px)').matches;


if (tabsContainer && searchBox && subtitle) {
  const updateUIForFilter = filter => {
    const desktop = isDesktop();

    if (filter === 'bodypart') {
      subtitle.textContent = ' / Waist';

      if (desktop) {
        // DESKTOP: показываем через opacity
        searchBox.classList.add('filters__search--visible');
        // searchBox.classList.remove('filters__search--visible-mobile');
      } else {
        // MOBILE + TABLET: поиск появляется вместо табов, сдвигая их вправо/вниз
        // searchBox.classList.add('filters__search--visible-mobile');
        searchBox.classList.add('filters__search--visible');
        // searchBox.classList.remove('filters__search--visible');
      }
    } else {
      subtitle.textContent = '';
      searchBox.classList.remove(
        'filters__search--visible'
        // 'filters__search--visible-mobile'
      );
    }
  };

  tabsContainer.addEventListener('click', e => {
    const btn = e.target.closest('.filters__tab');
    if (!btn) return;

    tabsContainer.querySelectorAll('.filters__tab').forEach(tab => {
      const isActive = tab === btn;
      tab.classList.toggle('filters__tab--active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    updateUIForFilter(btn.dataset.filter);
  });

  // Инициализация при загрузке страницы (если Body parts активен по умолчанию)
  const activeBtn = tabsContainer.querySelector('.filters__tab--active');
  if (activeBtn) {
    updateUIForFilter(activeBtn.dataset.filter);
  }
}

// === Логика крестика очистки ===
const searchInput = document.querySelector('.filters__input');
const clearBtn = document.querySelector('.filters__clear-btn');

if (searchInput && clearBtn) {
  const toggleClear = () => {
    if (searchInput.value.trim()) {
      clearBtn.classList.add('filters__clear-btn--visible');
    } else {
      clearBtn.classList.remove('filters__clear-btn--visible');
    }
  };

  searchInput.addEventListener('input', toggleClear);

  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchInput.focus();
    toggleClear();
  });

  toggleClear();
}


// filters-tabs.js
// const tabsContainer = document.querySelector('[data-filters-tabs]');
// const searchBox = document.querySelector('.filters__search');
// const subtitle = document.querySelector('.filters__subtitle');

// // ✅ Експортована функція для активації табу ззовні (з Categories)
// export function activateFiltersTab(filterKey, subtitleValue = '') {
//   if (!tabsContainer) return;

//   const btn = tabsContainer.querySelector(`[data-filter="${filterKey}"]`);
//   if (!btn) return;

//   // робимо активним потрібний таб
//   tabsContainer.querySelectorAll('.filters__tab').forEach(tab => {
//     const isActive = tab === btn;
//     tab.classList.toggle('filters__tab--active', isActive);
//     tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
//   });

//   // запускаємо ту саму логіку, що була в твоєму if
//   if (filterKey === 'bodypart') {
//     searchBox.classList.remove('hidden');
//     subtitle.textContent = ` / ${subtitleValue || 'Waist'}`;
//   } else {
//     searchBox.classList.add('hidden');
//     subtitle.textContent = '';
//   }
// }

// // ✅ Твій старий listener — залишаємо, але використовуємо функцію
// if (tabsContainer) {
//   tabsContainer.addEventListener('click', e => {
//     const btn = e.target.closest('.filters__tab');
//     if (!btn) return;

//     const filterKey = btn.dataset.filter;
//     activateFiltersTab(filterKey);
//   });
// }

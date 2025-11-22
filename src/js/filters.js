// const tabsContainer = document.querySelector('[data-filters-tabs]');
// const searchBox = document.querySelector('.filters__search');
// const subtitle = document.querySelector('.filters__subtitle');

// const isDesktop = () => window.matchMedia('(min-width: 1440px)').matches;

// if (tabsContainer && searchBox && subtitle) {
//   const updateUIForFilter = filter => {
//     const desktop = isDesktop();

//     if (filter === 'bodypart') {
//       subtitle.textContent = ' / Waist';

//       if (desktop) {
//         // DESKTOP: показываем через opacity
//         searchBox.classList.add('filters__search--visible');
//         // searchBox.classList.remove('filters__search--visible-mobile');
//       } else {
//         // MOBILE + TABLET: поиск появляется вместо табов, сдвигая их вправо/вниз
//         // searchBox.classList.add('filters__search--visible-mobile');
//         searchBox.classList.add('filters__search--visible');
//         // searchBox.classList.remove('filters__search--visible');
//       }
//     } else {
//       subtitle.textContent = '';
//       searchBox.classList.remove(
//         'filters__search--visible'
//         // 'filters__search--visible-mobile'
//       );
//     }
//   };

//   tabsContainer.addEventListener('click', e => {
//     const btn = e.target.closest('.filters__tab');
//     if (!btn) return;

//     tabsContainer.querySelectorAll('.filters__tab').forEach(tab => {
//       const isActive = tab === btn;
//       tab.classList.toggle('filters__tab--active', isActive);
//       tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
//     });

//     updateUIForFilter(btn.dataset.filter);
//   });

//   // Инициализация при загрузке страницы (если Body parts активен по умолчанию)
//   const activeBtn = tabsContainer.querySelector('.filters__tab--active');
//   if (activeBtn) {
//     updateUIForFilter(activeBtn.dataset.filter);
//   }
// }

// // === Логика крестика очистки ===
// const searchInput = document.querySelector('.filters__input');
// const clearBtn = document.querySelector('.filters__clear-btn');

// if (searchInput && clearBtn) {
//   const toggleClear = () => {
//     if (searchInput.value.trim()) {
//       clearBtn.classList.add('filters__clear-btn--visible');
//     } else {
//       clearBtn.classList.remove('filters__clear-btn--visible');
//     }
//   };

//   searchInput.addEventListener('input', toggleClear);

//   clearBtn.addEventListener('click', () => {
//     searchInput.value = '';
//     searchInput.focus();
//     toggleClear();
//   });

//   toggleClear();
// }

// // filters-tabs.js
// // const tabsContainer = document.querySelector('[data-filters-tabs]');
// // const searchBox = document.querySelector('.filters__search');
// // const subtitle = document.querySelector('.filters__subtitle');

// // // ✅ Експортована функція для активації табу ззовні (з Categories)
// // export function activateFiltersTab(filterKey, subtitleValue = '') {
// //   if (!tabsContainer) return;

// //   const btn = tabsContainer.querySelector(`[data-filter="${filterKey}"]`);
// //   if (!btn) return;

// //   // робимо активним потрібний таб
// //   tabsContainer.querySelectorAll('.filters__tab').forEach(tab => {
// //     const isActive = tab === btn;
// //     tab.classList.toggle('filters__tab--active', isActive);
// //     tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
// //   });

// //   // запускаємо ту саму логіку, що була в твоєму if
// //   if (filterKey === 'bodypart') {
// //     searchBox.classList.remove('hidden');
// //     subtitle.textContent = ` / ${subtitleValue || 'Waist'}`;
// //   } else {
// //     searchBox.classList.add('hidden');
// //     subtitle.textContent = '';
// //   }
// // }

// // // ✅ Твій старий listener — залишаємо, але використовуємо функцію
// // if (tabsContainer) {
// //   tabsContainer.addEventListener('click', e => {
// //     const btn = e.target.closest('.filters__tab');
// //     if (!btn) return;

// //     const filterKey = btn.dataset.filter;
// //     activateFiltersTab(filterKey);
// //   });
// // }

// filters.js
import { loadExercisesList } from './exercises-list.js';
const tabsContainer = document.querySelector('[data-filters-tabs]');
const searchBox = document.querySelector('.filters__search');
const subtitle = document.querySelector('.filters__subtitle');

const isDesktop = () => window.matchMedia('(min-width: 1440px)').matches;

// ✅ універсальна функція оновлення UI
function updateUIForFilter(filter, subtitleValue = '') {
  if (!searchBox || !subtitle) return;

  const desktop = isDesktop();

  if (filter === 'bodypart') {
    // якщо прийшло значення з Categories — показуємо його,
    // інакше лишаємо дефолт Waist
    subtitle.textContent = ` / ${subtitleValue || 'Waist'}`;

    // 👉 ДОБАВЛЕНО: рендер ексесайзів
    if (typeof renderExercises === 'function') {
      renderExercises(window.exercisesList || []);
    }

    if (desktop) {
      searchBox.classList.add('filters__search--visible');
    } else {
      searchBox.classList.add('filters__search--visible');
    }
  } else {
    subtitle.textContent = '';
    searchBox.classList.remove('filters__search--visible');
  }
}

// ✅ ЕКСПОРТ: те, що викликає Categories
export function activateFiltersTab(filterKey, subtitleValue = '') {
  if (!tabsContainer) return;

  const btn = tabsContainer.querySelector(`[data-filter="${filterKey}"]`);
  if (!btn) return;

  const categories = document.getElementById('cards-box');
  const exercises = document.getElementById('exercises');

  if (filterKey === 'muscles' || filterKey === 'equipment') {
    // Повертаємо початковий вигляд
    categories.classList.remove('hidden');
    exercises.classList.add('hidden');
    // ✅ повертаємо картки в початковий стан

    // Чистимо subtitle
    const subtitle = document.querySelector('.filters__subtitle');
    subtitle.textContent = '';

    // URL скидаємо
    const url = new URL(window.location.href);
    url.searchParams.delete('filter');
    window.history.pushState({}, '', url);
  } else if (filterKey === 'bodypart') {
    // ✅ показуємо EXERCISES
    categories.classList.add('hidden');
    exercises.classList.remove('hidden');

    // ✅ оновлюємо URL під формат exercises-list.js
    const url = new URL(window.location.href);
    url.searchParams.set('type', 'body-parts');

    if (subtitleValue) {
      // прийшли з Categories — filter вже правильний,
      // тут НЕ робимо loadExercisesList, бо Categories вже його викликає
      url.searchParams.set('filter', subtitleValue.toLowerCase());
    } else {
      // клік по табу — хай exercises-list візьме дефолт waist
      url.searchParams.delete('filter');

      // ✅ і тільки тут робимо запит
      loadExercisesList({ page: 1 });
    }
  }

  // активуємо таби
  tabsContainer.querySelectorAll('.filters__tab').forEach(tab => {
    const isActive = tab === btn;
    tab.classList.toggle('filters__tab--active', isActive);
    tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  // оновлюємо UI (search + subtitle)
  updateUIForFilter(filterKey, subtitleValue);
}

// ✅ твій listener тепер просто використовує ту саму функцію
if (tabsContainer && searchBox && subtitle) {
  tabsContainer.addEventListener('click', e => {
    const btn = e.target.closest('.filters__tab');
    if (!btn) return;

    // subtitleValue тут не передаємо — буде дефолтний Waist
    activateFiltersTab(btn.dataset.filter);
  });

  // ініціалізація при завантаженні
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
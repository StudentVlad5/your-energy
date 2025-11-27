import {
  getOpenExercises,
  setOpenExercises,
  getExercisesContext,
} from './state.js';
import { getCategories } from './categories.js';
import { loadExercisesList } from './exercises-list.js';

const tabsContainer = document.querySelector('[data-filters-tabs]');
const searchBox = document.querySelector('.filters__search');
const subtitle = document.querySelector('.filters__subtitle');

// ---------------------------------------
// helpers для UI
// ---------------------------------------

function updateUIForFilter(filter, subtitleValue = '') {
  if (!searchBox || !subtitle) return;

  const capitalizedSubtitle = subtitleValue
    ? subtitleValue.charAt(0).toUpperCase() + subtitleValue.slice(1)
    : '';

  if (filter === 'bodypart') {
    subtitle.textContent = ` / ${capitalizedSubtitle}`;

    if (typeof renderExercises === 'function') {
      renderExercises(window.exercisesList || []);
    }
  } else {
    subtitle.textContent = '';
  }
}

// запис стану табу в history + URL
function pushTabState(filterKey) {
  const url = new URL(location.href);
  url.searchParams.set('tab', filterKey);

  history.pushState(
    { tab: filterKey }, // важливо: тільки tab, без type/page для exercises
    '',
    url
  );
}

// ---------------------------------------
// основний перемикач табів
// ---------------------------------------

export function activateFiltersTab(filterKey, subtitleValue = '') {
  if (!tabsContainer) return;

  // запам’ятовуємо активний таб (для перезавантаження)
  sessionStorage.setItem('activeFilter', filterKey);

  if (searchBox) searchBox.classList.remove('filters__search--visible');
  const btn = tabsContainer.querySelector(`[data-filter="${filterKey}"]`);
  if (!btn) return;

  const categoriesBox = document.getElementById('cards-box');
  const exercisesBox = document.getElementById('exercises');

  // за замовчуванням – показуємо картки категорій, а не exercises
  if (categoriesBox) categoriesBox.classList.remove('hidden');
  if (exercisesBox) exercisesBox.classList.add('hidden');
  setOpenExercises(false);

  if (filterKey === 'muscles') {
    window.activeFilter = 'Muscles';
    getCategories('Muscles');
  } else if (filterKey === 'equipment') {
    window.activeFilter = 'Equipment';
    getCategories('Equipment');
  } else if (filterKey === 'bodypart') {
    window.activeFilter = 'Body parts';
    getCategories('Body parts');
  }

  // підсвічуємо активний таб
  tabsContainer.querySelectorAll('.filters__tab').forEach(tab => {
    const isActive = tab === btn;
    tab.classList.toggle('filters__tab--active', isActive);
    tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  updateUIForFilter(filterKey, subtitleValue);
}

// ---------------------------------------
// ініціалізація
// ---------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  if (!tabsContainer || !searchBox || !subtitle) return;

  // клік по табу
  tabsContainer.addEventListener('click', e => {
    const btn = e.target.closest('.filters__tab');
    if (!btn) return;

    const filterKey = btn.dataset.filter;

    // при кліку – записуємо стан табу в history
    pushTabState(filterKey);

    // при кліку по табу – повертаємось до карток
    setOpenExercises(false);
    activateFiltersTab(filterKey);
  });

  // читаємо tab з URL (якщо є)
  const url = new URL(location.href);
  const urlTab = url.searchParams.get('tab');

  const savedFilter = sessionStorage.getItem('activeFilter');
  const initialFilter = urlTab || savedFilter || 'muscles';

  const isExercisesOpen = getOpenExercises();

  if (isExercisesOpen) {
    // режим exercises (коли вже відкривали вправи)
    const categoriesBox = document.getElementById('cards-box');
    const exercisesBox = document.getElementById('exercises');

    if (categoriesBox) categoriesBox.classList.add('hidden');
    if (exercisesBox) exercisesBox.classList.remove('hidden');
    if (searchBox) searchBox.classList.add('filters__search--visible');

    // підсвічуємо правильний таб
    const btn = tabsContainer.querySelector(`[data-filter="${initialFilter}"]`);
    if (btn) {
      tabsContainer.querySelectorAll('.filters__tab').forEach(tab => {
        const isActive = tab === btn;
        tab.classList.toggle('filters__tab--active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
    }

    // відновлюємо exercises з тими ж параметрами, що були
    const { name, type } = getExercisesContext();

    if (name) {
      loadExercisesList({
        page: 1,
        filter: name,
        type: type || initialFilter,
        keyword: '',
      });
    }
  } else {
    // стандартний сценарій – відкриті картки
    activateFiltersTab(initialFilter);
  }
});

// ---------------------------------------
// логіка для clear button в пошуку
// ---------------------------------------

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

// ---------------------------------------
// Повернення стрілкою "Назад" / "Вперед"
// ---------------------------------------

window.addEventListener('popstate', event => {
  const state = event.state;

  // нас цікавлять тільки state, де є tab
  if (!state || !state.tab) return;

  const tabKey = state.tab;
  const page = state.page || 1;

  // коли повертаємось по історії табів/категорій – показуємо картки, а не exercises
  setOpenExercises(false);
  activateFiltersTab(tabKey);

  // якщо в history збережена конкретна сторінка пагінації — вантажимо саме її
  if (page > 1) {
    let filterName = 'Muscles';
    if (tabKey === 'equipment') filterName = 'Equipment';
    else if (tabKey === 'bodypart') filterName = 'Body parts';

    getCategories(filterName, page);
  }
});

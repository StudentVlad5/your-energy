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
  }
}

export function activateFiltersTab(filterKey, subtitleValue = '') {
  if (!tabsContainer) return;

  sessionStorage.setItem('activeFilter', filterKey);

  if (searchBox) searchBox.classList.remove('filters__search--visible');
  const btn = tabsContainer.querySelector(`[data-filter="${filterKey}"]`);
  if (!btn) return;

  const categoriesBox = document.getElementById('cards-box');
  const exercisesBox = document.getElementById('exercises');

  if (categoriesBox) categoriesBox.classList.add('hidden');
  if (exercisesBox) exercisesBox.classList.add('hidden');

  if (filterKey === 'muscles') {
    window.activeFilter = 'Muscles';
    getCategories('Muscles');
    if (categoriesBox) categoriesBox.classList.remove('hidden');
    setOpenExercises(false);
  } else if (filterKey === 'equipment') {
    window.activeFilter = 'Equipment';
    getCategories('Equipment');
    if (categoriesBox) categoriesBox.classList.remove('hidden');
    setOpenExercises(false);
  } else if (filterKey === 'bodypart') {
    window.activeFilter = 'Body parts';
    getCategories('Body parts');
    if (categoriesBox) categoriesBox.classList.remove('hidden');
    setOpenExercises(false);
  }

  tabsContainer.querySelectorAll('.filters__tab').forEach(tab => {
    const isActive = tab === btn;
    tab.classList.toggle('filters__tab--active', isActive);
    tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  updateUIForFilter(filterKey, subtitleValue);
}


document.addEventListener('DOMContentLoaded', () => {
  if (!tabsContainer || !searchBox || !subtitle) return;

  tabsContainer.addEventListener('click', e => {
    const btn = e.target.closest('.filters__tab');
    if (!btn) return;

    // при кліку по табу – повертаємось до карток
    setOpenExercises(false);
    activateFiltersTab(btn.dataset.filter);
  });

  const savedFilter = sessionStorage.getItem('activeFilter');
  const initialFilter = savedFilter || 'muscles';

  const isExercisesOpen = getOpenExercises();

  if (isExercisesOpen) {

    const categoriesBox = document.getElementById('cards-box');
    const exercisesBox = document.getElementById('exercises');

    if (categoriesBox) categoriesBox.classList.add('hidden');
    if (exercisesBox) exercisesBox.classList.remove('hidden');
    if (searchBox) searchBox.classList.add('filters__search--visible');

    // Підсвічуємо правильний таб
    const btn = tabsContainer.querySelector(`[data-filter="${initialFilter}"]`);
    if (btn) {
      tabsContainer.querySelectorAll('.filters__tab').forEach(tab => {
        const isActive = tab === btn;
        tab.classList.toggle('filters__tab--active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
    }

    //  Відновлюємо exercises з тими ж параметрами, що були
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
    //  Стандартний сценарій – відкриті картки
    activateFiltersTab(initialFilter);
  }
});

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

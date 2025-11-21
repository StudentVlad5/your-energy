import iziToast from 'izitoast';
import { loadExercisesList } from './exercises-list.js';

export function initExercisesSearch() {
  const searchInput = document.querySelector('.filters__input');
  const searchBtn = document.querySelector('.filters__search-btn');
  const clearBtn = document.querySelector('.filters__clear-btn');

  if (!searchInput || !searchBtn) return;

  const runSearch = () => {
    const query = searchInput.value.trim();

    if (!query) {
      iziToast.warning({
        title: 'Attention',
        message: 'Enter a search query',
        position: 'topRight',
      });
      return;
    }

    loadExercisesList({ page: 1, keyword: query });
  };

  searchBtn.addEventListener('click', runSearch);

  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      runSearch();
    }
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchInput.focus();

      loadExercisesList({ page: 1, keyword: '' });
    });
  }
}

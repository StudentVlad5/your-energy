import 'izitoast/dist/css/iziToast.min.css';

import './js/quote-of-the-day.js';

// import './js/favorites-btn.js';
// import './js/favorites-page.js';

import './js/categories.js';

import './js/mobile-menu.js';
import './js/filters.js';
import './js/footer.js';
import './js/scroll-up.js';
import { cancelLoader } from './js/loader.js';
import { registerModalType, initModalButtons } from './js/modal-template.js';
import { MODAL_TYPES } from './js/constants.js';
import {
  getExerciseModalContent,
  initExerciseModal,
} from './js/modal-exercise-content.js';
import {
  getRatingModalContent,
  initRatingModal,
} from './js/modal-rating-content.js';
import { initExercisesTabs } from './js/exercises-tabs.js';
import {  loadExercisesList } from './js/exercises-list.js';
// import { renderPagination } from './js/categories.js';
import { initExercisesSearch } from './js/exercises-search.js';

// функція пошуку
// ref.searchButton.addEventListener('click', onSearch);
// ref.loadMoreButton.addEventListener('click', loadMore);

// if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => cancelLoader(), 200);
  initModals();
});
// } else {
//   cancelLoader();
//   initModals();
// }

function initModals() {
  registerModalType(MODAL_TYPES.RATING, getRatingModalContent, initRatingModal);
  registerModalType(
    MODAL_TYPES.EXERCISE,
    getExerciseModalContent,
    initExerciseModal
  );

  initModalButtons();
}


loadExercisesList();
initExercisesTabs();
initExercisesSearch();

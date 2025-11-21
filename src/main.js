import 'izitoast/dist/css/iziToast.min.css';

import './js/quote-of-the-day.js';

import './js/favorites-btn.js';
import './js/favorites-page.js';

import './js/categories.js';

import './js/mobile-menu.js';
import './js/filters.js';
import './js/footer.js';
import { cancelLoader } from './js/loader.js';
import { registerModalType, initModalButtons } from './js/modal-template.js';
import { MODAL_TYPES } from './js/constants.js';
import {
  getRatingModalContent,
  initRatingModal,
} from './js/modal-rating-content.js';

// функція пошуку
// ref.searchButton.addEventListener('click', onSearch);
// ref.loadMoreButton.addEventListener('click', loadMore);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    cancelLoader();
    initModals();
  });
} else {
  cancelLoader();
  initModals();
}

function initModals() {
  registerModalType(MODAL_TYPES.RATING, getRatingModalContent, initRatingModal);
  // registerModalType(MODAL_TYPES.EXERCISE, getExerciseModalContent, initExerciseModal);

  initModalButtons();
}

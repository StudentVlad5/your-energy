import 'izitoast/dist/css/iziToast.min.css';
import './js/quote-of-the-day.js';
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
import { loadExercisesList } from './js/exercises-list.js';
import { initExercisesSearch } from './js/exercises-search.js';

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => cancelLoader(), 300);
  initModals();
});

window.activeFilter = 'Muscles';

function initializeGlobalVariables() {
  // Global variables
  window.activeFilter = 'Muscles';
  console.log('window.activeFilter = ', window.activeFilter);
}

initializeGlobalVariables();

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

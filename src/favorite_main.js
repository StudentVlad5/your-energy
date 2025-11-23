import 'izitoast/dist/css/iziToast.min.css';
import './js/quote-of-the-day.js';
import './js/mobile-menu.js';
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

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => cancelLoader(), 300);
  initModals();
});

function initModals() {
  registerModalType(MODAL_TYPES.RATING, getRatingModalContent, initRatingModal);
  registerModalType(
    MODAL_TYPES.EXERCISE,
    getExerciseModalContent,
    initExerciseModal
  );

  initModalButtons();
}

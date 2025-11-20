import 'izitoast/dist/css/iziToast.min.css';
import './js/quote-of-the-day.js';
import { cancelLoader } from './js/loader.js';
import { registerModalType, initModalButtons } from './js/modal-template.js';
import { MODAL_TYPES } from './js/constants.js';
import {
  getRatingModalContent,
  initRatingModal,
} from './js/modal-rating-content.js';

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

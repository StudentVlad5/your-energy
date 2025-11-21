export const REFS = {
  modalBody: document.querySelector('[data-modal-body]'),

  favoritesBtn: document.querySelector('.favorites-btn'),
  favoritesList: document.querySelector('.favorites-list'),

  exercisesList: document.querySelector('.js-exercises-list'),
  exercisesActiveTab: document.querySelector('.exercises__tab--active'),
  exercisesPagination: document.querySelector('.js-exercises-pagination'),

  modalTemplate: document.getElementById('modal-template'),
  modalCloseBtn: document.querySelector('.modal-template__close-btn'),
  modalBackdrop: document.querySelector('.modal-template__backdrop'),

  exerciseModal: document.querySelector('.exercise-modal'), // from modal-exercise.html
  exerciseTrigger: document.querySelector('[data-modal="exercise"]'),
};

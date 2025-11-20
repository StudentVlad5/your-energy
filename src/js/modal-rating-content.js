import { YourEnergyAPI } from './api.js';
import { showError, showSuccess } from './iziToast-helper.js';
import { openConfirmModal } from './confirm-modal.js';
import { ERROR_MESSAGES } from './constants.js';

const api = new YourEnergyAPI();

let checkFormFilledFn = null;

export function getRatingModalContent() {
  const existingRatingModal = document.querySelector('.rating-modal');

  if (!existingRatingModal) {
    console.error(
      'Rating modal HTML not found. Make sure modal-rating.html is loaded via <load> tag.'
    );
    return null;
  }

  const clonedModal = existingRatingModal.cloneNode(true);
  updateElementIds(clonedModal);

  return clonedModal;
}

function initRatingModalButtons() {
  document.addEventListener(
    'click',
    function (event) {
      const button = event.target.closest('[data-modal="rating"]');
      if (button) {
        const exerciseId = button.getAttribute('data-exercise-id');
        if (exerciseId) {
          sessionStorage.setItem('ratingModalExerciseId', exerciseId);
        }
      }
    },
    { capture: true }
  );
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRatingModalButtons);
} else {
  initRatingModalButtons();
}

function updateElementIds(element) {
  const elementsWithId = element.querySelectorAll('[id]');
  const timestamp = Date.now();

  elementsWithId.forEach(el => {
    const oldId = el.id;
    el.id = `${oldId}-${timestamp}`;

    const labels = element.querySelectorAll(`label[for="${oldId}"]`);
    labels.forEach(label => {
      label.setAttribute('for', el.id);
    });
  });
}

export function checkRatingFormFilled() {
  return checkFormFilledFn ? checkFormFilledFn() : false;
}

function clearRatingForm() {
  const modalBody = document.querySelector('[data-modal-body]');
  const ratingModal = modalBody?.querySelector('.rating-modal');

  if (!ratingModal) return;

  const form = ratingModal.querySelector('.rating-modal__form');
  const ratingInput = ratingModal.querySelector('input[name="rating"]');
  const ratingText = ratingModal.querySelector('.rating-modal__rating-text');
  const emailInput = ratingModal.querySelector('input[name="email"]');
  const commentTextarea = ratingModal.querySelector('textarea[name="comment"]');
  const stars = ratingModal.querySelectorAll('.rating-star');

  if (form) form.reset();
  if (ratingInput) ratingInput.value = '0';
  if (emailInput) emailInput.value = '';
  if (commentTextarea) commentTextarea.value = '';
  if (ratingText) ratingText.textContent = '';

  stars.forEach(star => {
    star.classList.remove('active');
  });
}

export function handleRatingModalClose(closeModalFn) {
  if (checkFormFilledFn && checkFormFilledFn()) {
    openConfirmModal(
      'Are you sure you want to cancel your exercise review?',
      () => {
        clearRatingForm();
        checkFormFilledFn = null;
        closeModalFn();
      },
      () => {}
    );
  } else {
    clearRatingForm();
    checkFormFilledFn = null;
    closeModalFn();
  }
}

export function initRatingModal(closeModalFn) {
  checkFormFilledFn = null;

  const modalBody = document.querySelector('[data-modal-body]');
  const ratingModal = modalBody?.querySelector('.rating-modal');

  if (!modalBody || !ratingModal) {
    console.error('Modal body or rating modal not found');
    return;
  }

  let exerciseId =
    sessionStorage.getItem('ratingModalExerciseId') ||
    document
      .querySelector('[data-modal="rating"][data-exercise-id]')
      ?.getAttribute('data-exercise-id');

  if (exerciseId) {
    sessionStorage.removeItem('ratingModalExerciseId');
  }

  if (!exerciseId) {
    showError('Exercise ID is missing');
    return;
  }

  const stars = ratingModal.querySelectorAll('.rating-star');
  const ratingInput = ratingModal.querySelector('input[name="rating"]');
  const ratingText = ratingModal.querySelector('.rating-modal__rating-text');
  const cancelBtn = ratingModal.querySelector('.rating-modal__btn--cancel');
  const submitBtn = ratingModal.querySelector(
    '.rating-modal__btn[type="submit"]'
  );
  const emailInput = ratingModal.querySelector('input[name="email"]');
  const commentTextarea = ratingModal.querySelector('textarea[name="comment"]');
  const form = ratingModal.querySelector('.rating-modal__form');

  let currentRating = 0;
  if (submitBtn) submitBtn.disabled = true;
  if (ratingInput) ratingInput.value = '0';
  if (ratingText) ratingText.textContent = '0';

  const isFormValid = () => {
    return (
      currentRating > 0 &&
      currentRating <= 5 &&
      emailInput?.value.trim() !== '' &&
      commentTextarea?.value.trim() !== ''
    );
  };

  const updateSubmitButton = () => {
    if (submitBtn) {
      submitBtn.disabled = !isFormValid();
    }
  };

  const checkFormFilled = () => {
    return (
      currentRating > 0 ||
      emailInput?.value.trim() !== '' ||
      commentTextarea?.value.trim() !== ''
    );
  };

  checkFormFilledFn = checkFormFilled;

  const updateStars = rating => {
    stars.forEach((star, index) => {
      const starRating = index + 1;
      if (starRating <= rating) {
        star.classList.add('active');
      } else {
        star.classList.remove('active');
      }
    });
  };

  stars.forEach((star, index) => {
    const rating = index + 1;

    star.addEventListener('click', () => {
      currentRating = rating;
      updateStars(rating);
      if (ratingInput) ratingInput.value = rating;
      if (ratingText) ratingText.textContent = rating;
      updateSubmitButton();
    });
  });

  [emailInput, commentTextarea].forEach(input => {
    if (input) {
      input.addEventListener('input', updateSubmitButton);
    }
  });

  const resetForm = () => {
    currentRating = 0;
    if (ratingInput) ratingInput.value = '0';
    if (emailInput) emailInput.value = '';
    if (commentTextarea) commentTextarea.value = '';
    if (ratingText) ratingText.textContent = '0';
    updateStars(0);
    updateSubmitButton();
  };

  const backdrop = document.querySelector('[data-modal-close]');

  const isConfirmModalOpen = () => {
    const confirmModal = document.getElementById('modal-confirm');
    return confirmModal && !confirmModal.classList.contains('hidden');
  };

  const handleEscapeCapture = event => {
    if (event.key === 'Escape') {
      if (isConfirmModalOpen()) {
        return;
      }
      event.stopPropagation();
      handleRatingModalClose(() => {
        cleanup();
        closeModalFn();
      });
    }
  };

  const backdropClickHandler = event => {
    if (event.target === backdrop) {
      if (isConfirmModalOpen()) {
        return;
      }
      event.stopPropagation();
      handleRatingModalClose(() => {
        cleanup();
        closeModalFn();
      });
    }
  };

  const cleanup = () => {
    document.removeEventListener('keydown', handleEscapeCapture, {
      capture: true,
    });
    backdrop?.removeEventListener('click', backdropClickHandler, {
      capture: true,
    });
    closeBtn?.removeEventListener('click', closeBtnHandler, { capture: true });
  };

  const closeBtn = document.querySelector('.modal-template__close-btn');
  const closeBtnHandler = event => {
    if (isConfirmModalOpen()) {
      return;
    }
    event.stopPropagation();
    handleClose();
  };

  document.addEventListener('keydown', handleEscapeCapture, { capture: true });
  backdrop?.addEventListener('click', backdropClickHandler, { capture: true });
  closeBtn?.addEventListener('click', closeBtnHandler, { capture: true });

  const handleClose = () => {
    handleRatingModalClose(() => {
      cleanup();
      closeModalFn();
    });
  };

  if (cancelBtn && closeModalFn) {
    cancelBtn.addEventListener('click', () => {
      handleClose();
    });
  }

  if (form) {
    form.setAttribute('data-no-auto-close', 'true');

    form.addEventListener('submit', async e => {
      e.preventDefault();

      if (!isFormValid()) {
        showError('Please fill in all fields');
        return;
      }

      const formData = new FormData(form);
      const rating = parseInt(formData.get('rating'), 10);
      const email = formData.get('email').trim();
      const comment = formData.get('comment').trim();

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      try {
        await api.rateExercise(exerciseId, {
          rate: rating,
          email: email,
          review: comment,
        });

        showSuccess('Thank you for your feedback!');
        checkFormFilledFn = null;

        setTimeout(() => {
          if (closeModalFn) {
            cleanup();
            closeModalFn();
          }
        }, 1000);
      } catch (error) {
        console.error('Failed to submit rating:', error);
        showError(error.message || ERROR_MESSAGES.API_ERROR);

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send';
        }
      }
    });
  }
}

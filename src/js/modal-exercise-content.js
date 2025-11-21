import { YourEnergyAPI } from './api.js';
import { initFavoritesBtn } from './favorites-btn.js';
import { REFS } from './constants.js';

const api = new YourEnergyAPI();

export function getExerciseModalContent() {
  const modalTemplate = REFS.exerciseModal;

  if (!modalTemplate) {
    console.error(
      'Exercise modal HTML not found. Ensure modal-exercise.html is loaded via <load>.'
    );
    return null;
  }

  const clone = modalTemplate.cloneNode(true);
  return clone;
}

export async function initExerciseModal(closeModalFn) {
  const modalBody = REFS.modalBody;
  const modal = modalBody?.querySelector('.exercise-modal');

  if (!modal) {
    console.error('Exercise modal not found after openModal()');
    return;
  }

  let activeTrigger = REFS.exerciseTrigger;

  let exerciseId = activeTrigger?.getAttribute('data-exercise-id');
  if (!exerciseId) {
    exerciseId = modal.getAttribute('data-exercise-id');
  }

  if (!exerciseId) {
    console.error('Exercise ID is missing for modal');
    return;
  }

  let exercise;
  try {
    exercise = await api.getExerciseById(exerciseId);

    exercise.id = exercise.id || exercise._id;
  } catch (err) {
    console.error('Failed to load exercise:', err);
    modal.innerHTML = `<p>Failed to load exercise. Try later.</p>`;
    return;
  }

  renderExerciseData(modal, exercise);

  initFavoritesBtn(exercise);
}

function renderExerciseData(container, exercise) {
  container.innerHTML = `
    <div class="exercise-modal__header">
      <h2 class="exercise-modal__title">${exercise.name}</h2>
    </div>

    <div class="exercise-modal__content">
      <img class="exercise-modal__gif" src="${exercise.gifUrl}" alt="${exercise.name}" />

      <ul class="exercise-modal__list">
        <li><b>Target:</b> ${exercise.target}</li>
        <li><b>Body part:</b> ${exercise.bodyPart}</li>
        <li><b>Equipment:</b> ${exercise.equipment}</li>
        <li><b>Burned calories:</b> ${exercise.burnedCalories}</li>
      </ul>

      <button type="button" class="favorites-btn">Add to favorites</button>
    </div>
  `;
}

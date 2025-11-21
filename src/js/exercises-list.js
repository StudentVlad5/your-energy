import { YourEnergyAPI } from './api';
import { showError } from './iziToast-helper';
import { renderPaginationUniversal } from './pagination.js';
import { REFS } from './constants.js';

const api = new YourEnergyAPI();

function getPageLimit() {
  return window.innerWidth < 768 ? 8 : 10;
}

let currentPage = 1;
let currentTotalPages = 1;

export async function initExercisesList() {
  const listEl = REFS.exercisesList;
  if (!listEl) return;

  await loadExercisesList({ page: 1 });
}

export async function loadExercisesList({ page = 1, keyword = '' } = {}) {
  const listEl = REFS.exercisesList;
  if (!listEl) return;

  const limit = getPageLimit();

  const { type, filter } = getTypeAndFilterFromUI();
  const params = buildExercisesParams({ page, limit, type, filter, keyword });

  try {
    const data = await api.getExercises(params);
    const items = data.results || [];

    currentPage = data.page || page;
    currentTotalPages = data.totalPages || 1;

    renderExercisesList(listEl, items);
    renderExercisesPagination(currentPage, currentTotalPages);
  } catch (err) {
    console.error('Failed to load exercises:', err);
    showError(err.message || 'Failed to load exercises. Try again later.');

    listEl.innerHTML = `
      <li class="exercises__item">
        <p>Failed to load exercises. Try again later.</p>
      </li>
    `;
  }
}

function getTypeAndFilterFromUI() {
  const urlParams = new URLSearchParams(window.location.search);

  const typeFromUrl = urlParams.get('type') || urlParams.get('tab');

  const activeTab =
    REFS.exercisesActiveTab?.dataset.tab || typeFromUrl || 'body-parts';

  const filterFromUrl = urlParams.get('filter');
  const fallbackFilter = getDefaultFilterForType(activeTab);

  return {
    type: activeTab,
    filter: filterFromUrl || fallbackFilter,
  };
}

function getDefaultFilterForType(type) {
  switch (type) {
    case 'muscles':
      return 'abs';
    case 'equipment':
      return 'body weight';
    case 'body-parts':
    default:
      return 'waist';
  }
}

function buildExercisesParams({ page, limit, type, filter, keyword }) {
  const params = { page, limit };

  if (keyword) params.keyword = keyword;

  switch (type) {
    case 'body-parts':
      params.bodypart = filter;
      break;
    case 'muscles':
      params.muscles = filter;
      break;
    case 'equipment':
      params.equipment = filter;
      break;
    default:
      params.bodypart = filter;
  }

  return params;
}

function renderExercisesList(listEl, items) {
  if (!items.length) {
    listEl.innerHTML = `
      <li class="exercises__item">
        <p>No exercises found.</p>
      </li>
    `;
    return;
  }

  const markup = items.map(createExerciseCardMarkup).join('');
  listEl.innerHTML = markup;
}

function createExerciseCardMarkup(item) {
  const { name, burnedCalories, bodyPart, target, rating } = item;

  return `
    <li class="exercises__item">
      <div class="exercises__item-top">
        <div class="exercises__item-info">
          <span class="exercises__badge">Workout</span>
          <div class="exercises__rating">
            <span class="exercises__meta-key">${rating}</span>
            <span class="exercises__meta-value">
              <svg class="star"></svg>
            </span>
          </div>
        </div>

        <button
          type="button"
          class="exercises__start-btn js-open-exercise"
          data-modal="exercise"
          data-exercise-id="${item._id}"
        >
          Start
          <svg class="arrow__icon"></svg>
        </button>
      </div>

      <div class="exercises__name-container">
        <svg class="exercises__icon"></svg>
        <h3 class="exercises__name">${name}</h3>
      </div>

      <div class="exercises__item-bottom">
        <p class="exercises__meta">
          <span class="exercises__meta-label">Burned calories:</span>
          <span class="exercises__meta-value">${burnedCalories}</span>
        </p>
        <p class="exercises__meta">
          <span class="exercises__meta-label">Body part:</span>
          <span class="exercises__meta-value">${bodyPart}</span>
        </p>
        <p class="exercises__meta">
          <span class="exercises__meta-label">Target:</span>
          <span class="exercises__meta-value">${target}</span>
        </p>
      </div>
    </li>
  `;
}

export function renderExercisesPagination(currentPage, totalPages) {
  const container = REFS.exercisesPagination;

  renderPaginationUniversal({
    container,
    currentPage,
    totalPages,
    mode: 'neighbors',
    classes: {
      page: 'exercises__page',
      active: 'active',
    },
    onPageChange(page) {
      loadExercisesList({ page });
    },
  });
}

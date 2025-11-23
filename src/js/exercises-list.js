import { YourEnergyAPI } from './api';
import { showError } from './iziToast-helper';
import { renderPaginationUniversal } from './pagination.js';
import iziToast from 'izitoast';
import { openModal, closeModal } from './modal-template.js';
import { startLoader, cancelLoader } from './loader.js';
import {
  getExerciseModalContent,
  initExerciseModal,
} from './modal-exercise-content.js';
import { injectSchemaExercises } from './seo-function.js';

const api = new YourEnergyAPI();

function getPageLimit() {
  return window.innerWidth < 768 ? 8 : 10;
}

let currentQuery = {
  type: 'body-parts',
  filter: 'waist',
  keyword: '',
};

let currentPage = 1;
let currentTotalPages = 1;
let lastRequestId = 0;
let lastEmptyToastKey = '';

export async function loadExercisesList({
  page = 1,
  type,
  filter,
  keyword,
} = {}) {
  const listEl = document.querySelector('.js-exercises-list');
  if (!listEl) return;

  const limit = getPageLimit();

  if (type !== undefined) currentQuery.type = type;
  if (filter !== undefined) currentQuery.filter = filter;
  if (keyword !== undefined) currentQuery.keyword = keyword;

  const activeType = currentQuery.type;
  const activeFilter = currentQuery.filter;
  const activeKeyword = currentQuery.keyword || '';

  const params = buildExercisesParams({
    page,
    limit,
    type: activeType,
    filter: activeFilter,
    keyword: activeKeyword,
  });

  const requestId = ++lastRequestId;

  startLoader();

  try {
    const data = await api.getExercises(params);

    if (requestId !== lastRequestId) return;

    const items = data.results || [];
    currentPage = data.page || page;
    currentTotalPages = data.totalPages || 1;
    injectSchemaExercises(data);
    renderExercisesList(listEl, items);
    renderExercisesPagination(currentPage, currentTotalPages);

    if (!items.length) {
      const emptyKey = `${activeType}:${activeFilter}:${activeKeyword || ''}`;

      if (emptyKey !== lastEmptyToastKey) {
        lastEmptyToastKey = emptyKey;

        if (activeKeyword || type !== undefined || filter !== undefined) {
          iziToast.warning({
            title: 'No results',
            message: activeKeyword
              ? `Nothing found for “${activeKeyword}”. Try another search.`
              : 'No exercises found for this category.',
            position: 'topRight',
          });
        }
      }
    } else {
      lastEmptyToastKey = '';
    }

    const shouldUpdateUrl =
      type !== undefined || filter !== undefined || keyword !== undefined;

    if (shouldUpdateUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set('type', activeType);
      url.searchParams.set('filter', activeFilter);

      if (activeKeyword) url.searchParams.set('keyword', activeKeyword);
      else url.searchParams.delete('keyword');

      window.history.pushState({}, '', url);
    }
  } catch (err) {
    console.error('Failed to load exercises:', err);

    if (requestId !== lastRequestId) return;

    if (typeof showError === 'function') {
      showError(err.message || 'Failed to load exercises. Try again later.');
    } else {
      iziToast.error({
        title: 'Error',
        message: err.message || 'Failed to load exercises. Try again later.',
        position: 'topRight',
      });
    }

    listEl.innerHTML = `
      <li class="exercises__item">
        <p>Failed to load exercises. Try again later.</p>
      </li>
    `;
  } finally {
    if (requestId === lastRequestId) {
      cancelLoader();
    }
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

export function renderExercisesList(listEl, items, isFavorite = false) {
  if (!items.length) {
    listEl.innerHTML = `
      <li class="exercises__item">
        <p>No exercises found.</p>
      </li>
    `;
    return;
  }

  const markup = items
    .map(it => createExerciseCardMarkup(it, isFavorite))
    .join('');
  listEl.innerHTML = markup;
  handleExerciseItemClick(listEl);
}

function createExerciseCardMarkup(item, isFavorite = false) {
  const { name, burnedCalories, bodyPart, target, time, rating, _id } = item;
  const actionMarkup = isFavorite
    ? `<button type="button" class="favorites-delete-btn" data-id="${_id}">
         <svg class="favorites-icon-trash" width="16" height="16" aria-label="Remove from favorites">
            <use href="./img/icons.svg#icon-trash"></use> 
         </svg>
       </button>`
    : `<div class="exercises__rating">
         <span class="exercises__meta-key">${rating}</span>
         <span class="exercises__meta-value">
           <svg class="star" width="18" height="18">
             <use href="./img/icons.svg#icon-star"></use>
           </svg>
         </span>
       </div>`;

  return `
    <li class="exercises__item" data-exercise-id="${_id}">
      <div class="exercises__item-top">
        <div class="exercises__item-info">
          <span class="exercises__badge">Workout</span>
          
          ${actionMarkup} 
          
        </div>

        <button
          type="button"
          class="exercises__start-btn js-open-exercise"
          data-exercise-id="${_id}"
        >
          Start
          <svg class="arrow__icon" width="16" height="16">
             <use href="./img/icons.svg#icon-arrow"></use>
          </svg>
        </button>
      </div>

      <div class="exercises__name-container">
        <svg class="exercises__icon" width="24" height="24">
           <use href="./img/icons.svg#icon-running-man"></use>
        </svg>
        <h3 class="exercises__name">${name}</h3>
      </div>

        <div class="exercises__item-bottom">
          <p class="exercises__meta">
            <span class="exercises__meta-label">Burned calories:</span>
            <span class="exercises__meta-value">${burnedCalories} / ${time}</span>
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
  const container = document.querySelector('.js-exercises-pagination');
  if (!container) return;

  renderPaginationUniversal({
    container,
    currentPage,
    totalPages,
    mode: 'neighbors',
    showPrevNext: totalPages > 2,
    classes: {
      page: 'exercises__page',
      active: 'active',
      prev: 'exercises__page-prev',
      next: 'exercises__page-next',
    },
    icons: {
      prev: '<',
      next: '>',
    },
    scrollToTop: true,
    scrollTarget: '.exercises',
    onPageChange(page) {
      return loadExercisesList({ page });
    },
  });

  const el = document.querySelector('.filters__controls');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function handleExerciseItemClick(listEl) {
  const startButtons = listEl.querySelectorAll(
    '.exercises__start-btn[data-exercise-id]'
  );

  startButtons.forEach(button => {
    if (button.hasAttribute('data-click-handler-attached')) {
      return;
    }

    button.addEventListener('click', handleExcersiseModalOpen);
    button.setAttribute('data-click-handler-attached', 'true');
  });
}

async function handleExcersiseModalOpen(event) {
  const button = event.currentTarget;
  const exerciseId = button.getAttribute('data-exercise-id');

  if (!exerciseId) {
    console.error('Exercise ID is missing');
    return;
  }

  sessionStorage.setItem('exerciseModalExerciseId', exerciseId);

  const content = getExerciseModalContent();
  if (!content) {
    console.error('Failed to get exercise modal content');
    return;
  }

  openModal(content);
  try {
    await initExerciseModal(closeModal);
  } catch (error) {
    console.error('Error initializing exercise modal:', error);
  }
}

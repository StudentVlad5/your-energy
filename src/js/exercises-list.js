import { YourEnergyAPI } from './api';
import { showError } from './iziToast-helper'; // якщо не хочеш тости — можеш замінити на console.error
import { renderPaginationUniversal } from './pagination.js';
import iziToast from 'izitoast';
import { startLoader, cancelLoader } from './loader.js'; // <-- додали лоадер

const api = new YourEnergyAPI();
console.dir(api);

function getPageLimit() {
  return window.innerWidth < 768 ? 8 : 10;
}

// мінімальний стан
// (щоб пагінація знала останній filter/type/keyword)
let currentQuery = {
  type: 'body-parts',
  filter: 'waist',
  keyword: '',
};

// Поточний стан
let currentPage = 1;
let currentTotalPages = 1;

// анти-гонка запитів
let lastRequestId = 0;

// щоб не спамити тостом "No results" при тих самих параметрах
let lastEmptyToastKey = '';

// тимчасова, щоб відмальовувалась на сторінці без кліку
loadExercisesList({ page: 1 });

export async function loadExercisesList({
  page = 1,
  type,
  filter,
  keyword, // <-- ВАЖЛИВО: без дефолту '' щоб пагінація не скидала пошук
} = {}) {
  const listEl = document.querySelector('.js-exercises-list');
  if (!listEl) return;

  const limit = getPageLimit();

  // 1) якщо прилетіли type/filter/keyword — зберігаємо як актуальні
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

  console.log('ACTIVE TYPE:', activeType);
  console.log('FILTER VALUE:', activeFilter);
  console.log('EXERCISES PARAMS:', params);

  // 2) анти-гонка
  const requestId = ++lastRequestId;

  startLoader();

  try {
    const data = await api.getExercises(params);
    console.log(data);

    // якщо це старий запит — нічого не робимо
    if (requestId !== lastRequestId) return;

    const items = data.results || [];
    currentPage = data.page || page;
    currentTotalPages = data.totalPages || 1;

    renderExercisesList(listEl, items);
    renderExercisesPagination(currentPage, currentTotalPages);

    if (!items.length) {
      const emptyKey = `${activeType}:${activeFilter}:${activeKeyword || ''}`;

      if (emptyKey !== lastEmptyToastKey) {
        lastEmptyToastKey = emptyKey;

        // показуємо лише якщо користувач щось змінював/шукає
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

    // 3) оновлюємо URL тільки коли реально прийшли нові параметри
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

    // якщо це старий запит — не чіпаємо UI
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
    // лоадер ховаємо тільки якщо це актуальний запит
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

/**
 * Рендер UL зі списком вправ
 */
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
  const { name, burnedCalories, bodyPart, target, rating, time } = item;

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
          <button type="button" class="exercises__start-btn js-exercises-start">
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
    classes: {
      page: 'exercises__page',
      active: 'active',
    },
    scrollToTop: true,
    scrollTarget: '.exercises',
    onPageChange(page) {
      // важливо: НЕ передаємо type/filter/keyword → береться currentQuery
      return loadExercisesList({ page });
    },
  });
}
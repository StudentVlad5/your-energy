import { YourEnergyAPI } from './api';
import { showError } from './iziToast-helper'; // якщо не хочеш тости — можеш замінити на console.error
import { renderPaginationUniversal } from './pagination.js';

const api = new YourEnergyAPI();

function getPageLimit() {
  return window.innerWidth < 768 ? 8 : 10;
}

// Поточний стан
let currentPage = 1;
let currentTotalPages = 1;

/**
 * Головна ініціалізація списку вправ на сторінці Exercises
 * Викликається з main.js: initExercisesList();
 */
export async function initExercisesList() {
  const listEl = document.querySelector('.js-exercises-list');
  if (!listEl) return;

  
  // перше завантаження
  await loadExercisesList({ page: 1 });

  // делегування на пагінацію
  //   const paginationEl = document.querySelector('.js-exercises-pagination');
  //   if (paginationEl) {
  //     paginationEl.addEventListener('click', onPaginationClick);
  //   }
}

/**
 * Цю функцію викликають:
 *  - при першому завантаженні (initExercisesList)
 *  - з файлу exercises-tabs.js при зміні табу
 *  - з файлу exercises-search.js при пошуку
 */
export async function loadExercisesList({ page = 1, keyword = '' } = {}) {
  const listEl = document.querySelector('.js-exercises-list');
  if (!listEl) return;

  const limit = getPageLimit();

  const { type, filter } = getTypeAndFilterFromUI();
  const params = buildExercisesParams({ page, limit, type, filter, keyword });

  console.log('ACTIVE TYPE:', type);
  console.log('FILTER VALUE:', filter);
  console.log('EXERCISES PARAMS:', params);

  try {
    const data = await api.getExercises(params);
    const items = data.results || [];
    currentPage = data.page || page;
    currentTotalPages = data.totalPages || 1;

    renderExercisesList(listEl, items);
    renderExercisesPagination(currentPage, currentTotalPages);
  } catch (err) {
    console.error('Failed to load exercises:', err);
    if (typeof showError === 'function') {
      showError(err.message || 'Failed to load exercises. Try again later.');
    }
    listEl.innerHTML = `
      <li class="exercises__item">
        <p>Failed to load exercises. Try again later.</p>
      </li>
    `;
  }
}

/**
 * Зчитує тип (tab) + filter з:
 *  - активного табу (.exercises__tab--active)
 *  - URL: ?type=body-parts&filter=waist
 */
function getTypeAndFilterFromUI() {
  const urlParams = new URLSearchParams(window.location.search);

  // type може прийти з Categories як type,
  // або у тебе старий формат tab=muscles
  const typeFromUrl = urlParams.get('type') || urlParams.get('tab');

  // активний таб у розмітці
  const activeTab =
    document.querySelector('.exercises__tab--active')?.dataset.tab ||
    typeFromUrl ||
    'body-parts';

  // filter приходить з Categories (waist / abs / body weight / і т.д.)
  const filterFromUrl = urlParams.get('filter');

  const fallbackFilter = getDefaultFilterForType(activeTab);

  return {
    type: activeTab,
    filter: filterFromUrl || fallbackFilter,
  };
}

/**
 * Значення за замовчуванням, якщо немає filter в URL
 */
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

/**
 * Мапа type → параметр API
 * body-parts → bodypart=...
 * muscles   → muscles=...
 * equipment → equipment=...
 */
function buildExercisesParams({ page, limit, type, filter, keyword }) {
  const params = { page, limit };

  if (keyword) {
    params.keyword = keyword;
  }

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

/**
 * Одна картка вправи
 * Підганяємо під твій HTML-макет
 */
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
              <!-- <svg class="star"></svg> -->
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
  const container = document.querySelector('.js-exercises-pagination');

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
    scrollTarget: '.exercises', // або '#exercises', дивись як у тебе в HTML
    onPageChange(page) {
      return loadExercisesList({ page });
    },
  });
}

// import { renderPaginationUniversal } from './pagination.js';

// function renderPagination(currentPage, totalPages) {
//   const container = document.getElementById('pagination');
//   if (!container) return;

//   renderPaginationUniversal({
//     container,
//     currentPage,
//     totalPages,
//     mode: 'full',
//     classes: {
//       page: 'pagination-page',
//       active: 'active',
//     },
//     scrollToTop: true,
//     scrollTarget: '#exercise-categories',
//     // або '.filters' / '.categories' — постав свій реальний селектор секції

//     onPageChange(page) {
//       if (page === activePage) return;
//       activePage = page;

//       // важливо: повертаємо проміс, щоб скрол був ПІСЛЯ рендера
//       return getCategories(activeFilter, page, PAGE_LIMIT);
//     },
//   });
// }

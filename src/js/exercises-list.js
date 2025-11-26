// import { YourEnergyAPI } from './api';
// import { showError } from './iziToast-helper';
// import { renderPaginationUniversal } from './pagination.js';
// import iziToast from 'izitoast';
// import { openModal, closeModal } from './modal-template.js';
// import { startLoader, cancelLoader } from './loader.js';
// import {
//   getExerciseModalContent,
//   initExerciseModal,
// } from './modal-exercise-content.js';
// import { injectSchemaExercises } from './seo-function.js';
// import { scrollToFilter } from './scrollToFilter';

// const api = new YourEnergyAPI();
// const BASE_URL = import.meta.env.BASE_URL || '/';

// function getPageLimit() {
//   return window.innerWidth < 768 ? 8 : 10;
// }

// let currentQuery = {
//   type: 'body-parts',
//   filter: 'waist',
//   keyword: '',
// };

// let currentPage = 1;
// let currentTotalPages = 1;
// let lastRequestId = 0;
// let lastEmptyToastKey = '';

// export async function loadExercisesList({
//   page = 1,
//   type,
//   filter,
//   keyword,
// } = {}) {
//   const listEl = document.querySelector('.js-exercises-list');
//   if (!listEl) return;

//   const limit = getPageLimit();

//   if (type !== undefined) currentQuery.type = type;
//   if (filter !== undefined) currentQuery.filter = filter;
//   if (keyword !== undefined) currentQuery.keyword = keyword;

//   const activeType = currentQuery.type;
//   const activeFilter = currentQuery.filter;
//   const activeKeyword = currentQuery.keyword || '';
//   const params = buildExercisesParams({
//     page,
//     limit,
//     type: activeType,
//     filter: activeFilter,
//     keyword: activeKeyword,
//   });

//   const requestId = ++lastRequestId;

//   startLoader();

//   try {
//     const data = await api.getExercises(params);

//     if (requestId !== lastRequestId) return;

//     const items = data.results || [];
//     currentPage = data.page || page;
//     currentTotalPages = data.totalPages || 1;
//     injectSchemaExercises(data);
//     renderExercisesList(listEl, items);
//     renderExercisesPagination(currentPage, currentTotalPages);

//     if (!items.length) {
//       const emptyKey = `${activeType}:${activeFilter}:${activeKeyword || ''}`;

//       if (emptyKey !== lastEmptyToastKey) {
//         lastEmptyToastKey = emptyKey;

//         if (activeKeyword || type !== undefined || filter !== undefined) {
//           iziToast.warning({
//             title: 'No results',
//             message: activeKeyword
//               ? `Nothing found for "${activeKeyword}". Try another search.`
//               : 'No exercises found for this category.',
//             position: 'topRight',
//           });
//         }
//       }
//     } else {
//       lastEmptyToastKey = '';
//     }

//     const shouldUpdateUrl =
//       type !== undefined || filter !== undefined || keyword !== undefined;

//     if (shouldUpdateUrl) {
//       const url = new URL(window.location.href);
//       url.searchParams.set('type', activeType);
//       url.searchParams.set('filter', activeFilter);

//       if (activeKeyword) url.searchParams.set('keyword', activeKeyword);
//       else url.searchParams.delete('keyword');

//       window.history.pushState({}, '', url);
//     }
//   } catch (err) {
//     console.error('Failed to load exercises:', err);

//     if (requestId !== lastRequestId) return;

//     if (typeof showError === 'function') {
//       showError(err.message || 'Failed to load exercises. Try again later.');
//     } else {
//       iziToast.error({
//         title: 'Error',
//         message: err.message || 'Failed to load exercises. Try again later.',
//         position: 'topRight',
//       });
//     }

//     listEl.innerHTML = `
//       <li class="exercises__item">
//         <p>Failed to load exercises. Try again later.</p>
//       </li>
//     `;
//   } finally {
//     if (requestId === lastRequestId) {
//       cancelLoader();
//     }
//   }
// }

// function buildExercisesParams({ page, limit, type, filter, keyword }) {
//   const params = { page, limit };

//   if (keyword) params.keyword = keyword;

//   switch (type) {
//     case 'body-parts':
//       params.bodypart = filter;
//       break;
//     case 'muscles':
//       params.muscles = filter;
//       break;
//     case 'equipment':
//       params.equipment = filter;
//       break;
//     default:
//       params.bodypart = filter;
//   }

//   return params;
// }

// export function renderExercisesList(listEl, items, isFavorite = false) {
//   if (!items.length) {
//     listEl.innerHTML = `
//       <li class="exercises__item">
//         <p>No exercises found.</p>
//       </li>
//     `;
//     return;
//   }

//   const markup = items
//     .map(it => createExerciseCardMarkup(it, isFavorite))
//     .join('');
//   listEl.innerHTML = markup;
//   handleExerciseItemClick(listEl);
// }

// function createExerciseCardMarkup(item, isFavorite = false) {
//   const { name, burnedCalories, bodyPart, target, time, rating, _id } = item;
//   const actionMarkup = isFavorite
//     ? `<button type="button" class="favorites-delete-btn" data-id="${_id}">
//         <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="13"
//             height="14"
//             viewBox="0 0 17 19"
//             fill="none"
//             class="exercise-modal__btn-icon exercise-modal__btn-icon--trash"
//           >
//             <path
//               d="M11.5833 4.08333V3.41667C11.5833 2.48325 11.5833 2.01654 11.4017 1.66002C11.2419 1.34641 10.9869 1.09144 10.6733 0.931656C10.3168 0.75 9.85009 0.75 8.91667 0.75H7.58333C6.64991 0.75 6.1832 0.75 5.82668 0.931656C5.51308 1.09144 5.25811 1.34641 5.09832 1.66002C4.91667 2.01654 4.91667 2.48325 4.91667 3.41667V4.08333M6.58333 8.66667V12.8333M9.91667 8.66667V12.8333M0.75 4.08333H15.75M14.0833 4.08333V13.4167C14.0833 14.8168 14.0833 15.5169 13.8108 16.0516C13.5712 16.522 13.1887 16.9045 12.7183 17.1442C12.1835 17.4167 11.4835 17.4167 10.0833 17.4167H6.41667C5.01654 17.4167 4.31647 17.4167 3.78169 17.1442C3.31129 16.9045 2.92883 16.522 2.68915 16.0516C2.41667 15.5169 2.41667 14.8168 2.41667 13.4167V4.08333"
//               stroke="currentColor"
//               stroke-width="1.5"
//               stroke-linecap="round"
//               stroke-linejoin="round"
//             />
//           </svg>
//        </button>`
//     : `<div class="exercises__rating">
//          <span class="exercises__meta-key">${rating}</span>
//          <span class="exercises__meta-value">
//            <svg class="star" width="18" height="18">
//              <use href="${BASE_URL}img/icons.svg#icon-star"></use>
//            </svg>
//          </span>
//        </div>`;

//   return `
//     <li class="exercises__item" data-exercise-id="${_id}">
//       <div class="exercises__item-top">
//         <div class="exercises__item-info">
//           <span class="exercises__badge">Workout</span>
          
//           ${actionMarkup}
          
//         </div>

//         <button
//           type="button"
//           class="exercises__start-btn js-open-exercise"
//           data-exercise-id="${_id}"
//         >
//           Start
//           <svg class="arrow__icon" width="16" height="16">
//              <use href="${BASE_URL}img/icons.svg#icon-arrow"></use>
//           </svg>
//         </button>
//       </div>

//       <div class="exercises__name-container">
//         <svg class="exercises__icon" width="24" height="24">
//            <use href="${BASE_URL}img/icons.svg#icon-running-man"></use>
//         </svg>
//         <h3 class="exercises__name">${name}</h3>
//       </div>

//         <div class="exercises__item-bottom">
//           <p class="exercises__meta">
//             <span class="exercises__meta-label">Burned calories:</span>
//             <span class="exercises__meta-value">${burnedCalories} / ${time}</span>
//           </p>
//           <p class="exercises__meta">
//             <span class="exercises__meta-label">Body part:</span>
//             <span class="exercises__meta-value">${bodyPart}</span>
//           </p>
//           <p class="exercises__meta">
//             <span class="exercises__meta-label">Target:</span>
//             <span class="exercises__meta-value">${target}</span>
//           </p>
//         </div>
//       </li>
//   `;
// }

// export function renderExercisesPagination(currentPage, totalPages) {
//   const container = document.querySelector('.js-exercises-pagination');
//   if (!container) return;

//   renderPaginationUniversal({
//     container,
//     currentPage,
//     totalPages,
//     mode: 'neighbors',

//     showPrevNext: totalPages > 2,
//     showArrows: totalPages > 3,

//     classes: {
//       page: 'exercises__page',
//       active: 'active',
//       prev: 'exercises__page-prev',
//       next: 'exercises__page-next',
//     },
//     scrollToTop: false,
//     onPageChange: page => {
//       scrollToFilter();
//       loadExercisesList({ page });
//     },
//   });
// }

// function handleExerciseItemClick(listEl) {
//   const startButtons = listEl.querySelectorAll(
//     '.exercises__start-btn[data-exercise-id]'
//   );

//   startButtons.forEach(button => {
//     if (button.hasAttribute('data-click-handler-attached')) {
//       return;
//     }
//     button.addEventListener('click', handleExcersiseModalOpen);
//     button.setAttribute('data-click-handler-attached', 'true');
//   });
// }

// async function handleExcersiseModalOpen(event) {
//   const button = event.currentTarget;
//   const exerciseId = button.getAttribute('data-exercise-id');

//   if (!exerciseId) {
//     console.error('Exercise ID is missing');
//     return;
//   }

//   sessionStorage.setItem('exerciseModalExerciseId', exerciseId);

//   const content = getExerciseModalContent();
//   if (!content) {
//     console.error('Failed to get exercise modal content');
//     return;
//   }

//   openModal(content);
//   try {
//     await initExerciseModal(closeModal);
//   } catch (error) {
//     console.error('Error initializing exercise modal:', error);
//   }
// }


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
import { scrollToFilter } from './scrollToFilter';

// ⬇️ ІМПОРТ КЕРУВАННЯ ІСТОРІЄЮ / URL
import {
  updateURLState,
  readURLState,
  initHistoryNavigation,
} from './history-state.js';


const api = new YourEnergyAPI();
const BASE_URL = import.meta.env.BASE_URL || '/';

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

  // Оновлюємо поточний запит, якщо прийшли нові значення
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

    // Якщо за час очікування вже пішов інший запит — ігноруємо цей
    if (requestId !== lastRequestId) return;

    const items = data.results || [];
    currentPage = data.page || page;
    currentTotalPages = data.totalPages || 1;

    injectSchemaExercises(data);
    renderExercisesList(listEl, items);
    renderExercisesPagination(currentPage, currentTotalPages);

    // Обробка порожніх результатів
    if (!items.length) {
      const emptyKey = `${activeType}:${activeFilter}:${activeKeyword || ''}`;

      if (emptyKey !== lastEmptyToastKey) {
        lastEmptyToastKey = emptyKey;

        if (activeKeyword || type !== undefined || filter !== undefined) {
          iziToast.warning({
            title: 'No results',
            message: activeKeyword
              ? `Nothing found for "${activeKeyword}". Try another search.`
              : 'No exercises found for this category.',
            position: 'topRight',
          });
        }
      }
    } else {
      lastEmptyToastKey = '';
    }

    // ⬇️ ОНОВЛЕННЯ URL + HISTORY ЧЕРЕЗ ТВІЙ ПОПЕРЕДНІЙ КОД
    const shouldUpdateUrl =
      type !== undefined ||
      filter !== undefined ||
      keyword !== undefined ||
      page !== undefined;

    if (shouldUpdateUrl) {
      updateURLState({
        type: activeType,
        filter: activeFilter,
        keyword: activeKeyword,
        page: currentPage,
      });
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
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="14"
            viewBox="0 0 17 19"
            fill="none"
            class="exercise-modal__btn-icon exercise-modal__btn-icon--trash"
          >
            <path
              d="M11.5833 4.08333V3.41667C11.5833 2.48325 11.5833 2.01654 11.4017 1.66002C11.2419 1.34641 10.9869 1.09144 10.6733 0.931656C10.3168 0.75 9.85009 0.75 8.91667 0.75H7.58333C6.64991 0.75 6.1832 0.75 5.82668 0.931656C5.51308 1.09144 5.25811 1.34641 5.09832 1.66002C4.91667 2.01654 4.91667 2.48325 4.91667 3.41667V4.08333M6.58333 8.66667V12.8333M9.91667 8.66667V12.8333M0.75 4.08333H15.75M14.0833 4.08333V13.4167C14.0833 14.8168 14.0833 15.5169 13.8108 16.0516C13.5712 16.522 13.1887 16.9045 12.7183 17.1442C12.1835 17.4167 11.4835 17.4167 10.0833 17.4167H6.41667C5.01654 17.4167 4.31647 17.4167 3.78169 17.1442C3.31129 16.9045 2.92883 16.522 2.68915 16.0516C2.41667 15.5169 2.41667 14.8168 2.41667 13.4167V4.08333"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
       </button>`
    : `<div class="exercises__rating">
         <span class="exercises__meta-key">${rating}</span>
         <span class="exercises__meta-value">
           <svg class="star" width="18" height="18">
             <use href="${BASE_URL}img/icons.svg#icon-star"></use>
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
             <use href="${BASE_URL}img/icons.svg#icon-arrow"></use>
          </svg>
        </button>
      </div>

      <div class="exercises__name-container">
        <svg class="exercises__icon" width="24" height="24">
           <use href="${BASE_URL}img/icons.svg#icon-running-man"></use>
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
    showArrows: totalPages >= 3,

    classes: {
      page: 'exercises__page',
      active: 'active',
      prev: 'exercises__page-prev',
      next: 'exercises__page-next',
    },
    scrollToTop: false,
    onPageChange: page => {
      scrollToFilter();
      loadExercisesList({
        page,
        type: currentQuery.type,
        filter: currentQuery.filter,
        keyword: currentQuery.keyword,
      });
    },
  });
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

// ⬇️ ІНІЦІАЛІЗАЦІЯ СТОРІНКИ З URL + ІСТОРІЯ
document.addEventListener('DOMContentLoaded', () => {
  const initialState = readURLState();

  currentQuery = {
    type: initialState.type,
    filter: initialState.filter,
    keyword: initialState.keyword,
  };
  currentPage = initialState.page || 1;

  loadExercisesList(initialState);
  initHistoryNavigation(loadExercisesList);
});

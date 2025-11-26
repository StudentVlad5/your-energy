// ===== СИНХРОНІЗАЦІЯ URL =====
export function updateURLState({ type, filter, keyword, page }) {
  const url = new URL(location.href);
  const prev = location.href;

  if (type) url.searchParams.set('type', type);
  if (filter) url.searchParams.set('filter', filter);

  if (keyword) url.searchParams.set('keyword', keyword);
  else url.searchParams.delete('keyword');

  url.searchParams.set('page', page);

  const next = url.toString();

  if (next !== prev) {
    history.pushState({ type, filter, keyword, page }, '', next);
  }
}

// ===== ЧИТАННЯ СТАНУ З URL =====
export function readURLState() {
  const url = new URL(location.href);

  return {
    type: url.searchParams.get('type') || 'body-parts',
    filter: url.searchParams.get('filter') || 'waist',
    keyword: url.searchParams.get('keyword') || '',
    page: Number(url.searchParams.get('page')) || 1,
  };
}

// ===== ОБРОБКА НАТИСКАННЯ НАЗАД/ВПЕРЕД =====
export function initHistoryNavigation(loadExercisesList) {
  window.addEventListener('popstate', event => {
    const state = event.state;

    // якщо state пустий або це state лише для табів (tab),
    // то exercises-list не чіпаємо
    if (
      !state ||
      (!state.type && !state.filter && !state.keyword && !state.page)
    ) {
      return;
    }

    const page = Number(state.page) || 1;

    loadExercisesList({
      type: state.type,
      filter: state.filter,
      keyword: state.keyword,
      page,
    });
  });
}


// export function updateURLState({ type, filter, keyword, page }) {
//   const url = new URL(location.href);
//   const prev = location.href;

//   if (type) url.searchParams.set('type', type);
//   if (filter) url.searchParams.set('filter', filter);

//   if (keyword) url.searchParams.set('keyword', keyword);
//   else url.searchParams.delete('keyword');

//   url.searchParams.set('page', page);

//   const next = url.toString();

//   if (next !== prev) {
//     history.pushState({ type, filter, keyword, page }, '', next);
//   }
// }

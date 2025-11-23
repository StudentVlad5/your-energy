// export function initExercisesTabs() {
//   const tabs = document.querySelectorAll('.exercises__tab');

//   tabs.forEach(tab => {
//     tab.addEventListener('click', () => {
//       tabs.forEach(t => t.classList.remove('exercises__tab--active'));
//       tab.classList.add('exercises__tab--active');
//     });
//   });
// }

// src/js/exercises-tabs.js
// import { loadExercisesList } from './exercises-list.js';

// export function initExercisesTabs() {
//   const tabsContainer = document.querySelector('.js-exercises-tabs');
//   if (!tabsContainer) return;

//   const tabs = tabsContainer.querySelectorAll('.exercises__tab');
//   const searchInput = document.querySelector('.exercises__search-input');

//   tabs.forEach(tab => {
//     tab.addEventListener('click', () => {
//       // 1. міняємо активний таб
//       tabs.forEach(t => t.classList.remove('exercises__tab--active'));
//       tab.classList.add('exercises__tab--active');

//       // 2. можемо враховувати поточний пошуковий запит, якщо є
//       const keyword = searchInput ? searchInput.value.trim() : '';

//       // 3. тягнемо нові вправи під цей таб
//       loadExercisesList({ page: 1, keyword });
//     });
//   });
// }

// !!! цей модуль не використовується

import { loadExercisesList } from './exercises-list.js';

export function initExercisesTabs() {
  console.log('function initExercisesTabs()');

  const tabsContainer = document.querySelector('.js-exercises-tabs');
  console.log('tabsContainer', tabsContainer);
  // tabsContainer завжди null так як ніде немає класу .js-exercises-tabs
  if (!tabsContainer) return;

  const tabs = tabsContainer.querySelectorAll('.exercises__tab');
  const searchInput = document.querySelector('.exercises__search-input');

  // через помилку Could not find name 'tab'. Did you mean 'tabs'?
  // цей лістенер не використовується
  tab.addEventListener('click', () => {
    console.log(' tab.addEventListener');

    document.getElementById('categories-section')?.classList.add('hidden');
    document.getElementById('exercises-section')?.classList.remove('hidden');

    loadExercisesList({ page: 1 });
  });
}

import { activateFiltersTab } from './filters';
import { loadExercisesList } from './exercises-list';


export function handleCategoryCardClick(item) {
  return function (e) {
    e.preventDefault();

    // 1. Визначаємо тип фільтру
    const TYPE_MAP = {
      Muscles: 'muscles',
      'Body parts': 'body-parts',
      Equipment: 'equipment',
    };

    const type = TYPE_MAP[item.filter] || TYPE_MAP['Body parts'];

    // 2. Ховаємо категорії
    const categoriesSection = document.getElementById('cards-box');
    categoriesSection.classList.add('hidden');

    // 3. Показуємо exercises
    const exercisesSection = document.getElementById('exercises');
    exercisesSection.classList.remove('hidden');

    // 4. Активуємо таб Body parts + чорна риска
    activateFiltersTab('bodypart', item.name);

    // 5. Показуємо пошук (активує сама activateFiltersTab)

    // 6. Завантажуємо exercises за категорією
    loadExercisesList ({
      page: 1,
      filter: item.name.toLowerCase(),
      type,
    });

    // 7. Оновлюємо URL
    const url = new URL(window.location.href);
    url.searchParams.set('type', type);
    url.searchParams.set('filter', item.name.toLowerCase());
    window.history.pushState({}, '', url);
  };
}
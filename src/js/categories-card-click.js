import { loadExercisesList } from './exercises-list';
import { resetExercisesSearch } from './exercises-search';
import { setOpenExercises, setExercisesContext } from './state.js';
import { scrollToFilter } from './scrollToFilter';

export function handleCategoryCardClick(item) {
  return function (e) {
    e.preventDefault();

    const categoriesBox = document.getElementById('cards-box');
    const exercisesBox = document.getElementById('exercises');
    const searchBox = document.querySelector('.filters__search');
    const filtersSubtitle = document.querySelector('.filters__subtitle');

    //  перемикаємо з карток на Exercises
    if (categoriesBox) categoriesBox.classList.add('hidden');
    if (exercisesBox) exercisesBox.classList.remove('hidden');

    // якщо ще десь лишився equipment-box і він не потрібен — можна не чіпати
    const equipmentBox = document.getElementById('equipment-box');
    if (equipmentBox) equipmentBox.classList.add('hidden');

    //  позначаємо, що ми зараз в блоці Exercises (і пишемо це в sessionStorage)
    setOpenExercises(true);

    //  готуємо type для API та для відновлення стану
    const TYPE_MAP = {
      Muscles: 'muscles',
      'Body parts': 'body-parts',
      Equipment: 'equipment',
    };
    const type = TYPE_MAP[item.filter] || 'body-parts';
    const filterName = item.name.toLowerCase();

    //  зберігаємо контекст exercises (щоб при оновленні сторінки повернутись сюди ж)
    setExercisesContext(filterName, type);

    //  оновлюємо сабтайтл, показуємо пошук
    if (filtersSubtitle) {
      filtersSubtitle.textContent =
        filterName.charAt(0).toUpperCase() + filterName.slice(1);
    }
    if (searchBox) {
      searchBox.classList.add('filters__search--visible');
    }

    resetExercisesSearch();
    scrollToFilter();

    //  вантажимо вправи для цієї категорії
    loadExercisesList({
      page: 1,
      type,
      filter: filterName,
      keyword: '',
    });

  };
}

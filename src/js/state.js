let openExercisesFromCard = false;
let exercisesFilterName = '';
let exercisesFilterType = '';

export function setOpenExercises(flag) {
  openExercisesFromCard = !!flag;
  sessionStorage.setItem(
    'openExercises',
    openExercisesFromCard ? 'true' : 'false'
  );
}

export function getOpenExercises() {
  const stored = sessionStorage.getItem('openExercises');
  if (stored !== null) {
    return stored === 'true';
  }
  return openExercisesFromCard;
}

//  зберігаємо контекст exercises (назва категорії + тип фільтра)
export function setExercisesContext(name, type) {
  exercisesFilterName = name || '';
  exercisesFilterType = type || '';

  sessionStorage.setItem('exercisesFilterName', exercisesFilterName);
  sessionStorage.setItem('exercisesFilterType', exercisesFilterType);
}

//  читаємо контекст exercises
export function getExercisesContext() {
  const name =
    sessionStorage.getItem('exercisesFilterName') ?? exercisesFilterName;
  const type =
    sessionStorage.getItem('exercisesFilterType') ?? exercisesFilterType;
  return { name, type };
}

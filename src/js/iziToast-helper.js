import iziToast from 'izitoast';

const colorBlack = '#242424';
const colorWhite = '#ffffff';
const colorGray = '#8e8f99';

// --- Базова конфігурація ---
const defaultOptions = {
  position: 'topRight',
  timeout: 4000,
  close: true,
  closeOnEscape: true,
  pauseOnHover: true,
  progressBar: true,
  progressBarColor: colorGray,
  transitionIn: 'fadeInLeft',
  transitionOut: 'fadeOutRight',
  fontFamily: 'inherit',
  icon: '',
};

// 1. Повідомлення про УСПІХ (Success)
export const showSuccess = message => {
  iziToast.show({
    ...defaultOptions,
    title: 'OK',
    message: message,
    backgroundColor: colorBlack,
    titleColor: colorWhite,
    messageColor: colorWhite,
    icon: 'icon-check',
    iconColor: colorWhite,
  });
};

// 2. Повідомлення про ПОМИЛКУ (Error)
export const showError = message => {
  iziToast.show({
    ...defaultOptions,
    title: 'Error',
    message: message,
    backgroundColor: colorBlack,
    titleColor: colorWhite,
    messageColor: colorGray,
    progressBarColor: colorWhite,
    icon: 'icon-error',
    iconColor: colorWhite,
  });
};

// 3. Інформаційне повідомлення (Info)
export const showInfo = message => {
  iziToast.show({
    ...defaultOptions,
    title: 'Info',
    message: message,
    backgroundColor: colorWhite,
    titleColor: colorBlack,
    messageColor: colorBlack,
    progressBarColor: colorBlack,
    borderBottom: `2px solid ${colorBlack}`,
  });
};

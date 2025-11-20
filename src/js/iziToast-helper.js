import iziToast from 'izitoast';
import { COLORS, TOAST } from './constants.js';

// --- Базова конфігурація ---
const defaultOptions = {
  position: TOAST.POSITION.TOP_RIGHT,
  timeout: TOAST.TIMEOUT.DEFAULT,
  close: true,
  closeOnEscape: true,
  pauseOnHover: true,
  progressBar: true,
  progressBarColor: COLORS.GRAY_LIGHT,
  transitionIn: TOAST.TRANSITION.IN,
  transitionOut: TOAST.TRANSITION.OUT,
  fontFamily: 'inherit',
  icon: '',
};

// 1. Повідомлення про УСПІХ (Success)
export const showSuccess = message => {
  iziToast.show({
    ...defaultOptions,
    title: TOAST.TITLE.SUCCESS,
    message: message,
    backgroundColor: COLORS.BLACK,
    titleColor: COLORS.WHITE,
    messageColor: COLORS.WHITE,
    icon: TOAST.ICON.SUCCESS,
    iconColor: COLORS.WHITE,
  });
};

// 2. Повідомлення про ПОМИЛКУ (Error)
export const showError = message => {
  iziToast.show({
    ...defaultOptions,
    title: TOAST.TITLE.ERROR,
    message: message,
    backgroundColor: COLORS.BLACK,
    titleColor: COLORS.WHITE,
    messageColor: COLORS.GRAY_LIGHT,
    progressBarColor: COLORS.WHITE,
    icon: TOAST.ICON.ERROR,
    iconColor: COLORS.WHITE,
  });
};

// 3. Інформаційне повідомлення (Info)
export const showInfo = message => {
  iziToast.show({
    ...defaultOptions,
    title: TOAST.TITLE.INFO,
    message: message,
    backgroundColor: COLORS.WHITE,
    titleColor: COLORS.BLACK,
    messageColor: COLORS.BLACK,
    progressBarColor: COLORS.BLACK,
    borderBottom: `2px solid ${COLORS.BLACK}`,
  });
};

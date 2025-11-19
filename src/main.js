import 'izitoast/dist/css/iziToast.min.css';
import { showSuccess, showError, showInfo } from './js/iziToast-helper.js';
import './js/mobile-menu.js';

showSuccess('We have sent you a verification email!');

showInfo('Wrong symbols in your email.');

showError('This email is already subscribed or invalid.');

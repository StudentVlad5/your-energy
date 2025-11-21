import { REFS } from './constants.js';

(() => {
  const {
    mobileMenu: menu,
    mobileMenuOpenBtn: openMenuBtn,
    mobileMenuCloseBtn: closeMenuBtn,
  } = REFS;

  if (!openMenuBtn || !menu || !closeMenuBtn) return;

  const toggleMenu = () => {
    menu.classList.toggle('is-open');
    document.body.classList.toggle('menu-open');
  };

  openMenuBtn.addEventListener('click', toggleMenu);
  closeMenuBtn.addEventListener('click', toggleMenu);

  window
    .matchMedia('(min-width: 768px)')
    .addEventListener('change', e => {
      if (!e.matches) return;
      menu.classList.remove('is-open');
      document.body.classList.remove('menu-open');
    });
})();

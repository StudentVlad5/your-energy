(() => {
  const refs = {
    openMenuBtn: document.querySelector('[data-menu-open]'),
    closeMenuBtn: document.querySelector('[data-menu-close]'),
    menu: document.querySelector('[data-menu]'),
  };

  if (!refs.openMenuBtn || !refs.menu || !refs.closeMenuBtn) return;

  const toggleMenu = () => {
    refs.menu.classList.toggle('is-open');
    document.body.classList.toggle('menu-open');
  };

  refs.openMenuBtn.addEventListener('click', toggleMenu);
  refs.closeMenuBtn.addEventListener('click', toggleMenu);

  window
    .matchMedia('(min-width: 768px)')
    .addEventListener('change', e => {
      if (!e.matches) return;
      refs.menu.classList.remove('is-open');
      document.body.classList.remove('menu-open');
    });
})();

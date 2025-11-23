export function renderPaginationUniversal({
  container,
  currentPage,
  totalPages,
  onPageChange,
  mode = 'full',
  showArrows = false,
  showPrevNext = false,
  classes = {},
  icons = {},
  scrollToTop = true,
  scrollTarget = null,
}) {
  if (!container) return;
  container.innerHTML = '';

  const {
    page: pageClass = '',
    active: activeClass = 'active',
    arrow: arrowClass = '',
    prev: prevClass = '',
    next: nextClass = '',
  } = classes;

  const { prev: prevIcon = 'Prev', next: nextIcon = 'Next' } = icons;

  const createBtn = (label, page, className = '') => {
    const btn = document.createElement('button');
    btn.className = className;
    btn.textContent = label;
    btn.dataset.page = page;
    return btn;
  };

  const scrollHandler = () => {
    if (scrollToTop) {
      if (scrollTarget) {
        const el =
          typeof scrollTarget === 'string'
            ? document.querySelector(scrollTarget)
            : scrollTarget;

        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  if (showPrevNext && currentPage > 1) {
    const prevBtn = createBtn(prevIcon, currentPage - 1, prevClass);
    container.appendChild(prevBtn);
  }

  if (mode === 'full') {
    for (let i = 1; i <= totalPages; i++) {
      const btn = createBtn(i, i, pageClass);
      if (i === currentPage) btn.classList.add(activeClass);
      container.appendChild(btn);
    }
  } else if (mode === 'neighbors') {
    let pages = [];

    if (totalPages <= 3) {
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else if (currentPage === 1) {
      pages = [1, 2, 3];
    } else if (currentPage === totalPages) {
      pages = [totalPages - 2, totalPages - 1, totalPages];
    } else {
      pages = [currentPage - 1, currentPage, currentPage + 1];
    }

    pages.forEach(p => {
      const btn = createBtn(
        p,
        p,
        `${pageClass} ${p === currentPage ? activeClass : ''}`.trim()
      );
      container.appendChild(btn);
    });
  }

  if (showPrevNext && currentPage < totalPages) {
    const nextBtn = createBtn(nextIcon, currentPage + 1, nextClass);
    container.appendChild(nextBtn);
  }

  container.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = Number(btn.dataset.page);
      if (Number.isNaN(page) || page === currentPage) return;

      onPageChange(page);

      if (scrollToTop) {
        if (scrollTarget) {
          const el =
            typeof scrollTarget === 'string'
              ? document.querySelector(scrollTarget)
              : scrollTarget;

          if (el) {
            const y = el.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: y - 200, behavior: 'smooth' });
          }
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    });
  });
}

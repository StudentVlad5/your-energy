export function renderPaginationUniversal({
  container,
  currentPage,
  totalPages,
  onPageChange,
  mode = 'full',
  showArrows = false, // подвійні «»
  showPrevNext = false, // одинарні <>
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
    first: firstClass = '',
    last: lastClass = '',
  } = classes;

  const {
    prev: prevIcon = '<',
    next: nextIcon = '>',
    first: firstIcon = '<<',
    last: lastIcon = '>>',
  } = icons;

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

  // Prev/Next зовні тільки не в neighbors
  if (mode !== 'neighbors') {
    if (showPrevNext && currentPage > 1) {
      const prevBtn = createBtn(prevIcon, currentPage - 1, prevClass);
      container.appendChild(prevBtn);
    }
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

    const needDouble = showArrows && totalPages > 3;
    const isAtStart = pages[0] === 1; // ще вікно 123
    const isAtEnd = pages[2] === totalPages; // останнє вікно

    // << — завжди, але disabled поки 123
    if (needDouble) {
      const firstBtn = createBtn(
        firstIcon,
        1,
        `${arrowClass} ${prevClass} ${firstClass}`.trim()
      );
      if (isAtStart) firstBtn.disabled = true;
      container.appendChild(firstBtn);
    }

    // < — завжди, але disabled поки 123
    if (showPrevNext) {
      const prevBtn = createBtn(
        prevIcon,
        Math.max(1, currentPage - 1),
        prevClass
      );
      if (isAtStart) prevBtn.disabled = true;
      container.appendChild(prevBtn);
    }

    // pages
    pages.forEach(p => {
      const btn = createBtn(
        p,
        p,
        `${pageClass} ${p === currentPage ? activeClass : ''}`.trim()
      );
      container.appendChild(btn);
    });

    // > — завжди, disabled на останньому вікні
    if (showPrevNext) {
      const nextBtn = createBtn(
        nextIcon,
        Math.min(totalPages, currentPage + 1),
        nextClass
      );
      if (isAtEnd) nextBtn.disabled = true;
      container.appendChild(nextBtn);
    }

    // >> — завжди, disabled на останньому вікні
    if (needDouble) {
      const lastBtn = createBtn(
        lastIcon,
        totalPages,
        `${arrowClass} ${nextClass} ${lastClass}`.trim()
      );
      if (isAtEnd) lastBtn.disabled = true;
      container.appendChild(lastBtn);
    }
  }

  // Next зовні тільки не в neighbors
  if (mode !== 'neighbors') {
    if (showPrevNext && currentPage < totalPages) {
      const nextBtn = createBtn(nextIcon, currentPage + 1, nextClass);
      container.appendChild(nextBtn);
    }
  }

  container.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.disabled) return;

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

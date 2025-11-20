/**
 * Universal module for working with a modal window template
 * Allows opening a modal with any content,
 * blocks the page scroll, closes on Escape
 */

let refs = null;
let isInitialized = false;
const modalTypes = {};

export function registerModalType(type, getContentFn, initFn) {
  modalTypes[type] = {
    getContent: getContentFn,
    init: initFn,
  };
}

function initRefs() {
  if (isInitialized) return;

  refs = {
    modal: document.getElementById('modal-template'),
    backdrop: document.querySelector('[data-modal-close]'),
    closeBtn: document.querySelector('.modal-template__close-btn'),
    body: document.querySelector('[data-modal-body]'),
  };

  isInitialized = true;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initRefs();
  });
} else {
  initRefs();
}

export function initModalButtons() {
  const modalButtons = document.querySelectorAll('[data-modal]');

  modalButtons.forEach(button => {
    if (button.hasAttribute('data-modal-initialized')) {
      return;
    }

    const modalType = button.getAttribute('data-modal');

    if (!modalTypes[modalType]) {
      console.warn(`Modal type "${modalType}" is not registered`);
      return;
    }

    button.addEventListener('click', () => {
      const { getContent, init } = modalTypes[modalType];

      const content = getContent();
      if (!content) {
        console.error(`Failed to get content for modal type "${modalType}"`);
        return;
      }

      openModal(content);

      if (init) {
        setTimeout(async () => {
          try {
            await init(closeModal);
          } catch (error) {
            console.error('Error initializing modal:', error);
          }
        }, 100);
      }
    });

    button.setAttribute('data-modal-initialized', 'true');
  });
}

export function openModal(content) {
  initRefs();

  if (!refs || !refs.modal || !refs.body) {
    console.error('Modal template elements not found');
    return;
  }

  if (typeof content === 'string') {
    refs.body.innerHTML = content;
  } else if (content instanceof HTMLElement) {
    refs.body.innerHTML = '';
    refs.body.appendChild(content);
  } else {
    console.error('Invalid content type. Expected string or HTMLElement');
    return;
  }

  refs.modal.classList.remove('hidden');
  document.body.classList.add('modal-open');

  document.addEventListener('keydown', handleEscape, { once: false });
  refs.backdrop?.addEventListener('click', handleBackdropClick);
  refs.closeBtn?.addEventListener('click', handleCloseButtonClick);
}

export function closeModal() {
  initRefs();

  if (!refs || !refs.modal) return;

  refs.modal.classList.add('hidden');
  document.body.classList.remove('modal-open');

  document.removeEventListener('keydown', handleEscape);
  refs.backdrop?.removeEventListener('click', handleBackdropClick);
  refs.closeBtn?.removeEventListener('click', handleCloseButtonClick);

  if (refs && refs.body) {
    refs.body.innerHTML = '';
  }
}

function isConfirmModalOpen() {
  const confirmModal = document.getElementById('modal-confirm');
  return confirmModal && !confirmModal.classList.contains('hidden');
}

function handleEscape(event) {
  if (event.key === 'Escape') {
    if (isConfirmModalOpen()) {
      return;
    }
    closeModal();
  }
}

function handleBackdropClick(event) {
  if (event.target === refs.backdrop) {
    if (isConfirmModalOpen()) {
      return;
    }
    closeModal();
  }
}

function handleCloseButtonClick() {
  if (isConfirmModalOpen()) {
    return;
  }
  closeModal();
}

export function isModalOpen() {
  initRefs();
  return refs && refs.modal && !refs.modal.classList.contains('hidden');
}

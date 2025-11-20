/**
 * module for working with a confirm modal that opens over the main modal
 */

let confirmModalRefs = null;
let confirmCallback = null;
let cancelCallback = null;

function initConfirmRefs() {
  if (confirmModalRefs) return;

  const modal = document.getElementById('modal-confirm');
  if (!modal) {
    console.error('Confirm modal not found');
    return;
  }

  confirmModalRefs = {
    modal,
    backdrop: modal.querySelector('[data-confirm-close]'),
    message: modal.querySelector('[data-confirm-message]'),
    cancelBtn: modal.querySelector('[data-confirm-cancel]'),
    confirmBtn: modal.querySelector('[data-confirm-ok]'),
  };

  confirmModalRefs.backdrop?.removeEventListener('click', handleBackdropClick, {
    capture: true,
  });
  confirmModalRefs.cancelBtn?.removeEventListener('click', handleCancel, {
    capture: true,
  });
  confirmModalRefs.confirmBtn?.removeEventListener('click', handleConfirm, {
    capture: true,
  });

  confirmModalRefs.backdrop?.addEventListener('click', handleBackdropClick, {
    capture: true,
  });
  confirmModalRefs.cancelBtn?.addEventListener('click', handleCancel, {
    capture: true,
  });
  confirmModalRefs.confirmBtn?.addEventListener('click', handleConfirm, {
    capture: true,
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initConfirmRefs);
} else {
  initConfirmRefs();
}

function handleEscape(event) {
  if (
    event.key === 'Escape' &&
    confirmModalRefs &&
    !confirmModalRefs.modal.classList.contains('hidden')
  ) {
    handleCancel();
  }
}

function handleBackdropClick(event) {
  if (event.target === confirmModalRefs.backdrop) {
    event.stopPropagation();
    event.preventDefault();
    handleCancel(event);
  }
}

function handleCancel(event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  const callback = cancelCallback;
  closeConfirmModal();
  if (callback) {
    callback();
  }
}

function handleConfirm(event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }

  const callback = confirmCallback;
  closeConfirmModal();
  setTimeout(() => {
    if (callback) {
      callback();
    }
  }, 0);
}

export function openConfirmModal(message, onConfirm, onCancel = null) {
  initConfirmRefs();

  if (!confirmModalRefs || !confirmModalRefs.modal) {
    console.error('Confirm modal elements not found');
    return;
  }

  confirmCallback = onConfirm;
  cancelCallback = onCancel;

  if (confirmModalRefs.message) {
    confirmModalRefs.message.textContent = message;
  }

  confirmModalRefs.modal.classList.remove('hidden');
  document.addEventListener('keydown', handleEscape, { once: true });
}

export function closeConfirmModal() {
  if (!confirmModalRefs || !confirmModalRefs.modal) return;

  confirmModalRefs.modal.classList.add('hidden');
  confirmCallback = null;
  cancelCallback = null;
}

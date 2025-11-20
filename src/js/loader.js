const ref = {
  loaderOverlay: document.getElementById('loader-overlay'),
};
export function startLoader() {
  if (ref.loaderOverlay) ref.loaderOverlay.classList.remove('hidden');
}
export function cancelLoader() {
  if (ref.loaderOverlay) ref.loaderOverlay.classList.add('hidden');
}

const ref = {
  loaderOverlay: document.getElementById('loader-overlay'),
};
export function startLoader() {
  if (ref.loaderOverlay) loaderOverlay.classList.add('hidden');
}
export function cancelLoader() {
  if (ref.loaderOverlay) loaderOverlay.classList.add('hidden');
}

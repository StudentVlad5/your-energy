const ref = {
  loaderOverlay: document.getElementById('loader-overlay'),
  loaderBg: document.getElementById('bg-loader'),
};
export function startLoader() {
  if (ref.loaderOverlay) ref.loaderOverlay.classList.remove('hidden');
  if (ref.loaderBg) ref.loaderBg.classList.add('bg-loader');
}
export function cancelLoader() {
  setTimeout(() => {
    if (ref.loaderOverlay) ref.loaderOverlay.classList.add('hidden');
    if (ref.loaderBg) ref.loaderBg.classList.remove('bg-loader');
  }, 250);
}

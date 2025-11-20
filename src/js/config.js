export const CONFIG = {
  BASE_API_URL:
    import.meta.env.VITE_API_BASE_URL || 'https://your-energy.b.goit.study/api',
  DEV_HOST: import.meta.env.VITE_DEV_HOST || '127.0.0.1',
  DEV_PORT: import.meta.env.VITE_DEV_PORT || '3000',
  BASE_PATH: import.meta.env.VITE_BASE_PATH || '/your-energy/',
};

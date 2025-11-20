import { SEO } from './constants.js';

//  SEO ФУНКЦІЯ
// Динамічно створюємо JSON-LD для Google, щоб він бачив вправи як структуровані дані
export function injectSchema(data) {
  const schemaData = {
    '@context': SEO.SCHEMA_CONTEXT,
    '@type': SEO.SCHEMA_TYPES.ITEM_LIST,
    itemListElement: data?.results.map((ex, index) => ({
      '@type': SEO.SCHEMA_TYPES.LIST_ITEM,
      position: index + 1,
      item: {
        '@type': SEO.SCHEMA_TYPES.EXERCISE_PLAN,
        name: ex.name,
        filter: ex.filter,
        image: ex.imgURL,
      },
    })),
  };

  // шукаємо існуючий JSON-LD
  let script = document.querySelector('script[data-schema="exercises"]');

  if (!script) {
    script = document.createElement('script');
    script.type = SEO.JSON_LD_TYPE;
    script.setAttribute('data-schema', 'exercises');
    document.head.appendChild(script);
  }
  if (script) script.textContent = JSON.stringify(schemaData);
}

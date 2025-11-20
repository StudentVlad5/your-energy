import { SEO } from './constants.js';

//  SEO ФУНКЦІЯ
// Динамічно створюємо JSON-LD для Google, щоб він бачив вправи як структуровані дані
function injectSchema(data) {
  const schemaData = {
    '@context': SEO.SCHEMA_CONTEXT,
    '@type': SEO.SCHEMA_TYPES.ITEM_LIST,
    itemListElement: data.map((ex, index) => ({
      '@type': SEO.SCHEMA_TYPES.LIST_ITEM,
      position: index + 1,
      item: {
        '@type': SEO.SCHEMA_TYPES.EXERCISE_PLAN,
        name: ex.title,
        description: ex.description,
        category: ex.category,
      },
    })),
  };

  const script = document.createElement('script');
  script.type = SEO.JSON_LD_TYPE;
  script.text = JSON.stringify(schemaData);
  document.head.appendChild(script);
}

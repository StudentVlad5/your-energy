//  SEO ФУНКЦІЯ
// Динамічно створюємо JSON-LD для Google, щоб він бачив вправи як структуровані дані
function injectSchema(data) {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: data.map((ex, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'ExercisePlan',
        name: ex.title,
        description: ex.description,
        category: ex.category,
      },
    })),
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(schemaData);
  document.head.appendChild(script);
}

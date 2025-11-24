import { SEO } from './constants.js';

export function injectSchema(data) {
  if (!data || !data.results) return;

  const schemaData = {
    '@context': SEO.SCHEMA_CONTEXT,
    '@type': SEO.SCHEMA_TYPES.ITEM_LIST,
    itemListElement: data.results.map((item, index) => ({
      '@type': SEO.SCHEMA_TYPES.LIST_ITEM,
      position: index + 1,
      item: {
        '@type': SEO.SCHEMA_TYPES.EXERCISE_PLAN,
        name: item.name,
        filter: item.filter,
        image: item.imgURL,
      },
    })),
  };
  updateSchemaScript('filters', schemaData);
}

export function injectSchemaExercises(data) {
  if (!data || !data.results || data.results.length === 0) return;

  const schemaData = {
    '@context': SEO.SCHEMA_CONTEXT,
    '@type': SEO.SCHEMA_TYPES.ITEM_LIST,
    itemListElement: data.results.map((ex, index) => ({
      '@type': SEO.SCHEMA_TYPES.LIST_ITEM,
      position: index + 1,
      item: {
        '@type': SEO.SCHEMA_TYPES.EXERCISE_PLAN,
        name: capitalize(ex.name),
        description: ex.description,
        image: ex.gifUrl,
        audience: {
          '@type': 'PeopleAudience',
          suggestedGender: 'unisex',
        },
        category: ex.target,
        keywords: `${ex.bodyPart}, ${ex.equipment}, fitness`,
      },
    })),
  };

  updateSchemaScript('detailed-exercises', schemaData);
}

function updateSchemaScript(schemaId, data) {
  let script = document.querySelector(`script[data-schema="${schemaId}"]`);

  if (!script) {
    script = document.createElement('script');
    script.type = SEO.JSON_LD_TYPE;
    script.setAttribute('data-schema', schemaId);
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(data);
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

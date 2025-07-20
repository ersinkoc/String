export function toCamelCase(str: string): string {
  if (!str || typeof str !== 'string') return '';
  
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase())
    .replace(/^[A-Z]/, char => char.toLowerCase());
}

export function toPascalCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase())
    .replace(/^[a-z]/, char => char.toUpperCase());
}

export function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .toLowerCase();
}

export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

export function toConstantCase(str: string): string {
  return toSnakeCase(str).toUpperCase();
}

export function toTitleCase(str: string, locale?: string): string {
  const words = str.toLowerCase().split(/\s+/);
  const minorWords = new Set([
    'a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'if', 'in', 'nor', 'of', 
    'on', 'or', 'so', 'the', 'to', 'up', 'yet'
  ]);

  return words.map((word, index) => {
    if (index === 0 || index === words.length - 1 || !minorWords.has(word)) {
      return capitalizeWord(word, locale);
    }
    return word;
  }).join(' ');
}

export function toSentenceCase(str: string): string {
  if (!str) return str;
  
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function capitalizeWord(word: string, locale?: string): string {
  if (!word) return word;
  
  if (locale && typeof Intl !== 'undefined') {
    try {
      return word.charAt(0).toLocaleUpperCase(locale) + word.slice(1);
    } catch {
      // Fall back to default if locale is invalid
    }
  }
  
  return word.charAt(0).toUpperCase() + word.slice(1);
}
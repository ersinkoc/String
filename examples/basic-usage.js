// Basic usage examples for @oxog/string

const { toCamelCase, isEmail, chain, Str } = require('@oxog/string');

console.log('=== Basic Usage Examples ===\n');

// Functional API
console.log('1. Functional API:');
console.log('toCamelCase("hello-world"):', toCamelCase('hello-world'));
console.log('isEmail("test@example.com"):', isEmail('test@example.com'));
console.log();

// Static Class API
console.log('2. Static Class API:');
console.log('Str.toCamelCase("hello-world"):', Str.toCamelCase('hello-world'));
console.log('Str.reverse("hello"):', Str.reverse('hello'));
console.log('Str.mask("secret123", { unmaskedEnd: 3 }):', Str.mask('secret123', { unmaskedEnd: 3 }));
console.log();

// Chainable API
console.log('3. Chainable API:');
const result = chain('  Hello WORLD  ')
  .trim()
  .toLowerCase()
  .toCamelCase()
  .value();
console.log('chain("  Hello WORLD  ").trim().toLowerCase().toCamelCase().value():', result);
console.log();

// Case transformations
console.log('4. Case Transformations:');
const text = 'hello-world_example';
console.log('Original:', text);
console.log('camelCase:', Str.toCamelCase(text));
console.log('PascalCase:', Str.toPascalCase(text));
console.log('snake_case:', Str.toSnakeCase(text));
console.log('kebab-case:', Str.toKebabCase(text));
console.log('CONSTANT_CASE:', Str.toConstantCase(text));
console.log();

// Validation
console.log('5. Validation:');
const testCases = [
  { value: 'test@example.com', test: 'isEmail' },
  { value: 'https://example.com', test: 'isUrl' },
  { value: '123.45', test: 'isNumeric' },
  { value: '#ff0000', test: 'isHexColor' },
  { value: '{"key": "value"}', test: 'isJson' }
];

testCases.forEach(({ value, test }) => {
  console.log(`${test}("${value}"):`, Str[test](value));
});
console.log();

// String manipulation
console.log('6. String Manipulation:');
console.log('reverse("hello"):', Str.reverse('hello'));
console.log('repeat("a", 5, "-"):', Str.repeat('a', 5, '-'));
console.log('truncate("hello world", 8):', Str.truncate('hello world', 8));
console.log('slugify("Hello World!"):', Str.slugify('Hello World!'));
console.log();

// Encoding/Decoding
console.log('7. Encoding/Decoding:');
const original = 'hello world';
const encoded = Str.encodeBase64(original);
const decoded = Str.decodeBase64(encoded);
console.log('Original:', original);
console.log('Base64 encoded:', encoded);
console.log('Base64 decoded:', decoded);
console.log();

// Advanced features
console.log('8. Advanced Features:');
console.log('similarity("hello", "helo"):', Str.similarity('hello', 'helo'));
console.log('fuzzyMatch("hello", "helo", 0.8):', Str.fuzzyMatch('hello', 'helo', 0.8));
console.log('extractEmails("Contact us at test@example.com"):', Str.extractEmails('Contact us at test@example.com'));
console.log('random(10):', Str.random(10));
console.log();

// Visual formatting
console.log('9. Visual Formatting:');
const tableData = [
  ['Name', 'Age', 'City'],
  ['John', '30', 'New York'],
  ['Jane', '25', 'San Francisco']
];
console.log('Table:');
console.log(Str.toTable(tableData, { headers: true, border: true }));
console.log();

console.log('Boxified text:');
console.log(Str.boxify('Hello World!', { style: 'single', padding: 1 }));
console.log();

console.log('Progress bar (75%):');
console.log(Str.progressBar(75, { width: 20, showPercent: true }));
console.log();

// Unicode support
console.log('10. Unicode Support:');
console.log('reverse("🚀🌍"):', Str.reverse('🚀🌍'));
console.log('chars("👨‍👩‍👧‍👦"):', Str.chars('👨‍👩‍👧‍👦'));
console.log('slugify("Café niño"):', Str.slugify('Café niño'));
console.log();

console.log('=== End of Examples ===');
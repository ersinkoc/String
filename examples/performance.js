// Performance comparison examples for @oxog/string

const { Str, chain } = require('@oxog/string');

console.log('=== Performance Comparison Examples ===\n');

// Helper function to measure execution time
function measureTime(fn, iterations = 1000) {
  const start = process.hrtime.bigint();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  const end = process.hrtime.bigint();
  return Number(end - start) / 1000000; // Convert to milliseconds
}

// Test data
const shortString = 'hello world';
const mediumString = 'The quick brown fox jumps over the lazy dog'.repeat(10);
const longString = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(100);
const unicodeString = '🚀 Hello 世界 🌍 emoji and unicode test string';

console.log('Test Data:');
console.log('- Short string:', shortString.length, 'characters');
console.log('- Medium string:', mediumString.length, 'characters');
console.log('- Long string:', longString.length, 'characters');
console.log('- Unicode string:', unicodeString.length, 'characters');
console.log();

// 1. Case Transformation Performance
console.log('1. Case Transformation Performance (1000 iterations):');

const caseTests = [
  { name: 'toCamelCase (short)', fn: () => Str.toCamelCase(shortString) },
  { name: 'toCamelCase (medium)', fn: () => Str.toCamelCase(mediumString) },
  { name: 'toCamelCase (long)', fn: () => Str.toCamelCase(longString) },
  { name: 'toSnakeCase (short)', fn: () => Str.toSnakeCase(shortString) },
  { name: 'toSnakeCase (medium)', fn: () => Str.toSnakeCase(mediumString) },
  { name: 'toKebabCase (short)', fn: () => Str.toKebabCase(shortString) },
  { name: 'slugify (medium)', fn: () => Str.slugify(mediumString) }
];

caseTests.forEach(test => {
  const time = measureTime(test.fn);
  console.log(`${test.name.padEnd(25)}: ${time.toFixed(2)}ms`);
});
console.log();

// 2. Validation Performance
console.log('2. Validation Performance (10000 iterations):');

const validationTests = [
  { name: 'isEmail', fn: () => Str.isEmail('test@example.com') },
  { name: 'isUrl', fn: () => Str.isUrl('https://example.com') },
  { name: 'isUuid', fn: () => Str.isUuid('550e8400-e29b-41d4-a716-446655440000') },
  { name: 'isHexColor', fn: () => Str.isHexColor('#ff0000') },
  { name: 'isBase64', fn: () => Str.isBase64('SGVsbG8gV29ybGQ=') },
  { name: 'isJson', fn: () => Str.isJson('{"key": "value"}') },
  { name: 'isNumeric', fn: () => Str.isNumeric('123.45') }
];

validationTests.forEach(test => {
  const time = measureTime(test.fn, 10000);
  console.log(`${test.name.padEnd(15)}: ${time.toFixed(2)}ms`);
});
console.log();

// 3. String Manipulation Performance
console.log('3. String Manipulation Performance (1000 iterations):');

const manipulationTests = [
  { name: 'reverse (short)', fn: () => Str.reverse(shortString) },
  { name: 'reverse (unicode)', fn: () => Str.reverse(unicodeString) },
  { name: 'truncate (medium)', fn: () => Str.truncate(mediumString, 50) },
  { name: 'pad (short)', fn: () => Str.pad(shortString, 20) },
  { name: 'wrap (long)', fn: () => Str.wrap(longString, 80) },
  { name: 'repeat (short)', fn: () => Str.repeat(shortString, 5) }
];

manipulationTests.forEach(test => {
  const time = measureTime(test.fn);
  console.log(`${test.name.padEnd(20)}: ${time.toFixed(2)}ms`);
});
console.log();

// 4. Search and Analysis Performance
console.log('4. Search and Analysis Performance (1000 iterations):');

const searchTests = [
  { name: 'contains (medium)', fn: () => Str.contains(mediumString, 'fox') },
  { name: 'count (medium)', fn: () => Str.count(mediumString, 'the') },
  { name: 'indexOfAll (medium)', fn: () => Str.indexOfAll(mediumString, 'o') },
  { name: 'words (medium)', fn: () => Str.words(mediumString) },
  { name: 'chars (unicode)', fn: () => Str.chars(unicodeString) }
];

searchTests.forEach(test => {
  const time = measureTime(test.fn);
  console.log(`${test.name.padEnd(20)}: ${time.toFixed(2)}ms`);
});
console.log();

// 5. Encoding Performance
console.log('5. Encoding Performance (1000 iterations):');

const encodingTests = [
  { name: 'encodeBase64 (short)', fn: () => Str.encodeBase64(shortString) },
  { name: 'encodeBase64 (medium)', fn: () => Str.encodeBase64(mediumString) },
  { name: 'encodeHex (short)', fn: () => Str.encodeHex(shortString) },
  { name: 'encodeHtml (medium)', fn: () => Str.encodeHtml(mediumString) }
];

encodingTests.forEach(test => {
  const time = measureTime(test.fn);
  console.log(`${test.name.padEnd(22)}: ${time.toFixed(2)}ms`);
});
console.log();

// 6. Advanced Features Performance
console.log('6. Advanced Features Performance (100 iterations):');

const advancedTests = [
  { name: 'similarity', fn: () => Str.similarity('hello', 'helo') },
  { name: 'fuzzyMatch', fn: () => Str.fuzzyMatch('hello', 'helo', 0.8) },
  { name: 'soundsLike', fn: () => Str.soundsLike('hello', 'helo') },
  { name: 'findPatterns', fn: () => Str.findPatterns('abcabcabc') },
  { name: 'extractEmails', fn: () => Str.extractEmails('Contact test@example.com') },
  { name: 'random', fn: () => Str.random(20) },
  { name: 'mask', fn: () => Str.mask('secret123', { unmaskedEnd: 3 }) }
];

advancedTests.forEach(test => {
  const time = measureTime(test.fn, 100);
  console.log(`${test.name.padEnd(15)}: ${time.toFixed(2)}ms`);
});
console.log();

// 7. API Performance Comparison
console.log('7. API Performance Comparison (10000 iterations):');

const apiTests = [
  { 
    name: 'Functional API', 
    fn: () => Str.toCamelCase(Str.trim('  HELLO WORLD  ').toLowerCase()) 
  },
  { 
    name: 'Chainable API', 
    fn: () => chain('  HELLO WORLD  ').trim().toLowerCase().toCamelCase().value() 
  },
  { 
    name: 'Static Class API', 
    fn: () => Str.toCamelCase(Str.trim('  HELLO WORLD  ').toLowerCase()) 
  }
];

apiTests.forEach(test => {
  const time = measureTime(test.fn, 10000);
  console.log(`${test.name.padEnd(18)}: ${time.toFixed(2)}ms`);
});
console.log();

// 8. Memory Usage Comparison
console.log('8. Memory Usage Simulation:');

function memoryTest(fn, iterations = 1000) {
  const memBefore = process.memoryUsage().heapUsed;
  
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  
  // Force garbage collection if available
  if (global.gc) {
    global.gc();
  }
  
  const memAfter = process.memoryUsage().heapUsed;
  return (memAfter - memBefore) / 1024 / 1024; // MB
}

const memoryTests = [
  { name: 'String creation', fn: () => 'test'.repeat(100) },
  { name: 'Case conversion', fn: () => Str.toCamelCase(longString) },
  { name: 'String splitting', fn: () => Str.words(longString) },
  { name: 'Encoding/Decoding', fn: () => Str.decodeBase64(Str.encodeBase64(mediumString)) }
];

memoryTests.forEach(test => {
  const memUsage = memoryTest(test.fn);
  console.log(`${test.name.padEnd(20)}: ${memUsage.toFixed(2)}MB`);
});
console.log();

// 9. Scalability Test
console.log('9. Scalability Test (single operation):');

const scalabilityTests = [
  { size: 100, label: 'Small (100 chars)' },
  { size: 1000, label: 'Medium (1K chars)' },
  { size: 10000, label: 'Large (10K chars)' },
  { size: 100000, label: 'Very Large (100K chars)' }
];

scalabilityTests.forEach(test => {
  const testString = 'a'.repeat(test.size);
  const time = measureTime(() => Str.toCamelCase(testString), 10);
  console.log(`${test.label.padEnd(22)}: ${time.toFixed(2)}ms`);
});
console.log();

// 10. Unicode Performance
console.log('10. Unicode Performance Comparison (1000 iterations):');

const unicodeTests = [
  { name: 'ASCII reverse', fn: () => Str.reverse('hello world') },
  { name: 'Unicode reverse', fn: () => Str.reverse('🚀🌍👨‍👩‍👧‍👦') },
  { name: 'ASCII chars', fn: () => Str.chars('hello world') },
  { name: 'Unicode chars', fn: () => Str.chars('🚀🌍👨‍👩‍👧‍👦') },
  { name: 'ASCII slugify', fn: () => Str.slugify('Hello World') },
  { name: 'Unicode slugify', fn: () => Str.slugify('Café niño 🚀') }
];

unicodeTests.forEach(test => {
  const time = measureTime(test.fn);
  console.log(`${test.name.padEnd(18)}: ${time.toFixed(2)}ms`);
});
console.log();

console.log('=== Performance Notes ===');
console.log('• All times are measured on this specific system');
console.log('• Performance may vary based on hardware and Node.js version');
console.log('• Unicode operations may be slower due to proper grapheme handling');
console.log('• Chainable API has minimal overhead compared to functional API');
console.log('• Most operations scale linearly with string length');
console.log('• Memory usage is optimized for garbage collection');
console.log();

console.log('=== End of Performance Examples ===');
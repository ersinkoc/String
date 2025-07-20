// Benchmarks for @oxog/string

const { Str } = require('../dist/cjs/index.js');

console.log('Running @oxog/string benchmarks...\n');

// Benchmark helper
function benchmark(name, fn, iterations = 10000) {
  console.log(`\n--- ${name} ---`);
  
  // Warm up
  for (let i = 0; i < 100; i++) fn();
  
  const start = process.hrtime.bigint();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  const end = process.hrtime.bigint();
  
  const totalTime = Number(end - start) / 1000000; // ms
  const avgTime = totalTime / iterations;
  const opsPerSec = Math.round(iterations / (totalTime / 1000));
  
  console.log(`Total time: ${totalTime.toFixed(2)}ms`);
  console.log(`Average time: ${avgTime.toFixed(4)}ms per operation`);
  console.log(`Operations per second: ${opsPerSec.toLocaleString()}`);
}

// Test data
const shortStr = 'hello world';
const mediumStr = 'The quick brown fox jumps over the lazy dog'.repeat(10);
const longStr = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(100);

// Case transformations
benchmark('toCamelCase (short)', () => Str.toCamelCase(shortStr));
benchmark('toCamelCase (medium)', () => Str.toCamelCase(mediumStr));
benchmark('toSnakeCase (medium)', () => Str.toSnakeCase(mediumStr));
benchmark('slugify (medium)', () => Str.slugify(mediumStr));

// Validation
benchmark('isEmail', () => Str.isEmail('test@example.com'));
benchmark('isUrl', () => Str.isUrl('https://example.com'));
benchmark('isUuid', () => Str.isUuid('550e8400-e29b-41d4-a716-446655440000'));

// Manipulation
benchmark('reverse (short)', () => Str.reverse(shortStr));
benchmark('truncate (medium)', () => Str.truncate(mediumStr, 50));
benchmark('pad (short)', () => Str.pad(shortStr, 20));

// Encoding
benchmark('encodeBase64 (medium)', () => Str.encodeBase64(mediumStr));
benchmark('decodeBase64', () => Str.decodeBase64('SGVsbG8gV29ybGQ='));

// Advanced features
benchmark('similarity', () => Str.similarity('hello', 'helo'), 1000);
benchmark('extractEmails', () => Str.extractEmails('Contact test@example.com'), 1000);
benchmark('random(20)', () => Str.random(20), 1000);

console.log('\nBenchmark complete!');
# @oxog/string

**🚀 The Ultimate String Manipulation Library**

A comprehensive, high-performance string utility library with zero dependencies. Featuring 80+ functions, three API styles, advanced algorithms, and complete Unicode support.

[![npm version](https://badge.fury.io/js/@oxog/string.svg)](https://badge.fury.io/js/@oxog/string)
[![Downloads](https://img.shields.io/npm/dm/@oxog/string.svg)](https://npmjs.org/package/@oxog/string)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Test Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)](https://github.com/ersinkoc/string)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/ersinkoc/string)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@oxog/string.svg)](https://bundlephobia.com/package/@oxog/string)

## ✨ Key Features

- 🚀 **Zero Dependencies** - Pure JavaScript implementation, no external dependencies
- 📦 **Three API Styles** - Functional, chainable, and static class interfaces  
- 🔧 **Plugin Architecture** - Extensible system for custom functionality
- 🌍 **Full Unicode Support** - Proper handling of emojis, grapheme clusters, and international text
- 📝 **Complete TypeScript Support** - Full type definitions and IntelliSense
- 🔄 **Dual Module Format** - CommonJS and ESM support for all environments
- ✅ **100% Test Coverage** - 434 comprehensive tests ensuring reliability
- 🎯 **Tree-Shakeable** - Import only what you need, optimized bundle size
- ⚡ **High Performance** - Optimized algorithms including Boyer-Moore string search
- 🛡️ **Security Features** - Built-in masking, encoding, and sanitization utilities
- 🌐 **Internationalization** - Locale-aware functions and accent normalization
- 📊 **Advanced Analytics** - String similarity, pattern detection, and fuzzy matching

## 📦 Installation

```bash
# npm
npm install @oxog/string

# yarn
yarn add @oxog/string

# pnpm
pnpm add @oxog/string
```

## 🚀 Quick Start

Choose your preferred API style and start using @oxog/string immediately:

### 🔗 Chainable API (Recommended)

Perfect for multiple transformations in sequence:

```typescript
import { chain } from '@oxog/string';

const result = chain('  Hello WORLD  ')
  .trim()
  .toLowerCase()
  .toCamelCase()
  .value(); // 'helloWorld'

// Complex text processing
const slug = chain('<p>Café & Restaurant</p>')
  .stripHtml()
  .removeAccents()
  .slugify({ separator: '_' })
  .value(); // 'cafe_restaurant'
```

### ⚡ Functional API

Import individual functions for optimal tree-shaking:

```typescript
import { toCamelCase, isEmail, reverse, similarity } from '@oxog/string';

toCamelCase('hello-world');        // 'helloWorld'
isEmail('test@example.com');       // true
reverse('hello');                  // 'olleh'
similarity('hello', 'helo');       // 0.8
```

### 🏗️ Static Class API

Use the unified Str class for consistent API access:

```typescript
import { Str } from '@oxog/string';

Str.toCamelCase('hello-world');    // 'helloWorld'
Str.maskEmail('test@example.com'); // 't***@example.com'
Str.random(10);                    // 'aB3xY9mN2p'
Str.boxify('Hello World!');        // ┌─────────────┐
                                   // │ Hello World! │
                                   // └─────────────┘
```

## API Reference

### Case Transformations

```typescript
import { toCamelCase, toPascalCase, toSnakeCase, toKebabCase, toConstantCase, toTitleCase, toSentenceCase } from '@oxog/string';

toCamelCase('hello-world');      // 'helloWorld'
toPascalCase('hello-world');     // 'HelloWorld'
toSnakeCase('helloWorld');       // 'hello_world'
toKebabCase('helloWorld');       // 'hello-world'
toConstantCase('helloWorld');    // 'HELLO_WORLD'
toTitleCase('hello world');      // 'Hello World'
toSentenceCase('HELLO WORLD');   // 'Hello world'
```

### Validation

```typescript
import { isEmail, isUrl, isUuid, isHexColor, isBase64, isJson, isNumeric, isAlpha, isAlphanumeric, isEmpty } from '@oxog/string';

isEmail('test@example.com');           // true
isUrl('https://example.com');          // true
isUuid('550e8400-e29b-41d4-a716-446655440000'); // true
isHexColor('#ff0000');                 // true
isBase64('SGVsbG8gV29ybGQ=');          // true
isJson('{"key": "value"}');            // true
isNumeric('123.45');                   // true
isAlpha('hello');                      // true
isAlphanumeric('hello123');            // true
isEmpty('');                           // true
```

### String Manipulation

```typescript
import { reverse, shuffle, repeat, truncate, pad, wrap, slugify } from '@oxog/string';

reverse('hello');                      // 'olleh'
shuffle('hello');                      // 'hlelo' (random)
repeat('a', 3);                        // 'aaa'
repeat('a', 3, '-');                   // 'a-a-a'
truncate('hello world', 8);            // 'hello...'
pad('hello', 8);                       // 'hello   '
wrap('hello world test', 10);          // 'hello\nworld test'
slugify('Hello World!');               // 'hello-world'
```

### Cleaning

```typescript
import { trim, trimStart, trimEnd, removeExtraSpaces, normalizeWhitespace, removeNonPrintable, stripHtml, stripAnsi, removeAccents } from '@oxog/string';

trim('  hello  ');                  // 'hello'
trimStart('__hello__', '_');        // 'hello__'
trimEnd('__hello__', '_');          // '__hello'
removeExtraSpaces('hello   world'); // 'hello world'
normalizeWhitespace('hello\tworld');  // 'hello world'
removeNonPrintable('hello\x00world'); // 'helloworld'
stripHtml('<p>hello</p>');          // 'hello'
stripAnsi('\x1b[31mhello\x1b[0m');    // 'hello'
removeAccents('crème brûlée');      // 'creme brulee'
```

### Encoding/Decoding

```typescript
import { encodeBase64, decodeBase64, encodeHex, decodeHex, encodeHtml, decodeHtml, encodeUri, decodeUri } from '@oxog/string';

encodeBase64('hello');                 // 'aGVsbG8='
decodeBase64('aGVsbG8=');              // 'hello'
encodeHex('hello');                    // '68656c6c6f'
decodeHex('68656c6c6f');               // 'hello'
encodeHtml('<div>Hello</div>');        // '&lt;div&gt;Hello&lt;/div&gt;'
decodeHtml('&lt;div&gt;Hello&lt;/div&gt;'); // '<div>Hello</div>'
```

### Analysis

```typescript
import { similarity, fuzzyMatch, soundsLike, findPatterns, extractEmails } from '@oxog/string';

similarity('hello', 'helo');           // 0.8 (similarity score)
fuzzyMatch('hello', 'helo', 0.7);      // true
soundsLike('hello', 'helo');           // true (using soundex)
findPatterns('abcabcabc');             // [{ pattern: 'abc', frequency: 3, ... }]
extractEmails('Contact test@example.com'); // ['test@example.com']
```

### Utilities

```typescript
import { random, mask } from '@oxog/string';

random(10);                            // 'aB3xY9mN2p' (random)
mask('secret', { unmaskedEnd: 2 });    // '****et'
```

### Visual Formatting

```typescript
import { toTable, boxify, progressBar } from '@oxog/string';

toTable([['Name', 'Age'], ['John', '30']]); // ASCII table
boxify('Hello World');                 // Boxed text
progressBar(75);                       // '███████████░░░░░ 75.0%'
```

### Plugin System

```typescript
import { core, createPlugin } from '@oxog/string';

// Create a custom plugin
const myPlugin = createPlugin('my-plugin', '1.0.0', (core) => {
  core.extend('customMethod', (str: string) => {
    return str.toUpperCase() + '!';
  });
});

// Use the plugin
core.use(myPlugin);

// Access extended functionality
const customMethod = core.getExtension('customMethod');
if (customMethod) {
  console.log(customMethod('hello')); // 'HELLO!'
}
```

## Options and Configuration

Many functions accept options objects for customization:

```typescript
// URL validation options
isUrl('example.com', { 
  requireProtocol: false,
  allowUnderscore: true 
});

// Truncation options
truncate('hello world', 8, { 
  suffix: '…', 
  preserveWords: true 
});

// Slugify options
slugify('Hello World!', {
  separator: '_',
  lowercase: true,
  strict: false
});

// Random string options
random(10, {
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: false,
  excludeSimilar: true
});
```

## Unicode Support

All functions properly handle Unicode characters, emojis, and grapheme clusters:

```typescript
reverse('🚀🌍');           // '🌍🚀'
chars('👨‍👩‍👧‍👦');            // ['👨‍👩‍👧‍👦'] (single grapheme cluster)
slugify('Café niño');      // 'cafe-nino'
```

## TypeScript Support

Full TypeScript definitions are included:

```typescript
import type { TruncateOptions, SlugifyOptions, ChainableString } from '@oxog/string';

const options: TruncateOptions = {
  suffix: '...',
  preserveWords: true
};

const chainable: ChainableString = chain('hello');
```

## Browser Support

Works in all modern browsers and Node.js environments:

- Node.js 14+
- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## Performance

Optimized algorithms and implementations:

- Boyer-Moore string searching
- Efficient Unicode handling
- Memoization for expensive operations
- Tree-shakeable imports

## 📚 Examples & Documentation

Explore comprehensive examples and documentation:

### Example Files
- 📋 [Comprehensive Examples](./examples/comprehensive.js) - All 80+ functions demonstrated
- 🏗️ [Basic Usage](./examples/basic-usage.js) - Getting started guide
- 📝 [TypeScript Usage](./examples/typescript-usage.ts) - Type-safe implementations
- 🔌 [Plugin Development](./examples/plugin-development.js) - Custom plugin creation
- ⚡ [Performance Benchmarks](./examples/performance.js) - Performance comparisons
- 🌐 [Real-World Usage](./examples/real-world-usage.js) - Practical applications

### Additional Documentation
- 📖 [Complete API Reference](./docs/API.md) - Detailed function documentation
- 🔄 [Migration Guide](./docs/MIGRATION.md) - Upgrading from other libraries
- 🎯 [Best Practices](./docs/BEST_PRACTICES.md) - Recommended usage patterns
- 🐛 [Troubleshooting](./docs/TROUBLESHOOTING.md) - Common issues and solutions

## License

MIT © Ersin KOÇ

## Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) for details.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for release history.
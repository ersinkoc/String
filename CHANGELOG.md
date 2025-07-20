# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-07-20

### Added

#### Core Features
- **Case Transformations**: toCamelCase, toPascalCase, toSnakeCase, toKebabCase, toConstantCase, toTitleCase, toSentenceCase
- **String Cleaning**: trim variants, removeExtraSpaces, normalizeWhitespace, removeNonPrintable, stripHtml, stripAnsi, removeAccents
- **Validation**: isEmail, isUrl, isUuid, isHexColor, isBase64, isJson, isNumeric, isAlpha, isAlphanumeric, isEmpty
- **Search & Analysis**: contains, count, indexOfAll, words, chars, codePoints, graphemes
- **Manipulation**: reverse, shuffle, repeat, truncate, pad, wrap, slugify
- **Encoding/Decoding**: Base64, hex, HTML, URI encoding/decoding with pure JavaScript implementations

#### Advanced Features
- **String Similarity**: Levenshtein distance, Jaro distance, cosine similarity
- **Fuzzy Matching**: configurable threshold-based matching
- **Sound Matching**: Soundex and Metaphone algorithms
- **Pattern Detection**: findPatterns, isRepeating functions
- **Data Extraction**: extractEmails, extractUrls, extractNumbers
- **String Generation**: random strings, pronounceable strings, pattern-based generation
- **Security**: mask, maskEmail, maskCreditCard, hash functions (MD5, SHA1, SHA256)
- **Visual Formatting**: toTable, boxify, progressBar

#### Plugin System
- Extensible plugin architecture with core.use() and core.extend()
- Built-in plugins for locale operations, color formatting, and math operations
- Type-safe plugin development with IStringPlugin interface

#### API Design
- **Functional API**: Import individual functions
- **Chainable API**: Fluent interface with chain() function
- **Static Class API**: Str.methodName() syntax

#### Technical Features
- **Zero Dependencies**: Pure JavaScript implementation
- **TypeScript Support**: Full type definitions with strict mode
- **Dual Module Support**: CommonJS and ESM builds
- **Unicode Support**: Proper handling of emojis, grapheme clusters, international characters
- **Locale Support**: Intl API integration for locale-aware operations
- **Performance**: Optimized algorithms (Boyer-Moore search, efficient string operations)
- **Tree Shaking**: Modular exports for optimal bundle size

#### Development & Quality
- **100% Test Coverage**: Comprehensive Jest test suite with 130+ tests
- **TypeScript Strict Mode**: Maximum type safety
- **ESLint Configuration**: Code quality enforcement
- **Cross-platform**: Node.js 14+ and modern browser support
- **Documentation**: Comprehensive README with examples
- **Examples**: JavaScript and TypeScript usage examples

### Technical Details
- Built with TypeScript 5.0+
- Tested with Jest 29+
- Supports Node.js 14+ and modern browsers
- Zero runtime dependencies
- Full CommonJS and ESM compatibility
- Tree-shakeable exports
- Comprehensive TypeScript definitions

### Package Structure
```
dist/
├── cjs/          # CommonJS build
├── esm/          # ES Modules build
└── types/        # TypeScript definitions
```

[1.0.0]: https://github.com/ersinkoc/string/releases/tag/v1.0.0
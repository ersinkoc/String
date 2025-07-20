# @oxog/string API Reference

Complete API documentation for all string manipulation functions.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Case Transformations](#case-transformations)
- [String Cleaning](#string-cleaning)
- [Validation](#validation)
- [Search & Analysis](#search--analysis)
- [String Manipulation](#string-manipulation)
- [Encoding/Decoding](#encodingdecoding)
- [Advanced Features](#advanced-features)
- [Plugin System](#plugin-system)
- [Type Definitions](#type-definitions)

## Installation

```bash
npm install @oxog/string
```

## Usage

### Three API Styles

```typescript
// 1. Functional API
import { toCamelCase, isEmail } from '@oxog/string';
const result = toCamelCase('hello-world');

// 2. Chainable API
import { chain } from '@oxog/string';
const result = chain('hello-world').toCamelCase().value();

// 3. Static Class API
import { Str } from '@oxog/string';
const result = Str.toCamelCase('hello-world');
```

## Case Transformations

### toCamelCase(str: string): string

Converts string to camelCase.

```typescript
toCamelCase('hello-world')        // 'helloWorld'
toCamelCase('hello_world')        // 'helloWorld'
toCamelCase('hello world')        // 'helloWorld'
toCamelCase('HelloWorld')         // 'helloWorld'
```

### toPascalCase(str: string): string

Converts string to PascalCase.

```typescript
toPascalCase('hello-world')       // 'HelloWorld'
toPascalCase('hello_world')       // 'HelloWorld'
toPascalCase('hello world')       // 'HelloWorld'
```

### toSnakeCase(str: string): string

Converts string to snake_case.

```typescript
toSnakeCase('helloWorld')         // 'hello_world'
toSnakeCase('HelloWorld')         // 'hello_world'
toSnakeCase('hello-world')        // 'hello_world'
```

### toKebabCase(str: string): string

Converts string to kebab-case.

```typescript
toKebabCase('helloWorld')         // 'hello-world'
toKebabCase('HelloWorld')         // 'hello-world'
toKebabCase('hello_world')        // 'hello-world'
```

### toConstantCase(str: string): string

Converts string to CONSTANT_CASE.

```typescript
toConstantCase('helloWorld')      // 'HELLO_WORLD'
toConstantCase('hello-world')     // 'HELLO_WORLD'
```

### toTitleCase(str: string, locale?: string): string

Converts string to Title Case.

```typescript
toTitleCase('hello world')        // 'Hello World'
toTitleCase('the lord of the rings') // 'The Lord of the Rings'
toTitleCase('café', 'fr')         // 'Café'
```

### toSentenceCase(str: string): string

Converts string to Sentence case.

```typescript
toSentenceCase('HELLO WORLD')     // 'Hello world'
toSentenceCase('hello WORLD')     // 'Hello world'
```

## String Cleaning

### trim(str: string, chars?: string): string

Trims whitespace or specific characters.

```typescript
trim('  hello  ')                 // 'hello'
trim('...hello...', '.')          // 'hello'
trim('###hello###', '#')          // 'hello'
```

### trimStart(str: string, chars?: string): string

Trims from the start only.

```typescript
trimStart('  hello  ')            // 'hello  '
trimStart('...hello...', '.')     // 'hello...'
```

### trimEnd(str: string, chars?: string): string

Trims from the end only.

```typescript
trimEnd('  hello  ')              // '  hello'
trimEnd('...hello...', '.')       // '...hello'
```

### removeExtraSpaces(str: string): string

Removes extra whitespace.

```typescript
removeExtraSpaces('hello    world')  // 'hello world'
removeExtraSpaces('  hello  world  ') // 'hello world'
```

### normalizeWhitespace(str: string): string

Normalizes all whitespace types.

```typescript
normalizeWhitespace('hello\t\nworld') // 'hello world'
normalizeWhitespace('hello\r\fworld') // 'hello world'
```

### removeNonPrintable(str: string): string

Removes non-printable characters.

```typescript
removeNonPrintable('hello\x00world')  // 'helloworld'
removeNonPrintable('hello\x01world')  // 'helloworld'
```

### stripHtml(str: string): string

Removes HTML tags and decodes entities.

```typescript
stripHtml('<p>Hello <strong>World</strong></p>') // 'Hello World'
stripHtml('&lt;test&gt;')                        // '<test>'
stripHtml('<script>alert("xss")</script>text')   // 'text'
```

### stripAnsi(str: string): string

Removes ANSI escape codes.

```typescript
stripAnsi('\x1b[31mhello\x1b[0m')     // 'hello'
stripAnsi('\x1b[1;32mgreen\x1b[0m')   // 'green'
```

### removeAccents(str: string): string

Removes accent marks from characters.

```typescript
removeAccents('café')              // 'cafe'
removeAccents('naïve')             // 'naive'
removeAccents('résumé')            // 'resume'
```

## Validation

### isEmail(str: string): boolean

Validates email addresses.

```typescript
isEmail('test@example.com')        // true
isEmail('invalid.email')           // false
isEmail('user@domain.co.uk')       // true
```

### isUrl(str: string, options?: UrlOptions): boolean

Validates URLs with options.

```typescript
isUrl('https://example.com')       // true
isUrl('example.com', { requireProtocol: false }) // true
isUrl('http://under_score.com', { allowUnderscore: true }) // true
```

**UrlOptions:**
```typescript
interface UrlOptions {
  requireProtocol?: boolean;    // Default: false
  allowUnderscore?: boolean;    // Default: false
  allowTrailingDot?: boolean;   // Default: false
  allowProtocols?: string[];    // Default: ['http', 'https', 'ftp']
}
```

### isUuid(str: string, version?: number): boolean

Validates UUIDs.

```typescript
isUuid('550e8400-e29b-41d4-a716-446655440000')  // true
isUuid('550e8400-e29b-41d4-a716-446655440000', 4) // true
```

### isHexColor(str: string): boolean

Validates hex color codes.

```typescript
isHexColor('#ff0000')             // true
isHexColor('#f00')                // true
isHexColor('#ff0000aa')           // true (with alpha)
isHexColor('ff0000')              // false (missing #)
```

### isBase64(str: string): boolean

Validates Base64 strings.

```typescript
isBase64('SGVsbG8gV29ybGQ=')      // true
isBase64('Hello World')           // false
```

### isJson(str: string): boolean

Validates JSON strings.

```typescript
isJson('{"key": "value"}')        // true
isJson('[1, 2, 3]')               // true
isJson('invalid')                 // false
```

### isNumeric(str: string): boolean

Validates numeric strings.

```typescript
isNumeric('123')                  // true
isNumeric('123.45')               // true
isNumeric('-123')                 // true
isNumeric('123abc')               // false
```

### isAlpha(str: string, locale?: string): boolean

Validates alphabetic strings.

```typescript
isAlpha('hello')                  // true
isAlpha('hello123')               // false
isAlpha('café', 'fr')             // true
```

### isAlphanumeric(str: string, locale?: string): boolean

Validates alphanumeric strings.

```typescript
isAlphanumeric('hello123')        // true
isAlphanumeric('hello world')     // false
isAlphanumeric('café123', 'fr')   // true
```

### isEmpty(str: string, options?: {ignoreWhitespace?: boolean}): boolean

Checks if string is empty.

```typescript
isEmpty('')                       // true
isEmpty('   ')                    // false
isEmpty('   ', { ignoreWhitespace: true }) // true
```

## Search & Analysis

### contains(str: string, search: string, caseSensitive?: boolean): boolean

Checks if string contains substring.

```typescript
contains('hello world', 'world')         // true
contains('Hello World', 'world', false)  // true
contains('Hello World', 'world', true)   // false
```

### count(str: string, search: string): number

Counts occurrences of substring.

```typescript
count('hello world hello', 'hello')      // 2
count('aaa', 'aa')                       // 1
```

### indexOfAll(str: string, search: string): number[]

Returns all indices of substring.

```typescript
indexOfAll('hello world hello', 'hello') // [0, 12]
indexOfAll('aaa', 'a')                   // [0, 1, 2]
```

### words(str: string, locale?: string): string[]

Splits string into words.

```typescript
words('hello world')              // ['hello', 'world']
words('hello, world!')            // ['hello', 'world']
words('café résumé', 'fr')        // ['café', 'résumé']
```

### chars(str: string): string[]

Splits string into characters (Unicode-aware).

```typescript
chars('hello')                    // ['h', 'e', 'l', 'l', 'o']
chars('🚀🌍')                     // ['🚀', '🌍']
chars('👨‍👩‍👧‍👦')                    // ['👨‍👩‍👧‍👦'] (single grapheme cluster)
```

### codePoints(str: string): number[]

Returns Unicode code points.

```typescript
codePoints('hello')               // [104, 101, 108, 108, 111]
codePoints('🚀')                  // [128640]
```

### graphemes(str: string): string[]

Returns grapheme clusters.

```typescript
graphemes('hello')                // ['h', 'e', 'l', 'l', 'o']
graphemes('🚀🌍')                 // ['🚀', '🌍']
graphemes('👨‍👩‍👧‍👦')                // ['👨‍👩‍👧‍👦']
```

## String Manipulation

### reverse(str: string): string

Reverses string (Unicode-aware).

```typescript
reverse('hello')                  // 'olleh'
reverse('🚀🌍')                   // '🌍🚀'
```

### shuffle(str: string): string

Randomly shuffles characters.

```typescript
shuffle('hello')                  // 'hlelo' (random)
shuffle('🚀🌍')                   // '🌍🚀' (random)
```

### repeat(str: string, count: number, separator?: string): string

Repeats string with optional separator.

```typescript
repeat('hello', 3)                // 'hellohellohello'
repeat('hello', 3, '-')           // 'hello-hello-hello'
repeat('a', 5, ' ')               // 'a a a a a'
```

### truncate(str: string, length: number, options?: TruncateOptions): string

Truncates string to specified length.

```typescript
truncate('hello world', 8)        // 'hello...'
truncate('hello world', 8, { suffix: '…' }) // 'hello w…'
truncate('hello world example', 12, { preserveWords: true }) // 'hello...'
```

**TruncateOptions:**
```typescript
interface TruncateOptions {
  suffix?: string;        // Default: '...'
  preserveWords?: boolean; // Default: false
}
```

### pad(str: string, length: number, fillString?: string, type?: PadType): string

Pads string to specified length.

```typescript
pad('hello', 8)                   // 'hello   '
pad('hello', 8, '-', 'start')     // '---hello'
pad('hello', 9, '-', 'both')      // '--hello--'
```

**PadType:** `'start' | 'end' | 'both'`

### wrap(str: string, width: number, options?: WrapOptions): string

Wraps text at specified width.

```typescript
wrap('hello world example', 10)   // 'hello\nworld\nexample'
wrap('hello world', 10, { indent: '  ' }) // '  hello\n  world'
```

**WrapOptions:**
```typescript
interface WrapOptions {
  indent?: string;        // Default: ''
  break?: boolean;        // Default: false
  cut?: boolean;          // Default: false
  width?: number;         // Default: undefined
}
```

### slugify(str: string, options?: SlugifyOptions): string

Creates URL-friendly slugs.

```typescript
slugify('Hello World!')           // 'hello-world'
slugify('Café & Restaurant')      // 'cafe-restaurant'
slugify('Hello World', { separator: '_' }) // 'hello_world'
slugify('Hello World', { lowercase: false }) // 'Hello-World'
```

**SlugifyOptions:**
```typescript
interface SlugifyOptions {
  separator?: string;     // Default: '-'
  lowercase?: boolean;    // Default: true
  strict?: boolean;       // Default: false
  locale?: string;        // Default: undefined
}
```

## Encoding/Decoding

### encodeBase64(str: string): string

Encodes string to Base64.

```typescript
encodeBase64('hello world')       // 'aGVsbG8gd29ybGQ='
encodeBase64('🚀')                // '8J+agA=='
```

### decodeBase64(str: string): string

Decodes Base64 string.

```typescript
decodeBase64('aGVsbG8gd29ybGQ=')  // 'hello world'
decodeBase64('8J+agA==')          // '🚀'
```

### encodeHex(str: string): string

Encodes string to hexadecimal.

```typescript
encodeHex('hello')                // '68656c6c6f'
encodeHex('🚀')                   // 'f09f9a80'
```

### decodeHex(str: string): string

Decodes hexadecimal string.

```typescript
decodeHex('68656c6c6f')           // 'hello'
decodeHex('f09f9a80')             // '🚀'
```

### encodeHtml(str: string): string

Encodes HTML special characters.

```typescript
encodeHtml('<div>Hello & World</div>') // '&lt;div&gt;Hello &amp; World&lt;/div&gt;'
encodeHtml('"quoted"')                 // '&quot;quoted&quot;'
```

### decodeHtml(str: string): string

Decodes HTML entities.

```typescript
decodeHtml('&lt;div&gt;')         // '<div>'
decodeHtml('&amp;&nbsp;&copy;')   // '& ©'
```

### encodeUri(str: string): string

Encodes URI components.

```typescript
encodeUri('hello world')          // 'hello%20world'
encodeUri('café')                 // 'caf%C3%A9'
```

### decodeUri(str: string): string

Decodes URI components.

```typescript
decodeUri('hello%20world')        // 'hello world'
decodeUri('caf%C3%A9')            // 'café'
```

## Advanced Features

### String Similarity

#### similarity(str1: string, str2: string, algorithm?: SimilarityAlgorithm): number

Calculates string similarity (0-1).

```typescript
similarity('hello', 'hello')      // 1.0
similarity('hello', 'helo')       // 0.8
similarity('hello', 'world')      // 0.0

// Different algorithms
similarity('hello', 'helo', 'levenshtein') // 0.8
similarity('hello', 'helo', 'jaro')        // 0.933
similarity('hello', 'helo', 'cosine')      // 0.8
```

#### fuzzyMatch(str: string, pattern: string, threshold?: number): boolean

Fuzzy string matching.

```typescript
fuzzyMatch('hello', 'helo', 0.8)  // true
fuzzyMatch('hello', 'world', 0.8) // false
```

#### soundsLike(str1: string, str2: string, algorithm?: SoundsLikeAlgorithm): boolean

Phonetic similarity matching.

```typescript
soundsLike('smith', 'smyth')      // true
soundsLike('phone', 'fone')       // true

// Different algorithms
soundsLike('smith', 'smyth', 'soundex')   // true
soundsLike('smith', 'smyth', 'metaphone') // true
```

### Pattern Detection

#### findPatterns(str: string, minLength?: number): Pattern[]

Finds repeating patterns.

```typescript
findPatterns('abcabcabc')         // [{ pattern: 'abc', indices: [0, 3, 6], frequency: 3 }]
findPatterns('hello world hello') // [{ pattern: 'hello', indices: [0, 12], frequency: 2 }]
```

#### isRepeating(str: string): boolean

Checks if string is composed of repeating patterns.

```typescript
isRepeating('abcabc')             // true
isRepeating('abcdef')             // false
```

### Data Extraction

#### extractEmails(str: string): string[]

Extracts email addresses.

```typescript
extractEmails('Contact john@example.com or jane@test.org')
// ['john@example.com', 'jane@test.org']
```

#### extractUrls(str: string): string[]

Extracts URLs.

```typescript
extractUrls('Visit https://example.com or http://test.org')
// ['https://example.com', 'http://test.org']
```

#### extractNumbers(str: string): string[]

Extracts numbers.

```typescript
extractNumbers('I have 5 apples and 3.14 oranges')
// ['5', '3.14']
```

### String Generation

#### random(length: number, options?: RandomOptions): string

Generates random strings.

```typescript
random(10)                        // 'aB3xY9mN2p'
random(8, { uppercase: false })   // 'ab3xy9mn'
random(6, { numbers: false })     // 'aBxYmN'
random(5, { customCharset: 'abc' }) // 'abcab'
```

**RandomOptions:**
```typescript
interface RandomOptions {
  uppercase?: boolean;      // Default: true
  lowercase?: boolean;      // Default: true
  numbers?: boolean;        // Default: true
  symbols?: boolean;        // Default: false
  excludeSimilar?: boolean; // Default: false
  customCharset?: string;   // Default: undefined
}
```

#### generatePronounceable(length: number): string

Generates pronounceable strings.

```typescript
generatePronounceable(8)          // 'babomeki'
generatePronounceable(10)         // 'kitemanoba'
```

#### generateFromPattern(pattern: string): string

Generates strings from patterns.

```typescript
generateFromPattern('XXX-###')    // 'ABC-123'
generateFromPattern('X#X#X#')     // 'A1B2C3'
```

**Pattern characters:**
- `X`: Random uppercase letter
- `#`: Random digit

### Security & Privacy

#### mask(str: string, options?: MaskOptions): string

Masks strings for privacy.

```typescript
mask('secret123')                 // '*********'
mask('secret123', { unmaskedEnd: 3 }) // '******123'
mask('secret123', { maskChar: '#' })  // '#########'
```

**MaskOptions:**
```typescript
interface MaskOptions {
  maskChar?: string;        // Default: '*'
  unmaskedStart?: number;   // Default: 0
  unmaskedEnd?: number;     // Default: 0
}
```

#### maskEmail(email: string): string

Masks email addresses.

```typescript
maskEmail('john.doe@example.com') // 'j*****e@example.com'
maskEmail('a@b.com')              // 'a@b.com'
```

#### maskCreditCard(cc: string): string

Masks credit card numbers.

```typescript
maskCreditCard('4532-0151-1283-0366') // '************0366'
maskCreditCard('4532015112830366')     // '************0366'
```

#### hash(str: string, algorithm: HashAlgorithm): string

Generates hash strings.

```typescript
hash('password', 'md5')           // 'a9b9f04336...'
hash('password', 'sha1')          // '5baa61e4c9...'
hash('password', 'sha256')        // 'ef92fc2bfb...'
```

### Visual Formatting

#### toTable(data: string[][], options?: TableOptions): string

Creates ASCII tables.

```typescript
const data = [
  ['Name', 'Age', 'City'],
  ['John', '30', 'New York'],
  ['Jane', '25', 'San Francisco']
];

toTable(data, { headers: true, border: true })
// ┌──────┬─────┬───────────────┐
// │ Name │ Age │ City          │
// ├──────┼─────┼───────────────┤
// │ John │ 30  │ New York      │
// │ Jane │ 25  │ San Francisco │
// └──────┴─────┴───────────────┘
```

**TableOptions:**
```typescript
interface TableOptions {
  headers?: boolean;        // Default: false
  border?: boolean;         // Default: true
  padding?: number;         // Default: 1
  align?: 'left' | 'center' | 'right'; // Default: 'left'
}
```

#### boxify(str: string, options?: BoxOptions): string

Creates text boxes.

```typescript
boxify('Hello World')
// ┌─────────────┐
// │ Hello World │
// └─────────────┘

boxify('Hello', { style: 'double' })
// ╔═══════╗
// ║ Hello ║
// ╚═══════╝
```

**BoxOptions:**
```typescript
interface BoxOptions {
  style?: 'single' | 'double' | 'rounded' | 'thick'; // Default: 'single'
  padding?: number;         // Default: 1
  margin?: number;          // Default: 0
  title?: string;           // Default: undefined
}
```

#### progressBar(value: number, options?: ProgressOptions): string

Creates progress bars.

```typescript
progressBar(75)                   // '███████████████░░░░░ 75.0%'
progressBar(50, { width: 10 })    // '█████░░░░░ 50.0%'
progressBar(25, { showPercent: false }) // '█████░░░░░░░░░░░░░░░'
```

**ProgressOptions:**
```typescript
interface ProgressOptions {
  width?: number;           // Default: 20
  complete?: string;        // Default: '█'
  incomplete?: string;      // Default: '░'
  showPercent?: boolean;    // Default: true
}
```

## Plugin System

### Core Class

```typescript
import { core, createPlugin } from '@oxog/string';

// Use existing plugins
core.use(localePlugin);
core.use(colorPlugin);

// Create custom plugin
const myPlugin = createPlugin('my-plugin', '1.0.0', (core) => {
  core.extend('myMethod', (str: string) => {
    return str.toUpperCase() + '!';
  });
});

core.use(myPlugin);

// Use plugin methods
const myMethod = core.getExtension('myMethod');
if (myMethod) {
  console.log(myMethod('hello')); // 'HELLO!'
}
```

### Built-in Plugins

#### localePlugin

Adds locale-aware string operations.

```typescript
import { core, localePlugin } from '@oxog/string';

core.use(localePlugin);

const toLowerCase = core.getExtension('toLocaleLowerCase');
const toUpperCase = core.getExtension('toLocaleUpperCase');
const localeCompare = core.getExtension('localeCompare');
```

#### colorPlugin

Adds terminal color formatting.

```typescript
import { core, colorPlugin } from '@oxog/string';

core.use(colorPlugin);

const colorize = core.getExtension('colorize');
const stripColors = core.getExtension('stripColors');

if (colorize) {
  console.log(colorize('Hello', 'red')); // Red colored text
}
```

#### mathPlugin

Adds mathematical string operations.

```typescript
import { core, mathPlugin } from '@oxog/string';

core.use(mathPlugin);

const extractNumbers = core.getExtension('extractNumbers');
const sumNumbers = core.getExtension('sumNumbers');
const replaceNumbers = core.getExtension('replaceNumbers');
```

### Plugin Interface

```typescript
interface IStringPlugin {
  name: string;
  version: string;
  install(core: StringCore): void;
}

interface StringCore {
  use(plugin: IStringPlugin): void;
  extend(name: string, fn: Function): void;
  getExtension(name: string): Function | undefined;
  getPlugin(name: string): IStringPlugin | undefined;
  listPlugins(): string[];
  listExtensions(): string[];
}
```

## Type Definitions

### Core Types

```typescript
// Chainable interface
interface ChainableString {
  trim(): ChainableString;
  toCamelCase(): ChainableString;
  slugify(options?: SlugifyOptions): ChainableString;
  value(): string;
  // ... all other methods
}

// Similarity algorithms
type SimilarityAlgorithm = 'levenshtein' | 'jaro' | 'cosine';

// Sound matching algorithms
type SoundsLikeAlgorithm = 'soundex' | 'metaphone';

// Hash algorithms
type HashAlgorithm = 'md5' | 'sha1' | 'sha256';

// Padding types
type PadType = 'start' | 'end' | 'both';
```

### Pattern Interface

```typescript
interface Pattern {
  pattern: string;
  indices: number[];
  length: number;
  frequency: number;
}
```

All functions are Unicode-aware and handle emojis, grapheme clusters, and international characters properly.
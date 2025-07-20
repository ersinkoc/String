// Comprehensive examples demonstrating ALL functions of @oxog/string
const { Str, chain, core, createPlugin } = require('@oxog/string');

console.log('=== COMPREHENSIVE @oxog/string EXAMPLES ===\n');

// ========================================
// 1. CASE TRANSFORMATIONS
// ========================================
console.log('1. CASE TRANSFORMATIONS:');
const testText = 'hello-world_example';
console.log('Original:', testText);
console.log('toCamelCase:', Str.toCamelCase(testText));
console.log('toPascalCase:', Str.toPascalCase(testText));
console.log('toSnakeCase:', Str.toSnakeCase(testText));
console.log('toKebabCase:', Str.toKebabCase(testText));
console.log('toConstantCase:', Str.toConstantCase(testText));
console.log('toTitleCase:', Str.toTitleCase('hello world example'));
console.log('toSentenceCase:', Str.toSentenceCase('HELLO WORLD'));
console.log();

// ========================================
// 2. CLEANING FUNCTIONS
// ========================================
console.log('2. CLEANING FUNCTIONS:');
console.log('trim:', `"${Str.trim('  hello world  ')}"` + ' -> removed whitespace');
console.log('trimStart:', `"${Str.trimStart('  hello world  ')}"` + ' -> removed leading');
console.log('trimEnd:', `"${Str.trimEnd('  hello world  ')}"` + ' -> removed trailing');
console.log('trim custom chars:', `"${Str.trim('###hello###', '#')}"` + ' -> removed #');
console.log('removeExtraSpaces:', `"${Str.removeExtraSpaces('hello    world   test')}"` + ' -> normalized spaces');
console.log('normalizeWhitespace:', `"${Str.normalizeWhitespace('hello\\t\\nworld\\r test')}"` + ' -> normalized all whitespace');
console.log('removeNonPrintable:', `"${Str.removeNonPrintable('hello\\x00world\\x01test')}"` + ' -> removed control chars');
console.log('stripHtml:', `"${Str.stripHtml('<p>Hello <strong>world</strong>!</p>')}"` + ' -> removed HTML');
console.log('stripAnsi:', `"${Str.stripAnsi('\\x1b[31mRed text\\x1b[0m')}"` + ' -> removed ANSI codes');
console.log('removeAccents:', `"${Str.removeAccents('café résumé naïve')}"` + ' -> removed accents');
console.log();

// ========================================
// 3. VALIDATION FUNCTIONS
// ========================================
console.log('3. VALIDATION FUNCTIONS:');
const validationTests = [
  { func: 'isEmail', value: 'test@example.com', expected: true },
  { func: 'isUrl', value: 'https://example.com', expected: true },
  { func: 'isUuid', value: '550e8400-e29b-41d4-a716-446655440000', expected: true },
  { func: 'isHexColor', value: '#ff0000', expected: true },
  { func: 'isBase64', value: 'SGVsbG8gV29ybGQ=', expected: true },
  { func: 'isJson', value: '{"key": "value"}', expected: true },
  { func: 'isNumeric', value: '123.45', expected: true },
  { func: 'isAlpha', value: 'hello', expected: true },
  { func: 'isAlphanumeric', value: 'hello123', expected: true },
  { func: 'isEmpty', value: '', expected: true },
];

validationTests.forEach(({ func, value, expected }) => {
  const result = Str[func](value);
  console.log(`${func}("${value}"):`, result, result === expected ? '✓' : '✗');
});

// Advanced validation with options
console.log('isUrl with options:', Str.isUrl('example.com', { requireProtocol: false }));
console.log('isUuid v4:', Str.isUuid('550e8400-e29b-41d4-a716-446655440000', 4));
console.log('isEmpty ignoring whitespace:', Str.isEmpty('   ', { ignoreWhitespace: true }));
console.log('isAlpha with locale:', Str.isAlpha('café', 'fr'));
console.log();

// ========================================
// 4. MANIPULATION FUNCTIONS
// ========================================
console.log('4. MANIPULATION FUNCTIONS:');
console.log('reverse:', Str.reverse('hello world'));
console.log('shuffle:', Str.shuffle('abcdefgh')); // Random output each time
console.log('repeat:', Str.repeat('hello', 3, '-'));
console.log('truncate:', Str.truncate('hello world example', 10));
console.log('truncate with options:', Str.truncate('hello world example', 10, { suffix: '...', preserveWords: true }));
console.log('pad (end):', `"${Str.pad('hello', 10)}"`);
console.log('pad (start):', `"${Str.pad('hello', 10, '_', 'start')}"`);
console.log('pad (both):', `"${Str.pad('hello', 12, '-', 'both')}"`);
console.log('wrap:', Str.wrap('this is a very long text that should be wrapped', 15));
console.log('slugify:', Str.slugify('Hello World! & Special Characters'));
console.log('slugify with options:', Str.slugify('Hello World!', { separator: '_', lowercase: false }));
console.log();

// ========================================
// 5. ENCODING FUNCTIONS
// ========================================
console.log('5. ENCODING FUNCTIONS:');
const originalText = 'Hello World! 🌍';
const base64Encoded = Str.encodeBase64(originalText);
const hexEncoded = Str.encodeHex(originalText);
const htmlEncoded = Str.encodeHtml('<div>Hello & "World"</div>');
const uriEncoded = Str.encodeUri('hello world & café');

console.log('Base64 encode:', base64Encoded);
console.log('Base64 decode:', Str.decodeBase64(base64Encoded));
console.log('Hex encode:', hexEncoded);
console.log('Hex decode:', Str.decodeHex(hexEncoded));
console.log('HTML encode:', htmlEncoded);
console.log('HTML decode:', Str.decodeHtml(htmlEncoded));
console.log('URI encode:', uriEncoded);
console.log('URI decode:', Str.decodeUri(uriEncoded));
console.log();

// ========================================
// 6. ANALYSIS FUNCTIONS
// ========================================
console.log('6. ANALYSIS FUNCTIONS:');
const analysisText = 'Hello world! How are you today? Hello again!';
console.log('contains:', Str.contains(analysisText, 'world'));
console.log('contains (case-insensitive):', Str.contains(analysisText, 'WORLD', false));
console.log('count:', Str.count(analysisText, 'Hello'));
console.log('indexOfAll:', Str.indexOfAll(analysisText, 'o'));
console.log('words:', Str.words(analysisText));
console.log('chars:', Str.chars('hello'));
console.log('codePoints:', Str.codePoints('🚀🌍'));
console.log('graphemes:', Str.graphemes('👨‍👩‍👧‍👦')); // Family emoji
console.log();

// ========================================
// 7. ADVANCED FEATURES
// ========================================
console.log('7. ADVANCED FEATURES:');
console.log('similarity (levenshtein):', Str.similarity('hello', 'helo'));
console.log('similarity (jaro):', Str.similarity('martha', 'marhta', 'jaro'));
console.log('similarity (cosine):', Str.similarity('hello world', 'hello earth', 'cosine'));
console.log('fuzzyMatch:', Str.fuzzyMatch('hello', 'helo', 0.8));
console.log('soundsLike (soundex):', Str.soundsLike('smith', 'smyth'));
console.log('soundsLike (metaphone):', Str.soundsLike('phone', 'fone', 'metaphone'));

const patternText = 'abcabcabc';
console.log('findPatterns:', Str.findPatterns(patternText));
console.log('isRepeating:', Str.isRepeating(patternText));

const emailText = 'Contact us at test@example.com or support@company.org';
console.log('extractEmails:', Str.extractEmails(emailText));

const urlText = 'Visit https://example.com or http://test.org for more info';
console.log('extractUrls:', Str.extractUrls(urlText));

const numberText = 'I have 5 apples, 3.14 oranges, and spent $12.50';
console.log('extractNumbers:', Str.extractNumbers(numberText));
console.log();

// ========================================
// 8. RANDOM GENERATION
// ========================================
console.log('8. RANDOM GENERATION:');
console.log('random (default):', Str.random(10));
console.log('random (uppercase only):', Str.random(8, { lowercase: false, numbers: false }));
console.log('random (numbers only):', Str.random(6, { uppercase: false, lowercase: false }));
console.log('random (exclude similar):', Str.random(10, { excludeSimilar: true }));
console.log('random (custom charset):', Str.random(8, { customCharset: 'abc123' }));
console.log('random (with symbols):', Str.random(8, { symbols: true }));
console.log('generatePronounceable:', Str.generatePronounceable(10));
console.log('generateFromPattern:', Str.generateFromPattern('XXX-###-XXX'));
console.log();

// ========================================
// 9. MASKING & SECURITY
// ========================================
console.log('9. MASKING & SECURITY:');
console.log('mask (default):', Str.mask('secret123'));
console.log('mask (custom options):', Str.mask('secret123', { maskChar: '#', unmaskedStart: 2, unmaskedEnd: 2 }));
console.log('maskEmail:', Str.maskEmail('john.doe@example.com'));
console.log('maskCreditCard:', Str.maskCreditCard('4532-0151-1283-0366'));
console.log('hash (md5):', Str.hash('hello world', 'md5'));
console.log('hash (sha1):', Str.hash('hello world', 'sha1'));
console.log('hash (sha256):', Str.hash('hello world', 'sha256'));
console.log();

// ========================================
// 10. VISUAL FORMATTING
// ========================================
console.log('10. VISUAL FORMATTING:');

// Table creation
const tableData = [
  ['Name', 'Age', 'City'],
  ['John Doe', '30', 'New York'],
  ['Jane Smith', '25', 'San Francisco'],
  ['Bob Johnson', '35', 'Chicago']
];

console.log('Table (with headers and borders):');
console.log(Str.toTable(tableData, { headers: true, border: true, align: 'left' }));

console.log('\nTable (center aligned):');
console.log(Str.toTable(tableData, { headers: true, border: true, align: 'center' }));

console.log('\nTable (right aligned):');
console.log(Str.toTable(tableData, { headers: true, border: true, align: 'right' }));

console.log('\nTable (no borders):');
console.log(Str.toTable(tableData, { headers: true, border: false }));

// Boxify examples
console.log('\nBoxify (single border):');
console.log(Str.boxify('Hello World!', { style: 'single', padding: 1 }));

console.log('\nBoxify (double border):');
console.log(Str.boxify('Hello World!', { style: 'double', padding: 2 }));

console.log('\nBoxify (rounded border):');
console.log(Str.boxify('Hello World!', { style: 'rounded', padding: 1 }));

console.log('\nBoxify (thick border):');
console.log(Str.boxify('Hello World!', { style: 'thick', padding: 1 }));

console.log('\nBoxify (with title):');
console.log(Str.boxify('This is the content', { style: 'single', title: 'Title', padding: 1 }));

console.log('\nBoxify (with margin):');
console.log(Str.boxify('Centered content', { style: 'single', margin: 2, padding: 1 }));

// Progress bars
console.log('\nProgress bars:');
console.log('25%:', Str.progressBar(25));
console.log('50%:', Str.progressBar(50));
console.log('75%:', Str.progressBar(75));
console.log('100%:', Str.progressBar(100));

console.log('\nCustom progress bar:');
console.log(Str.progressBar(60, { width: 30, complete: '█', incomplete: '░', showPercent: true }));

console.log('\nProgress bar without percentage:');
console.log(Str.progressBar(80, { width: 20, showPercent: false }));
console.log();

// ========================================
// 11. UNICODE UTILITIES
// ========================================
console.log('11. UNICODE UTILITIES:');
const unicodeText = '🚀🌍👨‍👩‍👧‍👦';
const arabicText = 'مرحبا بالعالم';
const accentedText = 'café résumé naïve';

console.log('getGraphemes (emoji):', Str.graphemes(unicodeText));
console.log('getCodePoints (emoji):', Str.codePoints(unicodeText));
console.log('isRtl (Arabic):', Str.isRtl ? Str.isRtl(arabicText) : 'Function not exposed');
console.log('reverseUnicode (emoji):', Str.reverse(unicodeText)); // Uses Unicode-aware reverse
console.log('normalizeUnicode:', Str.normalizeUnicode ? Str.normalizeUnicode(accentedText) : 'Function not exposed');
console.log('removeAccents:', Str.removeAccents(accentedText));
console.log('isEmoji:', Str.isEmoji ? Str.isEmoji('🚀') : 'Function not exposed');
console.log('stripEmojis:', Str.stripEmojis ? Str.stripEmojis('Hello 🚀 World 🌍!') : 'Function not exposed');
console.log('getStringWidth:', Str.getStringWidth ? Str.getStringWidth('Hello 🚀') : 'Function not exposed');
console.log();

// ========================================
// 12. CHAINABLE API
// ========================================
console.log('12. CHAINABLE API EXAMPLES:');

const chainedResult1 = chain('  HELLO-world_example  ')
  .trim()
  .toLowerCase()
  .toCamelCase()
  .value();
console.log('Complex chaining result:', chainedResult1);

const chainedResult2 = chain('<p>Hello <strong>World</strong>!</p>')
  .stripHtml()
  .toTitleCase()
  .truncate(10, { suffix: '...' })
  .value();
console.log('HTML processing chain:', chainedResult2);

const chainedResult3 = chain('  café   résumé  ')
  .trim()
  .removeAccents()
  .slugify({ separator: '-' })
  .value();
console.log('Internationalization chain:', chainedResult3);
console.log();

// ========================================
// 13. ALGORITHM DEMONSTRATIONS
// ========================================
console.log('13. ALGORITHM DEMONSTRATIONS:');
const str1 = 'hello world';
const str2 = 'helo wrld';
const str3 = 'goodbye earth';

console.log('Levenshtein distance (edit distance):');
console.log(`"${str1}" vs "${str2}":`, 1 - Str.similarity(str1, str2, 'levenshtein'));
console.log(`"${str1}" vs "${str3}":`, 1 - Str.similarity(str1, str3, 'levenshtein'));

console.log('\nJaro similarity:');
console.log(`"${str1}" vs "${str2}":`, Str.similarity(str1, str2, 'jaro'));
console.log(`"${str1}" vs "${str3}":`, Str.similarity(str1, str3, 'jaro'));

console.log('\nCosine similarity:');
console.log(`"${str1}" vs "${str2}":`, Str.similarity(str1, str2, 'cosine'));
console.log(`"${str1}" vs "${str3}":`, Str.similarity(str1, str3, 'cosine'));

console.log('\nSoundex algorithm:');
console.log(`"smith" vs "smyth":`, Str.soundsLike('smith', 'smyth', 'soundex'));
console.log(`"john" vs "jon":`, Str.soundsLike('john', 'jon', 'soundex'));

console.log('\nMetaphone algorithm:');
console.log(`"phone" vs "fone":`, Str.soundsLike('phone', 'fone', 'metaphone'));
console.log(`"night" vs "knight":`, Str.soundsLike('night', 'knight', 'metaphone'));
console.log();

// ========================================
// 14. PERFORMANCE EXAMPLES
// ========================================
console.log('14. PERFORMANCE EXAMPLES:');
const largeText = 'hello world '.repeat(1000);
const startTime = Date.now();

// Demonstrate efficient operations on large text
const result = chain(largeText)
  .trim()
  .toLowerCase()
  .removeExtraSpaces()
  .truncate(100)
  .value();

const endTime = Date.now();
console.log('Large text processing (11,000 chars):', result.substring(0, 50) + '...');
console.log('Processing time:', endTime - startTime, 'ms');

// Pattern finding performance
const patternTestText = 'abc'.repeat(100) + 'def'.repeat(100);
const patternStartTime = Date.now();
const patterns = Str.findPatterns(patternTestText, 3);
const patternEndTime = Date.now();
console.log('Pattern finding on 600 chars:', patterns.length, 'patterns found in', patternEndTime - patternStartTime, 'ms');
console.log();

// ========================================
// 15. ERROR HANDLING EXAMPLES
// ========================================
console.log('15. ERROR HANDLING EXAMPLES:');

try {
  Str.similarity('hello', 'world', 'invalid');
} catch (error) {
  console.log('Expected error for invalid similarity algorithm:', error.message);
}

try {
  Str.soundsLike('hello', 'world', 'invalid');
} catch (error) {
  console.log('Expected error for invalid sounds-like algorithm:', error.message);
}

try {
  Str.hash('hello', 'invalid');
} catch (error) {
  console.log('Expected error for invalid hash algorithm:', error.message);
}

try {
  Str.random(10, { uppercase: false, lowercase: false, numbers: false, symbols: false });
} catch (error) {
  console.log('Expected error for no character types:', error.message);
}

try {
  Str.decodeHex('invalid');
} catch (error) {
  console.log('Expected error for invalid hex:', error.message);
}

console.log('Graceful handling of invalid base64:', Str.decodeBase64('invalid!!!'));
console.log('Graceful handling of invalid URI:', Str.decodeUri('%%invalid%%'));
console.log();

// ========================================
// 16. PLUGIN SYSTEM DEMONSTRATION
// ========================================
console.log('16. PLUGIN SYSTEM DEMONSTRATION:');

// Create a custom plugin
const demoPlugin = createPlugin('demo', '1.0.0', (core) => {
  core.extend('double', (str) => str + str);
  core.extend('wrapInBrackets', (str) => `[${str}]`);
  core.extend('countVowels', (str) => {
    return (str.match(/[aeiouAEIOU]/g) || []).length;
  });
});

core.use(demoPlugin);

const double = core.getExtension('double');
const wrapInBrackets = core.getExtension('wrapInBrackets');
const countVowels = core.getExtension('countVowels');

if (double && wrapInBrackets && countVowels) {
  console.log('Custom plugin functions:');
  console.log('double("hello"):', double('hello'));
  console.log('wrapInBrackets("test"):', wrapInBrackets('test'));
  console.log('countVowels("hello world"):', countVowels('hello world'));
}

console.log('Installed plugins:', core.listPlugins());
console.log('Available extensions:', core.listExtensions().slice(0, 10), '... and more');
console.log();

console.log('=== END OF COMPREHENSIVE EXAMPLES ===');
console.log('Total functions demonstrated: 80+');
console.log('Package version: 1.0.0');
console.log('Zero runtime dependencies ✓');
console.log('100% TypeScript support ✓');
console.log('Three API styles: Functional, Static Class, Chainable ✓');
console.log('Unicode and internationalization support ✓');
console.log('Advanced algorithms and security features ✓');
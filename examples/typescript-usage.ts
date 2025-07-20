// TypeScript usage examples for @oxog/string

import { 
  toCamelCase, 
  isEmail, 
  chain, 
  Str, 
  core,
  createPlugin,
  type TruncateOptions,
  type SlugifyOptions,
  type ChainableString,
  type RandomOptions
} from '@oxog/string';

console.log('=== TypeScript Usage Examples ===\n');

// Type-safe functional API
console.log('1. Type-safe Functional API:');
const camelCased: string = toCamelCase('hello-world');
const isValidEmail: boolean = isEmail('test@example.com');
console.log('Camel cased:', camelCased);
console.log('Is valid email:', isValidEmail);
console.log();

// Type-safe options
console.log('2. Type-safe Options:');
const truncateOptions: TruncateOptions = {
  suffix: '…',
  preserveWords: true
};

const slugifyOptions: SlugifyOptions = {
  separator: '_',
  lowercase: true,
  strict: false,
  locale: 'en'
};

const randomOptions: RandomOptions = {
  uppercase: true,
  lowercase: false,
  numbers: true,
  symbols: false,
  excludeSimilar: true
};

console.log('Truncated:', Str.truncate('hello world example', 10, truncateOptions));
console.log('Slugified:', Str.slugify('Hello World!', slugifyOptions));
console.log('Random string:', Str.random(8, randomOptions));
console.log();

// Chainable API with types
console.log('3. Chainable API with Types:');
const chainable: ChainableString = chain('  Hello WORLD  ');
const result: string = chainable
  .trim()
  .toLowerCase()
  .toCamelCase()
  .value();
console.log('Chained result:', result);
console.log();

// Generic type usage
console.log('4. Generic Type Usage:');
function processStrings<T extends string[]>(strings: T): string[] {
  return strings.map(str => Str.toCamelCase(str));
}

const inputStrings = ['hello-world', 'foo-bar', 'baz-qux'] as const;
const processedStrings = processStrings(inputStrings);
console.log('Processed strings:', processedStrings);
console.log();

// Plugin system with types
console.log('5. Plugin System with Types:');
interface CustomPlugin {
  reverse: (str: string) => string;
  duplicate: (str: string, count: number) => string;
}

const customPlugin = createPlugin('custom', '1.0.0', (core) => {
  core.extend('reverse', (str: string): string => {
    return Str.reverse(str);
  });
  
  core.extend('duplicate', (str: string, count: number): string => {
    return Str.repeat(str, count, ' ');
  });
});

core.use(customPlugin);

const reverseFunction = core.getExtension('reverse');
const duplicateFunction = core.getExtension('duplicate');

if (reverseFunction && duplicateFunction) {
  console.log('Reversed:', reverseFunction('hello'));
  console.log('Duplicated:', duplicateFunction('test', 3));
}
console.log();

// Type guards and validation
console.log('6. Type Guards and Validation:');
function isValidEmailType(input: unknown): input is string {
  return typeof input === 'string' && Str.isEmail(input);
}

function processEmail(email: unknown): string | null {
  if (isValidEmailType(email)) {
    return Str.maskEmail(email);
  }
  return null;
}

console.log('Valid email processed:', processEmail('test@example.com'));
console.log('Invalid email processed:', processEmail('not-an-email'));
console.log();

// Advanced type usage with arrays
console.log('7. Advanced Type Usage:');
type StringProcessor = (str: string) => string;

const processors: StringProcessor[] = [
  Str.toCamelCase,
  Str.trim,
  (str: string) => Str.truncate(str, 10),
  Str.slugify
];

function applyProcessors(input: string, processors: StringProcessor[]): string {
  return processors.reduce((result, processor) => processor(result), input);
}

const processed = applyProcessors('  Hello World Example  ', processors);
console.log('Processed with multiple functions:', processed);
console.log();

// Utility type helpers
console.log('8. Utility Type Helpers:');
type ValidationResult<T> = {
  value: T;
  isValid: boolean;
  errors: string[];
};

function validateString(input: string): ValidationResult<string> {
  const errors: string[] = [];
  
  if (Str.isEmpty(input)) {
    errors.push('String cannot be empty');
  }
  
  if (!Str.isAlphanumeric(input)) {
    errors.push('String must be alphanumeric');
  }
  
  return {
    value: input,
    isValid: errors.length === 0,
    errors
  };
}

console.log('Validation result for "hello123":', validateString('hello123'));
console.log('Validation result for "hello!":', validateString('hello!'));
console.log();

// Conditional types example
console.log('9. Conditional Types:');
type StringMethod<T> = T extends 'case' 
  ? typeof Str.toCamelCase
  : T extends 'validation' 
  ? typeof Str.isEmail
  : never;

function getStringMethod<T extends 'case' | 'validation'>(type: T): StringMethod<T> {
  if (type === 'case') {
    return Str.toCamelCase as StringMethod<T>;
  } else {
    return Str.isEmail as StringMethod<T>;
  }
}

const caseMethod = getStringMethod('case');
const validationMethod = getStringMethod('validation');

console.log('Case method result:', caseMethod('hello-world'));
console.log('Validation method result:', validationMethod('test@example.com'));
console.log();

// Mapped types example
console.log('10. Mapped Types:');
type StringTransformers = {
  camel: typeof Str.toCamelCase;
  pascal: typeof Str.toPascalCase;
  snake: typeof Str.toSnakeCase;
  kebab: typeof Str.toKebabCase;
};

const transformers: StringTransformers = {
  camel: Str.toCamelCase,
  pascal: Str.toPascalCase,
  snake: Str.toSnakeCase,
  kebab: Str.toKebabCase
};

type TransformResult = {
  [K in keyof StringTransformers]: string;
};

function transformAllCases(input: string): TransformResult {
  return {
    camel: transformers.camel(input),
    pascal: transformers.pascal(input),
    snake: transformers.snake(input),
    kebab: transformers.kebab(input)
  };
}

console.log('All case transformations:', transformAllCases('hello world example'));
console.log();

console.log('=== End of TypeScript Examples ===');
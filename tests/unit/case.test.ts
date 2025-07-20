import { toCamelCase, toPascalCase, toSnakeCase, toKebabCase, toConstantCase, toTitleCase, toSentenceCase } from '../../src/core/case';

describe('Case transformations', () => {
  describe('toCamelCase', () => {
    it('should convert to camelCase', () => {
      expect(toCamelCase('hello world')).toBe('helloWorld');
      expect(toCamelCase('hello-world')).toBe('helloWorld');
      expect(toCamelCase('hello_world')).toBe('helloWorld');
      expect(toCamelCase('HelloWorld')).toBe('helloWorld');
    });

    it('should handle empty string', () => {
      expect(toCamelCase('')).toBe('');
    });

    it('should handle single word', () => {
      expect(toCamelCase('hello')).toBe('hello');
      expect(toCamelCase('Hello')).toBe('hello');
    });

    it('should handle numbers', () => {
      expect(toCamelCase('hello123world')).toBe('hello123world');
      expect(toCamelCase('hello-123-world')).toBe('hello123World');
    });
  });

  describe('toPascalCase', () => {
    it('should convert to PascalCase', () => {
      expect(toPascalCase('hello world')).toBe('HelloWorld');
      expect(toPascalCase('hello-world')).toBe('HelloWorld');
      expect(toPascalCase('hello_world')).toBe('HelloWorld');
      expect(toPascalCase('helloWorld')).toBe('HelloWorld');
    });

    it('should handle empty string', () => {
      expect(toPascalCase('')).toBe('');
    });

    it('should handle single word', () => {
      expect(toPascalCase('hello')).toBe('Hello');
    });
  });

  describe('toSnakeCase', () => {
    it('should convert to snake_case', () => {
      expect(toSnakeCase('hello world')).toBe('hello_world');
      expect(toSnakeCase('helloWorld')).toBe('hello_world');
      expect(toSnakeCase('HelloWorld')).toBe('hello_world');
      expect(toSnakeCase('hello-world')).toBe('hello_world');
    });

    it('should handle empty string', () => {
      expect(toSnakeCase('')).toBe('');
    });

    it('should handle consecutive separators', () => {
      expect(toSnakeCase('hello--world')).toBe('hello_world');
      expect(toSnakeCase('hello  world')).toBe('hello_world');
    });
  });

  describe('toKebabCase', () => {
    it('should convert to kebab-case', () => {
      expect(toKebabCase('hello world')).toBe('hello-world');
      expect(toKebabCase('helloWorld')).toBe('hello-world');
      expect(toKebabCase('HelloWorld')).toBe('hello-world');
      expect(toKebabCase('hello_world')).toBe('hello-world');
    });

    it('should handle empty string', () => {
      expect(toKebabCase('')).toBe('');
    });

    it('should handle consecutive separators', () => {
      expect(toKebabCase('hello__world')).toBe('hello-world');
      expect(toKebabCase('hello  world')).toBe('hello-world');
    });
  });

  describe('toConstantCase', () => {
    it('should convert to CONSTANT_CASE', () => {
      expect(toConstantCase('hello world')).toBe('HELLO_WORLD');
      expect(toConstantCase('helloWorld')).toBe('HELLO_WORLD');
      expect(toConstantCase('hello-world')).toBe('HELLO_WORLD');
    });

    it('should handle empty string', () => {
      expect(toConstantCase('')).toBe('');
    });
  });

  describe('toTitleCase', () => {
    it('should convert to Title Case', () => {
      expect(toTitleCase('hello world')).toBe('Hello World');
      expect(toTitleCase('the quick brown fox')).toBe('The Quick Brown Fox');
    });

    it('should handle minor words correctly', () => {
      expect(toTitleCase('a tale of two cities')).toBe('A Tale of Two Cities');
      expect(toTitleCase('the lord of the rings')).toBe('The Lord of the Rings');
    });

    it('should always capitalize first and last words', () => {
      expect(toTitleCase('of mice and men')).toBe('Of Mice and Men');
      expect(toTitleCase('to be or not to be')).toBe('To Be or Not to Be');
    });

    it('should handle empty string', () => {
      expect(toTitleCase('')).toBe('');
    });

    it('should handle locale-specific title casing', () => {
      expect(toTitleCase('hello world', 'en')).toBe('Hello World');
      expect(toTitleCase('istanbul', 'tr')).toBe('İstanbul'); // Turkish locale correctly capitalizes i to İ
    });
  });

  describe('toSentenceCase', () => {
    it('should convert to Sentence case', () => {
      expect(toSentenceCase('hello world')).toBe('Hello world');
      expect(toSentenceCase('HELLO WORLD')).toBe('Hello world');
      expect(toSentenceCase('hELLO wORLD')).toBe('Hello world');
    });

    it('should handle empty string', () => {
      expect(toSentenceCase('')).toBe('');
    });

    it('should handle single character', () => {
      expect(toSentenceCase('a')).toBe('A');
      expect(toSentenceCase('A')).toBe('A');
    });
  });
});
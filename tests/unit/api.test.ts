import { Str, chain } from '../../src/index';

describe('API Interfaces', () => {
  describe('Static Class API', () => {
    it('should provide all case transformation methods', () => {
      expect(Str.toCamelCase('hello-world')).toBe('helloWorld');
      expect(Str.toPascalCase('hello-world')).toBe('HelloWorld');
      expect(Str.toSnakeCase('helloWorld')).toBe('hello_world');
      expect(Str.toKebabCase('helloWorld')).toBe('hello-world');
      expect(Str.toConstantCase('helloWorld')).toBe('HELLO_WORLD');
    });

    it('should provide validation methods', () => {
      expect(Str.isEmail('test@example.com')).toBe(true);
      expect(Str.isUrl('https://example.com')).toBe(true);
      expect(Str.isNumeric('123')).toBe(true);
    });

    it('should provide manipulation methods', () => {
      expect(Str.reverse('hello')).toBe('olleh');
      expect(Str.repeat('a', 3)).toBe('aaa');
      expect(Str.truncate('hello world', 5)).toBe('he...');
    });

    it('should provide encoding methods', () => {
      const encoded = Str.encodeBase64('hello');
      expect(Str.decodeBase64(encoded)).toBe('hello');
    });
  });

  describe('Chainable API', () => {
    it('should allow method chaining', () => {
      const result = chain('  Hello WORLD  ')
        .trim()
        .toLowerCase()
        .toCamelCase()
        .value();
      
      expect(result).toBe('helloWorld');
    });

    it('should handle complex transformations', () => {
      const result = chain('Hello, World!')
        .stripHtml()
        .removeNonPrintable()
        .trim()
        .toKebabCase()
        .value();
      
      expect(result).toBe('hello-world');
    });

    it('should support encoding operations', () => {
      const result = chain('hello world')
        .encodeBase64()
        .decodeBase64()
        .value();
      
      expect(result).toBe('hello world');
    });

    it('should handle manipulation operations', () => {
      const result = chain('hello')
        .repeat(2, '-')
        .toUpperCase()
        .value();
      
      expect(result).toBe('HELLO-HELLO');
    });

    it('should allow mixed operations', () => {
      const result = chain('  Test String  ')
        .trim()
        .toSnakeCase()
        .toUpperCase()
        .value();
      
      expect(result).toBe('TEST_STRING');
    });
  });

  describe('Functional API', () => {
    it('should be importable as individual functions', async () => {
      const { toCamelCase, isEmail, reverse } = await import('../../src/index');
      
      expect(toCamelCase('hello-world')).toBe('helloWorld');
      expect(isEmail('test@example.com')).toBe(true);
      expect(reverse('hello')).toBe('olleh');
    });
  });

  describe('Type Safety', () => {
    it('should maintain proper TypeScript types', () => {
      // These tests verify TypeScript compilation
      const str: string = Str.toCamelCase('test');
      const bool: boolean = Str.isEmail('test@example.com');
      const num: number = Str.count('hello world', 'l');
      const arr: string[] = Str.words('hello world');
      
      expect(typeof str).toBe('string');
      expect(typeof bool).toBe('boolean');
      expect(typeof num).toBe('number');
      expect(Array.isArray(arr)).toBe(true);
    });

    it('should handle chainable types correctly', () => {
      const chainable = chain('test');
      const result: string = chainable.toCamelCase().value();
      
      expect(typeof result).toBe('string');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty strings', () => {
      expect(Str.toCamelCase('')).toBe('');
      expect(chain('').toCamelCase().value()).toBe('');
    });

    it('should handle null and undefined gracefully', () => {
      // Functions should handle null/undefined by returning empty string
      expect(Str.toCamelCase(null as any)).toBe('');
      expect(Str.toCamelCase(undefined as any)).toBe('');
      expect(() => chain('')).not.toThrow();
    });

    it('should handle special characters', () => {
      const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      expect(() => Str.slugify(special)).not.toThrow();
      expect(() => chain(special).slugify().value()).not.toThrow();
    });

    it('should handle Unicode strings', () => {
      const unicode = '🚀 Hello 世界 🌍';
      expect(() => Str.reverse(unicode)).not.toThrow();
      expect(() => chain(unicode).reverse().value()).not.toThrow();
    });
  });
});
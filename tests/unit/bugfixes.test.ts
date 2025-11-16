/**
 * Comprehensive tests for all bug fixes from the bug analysis report
 * These tests verify that all identified bugs have been properly fixed
 */

import {
  random,
  hash,
  toTable,
  toPascalCase,
  toSnakeCase,
  toKebabCase,
  decodeHex,
  isEmail,
  isUrl,
  decodeHtml,
  truncate,
  wrap,
  slugify,
  encodeBase64,
  decodeBase64
} from '../../src';

describe('Bug Fixes - CRITICAL Severity', () => {
  describe('BUG-001: Hash function security warnings', () => {
    // Suppress console warnings for tests
    const originalWarn = console.warn;
    beforeAll(() => {
      console.warn = jest.fn();
    });
    afterAll(() => {
      console.warn = originalWarn;
    });

    it('should warn users about non-cryptographic hashes', () => {
      hash('test', 'md5');
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('WARNING: hash() uses simple checksums')
      );
    });

    it('should still generate consistent hashes for non-security use cases', () => {
      const hash1 = hash('hello', 'md5');
      const hash2 = hash('hello', 'md5');
      expect(hash1).toBe(hash2);
    });

    it('should handle empty strings without errors', () => {
      expect(() => hash('', 'md5')).not.toThrow();
      expect(() => hash('', 'sha1')).not.toThrow();
      expect(() => hash('', 'sha256')).not.toThrow();
    });
  });

  describe('BUG-002: Secure random generation', () => {
    it('should support secure random generation option', () => {
      const secureToken = random(32, { secure: true });
      expect(secureToken).toHaveLength(32);
    });

    it('should generate different strings each time (even with secure mode)', () => {
      const tokens = new Set();
      for (let i = 0; i < 100; i++) {
        tokens.add(random(16, { secure: true }));
      }
      // With 16 chars from a large charset, we should have 100 unique strings
      expect(tokens.size).toBe(100);
    });

    it('should work with secure option and custom charset', () => {
      const result = random(10, { secure: true, customCharset: 'ABC123' });
      expect(result).toHaveLength(10);
      expect(/^[ABC123]+$/.test(result)).toBe(true);
    });

    it('should work with secure option and excludeSimilar', () => {
      const result = random(20, {
        secure: true,
        excludeSimilar: true,
        uppercase: true,
        lowercase: true,
        numbers: true
      });
      expect(result).toHaveLength(20);
      // Should not contain similar chars like O, 0, I, l, 1
      expect(result).not.toMatch(/[Ol01Ii]/);
    });
  });
});

describe('Bug Fixes - HIGH Severity', () => {
  describe('BUG-003: Missing input validation in case transformation functions', () => {
    it('toPascalCase should handle null/undefined gracefully', () => {
      expect(toPascalCase(null as any)).toBe('');
      expect(toPascalCase(undefined as any)).toBe('');
      expect(toPascalCase('' as any)).toBe('');
    });

    it('toSnakeCase should handle null/undefined gracefully', () => {
      expect(toSnakeCase(null as any)).toBe('');
      expect(toSnakeCase(undefined as any)).toBe('');
      expect(toSnakeCase('' as any)).toBe('');
    });

    it('toKebabCase should handle null/undefined gracefully', () => {
      expect(toKebabCase(null as any)).toBe('');
      expect(toKebabCase(undefined as any)).toBe('');
      expect(toKebabCase('' as any)).toBe('');
    });

    it('should still work correctly with valid strings', () => {
      expect(toPascalCase('hello world')).toBe('HelloWorld');
      expect(toSnakeCase('helloWorld')).toBe('hello_world');
      expect(toKebabCase('helloWorld')).toBe('hello-world');
    });
  });

  describe('BUG-004: Invalid hex string handling', () => {
    it('should throw error for invalid hex characters', () => {
      expect(() => decodeHex('XY')).toThrow('Invalid hex string: contains non-hexadecimal characters');
      expect(() => decodeHex('GG')).toThrow('Invalid hex string: contains non-hexadecimal characters');
      expect(() => decodeHex('41XY42')).toThrow('Invalid hex string: contains non-hexadecimal characters');
    });

    it('should throw error for invalid hex string length', () => {
      expect(() => decodeHex('123')).toThrow('Invalid hex string: length must be even');
    });

    it('should accept valid hex strings', () => {
      expect(() => decodeHex('4142')).not.toThrow();
      expect(decodeHex('48656c6c6f')).toBe('Hello');
    });

    it('should handle uppercase and lowercase hex', () => {
      expect(decodeHex('4142')).toBe(decodeHex('4142'));
      expect(decodeHex('ABCD')).toBe(decodeHex('abcd'));
    });
  });

  describe('BUG-005: Email validation regex improvements', () => {
    it('should reject emails with consecutive dots', () => {
      expect(isEmail('a..b@example.com')).toBe(false);
      expect(isEmail('test..user@example.com')).toBe(false);
    });

    it('should reject emails with leading dots in local part', () => {
      expect(isEmail('.user@example.com')).toBe(false);
    });

    it('should reject emails with trailing dots in local part', () => {
      expect(isEmail('user.@example.com')).toBe(false);
    });

    it('should accept valid emails', () => {
      expect(isEmail('user@example.com')).toBe(true);
      expect(isEmail('user.name@example.com')).toBe(true);
      expect(isEmail('user+tag@example.co.uk')).toBe(true);
    });
  });

  describe('BUG-006: Deprecated escape/unescape functions replaced', () => {
    it('should encode/decode base64 without deprecated functions', () => {
      const testStrings = [
        'Hello, World!',
        'Unicode: ñ, é, ü, ☺',
        'Special chars: <>&"\'',
        'Emoji: 😀🎉🚀'
      ];

      testStrings.forEach(str => {
        const encoded = encodeBase64(str);
        const decoded = decodeBase64(encoded);
        expect(decoded).toBe(str);
      });
    });

    it('should handle edge cases in base64 encoding', () => {
      expect(decodeBase64(encodeBase64(''))).toBe('');
      expect(decodeBase64(encodeBase64('a'))).toBe('a');
      expect(decodeBase64(encodeBase64('ab'))).toBe('ab');
      expect(decodeBase64(encodeBase64('abc'))).toBe('abc');
    });
  });
});

describe('Bug Fixes - MEDIUM Severity', () => {
  describe('BUG-007: URL validation regex improvements', () => {
    it('should reject URLs with leading hyphens in hostname', () => {
      expect(isUrl('http://-example.com')).toBe(false);
    });

    it('should reject URLs with trailing hyphens in hostname', () => {
      expect(isUrl('http://example-.com')).toBe(false);
    });

    it('should reject URLs with consecutive dots', () => {
      expect(isUrl('http://example..com')).toBe(false);
      expect(isUrl('example..com', { requireProtocol: false })).toBe(false);
    });

    it('should accept valid URLs', () => {
      expect(isUrl('http://example.com')).toBe(true);
      expect(isUrl('https://sub.example.com')).toBe(true);
      expect(isUrl('example.com', { requireProtocol: false })).toBe(true);
    });
  });

  describe('BUG-009 & BUG-010: Table function type validation and array bounds', () => {
    it('should handle non-string cell values by converting to strings', () => {
      const table = toTable([
        ['Name', 'Age', 'Active'],
        ['Alice', 25 as any, true as any],
        ['Bob', 30 as any, false as any]
      ]);
      expect(table).toContain('Alice');
      expect(table).toContain('25');
      expect(table).toContain('true');
    });

    it('should handle null and undefined in cells', () => {
      const table = toTable([
        ['A', 'B'],
        ['x', null as any],
        [undefined as any, 'y']
      ]);
      expect(table).toContain('null');
      expect(table).toContain('undefined');
    });

    it('should handle sparse arrays without NaN widths', () => {
      const table = toTable([
        ['a', 'b', 'c'],
        ['x']  // Shorter row
      ]);
      expect(table).not.toContain('NaN');
      expect(typeof table).toBe('string');
    });
  });

  describe('BUG-011: HTML entity decoding improvements', () => {
    it('should decode decimal numeric entities', () => {
      expect(decodeHtml('&#65;')).toBe('A');
      expect(decodeHtml('&#66;&#67;')).toBe('BC');
      expect(decodeHtml('&#8364;')).toBe('€'); // Euro sign
    });

    it('should decode hexadecimal numeric entities', () => {
      expect(decodeHtml('&#x41;')).toBe('A');
      expect(decodeHtml('&#x42;&#x43;')).toBe('BC');
      expect(decodeHtml('&#x20AC;')).toBe('€'); // Euro sign
    });

    it('should decode common named entities', () => {
      expect(decodeHtml('&mdash;')).toBe('\u2014'); // Em dash
      expect(decodeHtml('&ndash;')).toBe('\u2013'); // En dash
      expect(decodeHtml('&ldquo;')).toBe('\u201C'); // Left double quote
      expect(decodeHtml('&rdquo;')).toBe('\u201D'); // Right double quote
    });

    it('should handle mixed entity types', () => {
      const result = decodeHtml('&lt;div&gt;&#65;&#x42;&amp;&mdash;&hellip;&lt;/div&gt;');
      expect(result).toContain('<div>');
      expect(result).toContain('AB');
      expect(result).toContain('&');
      expect(result).toContain('\u2014'); // Em dash
      expect(result).toContain('\u2026'); // Hellip
    });

    it('should leave unknown entities unchanged', () => {
      expect(decodeHtml('&unknownentity;')).toContain('&unknownentity;');
    });
  });
});

describe('Bug Fixes - LOW Severity', () => {
  describe('BUG-013: Slugify consecutive separators', () => {
    it('should clean up consecutive separators in strict mode', () => {
      const result = slugify('hello---world!!!test', { strict: true });
      expect(result).not.toMatch(/--/);
      expect(result).toBe('hello-world-test');
    });

    it('should handle custom separators correctly', () => {
      const result = slugify('hello  world', { separator: '_', strict: true });
      expect(result).not.toMatch(/__/);
      expect(result).toBe('hello_world');
    });

    it('should work with special characters in separator', () => {
      const result = slugify('test...string', { separator: '.', strict: false });
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });
  });

  describe('BUG-017: Truncate with very long suffix', () => {
    it('should handle suffix longer than truncation length', () => {
      const result = truncate('hello', 5, { suffix: '.........' });
      expect(result.length).toBeLessThanOrEqual(5);
      expect(result).toBe('hello');
    });

    it('should truncate normally when suffix is shorter than length', () => {
      const result = truncate('hello world', 8, { suffix: '...' });
      expect(result).toBe('hello...');
      expect(result.length).toBe(8);
    });

    it('should handle edge case where suffix equals length', () => {
      const result = truncate('hello', 3, { suffix: '...' });
      expect(result.length).toBeLessThanOrEqual(3);
    });
  });

  describe('BUG-019: Wrap function width validation', () => {
    it('should throw error for zero width', () => {
      expect(() => wrap('hello', 0)).toThrow('Width must be a positive number');
    });

    it('should throw error for negative width', () => {
      expect(() => wrap('hello', -5)).toThrow('Width must be a positive number');
    });

    it('should work with positive width', () => {
      const result = wrap('hello world', 5);
      expect(result).toContain('hello');
      expect(result).toContain('world');
    });
  });
});

describe('Regression Tests - Ensure fixes don\'t break existing functionality', () => {
  it('random() should still work without secure option', () => {
    const result = random(10);
    expect(result).toHaveLength(10);
  });

  it('hash() should produce consistent results despite warning', () => {
    const originalWarn = console.warn;
    console.warn = jest.fn();

    const hash1 = hash('test', 'md5');
    const hash2 = hash('test', 'md5');
    expect(hash1).toBe(hash2);

    console.warn = originalWarn;
  });

  it('case transformations should work normally with valid input', () => {
    expect(toPascalCase('hello-world')).toBe('HelloWorld');
    expect(toSnakeCase('helloWorld')).toBe('hello_world');
    expect(toKebabCase('HelloWorld')).toBe('hello-world');
  });

  it('hex encoding/decoding should work for valid inputs', () => {
    const text = 'Hello, 世界!';
    const hex = '48656c6c6f2c20e4b896e7958c21';
    expect(decodeHex(hex)).toBe(text);
  });

  it('table creation should work with proper string inputs', () => {
    const table = toTable([
      ['Name', 'Age'],
      ['Alice', '25'],
      ['Bob', '30']
    ]);
    expect(table).toContain('Name');
    expect(table).toContain('Alice');
  });
});

describe('Edge Cases - Additional coverage', () => {
  it('should handle extremely long secure random strings', () => {
    const result = random(1000, { secure: true });
    expect(result.length).toBe(1000);
  });

  it('should handle complex Unicode in validation functions', () => {
    expect(isEmail('user🚀@example.com')).toBe(false); // Emoji in local part should fail
    expect(isEmail('user@example.com')).toBe(true);
  });

  it('should handle malformed HTML entities gracefully', () => {
    expect(decodeHtml('&#;')).toContain('&#;'); // Invalid format
    expect(decodeHtml('&#99999999;')).toBeTruthy(); // Out of range
  });

  it('should handle edge cases in slugify', () => {
    expect(slugify('')).toBe('');
    expect(slugify('---')).toBe('');
    expect(slugify('!!!hello!!!')).toContain('hello');
  });
});

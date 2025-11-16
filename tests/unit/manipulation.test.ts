import { reverse, shuffle, repeat, truncate, pad, wrap, slugify } from '../../src/core/manipulation';

describe('Manipulation functions', () => {
  describe('reverse', () => {
    it('should reverse ASCII strings', () => {
      expect(reverse('hello')).toBe('olleh');
      expect(reverse('world')).toBe('dlrow');
    });

    it('should handle empty string', () => {
      expect(reverse('')).toBe('');
    });

    it('should handle single character', () => {
      expect(reverse('a')).toBe('a');
    });

    it('should handle Unicode properly', () => {
      expect(reverse('🚀🌍')).toBe('🌍🚀');
    });
  });

  describe('shuffle', () => {
    it('should shuffle string characters', () => {
      const original = 'hello';
      const shuffled = shuffle(original);
      
      expect(shuffled).toHaveLength(original.length);
      expect(shuffled.split('').sort()).toEqual(original.split('').sort());
    });

    it('should handle empty string', () => {
      expect(shuffle('')).toBe('');
    });

    it('should handle single character', () => {
      expect(shuffle('a')).toBe('a');
    });
  });

  describe('repeat', () => {
    it('should repeat string', () => {
      expect(repeat('a', 3)).toBe('aaa');
      expect(repeat('hello', 2)).toBe('hellohello');
    });

    it('should repeat with separator', () => {
      expect(repeat('a', 3, '-')).toBe('a-a-a');
      expect(repeat('hello', 2, ' ')).toBe('hello hello');
    });

    it('should handle zero count', () => {
      expect(repeat('hello', 0)).toBe('');
    });

    it('should handle count of 1', () => {
      expect(repeat('hello', 1)).toBe('hello');
    });

    it('should throw on negative count', () => {
      expect(() => repeat('hello', -1)).toThrow('Count must be non-negative');
    });
  });

  describe('truncate', () => {
    it('should truncate strings', () => {
      expect(truncate('hello world', 5)).toBe('he...');
      expect(truncate('hello world', 8)).toBe('hello...');
    });

    it('should not truncate if within length', () => {
      expect(truncate('hello', 10)).toBe('hello');
    });

    it('should respect custom suffix', () => {
      expect(truncate('hello world', 8, { suffix: '…' })).toBe('hello w…');
    });

    it('should preserve words when requested', () => {
      expect(truncate('hello world test', 10, { preserveWords: true })).toBe('hello...');
    });

    it('should handle preserveWords when no words fit', () => {
      expect(truncate('superlongword', 5, { preserveWords: true })).toBe('...');
    });

    it('should handle empty string', () => {
      expect(truncate('', 5)).toBe('');
    });
  });

  describe('pad', () => {
    it('should pad at end by default', () => {
      expect(pad('hello', 8)).toBe('hello   ');
    });

    it('should pad at start', () => {
      expect(pad('hello', 8, ' ', 'start')).toBe('   hello');
    });

    it('should pad at both ends', () => {
      expect(pad('hello', 9, ' ', 'both')).toBe('  hello  ');
    });

    it('should use custom fill string', () => {
      expect(pad('hello', 8, '-')).toBe('hello---');
    });

    it('should not pad if already at length', () => {
      expect(pad('hello', 5)).toBe('hello');
      expect(pad('hello', 3)).toBe('hello');
    });

    it('should handle invalid pad type (default case)', () => {
      expect(pad('hello', 8, '-', 'invalid' as any)).toBe('hello---');
    });
  });

  describe('wrap', () => {
    it('should wrap text at specified width', () => {
      const result = wrap('hello world test', 10);
      const lines = result.split('\n');
      expect(lines).toHaveLength(2);
      expect(lines[0]).toBe('hello');
      expect(lines[1]).toBe('world test');
    });

    it('should handle empty string', () => {
      expect(wrap('', 10)).toBe('');
    });

    it('should throw error on zero or negative width', () => {
      expect(() => wrap('hello world', 0)).toThrow('Width must be a positive number');
      expect(() => wrap('hello world', -5)).toThrow('Width must be a positive number');
    });

    it('should handle single word longer than width', () => {
      const result = wrap('supercalifragilisticexpialidocious', 10);
      expect(result).toBe('supercalifragilisticexpialidocious');
    });

    it('should add indent when specified', () => {
      const result = wrap('hello world', 10, { indent: '  ' });
      const lines = result.split('\n');
      lines.forEach(line => {
        expect(line.startsWith('  ')).toBe(true);
      });
    });

    it('should cut long words when cut option is true', () => {
      const result = wrap('supercalifragilisticexpialidocious', 10, { cut: true });
      const lines = result.split('\n');
      expect(lines).toHaveLength(4); // Word should be broken into multiple lines
      lines.forEach(line => {
        expect(line.length).toBeLessThanOrEqual(10);
      });
    });
  });

  describe('slugify', () => {
    it('should create URL-friendly slugs', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('This is a test!')).toBe('this-is-a-test');
    });

    it('should handle accented characters', () => {
      expect(slugify('Café & Restaurant')).toBe('cafe-restaurant');
      expect(slugify('Niño pequeño')).toBe('nino-pequeno');
    });

    it('should use custom separator', () => {
      expect(slugify('Hello World', { separator: '_' })).toBe('hello_world');
    });

    it('should handle strict mode', () => {
      expect(slugify('Hello!@#World', { strict: true })).toBe('hello-world');
    });

    it('should preserve case when requested', () => {
      expect(slugify('Hello World', { lowercase: false })).toBe('Hello-World');
    });

    it('should handle locale-specific lowercase', () => {
      expect(slugify('HELLO WORLD', { locale: 'en' })).toBe('hello-world');
      expect(slugify('BONJOUR MONDE', { locale: 'fr' })).toBe('bonjour-monde');
    });

    it('should handle empty string', () => {
      expect(slugify('')).toBe('');
    });
  });
});
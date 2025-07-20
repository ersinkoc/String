import { 
  contains, 
  count, 
  indexOfAll, 
  words, 
  chars, 
  codePoints, 
  graphemes 
} from '../../src/core/analysis';

describe('Analysis functions', () => {
  describe('contains', () => {
    it('should check if string contains substring (case sensitive)', () => {
      expect(contains('hello world', 'world')).toBe(true);
      expect(contains('hello world', 'WORLD')).toBe(false);
      expect(contains('hello world', 'xyz')).toBe(false);
    });

    it('should check if string contains substring (case insensitive)', () => {
      expect(contains('Hello World', 'world', false)).toBe(true);
      expect(contains('Hello World', 'WORLD', false)).toBe(true);
      expect(contains('Hello World', 'xyz', false)).toBe(false);
    });

    it('should handle empty strings', () => {
      expect(contains('', 'test')).toBe(false);
      expect(contains('test', '')).toBe(true);
      expect(contains('', '')).toBe(true);
    });
  });

  describe('count', () => {
    it('should count occurrences of substring', () => {
      expect(count('hello world hello', 'hello')).toBe(2);
      expect(count('aaa', 'aa')).toBe(1);
      expect(count('abcabc', 'abc')).toBe(2);
    });

    it('should return 0 for non-existent substring', () => {
      expect(count('hello', 'xyz')).toBe(0);
    });

    it('should handle empty search string', () => {
      expect(count('hello', '')).toBe(0);
    });

    it('should handle overlapping patterns', () => {
      expect(count('aaaa', 'aa')).toBe(2);
    });

    it('should handle empty strings', () => {
      expect(count('', 'test')).toBe(0);
      expect(count('test', '')).toBe(0);
    });
  });

  describe('indexOfAll', () => {
    it('should find all indices of substring', () => {
      expect(indexOfAll('hello world hello', 'hello')).toEqual([0, 12]);
      expect(indexOfAll('abcabcabc', 'abc')).toEqual([0, 3, 6]);
      expect(indexOfAll('aaa', 'a')).toEqual([0, 1, 2]);
    });

    it('should return empty array for non-existent substring', () => {
      expect(indexOfAll('hello', 'xyz')).toEqual([]);
    });

    it('should handle empty search string', () => {
      expect(indexOfAll('hello', '')).toEqual([]);
    });

    it('should handle single character patterns', () => {
      expect(indexOfAll('hello', 'l')).toEqual([2, 3]);
    });

    it('should handle empty strings', () => {
      expect(indexOfAll('', 'test')).toEqual([]);
    });
  });

  describe('words', () => {
    it('should split strings into words', () => {
      expect(words('hello world')).toEqual(['hello', 'world']);
      expect(words('hello, world!')).toEqual(['hello', 'world']);
      expect(words('one two three')).toEqual(['one', 'two', 'three']);
    });

    it('should handle punctuation and special characters', () => {
      expect(words('hello-world_test')).toEqual(['hello', 'world', 'test']);
      expect(words('test123 abc456')).toEqual(['test123', 'abc456']);
    });

    it('should handle Unicode characters', () => {
      expect(words('café résumé')).toEqual(['café', 'résumé']);
      expect(words('你好 世界')).toEqual(['你好', '世界']);
      expect(words('مرحبا بالعالم')).toEqual(['مرحبا', 'بالعالم']);
    });

    it('should handle empty string', () => {
      expect(words('')).toEqual([]);
    });

    it('should handle string with no words', () => {
      expect(words('!@#$%^&*()')).toEqual([]);
      expect(words('   ')).toEqual([]);
    });

    it('should handle locale parameter', () => {
      // Test that it doesn't crash with locale
      expect(words('hello world', 'en')).toEqual(['hello', 'world']);
      expect(words('bonjour monde', 'fr')).toEqual(['bonjour', 'monde']);
    });

    it('should handle invalid locale gracefully', () => {
      expect(words('hello world', 'invalid-locale')).toEqual(['hello', 'world']);
    });
  });

  describe('chars', () => {
    it('should split string into characters', () => {
      expect(chars('hello')).toEqual(['h', 'e', 'l', 'l', 'o']);
      expect(chars('abc')).toEqual(['a', 'b', 'c']);
    });

    it('should handle Unicode characters properly', () => {
      expect(chars('🚀🌍')).toEqual(['🚀', '🌍']);
      expect(chars('café')).toEqual(['c', 'a', 'f', 'é']);
    });

    it('should handle empty string', () => {
      expect(chars('')).toEqual([]);
    });

    it('should handle single character', () => {
      expect(chars('a')).toEqual(['a']);
      expect(chars('🚀')).toEqual(['🚀']);
    });

    it('should handle grapheme clusters', () => {
      // This tests the underlying getGraphemes function
      const result = chars('👨‍👩‍👧‍👦');
      expect(result).toHaveLength(1); // Should be treated as single grapheme cluster
    });
  });

  describe('codePoints', () => {
    it('should return Unicode code points', () => {
      expect(codePoints('hello')).toEqual([104, 101, 108, 108, 111]);
      expect(codePoints('ABC')).toEqual([65, 66, 67]);
    });

    it('should handle Unicode characters', () => {
      expect(codePoints('🚀')).toEqual([128640]);
      expect(codePoints('café')).toEqual([99, 97, 102, 233]);
    });

    it('should handle empty string', () => {
      expect(codePoints('')).toEqual([]);
    });

    it('should handle single character', () => {
      expect(codePoints('A')).toEqual([65]);
    });
  });

  describe('graphemes', () => {
    it('should return grapheme clusters', () => {
      expect(graphemes('hello')).toEqual(['h', 'e', 'l', 'l', 'o']);
      expect(graphemes('abc')).toEqual(['a', 'b', 'c']);
    });

    it('should handle Unicode characters properly', () => {
      expect(graphemes('🚀🌍')).toEqual(['🚀', '🌍']);
      expect(graphemes('café')).toEqual(['c', 'a', 'f', 'é']);
    });

    it('should handle complex grapheme clusters', () => {
      // Family emoji with skin tone modifiers
      const result = graphemes('👨‍👩‍👧‍👦');
      expect(result).toHaveLength(1); // Should be treated as single grapheme cluster
    });

    it('should handle empty string', () => {
      expect(graphemes('')).toEqual([]);
    });

    it('should handle combining characters', () => {
      // é can be composed of e + combining acute accent
      const e_with_accent = 'e\u0301';
      const result = graphemes(e_with_accent);
      expect(result).toHaveLength(1);
      // The result should be a single grapheme, but normalization varies
      expect(result[0]).toContain('e');
    });
  });
});
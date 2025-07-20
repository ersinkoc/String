import { 
  getGraphemes,
  getCodePoints,
  isRtl,
  reverseUnicode,
  normalizeUnicode,
  removeAccents,
  isEmoji,
  stripEmojis,
  getStringWidth 
} from '../../src/utils/unicode';

describe('Unicode utilities', () => {
  describe('getGraphemes', () => {
    it('should split simple ASCII strings into characters', () => {
      expect(getGraphemes('hello')).toEqual(['h', 'e', 'l', 'l', 'o']);
      expect(getGraphemes('abc')).toEqual(['a', 'b', 'c']);
    });

    it('should handle empty string', () => {
      expect(getGraphemes('')).toEqual([]);
    });

    it('should handle single character', () => {
      expect(getGraphemes('a')).toEqual(['a']);
      expect(getGraphemes('🚀')).toEqual(['🚀']);
    });

    it('should handle Unicode characters properly', () => {
      expect(getGraphemes('🚀🌍')).toEqual(['🚀', '🌍']);
      expect(getGraphemes('café')).toEqual(['c', 'a', 'f', 'é']);
    });

    it('should handle grapheme clusters as single units', () => {
      // Family emoji
      const family = '👨‍👩‍👧‍👦';
      const result = getGraphemes(family);
      expect(result).toHaveLength(1);
      expect(result[0]).toBe(family);
    });

    it('should handle combining characters', () => {
      // é composed of e + combining acute accent
      const eCombining = 'e\u0301';
      const result = getGraphemes(eCombining);
      expect(result).toHaveLength(1);
      // The result should be the normalized form, but we don't enforce exact match
      expect(result[0]).toContain('e');
    });

    it('should fallback to string spreading when Intl.Segmenter not available', () => {
      // Mock Intl.Segmenter as undefined
      const originalIntl = (global as any).Intl;
      (global as any).Intl = {};
      
      expect(getGraphemes('hello')).toEqual(['h', 'e', 'l', 'l', 'o']);
      expect(getGraphemes('🚀🌍')).toEqual(['🚀', '🌍']);
      
      // Restore Intl
      (global as any).Intl = originalIntl;
    });
  });

  describe('getCodePoints', () => {
    it('should return Unicode code points for ASCII characters', () => {
      expect(getCodePoints('ABC')).toEqual([65, 66, 67]);
      expect(getCodePoints('hello')).toEqual([104, 101, 108, 108, 111]);
    });

    it('should handle empty string', () => {
      expect(getCodePoints('')).toEqual([]);
    });

    it('should handle Unicode characters', () => {
      expect(getCodePoints('🚀')).toEqual([128640]);
      expect(getCodePoints('café')).toEqual([99, 97, 102, 233]);
    });

    it('should handle high Unicode code points', () => {
      expect(getCodePoints('𝔘')).toEqual([120088]); // Mathematical double-struck U
    });

    it('should handle null character', () => {
      expect(getCodePoints('\x00')).toEqual([0]);
    });
  });

  describe('isRtl', () => {
    it('should detect RTL scripts', () => {
      expect(isRtl('مرحبا')).toBe(true); // Arabic
      expect(isRtl('שלום')).toBe(true); // Hebrew
      expect(isRtl('Hello مرحبا')).toBe(true); // Mixed with RTL
    });

    it('should return false for LTR scripts', () => {
      expect(isRtl('hello')).toBe(false); // English
      expect(isRtl('bonjour')).toBe(false); // French
      expect(isRtl('你好')).toBe(false); // Chinese
      expect(isRtl('こんにちは')).toBe(false); // Japanese
    });

    it('should handle empty string', () => {
      expect(isRtl('')).toBe(false);
    });

    it('should handle numbers and punctuation', () => {
      expect(isRtl('123')).toBe(false);
      expect(isRtl('!@#$%')).toBe(false);
    });
  });

  describe('reverseUnicode', () => {
    it('should reverse ASCII strings', () => {
      expect(reverseUnicode('hello')).toBe('olleh');
      expect(reverseUnicode('abc')).toBe('cba');
    });

    it('should handle empty string', () => {
      expect(reverseUnicode('')).toBe('');
    });

    it('should reverse Unicode characters properly', () => {
      expect(reverseUnicode('🚀🌍')).toBe('🌍🚀');
      expect(reverseUnicode('café')).toBe('éfac');
    });

    it('should handle single character', () => {
      expect(reverseUnicode('a')).toBe('a');
      expect(reverseUnicode('🚀')).toBe('🚀');
    });

    it('should preserve grapheme clusters when reversing', () => {
      // This should keep complex emojis as single units
      const family = '👨‍👩‍👧‍👦';
      const text = `hello${family}world`;
      const reversed = reverseUnicode(text);
      expect(reversed).toContain(family); // Family emoji should stay intact
    });
  });

  describe('normalizeUnicode', () => {
    it('should normalize using NFC by default', () => {
      const result = normalizeUnicode('é'); // precomposed
      expect(result).toBe('é');
    });

    it('should handle different normalization forms', () => {
      const eWithAccent = 'e\u0301'; // e + combining acute
      expect(normalizeUnicode(eWithAccent, 'NFC')).toBe('é');
      expect(normalizeUnicode('é', 'NFD')).toBe('e\u0301');
    });

    it('should handle empty string', () => {
      expect(normalizeUnicode('')).toBe('');
    });

    it('should handle NFKC and NFKD forms', () => {
      expect(normalizeUnicode('ﬁ', 'NFKC')).toBe('fi'); // ligature to regular
      expect(normalizeUnicode('½', 'NFKD')).toBe('1⁄2'); // fraction decomposition
    });
  });

  describe('removeAccents', () => {
    it('should remove accents from characters', () => {
      expect(removeAccents('café')).toBe('cafe');
      expect(removeAccents('naïve')).toBe('naive');
      expect(removeAccents('résumé')).toBe('resume');
    });

    it('should handle empty string', () => {
      expect(removeAccents('')).toBe('');
    });

    it('should handle non-string input', () => {
      expect(removeAccents(null as any)).toBe('');
      expect(removeAccents(undefined as any)).toBe('');
      expect(removeAccents(123 as any)).toBe('');
    });

    it('should handle mixed text', () => {
      expect(removeAccents('Café résumé naïve')).toBe('Cafe resume naive');
    });

    it('should keep non-accented characters unchanged', () => {
      expect(removeAccents('hello world 123')).toBe('hello world 123');
    });

    it('should handle various accent types', () => {
      expect(removeAccents('àáâãäå')).toBe('aaaaaa');
      expect(removeAccents('èéêë')).toBe('eeee');
      expect(removeAccents('ìíîï')).toBe('iiii');
    });

    it('should preserve special characters that are not accents', () => {
      expect(removeAccents('æøå')).toContain('æ'); // æ is not just an accented a
      expect(removeAccents('æøå')).toContain('ø'); // ø is not just an accented o
    });
  });

  describe('isEmoji', () => {
    it('should detect basic emojis', () => {
      expect(isEmoji('😀')).toBe(true);
      expect(isEmoji('🚀')).toBe(true);
      expect(isEmoji('🌍')).toBe(true);
    });

    it('should detect copyright and registered symbols', () => {
      expect(isEmoji('©')).toBe(true);
      expect(isEmoji('®')).toBe(true);
    });

    it('should return false for regular characters', () => {
      expect(isEmoji('a')).toBe(false);
      expect(isEmoji('A')).toBe(false);
      expect(isEmoji('1')).toBe(false);
    });

    it('should return false for punctuation', () => {
      expect(isEmoji('!')).toBe(false);
      expect(isEmoji('?')).toBe(false);
      expect(isEmoji('.')).toBe(false);
    });

    it('should handle empty string', () => {
      expect(isEmoji('')).toBe(false);
    });

    it('should detect complex emojis', () => {
      expect(isEmoji('👨‍👩‍👧‍👦')).toBe(true); // Family emoji
    });
  });

  describe('stripEmojis', () => {
    it('should remove emojis from text', () => {
      expect(stripEmojis('Hello 😀 World')).toBe('Hello  World');
      expect(stripEmojis('🚀 Launch time! 🌍')).toBe(' Launch time! ');
    });

    it('should handle text with no emojis', () => {
      expect(stripEmojis('Hello World')).toBe('Hello World');
    });

    it('should handle empty string', () => {
      expect(stripEmojis('')).toBe('');
    });

    it('should handle text with only emojis', () => {
      expect(stripEmojis('😀🚀🌍')).toBe('');
    });

    it('should remove copyright and registered symbols', () => {
      expect(stripEmojis('Company © 2023')).toBe('Company  2023');
      expect(stripEmojis('Brand ® Name')).toBe('Brand  Name');
    });

    it('should handle complex emojis', () => {
      expect(stripEmojis('Family: 👨‍👩‍👧‍👦')).toBe('Family: ');
    });
  });

  describe('getStringWidth', () => {
    it('should calculate width for ASCII characters', () => {
      expect(getStringWidth('hello')).toBe(5);
      expect(getStringWidth('ABC')).toBe(3);
    });

    it('should handle empty string', () => {
      expect(getStringWidth('')).toBe(0);
    });

    it('should calculate width for full-width characters', () => {
      expect(getStringWidth('你好')).toBe(4); // Chinese characters are typically 2 units wide
      expect(getStringWidth('こんにちは')).toBe(10); // Japanese characters
    });

    it('should handle mixed ASCII and full-width characters', () => {
      const mixed = 'Hello世界';
      const width = getStringWidth(mixed);
      expect(width).toBeGreaterThan(5); // More than just ASCII
    });

    it('should handle control characters', () => {
      expect(getStringWidth('\x00\x01\x02')).toBe(0); // Control chars have no width
    });

    it('should handle emojis', () => {
      const width = getStringWidth('🚀🌍');
      expect(width).toBeGreaterThan(0);
    });

    it('should handle whitespace', () => {
      expect(getStringWidth(' ')).toBe(1);
      expect(getStringWidth('   ')).toBe(3);
    });

    it('should handle combining characters', () => {
      const eCombining = 'e\u0301'; // e + combining acute = é
      expect(getStringWidth(eCombining)).toBe(1);
    });
  });
});
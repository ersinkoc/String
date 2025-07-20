import { isEmail, isUrl, isUuid, isHexColor, isBase64, isJson, isNumeric, isAlpha, isAlphanumeric, isEmpty } from '../../src/core/validation';

describe('Validation functions', () => {
  describe('isEmail', () => {
    it('should validate correct emails', () => {
      expect(isEmail('test@example.com')).toBe(true);
      expect(isEmail('user.name@domain.co.uk')).toBe(true);
      expect(isEmail('user+tag@example.org')).toBe(true);
      expect(isEmail('user123@example123.com')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(isEmail('invalid.email')).toBe(false);
      expect(isEmail('@example.com')).toBe(false);
      expect(isEmail('user@')).toBe(false);
      expect(isEmail('user@@example.com')).toBe(false);
      expect(isEmail('')).toBe(false);
    });
  });

  describe('isUrl', () => {
    it('should validate URLs with protocol', () => {
      expect(isUrl('https://example.com')).toBe(true);
      expect(isUrl('http://example.com')).toBe(true);
      expect(isUrl('ftp://files.example.com')).toBe(true);
    });

    it('should validate URLs without protocol when allowed', () => {
      expect(isUrl('example.com', { requireProtocol: false })).toBe(true);
      expect(isUrl('www.example.com', { requireProtocol: false })).toBe(true);
    });

    it('should reject URLs without protocol when required', () => {
      expect(isUrl('example.com', { requireProtocol: true })).toBe(false);
      expect(isUrl('www.example.com', { requireProtocol: true })).toBe(false);
    });

    it('should handle underscore option', () => {
      expect(isUrl('http://under_score.com', { allowUnderscore: true })).toBe(true);
      expect(isUrl('http://under_score.com', { allowUnderscore: false })).toBe(false);
    });

    it('should reject URLs with disallowed protocols', () => {
      expect(isUrl('file://test.txt', { allowProtocols: ['http', 'https'] })).toBe(false);
      expect(isUrl('javascript:alert(1)', { allowProtocols: ['http', 'https'] })).toBe(false);
    });

    it('should reject URLs with trailing dots when not allowed', () => {
      expect(isUrl('http://example.com.', { allowTrailingDot: false })).toBe(false);
      expect(isUrl('http://example.com.', { allowTrailingDot: true })).toBe(true);
    });

    it('should reject invalid domain formats without protocol', () => {
      expect(isUrl('invalid-domain', { requireProtocol: false })).toBe(false);
      expect(isUrl('no-tld', { requireProtocol: false })).toBe(false);
      expect(isUrl('invalid:url:format', { requireProtocol: false })).toBe(false);
    });

    it('should handle URLs that fail both primary and fallback parsing', () => {
      expect(isUrl('http://', { requireProtocol: false })).toBe(false);
      expect(isUrl('[invalid]', { requireProtocol: false })).toBe(false);
      expect(isUrl('\\\\invalid\\path', { requireProtocol: false })).toBe(false);
    });

    it('should reject invalid URLs', () => {
      expect(isUrl('not-a-url')).toBe(false);
      expect(isUrl('')).toBe(false);
      expect(isUrl('http://')).toBe(false);
    });
  });

  describe('isUuid', () => {
    it('should validate UUIDs', () => {
      expect(isUuid('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
      expect(isUuid('6ba7b810-9dad-11d1-80b4-00c04fd430c8')).toBe(true);
      expect(isUuid('6ba7b811-9dad-11d1-80b4-00c04fd430c8')).toBe(true);
    });

    it('should validate specific UUID versions', () => {
      expect(isUuid('6ba7b810-9dad-11d1-80b4-00c04fd430c8', 1)).toBe(true);
      expect(isUuid('6ba7b812-9dad-31d1-80b4-00c04fd430c8', 3)).toBe(true);
      expect(isUuid('6ba7b814-9dad-41d1-80b4-00c04fd430c8', 4)).toBe(true);
    });

    it('should reject invalid UUIDs', () => {
      expect(isUuid('not-a-uuid')).toBe(false);
      expect(isUuid('550e8400-e29b-41d4-a716')).toBe(false);
      expect(isUuid('')).toBe(false);
      expect(isUuid('550e8400-e29b-41d4-a716-44665544000g')).toBe(false);
    });
  });

  describe('isHexColor', () => {
    it('should validate hex colors', () => {
      expect(isHexColor('#ff0000')).toBe(true);
      expect(isHexColor('#f00')).toBe(true);
      expect(isHexColor('#FF0000')).toBe(true);
      expect(isHexColor('#00ff00aa')).toBe(true);
    });

    it('should reject invalid hex colors', () => {
      expect(isHexColor('ff0000')).toBe(false);
      expect(isHexColor('#gg0000')).toBe(false);
      expect(isHexColor('#f')).toBe(false);
      expect(isHexColor('')).toBe(false);
    });
  });

  describe('isBase64', () => {
    it('should validate base64 strings', () => {
      expect(isBase64('SGVsbG8gV29ybGQ=')).toBe(true);
      expect(isBase64('SGVsbG8=')).toBe(true);
      expect(isBase64('SGVsbG8')).toBe(false); // Invalid padding
    });

    it('should reject invalid base64', () => {
      expect(isBase64('Hello World')).toBe(false);
      expect(isBase64('SGVsbG8gV29ybGQ')).toBe(false); // Wrong length
      expect(isBase64('')).toBe(false);
    });
  });

  describe('isJson', () => {
    it('should validate JSON strings', () => {
      expect(isJson('{}')).toBe(true);
      expect(isJson('{"key": "value"}')).toBe(true);
      expect(isJson('[]')).toBe(true);
      expect(isJson('[1, 2, 3]')).toBe(true);
      expect(isJson('null')).toBe(true);
      expect(isJson('true')).toBe(true);
      expect(isJson('123')).toBe(true);
      expect(isJson('"string"')).toBe(true);
    });

    it('should reject invalid JSON', () => {
      expect(isJson('{key: value}')).toBe(false);
      expect(isJson("{'key': 'value'}")).toBe(false);
      expect(isJson('')).toBe(false);
      expect(isJson('undefined')).toBe(false);
    });
  });

  describe('isNumeric', () => {
    it('should validate numeric strings', () => {
      expect(isNumeric('123')).toBe(true);
      expect(isNumeric('123.45')).toBe(true);
      expect(isNumeric('-123')).toBe(true);
      expect(isNumeric('-123.45')).toBe(true);
      expect(isNumeric('0')).toBe(true);
    });

    it('should reject non-numeric strings', () => {
      expect(isNumeric('abc')).toBe(false);
      expect(isNumeric('123abc')).toBe(false);
      expect(isNumeric('')).toBe(false);
      expect(isNumeric('Infinity')).toBe(false);
      expect(isNumeric('NaN')).toBe(false);
    });
  });

  describe('isAlpha', () => {
    it('should validate alphabetic strings', () => {
      expect(isAlpha('abc')).toBe(true);
      expect(isAlpha('ABC')).toBe(true);
      expect(isAlpha('AbC')).toBe(true);
    });

    it('should reject non-alphabetic strings', () => {
      expect(isAlpha('abc123')).toBe(false);
      expect(isAlpha('123')).toBe(false);
      expect(isAlpha('abc!')).toBe(false);
      expect(isAlpha('')).toBe(false);
      expect(isAlpha('abc def')).toBe(false);
    });

    it('should handle locale-specific characters', () => {
      expect(isAlpha('café', 'fr')).toBe(true);
      expect(isAlpha('niño', 'es')).toBe(true);
    });
  });

  describe('isAlphanumeric', () => {
    it('should validate alphanumeric strings', () => {
      expect(isAlphanumeric('abc123')).toBe(true);
      expect(isAlphanumeric('ABC123')).toBe(true);
      expect(isAlphanumeric('abc')).toBe(true);
      expect(isAlphanumeric('123')).toBe(true);
    });

    it('should reject non-alphanumeric strings', () => {
      expect(isAlphanumeric('abc!')).toBe(false);
      expect(isAlphanumeric('abc 123')).toBe(false);
      expect(isAlphanumeric('')).toBe(false);
      expect(isAlphanumeric('abc-123')).toBe(false);
    });

    it('should handle locale-specific alphanumeric characters', () => {
      expect(isAlphanumeric('café123', 'fr')).toBe(true);
      expect(isAlphanumeric('niño123', 'es')).toBe(true);
      expect(isAlphanumeric('schön123', 'de')).toBe(true);
      expect(isAlphanumeric('città123', 'it')).toBe(true);
      expect(isAlphanumeric('coração123', 'pt')).toBe(true);
      expect(isAlphanumeric('abc123', 'en')).toBe(true);
    });
  });

  describe('isEmpty', () => {
    it('should check if string is empty', () => {
      expect(isEmpty('')).toBe(true);
      expect(isEmpty('hello')).toBe(false);
    });

    it('should handle whitespace option', () => {
      expect(isEmpty('   ', { ignoreWhitespace: true })).toBe(true);
      expect(isEmpty('   ', { ignoreWhitespace: false })).toBe(false);
      expect(isEmpty('\t\n', { ignoreWhitespace: true })).toBe(true);
    });
  });
});
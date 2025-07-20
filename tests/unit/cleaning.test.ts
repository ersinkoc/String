import { 
  trim, 
  trimStart, 
  trimEnd, 
  removeExtraSpaces, 
  normalizeWhitespace, 
  removeNonPrintable, 
  stripHtml, 
  stripAnsi, 
  removeAccents 
} from '../../src/core/cleaning';

describe('Cleaning functions', () => {
  describe('trim', () => {
    it('should trim whitespace by default', () => {
      expect(trim('  hello world  ')).toBe('hello world');
      expect(trim('\t\nhello\t\n')).toBe('hello');
    });

    it('should trim specific characters', () => {
      expect(trim('...hello...', '.')).toBe('hello');
      expect(trim('###hello###', '#')).toBe('hello');
      expect(trim('abchelloabc', 'abc')).toBe('hello');
    });

    it('should handle empty string', () => {
      expect(trim('')).toBe('');
      expect(trim('', '.')).toBe('');
    });

    it('should handle string with only trim characters', () => {
      expect(trim('...', '.')).toBe('');
      expect(trim('   ')).toBe('');
    });
  });

  describe('trimStart', () => {
    it('should trim whitespace from start by default', () => {
      expect(trimStart('  hello world  ')).toBe('hello world  ');
      expect(trimStart('\t\nhello\t\n')).toBe('hello\t\n');
    });

    it('should trim specific characters from start', () => {
      expect(trimStart('...hello...', '.')).toBe('hello...');
      expect(trimStart('###hello###', '#')).toBe('hello###');
    });

    it('should handle empty string', () => {
      expect(trimStart('')).toBe('');
      expect(trimStart('', '.')).toBe('');
    });
  });

  describe('trimEnd', () => {
    it('should trim whitespace from end by default', () => {
      expect(trimEnd('  hello world  ')).toBe('  hello world');
      expect(trimEnd('\t\nhello\t\n')).toBe('\t\nhello');
    });

    it('should trim specific characters from end', () => {
      expect(trimEnd('...hello...', '.')).toBe('...hello');
      expect(trimEnd('###hello###', '#')).toBe('###hello');
    });

    it('should handle empty string', () => {
      expect(trimEnd('')).toBe('');
      expect(trimEnd('', '.')).toBe('');
    });
  });

  describe('removeExtraSpaces', () => {
    it('should remove extra spaces', () => {
      expect(removeExtraSpaces('hello    world')).toBe('hello world');
      expect(removeExtraSpaces('  hello   world  ')).toBe('hello world');
    });

    it('should handle tabs and newlines', () => {
      expect(removeExtraSpaces('hello\t\tworld')).toBe('hello world');
      expect(removeExtraSpaces('hello\n\nworld')).toBe('hello world');
    });

    it('should handle empty string', () => {
      expect(removeExtraSpaces('')).toBe('');
      expect(removeExtraSpaces('   ')).toBe('');
    });

    it('should handle single spaces', () => {
      expect(removeExtraSpaces('hello world')).toBe('hello world');
    });
  });

  describe('normalizeWhitespace', () => {
    it('should normalize all whitespace types', () => {
      expect(normalizeWhitespace('hello\t\nworld')).toBe('hello world');
      expect(normalizeWhitespace('hello\r\fworld')).toBe('hello world');
      expect(normalizeWhitespace('hello\vworld')).toBe('hello world');
    });

    it('should remove extra spaces and trim', () => {
      expect(normalizeWhitespace('  hello   \t\n  world  ')).toBe('hello world');
    });

    it('should handle empty string', () => {
      expect(normalizeWhitespace('')).toBe('');
      expect(normalizeWhitespace('\t\n\r\f\v')).toBe('');
    });
  });

  describe('removeNonPrintable', () => {
    it('should remove non-printable characters', () => {
      expect(removeNonPrintable('hello\x00world')).toBe('helloworld');
      expect(removeNonPrintable('hello\x01\x02world')).toBe('helloworld');
    });

    it('should keep printable characters', () => {
      expect(removeNonPrintable('hello world 123!@#')).toBe('hello world 123!@#');
    });

    it('should handle empty string', () => {
      expect(removeNonPrintable('')).toBe('');
    });

    it('should remove control characters', () => {
      expect(removeNonPrintable('hello\x7Fworld')).toBe('helloworld');
      expect(removeNonPrintable('hello\x9Fworld')).toBe('helloworld');
    });
  });

  describe('stripHtml', () => {
    it('should remove HTML tags', () => {
      expect(stripHtml('<p>hello world</p>')).toBe('hello world');
      expect(stripHtml('<div class="test">content</div>')).toBe('content');
    });

    it('should remove script and style tags completely', () => {
      expect(stripHtml('<script>alert("test")</script>hello')).toBe('hello');
      expect(stripHtml('<style>body{color:red}</style>hello')).toBe('hello');
    });

    it('should decode HTML entities', () => {
      expect(stripHtml('&lt;test&gt;')).toBe('<test>');
      expect(stripHtml('&amp;&quot;&apos;')).toBe('&"\'');
      expect(stripHtml('&nbsp;&copy;&reg;&trade;')).toBe(' ©®™');
    });

    it('should leave unknown HTML entities unchanged', () => {
      expect(stripHtml('<p>Hello &unknownentity; World</p>')).toBe('Hello &unknownentity; World');
    });

    it('should handle complex HTML', () => {
      const html = '<div><p>Hello <strong>world</strong>!</p><br/></div>';
      expect(stripHtml(html)).toBe('Hello world!');
    });

    it('should handle empty string', () => {
      expect(stripHtml('')).toBe('');
    });

    it('should handle self-closing tags', () => {
      expect(stripHtml('Hello<br/>world')).toBe('Helloworld');
      expect(stripHtml('Hello<img src="test.jpg"/>world')).toBe('Helloworld');
    });
  });

  describe('stripAnsi', () => {
    it('should remove ANSI escape codes', () => {
      expect(stripAnsi('\x1b[31mhello\x1b[0m')).toBe('hello');
      expect(stripAnsi('\x1b[1;32mgreen\x1b[0m')).toBe('green');
    });

    it('should handle multiple ANSI codes', () => {
      expect(stripAnsi('\x1b[31m\x1b[1mhello\x1b[0m\x1b[0m')).toBe('hello');
    });

    it('should handle empty string', () => {
      expect(stripAnsi('')).toBe('');
    });

    it('should keep regular text', () => {
      expect(stripAnsi('hello world')).toBe('hello world');
    });

    it('should handle complex ANSI sequences', () => {
      expect(stripAnsi('\x1b[38;5;208mhello\x1b[0m')).toBe('hello');
    });
  });

  describe('removeAccents', () => {
    it('should remove accents from characters', () => {
      expect(removeAccents('café')).toBe('cafe');
      expect(removeAccents('naïve')).toBe('naive');
      expect(removeAccents('résumé')).toBe('resume');
    });

    it('should handle various accent types', () => {
      expect(removeAccents('àáâãäåæçèéêë')).toBe('aaaaaaæceeee');
      expect(removeAccents('ìíîïñòóôõöø')).toBe('iiiinoooooø');
      expect(removeAccents('ùúûüýÿ')).toBe('uuuuyy');
    });

    it('should handle uppercase accented characters', () => {
      expect(removeAccents('ÀÁÂÃÄÅÆÇÈÉÊË')).toBe('AAAAAAÆCEEEE');
    });

    it('should keep non-accented characters', () => {
      expect(removeAccents('hello world 123')).toBe('hello world 123');
    });

    it('should handle empty string', () => {
      expect(removeAccents('')).toBe('');
    });

    it('should handle mixed text', () => {
      expect(removeAccents('Café niño résumé')).toBe('Cafe nino resume');
    });
  });
});
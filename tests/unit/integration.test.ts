import { Str, chain, core, createPlugin } from '../../src/index';

describe('Integration Tests', () => {
  describe('Cross-module functionality', () => {
    it('should work seamlessly across different modules', () => {
      const input = '  <h1>Hello, Café & Restaurant!</h1>  ';
      
      // Chain multiple operations from different modules
      const result = chain(input)
        .stripHtml()           // cleaning
        .trim()               // cleaning
        .removeAccents()      // cleaning
        .slugify()            // manipulation
        .value();
      
      expect(result).toBe('hello-cafe-restaurant');
    });

    it('should handle complex text processing workflows', () => {
      const userInput = `
        <script>alert('xss')</script>
        <p>Welcome to "Café & Niño's Restaurant"!</p>
        Contact: admin@example.com
        Phone: +1 (555) 123-4567
        Visit: https://example.com
      `;

      // Step 1: Security and cleaning
      const cleaned = chain(userInput)
        .stripHtml()
        .trim()
        .normalizeWhitespace()
        .value();

      // Step 2: Extract information
      const emails = Str.extractEmails(cleaned);
      const urls = Str.extractUrls(cleaned);
      const words = Str.words(cleaned);

      // Step 3: Generate metadata
      const metadata = {
        wordCount: words.length,
        readingTime: Math.ceil(words.length / 200),
        hasEmails: emails.length > 0,
        hasUrls: urls.length > 0,
        sentiment: cleaned.includes('Welcome') ? 'positive' : 'neutral'
      };

      // Step 4: Create summary
      const summary = Str.truncate(cleaned, 100, { preserveWords: true });
      const slug = Str.slugify(summary);

      expect(cleaned).not.toContain('<script>');
      expect(emails).toContain('admin@example.com');
      expect(urls).toContain('https://example.com');
      expect(metadata.wordCount).toBeGreaterThan(0);
      expect(summary.length).toBeLessThanOrEqual(103); // 100 + '...'
      expect(slug).toMatch(/^[a-z0-9-]+$/);
    });

    it('should handle multilingual content processing', () => {
      const multilingualContent = {
        en: 'Hello, World! How are you today?',
        es: 'Hola, Mundo! ¿Cómo estás hoy?',
        fr: 'Bonjour, Monde! Comment ça va aujourd\'hui?',
        de: 'Hallo, Welt! Wie geht es dir heute?',
        ja: 'こんにちは、世界！今日はいかがですか？',
        ar: 'مرحبا بالعالم! كيف حالك اليوم؟'
      };

      Object.entries(multilingualContent).forEach(([lang, text]) => {
        // Process each language
        const processed = {
          original: text,
          cleaned: Str.removeAccents(Str.normalizeWhitespace(text)),
          slug: Str.slugify(text),
          wordCount: Str.words(text).length,
          charCount: text.length,
          reversed: Str.reverse(text),
          similarity: Str.similarity(text, multilingualContent.en)
        };

        expect(processed.cleaned).toBeTruthy();
        expect(processed.slug).toMatch(/^[a-z0-9-]*$/);
        expect(processed.wordCount).toBeGreaterThan(0);
        expect(processed.charCount).toBeGreaterThan(0);
        expect(processed.reversed).toBeTruthy();
        expect(processed.similarity).toBeGreaterThanOrEqual(0);
        expect(processed.similarity).toBeLessThanOrEqual(1);
      });
    });
  });

  describe('API consistency', () => {
    it('should produce consistent results across all API styles', () => {
      const testString = '  Hello, World!  ';
      
      // Functional API
      const functional = Str.toCamelCase(Str.trim(testString));
      
      // Chainable API
      const chainable = chain(testString).trim().toCamelCase().value();
      
      // Static class API (same as functional)
      const staticClass = Str.toCamelCase(Str.trim(testString));

      expect(functional).toBe(chainable);
      expect(functional).toBe(staticClass);
      expect(chainable).toBe(staticClass);
    });

    it('should handle all transformation operations consistently', () => {
      const testCases = [
        'hello world',
        'Hello-World',
        'hello_world',
        'HelloWorld',
        'HELLO WORLD',
        'hello   world',
        '  hello world  '
      ];

      testCases.forEach(testCase => {
        // Test that all APIs produce the same results
        const operations = [
          'toCamelCase',
          'toPascalCase', 
          'toSnakeCase',
          'toKebabCase',
          'toConstantCase'
        ];

        operations.forEach(operation => {
          const functional = Str[operation as keyof typeof Str](Str.trim(testCase)) as string;
          const chainable = chain(testCase).trim()[operation as keyof typeof chain]().value();
          
          expect(functional).toBe(chainable);
        });
      });
    });
  });

  describe('Performance under load', () => {
    it('should handle large strings efficiently', () => {
      const largeString = 'Hello World! '.repeat(10000); // ~130KB string
      
      const startTime = performance.now();
      
      const result = chain(largeString)
        .trim()
        .normalizeWhitespace()
        .toCamelCase()
        .truncate(1000)
        .value();
      
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      
      expect(result).toBeTruthy();
      expect(result.length).toBeLessThanOrEqual(1003); // 1000 + '...'
      expect(executionTime).toBeLessThan(1000); // Should complete in <1 second
    });

    it('should handle many small operations efficiently', () => {
      const testStrings = Array.from({ length: 1000 }, (_, i) => `test string ${i}`);
      
      const startTime = performance.now();
      
      const results = testStrings.map(str => 
        chain(str)
          .toCamelCase()
          .reverse()
          .slugify()
          .value()
      );
      
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      
      expect(results).toHaveLength(1000);
      expect(results.every(r => typeof r === 'string')).toBe(true);
      expect(executionTime).toBeLessThan(1000); // Should complete in <1 second
    });
  });

  describe('Plugin integration', () => {
    beforeEach(() => {
      // Clear any existing plugins
      const pluginNames = core.listPlugins();
      // Note: We can't actually remove plugins in current implementation
      // This is just a conceptual test
    });

    it('should integrate plugins with core functionality', () => {
      const testPlugin = createPlugin('test-integration', '1.0.0', (core) => {
        core.extend('processBusinessText', (text: string) => {
          return chain(text)
            .trim()
            .toTitleCase()
            .value()
            .replace(/\b(Inc|Corp|LLC|Ltd)\b/gi, match => match.toUpperCase());
        });
      });

      core.use(testPlugin);
      
      const processBusinessText = core.getExtension('processBusinessText');
      expect(processBusinessText).toBeTruthy();
      
      if (processBusinessText) {
        const result = processBusinessText('  acme corp  ');
        expect(result).toBe('Acme CORP');
      }
    });

    it('should handle plugin dependencies', () => {
      let coreInstance: any;
      
      const basePlugin = createPlugin('base', '1.0.0', (core) => {
        coreInstance = core;
        core.extend('baseMethod', (str: string) => str.toUpperCase());
      });

      const dependentPlugin = createPlugin('dependent', '1.0.0', (core) => {
        core.extend('dependentMethod', (str: string) => {
          const baseMethod = core.getExtension('baseMethod');
          return baseMethod ? baseMethod(str) + '!' : str + '!';
        });
      });

      core.use(basePlugin);
      core.use(dependentPlugin);

      const dependentMethod = core.getExtension('dependentMethod');
      if (dependentMethod) {
        expect(dependentMethod('hello')).toBe('HELLO!');
      }
    });
  });

  describe('Error resilience', () => {
    it('should handle edge cases gracefully', () => {
      const edgeCases = [
        '',
        ' ',
        '\n',
        '\t',
        '\r\n',
        '   \t\n  ',
        null as any,
        undefined as any,
        0 as any,
        false as any,
        {} as any,
        [] as any
      ];

      edgeCases.forEach(edgeCase => {
        expect(() => {
          // These should not throw errors
          Str.toCamelCase(edgeCase);
          Str.trim(edgeCase);
          Str.isEmail(edgeCase);
          Str.slugify(edgeCase);
        }).not.toThrow();
      });
    });

    it('should handle malformed input gracefully', () => {
      const malformedInputs = [
        '<><><>invalid html<><><>',
        'invalid\\x00\\x01control\\x02chars',
        '🚀🌍👨‍👩‍👧‍👦🦄🌈', // Complex emoji
        'a'.repeat(100000), // Very long string
        'email@'.repeat(1000), // Malformed repeated pattern
        '\uFEFF\u200B\u200C\u200D', // Zero-width characters
        '💩'.repeat(1000) // Emoji repetition
      ];

      malformedInputs.forEach(input => {
        expect(() => {
          const result = chain(input)
            .trim()
            .stripHtml()
            .removeNonPrintable()
            .normalizeWhitespace()
            .slugify()
            .value();
          
          expect(typeof result).toBe('string');
        }).not.toThrow();
      });
    });

    it('should maintain type safety with invalid inputs', () => {
      // Test that functions return expected types even with bad input
      expect(typeof Str.toCamelCase('')).toBe('string');
      expect(typeof Str.isEmail('invalid')).toBe('boolean');
      expect(Array.isArray(Str.words(''))).toBe(true);
      expect(typeof Str.count('', 'x')).toBe('number');
      expect(typeof Str.similarity('', '')).toBe('number');
    });
  });

  describe('Real-world scenarios', () => {
    it('should handle form validation workflow', () => {
      const formData = {
        email: '  USER@EXAMPLE.COM  ',
        password: 'mypassword123',
        confirmPassword: 'mypassword123',
        firstName: '  john  ',
        lastName: '  doe  ',
        website: 'example.com',
        phone: '+1 (555) 123-4567'
      };

      // Validation workflow
      const validation = {
        email: {
          cleaned: Str.trim(formData.email.toLowerCase()),
          isValid: Str.isEmail(Str.trim(formData.email))
        },
        passwords: {
          match: formData.password === formData.confirmPassword,
          strength: formData.password.length >= 8
        },
        name: {
          formatted: Str.toTitleCase(`${Str.trim(formData.firstName)} ${Str.trim(formData.lastName)}`)
        },
        website: {
          isValid: Str.isUrl(formData.website, { requireProtocol: false })
        },
        phone: {
          cleaned: formData.phone.replace(/\D/g, ''),
          isValid: formData.phone.replace(/\D/g, '').length === 11
        }
      };

      expect(validation.email.cleaned).toBe('user@example.com');
      expect(validation.email.isValid).toBe(true);
      expect(validation.passwords.match).toBe(true);
      expect(validation.passwords.strength).toBe(true);
      expect(validation.name.formatted).toBe('John Doe');
      expect(validation.website.isValid).toBe(true);
      expect(validation.phone.cleaned).toBe('15551234567');
      expect(validation.phone.isValid).toBe(true);
    });

    it('should handle content processing workflow', () => {
      const article = {
        title: '  How to Build Amazing Web Applications!  ',
        content: `
          <h1>Introduction</h1>
          <p>Building web applications requires careful planning and <strong>attention to detail</strong>.</p>
          <p>Contact us at info@webdev.com for more information.</p>
          <script>alert('This should be removed');</script>
          <p>Visit our website at https://webdev.com for tutorials.</p>
        `,
        tags: ['  web development  ', '  JavaScript  ', '  react  ']
      };

      // Process article
      const processed = {
        title: {
          cleaned: Str.trim(article.title),
          slug: Str.slugify(article.title)
        },
        content: {
          sanitized: Str.stripHtml(article.content),
          cleaned: Str.normalizeWhitespace(Str.stripHtml(article.content)),
          excerpt: Str.truncate(Str.stripHtml(article.content), 150, { preserveWords: true }),
          emails: Str.extractEmails(article.content),
          urls: Str.extractUrls(article.content),
          wordCount: Str.words(Str.stripHtml(article.content)).length
        },
        tags: {
          normalized: article.tags.map(tag => Str.slugify(Str.trim(tag))),
          formatted: article.tags.map(tag => Str.toTitleCase(Str.trim(tag)))
        }
      };

      expect(processed.title.cleaned).toBe('How to Build Amazing Web Applications!');
      expect(processed.title.slug).toBe('how-to-build-amazing-web-applications');
      expect(processed.content.sanitized).not.toContain('<script>');
      expect(processed.content.sanitized).not.toContain('alert');
      expect(processed.content.emails).toContain('info@webdev.com');
      expect(processed.content.urls).toContain('https://webdev.com');
      expect(processed.content.wordCount).toBeGreaterThan(0);
      expect(processed.tags.normalized).toEqual(['web-development', 'javascript', 'react']);
      expect(processed.tags.formatted).toEqual(['Web Development', 'Javascript', 'React']);
    });
  });
});
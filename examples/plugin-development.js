// Plugin development examples for @oxog/string

const { core, createPlugin, Str } = require('@oxog/string');

console.log('=== Plugin Development Examples ===\n');

// Example 1: Simple Text Transform Plugin
console.log('1. Simple Text Transform Plugin:');

const textTransformPlugin = createPlugin('text-transform', '1.0.0', (core) => {
  core.extend('l33tSpeak', (str) => {
    return str
      .replace(/e/gi, '3')
      .replace(/a/gi, '4')
      .replace(/o/gi, '0')
      .replace(/i/gi, '1')
      .replace(/s/gi, '5')
      .replace(/t/gi, '7');
  });
  
  core.extend('alternatingCase', (str) => {
    return str
      .split('')
      .map((char, index) => 
        index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
      )
      .join('');
  });
});

core.use(textTransformPlugin);

const l33tSpeak = core.getExtension('l33tSpeak');
const alternatingCase = core.getExtension('alternatingCase');

if (l33tSpeak && alternatingCase) {
  console.log('L33t speak "hello world":', l33tSpeak('hello world'));
  console.log('Alternating case "hello world":', alternatingCase('hello world'));
}
console.log();

// Example 2: Statistics Plugin
console.log('2. String Statistics Plugin:');

const statisticsPlugin = createPlugin('statistics', '1.0.0', (core) => {
  core.extend('getStats', (str) => {
    const words = str.split(/\s+/).filter(word => word.length > 0);
    const sentences = str.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = str.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    
    return {
      characters: str.length,
      charactersNoSpaces: str.replace(/\s/g, '').length,
      words: words.length,
      sentences: sentences.length,
      paragraphs: paragraphs.length,
      averageWordsPerSentence: sentences.length > 0 ? Math.round(words.length / sentences.length * 100) / 100 : 0,
      averageCharsPerWord: words.length > 0 ? Math.round(str.replace(/\s/g, '').length / words.length * 100) / 100 : 0
    };
  });
  
  core.extend('readingTime', (str, wordsPerMinute = 200) => {
    const words = str.split(/\s+/).filter(word => word.length > 0).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  });
});

core.use(statisticsPlugin);

const getStats = core.getExtension('getStats');
const readingTime = core.getExtension('readingTime');

const sampleText = `This is a sample text. It has multiple sentences! 
How wonderful is that? We can analyze various statistics from this text.

This is a second paragraph. It helps demonstrate paragraph counting.`;

if (getStats && readingTime) {
  console.log('Text stats:', getStats(sampleText));
  console.log('Reading time:', readingTime(sampleText));
}
console.log();

// Example 3: Format Validation Plugin
console.log('3. Format Validation Plugin:');

const validationPlugin = createPlugin('advanced-validation', '1.0.0', (core) => {
  core.extend('isCreditCard', (str) => {
    const cleaned = str.replace(/\s|-/g, '');
    if (!/^\d{13,19}$/.test(cleaned)) return false;
    
    // Luhn algorithm
    let sum = 0;
    let isEven = false;
    
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i]);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  });
  
  core.extend('isPhoneNumber', (str, country = 'US') => {
    const patterns = {
      US: /^(\+1\s?)?(\d{3}|\(\d{3}\))[\s.-]?\d{3}[\s.-]?\d{4}$/,
      UK: /^(\+44\s?)?(\d{4}\s?\d{6}|\d{5}\s?\d{5})$/,
      DE: /^(\+49\s?)?\d{3,4}\s?\d{7,8}$/
    };
    
    return patterns[country]?.test(str.trim()) || false;
  });
  
  core.extend('isIPAddress', (str, version = 'both') => {
    const ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6 = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    
    if (version === 'v4') return ipv4.test(str);
    if (version === 'v6') return ipv6.test(str);
    return ipv4.test(str) || ipv6.test(str);
  });
});

core.use(validationPlugin);

const isCreditCard = core.getExtension('isCreditCard');
const isPhoneNumber = core.getExtension('isPhoneNumber');
const isIPAddress = core.getExtension('isIPAddress');

if (isCreditCard && isPhoneNumber && isIPAddress) {
  console.log('Valid credit card "4532015112830366":', isCreditCard('4532015112830366'));
  console.log('Valid credit card "1234567890":', isCreditCard('1234567890'));
  console.log('Valid US phone "(555) 123-4567":', isPhoneNumber('(555) 123-4567', 'US'));
  console.log('Valid IP address "192.168.1.1":', isIPAddress('192.168.1.1'));
}
console.log();

// Example 4: Text Processing Pipeline Plugin
console.log('4. Text Processing Pipeline Plugin:');

const pipelinePlugin = createPlugin('pipeline', '1.0.0', (core) => {
  core.extend('createPipeline', (...functions) => {
    return (input) => {
      return functions.reduce((result, fn) => fn(result), input);
    };
  });
  
  core.extend('conditionalTransform', (str, condition, transform) => {
    return condition(str) ? transform(str) : str;
  });
});

core.use(pipelinePlugin);

const createPipeline = core.getExtension('createPipeline');
const conditionalTransform = core.getExtension('conditionalTransform');

if (createPipeline && conditionalTransform) {
  // Create a text processing pipeline
  const textProcessor = createPipeline(
    (str) => str.trim(),
    (str) => Str.removeExtraSpaces(str),
    (str) => conditionalTransform(
      str,
      (s) => s.length > 50,
      (s) => Str.truncate(s, 50, { suffix: '...' })
    ),
    (str) => Str.toTitleCase(str)
  );
  
  const messyText = "  this   is    a   very   long   text   that   needs   processing   and   should   be   truncated  ";
  console.log('Original:', `"${messyText}"`);
  console.log('Processed:', `"${textProcessor(messyText)}"`);
}
console.log();

// Example 5: Internationalization Plugin
console.log('5. Internationalization Plugin:');

const i18nPlugin = createPlugin('i18n', '1.0.0', (core) => {
  const translations = {
    en: { hello: 'Hello', goodbye: 'Goodbye', world: 'World' },
    es: { hello: 'Hola', goodbye: 'Adiós', world: 'Mundo' },
    fr: { hello: 'Bonjour', goodbye: 'Au revoir', world: 'Monde' },
    de: { hello: 'Hallo', goodbye: 'Auf Wiedersehen', world: 'Welt' }
  };
  
  core.extend('translate', (str, fromLang, toLang) => {
    const fromDict = translations[fromLang];
    const toDict = translations[toLang];
    
    if (!fromDict || !toDict) return str;
    
    const words = str.split(/\s+/);
    return words.map(word => {
      const lowerWord = word.toLowerCase();
      const translationKey = Object.keys(fromDict).find(key => 
        fromDict[key].toLowerCase() === lowerWord
      );
      return translationKey ? toDict[translationKey] : word;
    }).join(' ');
  });
  
  core.extend('getSupportedLanguages', () => {
    return Object.keys(translations);
  });
});

core.use(i18nPlugin);

const translate = core.getExtension('translate');
const getSupportedLanguages = core.getExtension('getSupportedLanguages');

if (translate && getSupportedLanguages) {
  console.log('Supported languages:', getSupportedLanguages());
  console.log('English "Hello World" to Spanish:', translate('Hello World', 'en', 'es'));
  console.log('English "Hello World" to French:', translate('Hello World', 'en', 'fr'));
  console.log('English "Hello World" to German:', translate('Hello World', 'en', 'de'));
}
console.log();

// Example 6: Plugin Information
console.log('6. Plugin System Information:');
console.log('Installed plugins:', core.listPlugins());
console.log('Available extensions:', core.listExtensions());
console.log();

// Example 7: Complex Plugin Composition
console.log('7. Complex Plugin Composition:');

// Use multiple plugins together
if (l33tSpeak && getStats && translate) {
  const text = 'Hello World';
  const l33tText = l33tSpeak(text);
  const translatedText = translate(text, 'en', 'es');
  const stats = getStats(text);
  
  console.log('Original text:', text);
  console.log('L33t version:', l33tText);
  console.log('Spanish translation:', translatedText);
  console.log('Text statistics:', stats);
}

console.log('\n=== End of Plugin Development Examples ===');
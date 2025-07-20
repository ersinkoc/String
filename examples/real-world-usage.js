// Real-world usage examples for @oxog/string

const { Str, chain, core, createPlugin } = require('@oxog/string');

console.log('=== Real-World Usage Examples ===\n');

// Example 1: Form Data Processing
console.log('1. Form Data Processing:');
class FormProcessor {
  static cleanInput(input) {
    return chain(input)
      .trim()
      .normalizeWhitespace()
      .removeNonPrintable()
      .value();
  }

  static validateEmail(email) {
    const cleaned = this.cleanInput(email);
    return {
      isValid: Str.isEmail(cleaned),
      masked: Str.maskEmail(cleaned),
      cleaned
    };
  }

  static processName(name) {
    return chain(name)
      .trim()
      .removeExtraSpaces()
      .toTitleCase()
      .value();
  }

  static generateUsername(firstName, lastName) {
    const base = chain(`${firstName} ${lastName}`)
      .trim()
      .toLowerCase()
      .slugify({ separator: '_' })
      .value();
    
    const random = Str.random(4, { uppercase: false, symbols: false });
    return `${base}_${random}`;
  }
}

const formData = {
  email: '  TEST@EXAMPLE.COM  ',
  firstName: '  john  ',
  lastName: '  DOE  ',
  company: 'Acme Corp & Associates'
};

console.log('Original form data:', formData);
console.log('Processed email:', FormProcessor.validateEmail(formData.email));
console.log('Processed name:', FormProcessor.processName(`${formData.firstName} ${formData.lastName}`));
console.log('Generated username:', FormProcessor.generateUsername(formData.firstName, formData.lastName));
console.log('Company slug:', Str.slugify(formData.company));
console.log();

// Example 2: Content Management System
console.log('2. Content Management System:');
class CMSHelper {
  static createSlug(title) {
    return Str.slugify(title, { lowercase: true, strict: false });
  }

  static extractMetadata(content) {
    const stats = {
      wordCount: Str.words(content).length,
      charCount: content.length,
      readingTime: Math.ceil(Str.words(content).length / 200), // 200 WPM
      emails: Str.extractEmails(content),
      urls: Str.extractUrls(content)
    };
    return stats;
  }

  static sanitizeContent(html) {
    return chain(html)
      .stripHtml()
      .normalizeWhitespace()
      .value();
  }

  static createExcerpt(content, maxLength = 150) {
    const cleaned = this.sanitizeContent(content);
    return Str.truncate(cleaned, maxLength, { 
      preserveWords: true, 
      suffix: '...' 
    });
  }
}

const articleContent = `
  <h1>Welcome to Our Blog!</h1>
  <p>This is a sample article with some <strong>HTML content</strong>.</p>
  <p>Contact us at info@example.com or visit https://example.com for more info.</p>
  <p>We have many exciting features coming soon!</p>
`;

const articleTitle = 'How to Build Amazing Web Applications';

console.log('Article slug:', CMSHelper.createSlug(articleTitle));
console.log('Content metadata:', CMSHelper.extractMetadata(articleContent));
console.log('Sanitized content:', CMSHelper.sanitizeContent(articleContent));
console.log('Article excerpt:', CMSHelper.createExcerpt(articleContent));
console.log();

// Example 3: Data Validation & Cleaning
console.log('3. Data Validation & Cleaning:');
class DataValidator {
  static validateAndCleanData(records) {
    return records.map(record => {
      const cleaned = {};
      
      // Clean and validate email
      if (record.email) {
        const email = Str.trim(record.email);
        cleaned.email = {
          value: email,
          isValid: Str.isEmail(email),
          domain: email.split('@')[1] || null
        };
      }
      
      // Clean and validate phone
      if (record.phone) {
        const phone = record.phone.replace(/\D/g, ''); // Remove non-digits
        cleaned.phone = {
          value: phone,
          formatted: this.formatPhone(phone),
          isValid: phone.length >= 10
        };
      }
      
      // Clean name
      if (record.name) {
        cleaned.name = Str.toTitleCase(Str.trim(record.name));
      }
      
      // Validate and clean website
      if (record.website) {
        const website = Str.trim(record.website);
        cleaned.website = {
          value: website,
          isValid: Str.isUrl(website, { requireProtocol: false })
        };
      }
      
      return cleaned;
    });
  }

  static formatPhone(phone) {
    if (phone.length === 10) {
      return `(${phone.slice(0,3)}) ${phone.slice(3,6)}-${phone.slice(6)}`;
    }
    return phone;
  }
}

const rawData = [
  { 
    email: '  JOHN@EXAMPLE.COM  ', 
    phone: '+1-555-123-4567', 
    name: 'john doe',
    website: 'example.com'
  },
  { 
    email: 'invalid-email', 
    phone: '555.123.4567', 
    name: '  jane smith  ',
    website: 'https://janesmith.com'
  }
];

console.log('Original data:', rawData);
console.log('Cleaned data:', DataValidator.validateAndCleanData(rawData));
console.log();

// Example 4: Internationalization Helper
console.log('4. Internationalization Helper:');
class I18nHelper {
  static normalizeText(text, locale = 'en') {
    return chain(text)
      .trim()
      .normalizeWhitespace()
      .removeAccents()
      .value();
  }

  static compareStrings(str1, str2, locale = 'en') {
    const normalized1 = this.normalizeText(str1, locale);
    const normalized2 = this.normalizeText(str2, locale);
    
    return {
      exact: str1 === str2,
      normalized: normalized1 === normalized2,
      similarity: Str.similarity(normalized1, normalized2),
      soundsLike: Str.soundsLike(normalized1, normalized2)
    };
  }

  static generateSearchableText(text) {
    return chain(text)
      .toLowerCase()
      .removeAccents()
      .slugify({ separator: ' ' })
      .value();
  }
}

const textComparisons = [
  { str1: 'café', str2: 'cafe' },
  { str1: 'José María', str2: 'Jose Maria' },
  { str1: 'naïve', str2: 'naive' }
];

textComparisons.forEach(({ str1, str2 }) => {
  console.log(`Comparing "${str1}" vs "${str2}":`, I18nHelper.compareStrings(str1, str2));
});

console.log('Searchable text for "Café & Restaurante José María":');
console.log(I18nHelper.generateSearchableText('Café & Restaurante José María'));
console.log();

// Example 5: Security & Privacy Helper
console.log('5. Security & Privacy Helper:');
class SecurityHelper {
  static maskSensitiveData(data) {
    const masked = { ...data };
    
    // Mask credit cards
    if (masked.creditCard) {
      masked.creditCard = Str.maskCreditCard(masked.creditCard);
    }
    
    // Mask emails
    if (masked.email) {
      masked.email = Str.maskEmail(masked.email);
    }
    
    // Mask phone numbers
    if (masked.phone) {
      masked.phone = Str.mask(masked.phone, { unmaskedEnd: 4 });
    }
    
    // Mask SSN
    if (masked.ssn) {
      masked.ssn = Str.mask(masked.ssn, { unmaskedEnd: 4, maskChar: 'X' });
    }
    
    return masked;
  }

  static generateSecureIds() {
    return {
      sessionId: Str.random(32),
      apiKey: Str.generateFromPattern('XXXX-XXXX-XXXX-XXXX'),
      tempPassword: Str.generatePronounceable(12),
      hash: Str.hash('sensitive-data', 'sha256')
    };
  }

  static sanitizeInput(input) {
    return chain(input)
      .trim()
      .stripHtml()
      .encodeHtml()
      .value();
  }
}

const sensitiveData = {
  email: 'john.doe@example.com',
  creditCard: '4532-0151-1283-0366',
  phone: '555-123-4567',
  ssn: '123-45-6789'
};

console.log('Original sensitive data:', sensitiveData);
console.log('Masked data:', SecurityHelper.maskSensitiveData(sensitiveData));
console.log('Generated secure IDs:', SecurityHelper.generateSecureIds());
console.log('Sanitized input:', SecurityHelper.sanitizeInput('<script>alert("xss")</script>Hello World'));
console.log();

// Example 6: Log Processing
console.log('6. Log Processing:');
class LogProcessor {
  static parseLogEntry(logLine) {
    // Extract common log information
    const ips = Str.extractNumbers(logLine).join('.');
    const emails = Str.extractEmails(logLine);
    const urls = Str.extractUrls(logLine);
    
    return {
      originalLine: logLine,
      cleanedLine: Str.removeNonPrintable(logLine),
      extractedIPs: ips,
      extractedEmails: emails,
      extractedUrls: urls,
      wordCount: Str.words(logLine).length
    };
  }

  static generateLogSummary(logs) {
    const summary = {
      totalLines: logs.length,
      totalWords: logs.reduce((sum, log) => sum + Str.words(log).length, 0),
      avgWordsPerLine: 0,
      mostCommonWords: this.findCommonWords(logs.join(' '))
    };
    
    summary.avgWordsPerLine = Math.round(summary.totalWords / summary.totalLines);
    return summary;
  }

  static findCommonWords(text) {
    const words = Str.words(text.toLowerCase());
    const frequency = {};
    
    words.forEach(word => {
      if (word.length > 3) { // Ignore short words
        frequency[word] = (frequency[word] || 0) + 1;
      }
    });
    
    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word, count]) => ({ word, count }));
  }
}

const logEntries = [
  '2024-01-20 10:30:15 INFO User john@example.com logged in from 192.168.1.100',
  '2024-01-20 10:31:22 ERROR Failed login attempt from 192.168.1.200',
  '2024-01-20 10:32:05 INFO User accessed https://example.com/dashboard',
  '2024-01-20 10:33:10 WARN Rate limit exceeded for user admin@example.com'
];

console.log('Log entry analysis:');
logEntries.forEach((log, index) => {
  console.log(`Entry ${index + 1}:`, LogProcessor.parseLogEntry(log));
});

console.log('\nLog summary:', LogProcessor.generateLogSummary(logEntries));
console.log();

// Example 7: API Response Formatting
console.log('7. API Response Formatting:');
class APIFormatter {
  static formatResponse(data, options = {}) {
    const { maskSensitive = true, includeMetadata = true } = options;
    
    const formatted = JSON.stringify(data, null, 2);
    let result = formatted;
    
    if (maskSensitive) {
      // Mask potential sensitive data in JSON strings
      result = result.replace(/"password":\s*"[^"]*"/g, '"password": "***"');
      result = result.replace(/"token":\s*"[^"]*"/g, '"token": "***"');
      result = result.replace(/"key":\s*"[^"]*"/g, '"key": "***"');
    }
    
    if (includeMetadata) {
      const metadata = {
        size: Str.encodeBase64(formatted).length,
        hash: Str.hash(formatted, 'sha256').slice(0, 8),
        timestamp: new Date().toISOString()
      };
      
      return {
        data: JSON.parse(result),
        metadata
      };
    }
    
    return JSON.parse(result);
  }

  static createTableView(data) {
    if (!Array.isArray(data)) return 'Data must be an array';
    
    if (data.length === 0) return 'No data available';
    
    const headers = Object.keys(data[0]);
    const rows = data.map(item => headers.map(header => String(item[header] || '')));
    
    return Str.toTable([headers, ...rows], { 
      headers: true, 
      border: true,
      padding: 1 
    });
  }
}

const apiData = {
  users: [
    { id: 1, name: 'John Doe', email: 'john@example.com', password: 'secret123' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', token: 'abc123xyz' }
  ]
};

console.log('Formatted API response:');
console.log(APIFormatter.formatResponse(apiData));

console.log('\nTable view:');
console.log(APIFormatter.createTableView(apiData.users));
console.log();

// Example 8: Custom Plugin for Business Logic
console.log('8. Custom Business Logic Plugin:');
const businessPlugin = createPlugin('business', '1.0.0', (core) => {
  core.extend('formatCurrency', (amount, currency = 'USD', locale = 'en-US') => {
    const number = parseFloat(amount.toString());
    if (isNaN(number)) return 'Invalid amount';
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(number);
  });
  
  core.extend('formatBusinessName', (name) => {
    return chain(name)
      .trim()
      .toTitleCase()
      .value()
      .replace(/\b(Inc|Corp|LLC|Ltd)\b/gi, match => match.toUpperCase());
  });
  
  core.extend('generateInvoiceNumber', (prefix = 'INV') => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Str.random(4, { uppercase: true, lowercase: false, symbols: false });
    
    return `${prefix}-${year}${month}-${random}`;
  });
});

core.use(businessPlugin);

const formatCurrency = core.getExtension('formatCurrency');
const formatBusinessName = core.getExtension('formatBusinessName');
const generateInvoiceNumber = core.getExtension('generateInvoiceNumber');

if (formatCurrency && formatBusinessName && generateInvoiceNumber) {
  console.log('Currency formatting:', formatCurrency(1234.56));
  console.log('Business name formatting:', formatBusinessName('acme corp'));
  console.log('Invoice number:', generateInvoiceNumber());
  console.log('Custom invoice number:', generateInvoiceNumber('SALE'));
}

console.log('\n=== End of Real-World Examples ===');
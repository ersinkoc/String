// Core exports
export * from './core/case';
export * from './core/cleaning';
export * from './core/validation';
export * from './core/analysis';
export * from './core/manipulation';
export * from './core/encoding';
export * from './core/advanced';

// Type exports
export * from './types';

// Plugin exports
export * from './plugins/plugin-interface';

// Utility exports
export * from './utils/unicode';
export * from './utils/algorithms';

// Re-export removeAccents explicitly to resolve ambiguity
export { removeAccents } from './utils/unicode';

// Import all functions for APIs
import * as Case from './core/case';
import * as Cleaning from './core/cleaning';
import * as Validation from './core/validation';
import * as Analysis from './core/analysis';
import * as Manipulation from './core/manipulation';
import * as Encoding from './core/encoding';
import * as Advanced from './core/advanced';
import type { ChainableString, PadType, TruncateOptions, WrapOptions, SlugifyOptions, MaskOptions } from './types';
import { StringCoreImpl } from './plugins/plugin-interface';

// Chainable API
class ChainableStringImpl implements ChainableString {
  constructor(private str: string) {}

  // Case transformations
  toCamelCase(): ChainableString {
    return new ChainableStringImpl(Case.toCamelCase(this.str));
  }

  toPascalCase(): ChainableString {
    return new ChainableStringImpl(Case.toPascalCase(this.str));
  }

  toSnakeCase(): ChainableString {
    return new ChainableStringImpl(Case.toSnakeCase(this.str));
  }

  toKebabCase(): ChainableString {
    return new ChainableStringImpl(Case.toKebabCase(this.str));
  }

  toConstantCase(): ChainableString {
    return new ChainableStringImpl(Case.toConstantCase(this.str));
  }

  toTitleCase(locale?: string): ChainableString {
    return new ChainableStringImpl(Case.toTitleCase(this.str, locale));
  }

  toSentenceCase(): ChainableString {
    return new ChainableStringImpl(Case.toSentenceCase(this.str));
  }

  toLowerCase(): ChainableString {
    return new ChainableStringImpl(this.str.toLowerCase());
  }

  toUpperCase(): ChainableString {
    return new ChainableStringImpl(this.str.toUpperCase());
  }

  // Cleaning
  trim(chars?: string): ChainableString {
    return new ChainableStringImpl(Cleaning.trim(this.str, chars));
  }

  trimStart(chars?: string): ChainableString {
    return new ChainableStringImpl(Cleaning.trimStart(this.str, chars));
  }

  trimEnd(chars?: string): ChainableString {
    return new ChainableStringImpl(Cleaning.trimEnd(this.str, chars));
  }

  removeExtraSpaces(): ChainableString {
    return new ChainableStringImpl(Cleaning.removeExtraSpaces(this.str));
  }

  normalizeWhitespace(): ChainableString {
    return new ChainableStringImpl(Cleaning.normalizeWhitespace(this.str));
  }

  removeNonPrintable(): ChainableString {
    return new ChainableStringImpl(Cleaning.removeNonPrintable(this.str));
  }

  stripHtml(): ChainableString {
    return new ChainableStringImpl(Cleaning.stripHtml(this.str));
  }

  stripAnsi(): ChainableString {
    return new ChainableStringImpl(Cleaning.stripAnsi(this.str));
  }

  removeAccents(): ChainableString {
    return new ChainableStringImpl(Cleaning.removeAccents(this.str));
  }

  // Manipulation
  reverse(): ChainableString {
    return new ChainableStringImpl(Manipulation.reverse(this.str));
  }

  shuffle(): ChainableString {
    return new ChainableStringImpl(Manipulation.shuffle(this.str));
  }

  repeat(count: number, separator?: string): ChainableString {
    return new ChainableStringImpl(Manipulation.repeat(this.str, count, separator));
  }

  truncate(length: number, options?: TruncateOptions): ChainableString {
    return new ChainableStringImpl(Manipulation.truncate(this.str, length, options));
  }

  pad(length: number, fillString?: string, type?: PadType): ChainableString {
    return new ChainableStringImpl(Manipulation.pad(this.str, length, fillString, type));
  }

  wrap(width: number, options?: WrapOptions): ChainableString {
    return new ChainableStringImpl(Manipulation.wrap(this.str, width, options));
  }

  slugify(options?: SlugifyOptions): ChainableString {
    return new ChainableStringImpl(Manipulation.slugify(this.str, options));
  }

  // Encoding
  encodeBase64(): ChainableString {
    return new ChainableStringImpl(Encoding.encodeBase64(this.str));
  }

  decodeBase64(): ChainableString {
    return new ChainableStringImpl(Encoding.decodeBase64(this.str));
  }

  encodeHex(): ChainableString {
    return new ChainableStringImpl(Encoding.encodeHex(this.str));
  }

  decodeHex(): ChainableString {
    return new ChainableStringImpl(Encoding.decodeHex(this.str));
  }

  encodeHtml(): ChainableString {
    return new ChainableStringImpl(Encoding.encodeHtml(this.str));
  }

  decodeHtml(): ChainableString {
    return new ChainableStringImpl(Encoding.decodeHtml(this.str));
  }

  encodeUri(): ChainableString {
    return new ChainableStringImpl(Encoding.encodeUri(this.str));
  }

  decodeUri(): ChainableString {
    return new ChainableStringImpl(Encoding.decodeUri(this.str));
  }

  // Advanced
  mask(options?: MaskOptions): ChainableString {
    return new ChainableStringImpl(Advanced.mask(this.str, options));
  }

  value(): string {
    return this.str;
  }
}

// Static Class API
export class Str {
  // Case transformations
  static toCamelCase = Case.toCamelCase;
  static toPascalCase = Case.toPascalCase;
  static toSnakeCase = Case.toSnakeCase;
  static toKebabCase = Case.toKebabCase;
  static toConstantCase = Case.toConstantCase;
  static toTitleCase = Case.toTitleCase;
  static toSentenceCase = Case.toSentenceCase;

  // Cleaning
  static trim = Cleaning.trim;
  static trimStart = Cleaning.trimStart;
  static trimEnd = Cleaning.trimEnd;
  static removeExtraSpaces = Cleaning.removeExtraSpaces;
  static normalizeWhitespace = Cleaning.normalizeWhitespace;
  static removeNonPrintable = Cleaning.removeNonPrintable;
  static stripHtml = Cleaning.stripHtml;
  static stripAnsi = Cleaning.stripAnsi;
  static removeAccents = Cleaning.removeAccents;

  // Validation
  static isEmail = Validation.isEmail;
  static isUrl = Validation.isUrl;
  static isUuid = Validation.isUuid;
  static isHexColor = Validation.isHexColor;
  static isBase64 = Validation.isBase64;
  static isJson = Validation.isJson;
  static isNumeric = Validation.isNumeric;
  static isAlpha = Validation.isAlpha;
  static isAlphanumeric = Validation.isAlphanumeric;
  static isEmpty = Validation.isEmpty;

  // Analysis
  static contains = Analysis.contains;
  static count = Analysis.count;
  static indexOfAll = Analysis.indexOfAll;
  static words = Analysis.words;
  static chars = Analysis.chars;
  static codePoints = Analysis.codePoints;
  static graphemes = Analysis.graphemes;

  // Manipulation
  static reverse = Manipulation.reverse;
  static shuffle = Manipulation.shuffle;
  static repeat = Manipulation.repeat;
  static truncate = Manipulation.truncate;
  static pad = Manipulation.pad;
  static wrap = Manipulation.wrap;
  static slugify = Manipulation.slugify;

  // Encoding
  static encodeBase64 = Encoding.encodeBase64;
  static decodeBase64 = Encoding.decodeBase64;
  static encodeHex = Encoding.encodeHex;
  static decodeHex = Encoding.decodeHex;
  static encodeHtml = Encoding.encodeHtml;
  static decodeHtml = Encoding.decodeHtml;
  static encodeUri = Encoding.encodeUri;
  static decodeUri = Encoding.decodeUri;

  // Advanced
  static similarity = Advanced.similarity;
  static fuzzyMatch = Advanced.fuzzyMatch;
  static soundsLike = Advanced.soundsLike;
  static findPatterns = Advanced.findPatterns;
  static isRepeating = Advanced.isRepeating;
  static extractEmails = Advanced.extractEmails;
  static extractUrls = Advanced.extractUrls;
  static extractNumbers = Advanced.extractNumbers;
  static random = Advanced.random;
  static generatePronounceable = Advanced.generatePronounceable;
  static generateFromPattern = Advanced.generateFromPattern;
  static mask = Advanced.mask;
  static maskEmail = Advanced.maskEmail;
  static maskCreditCard = Advanced.maskCreditCard;
  static hash = Advanced.hash;
  static toTable = Advanced.toTable;
  static boxify = Advanced.boxify;
  static progressBar = Advanced.progressBar;
}

// Chainable factory function
export function chain(str: string): ChainableString {
  return new ChainableStringImpl(str);
}

// Plugin core instance
export const core = new StringCoreImpl();

// Default export for convenience
export default {
  ...Case,
  ...Cleaning,
  ...Validation,
  ...Analysis,
  ...Manipulation,
  ...Encoding,
  ...Advanced,
  Str,
  chain,
  core
};
export interface TruncateOptions {
  suffix?: string;
  preserveWords?: boolean;
}

export interface SlugifyOptions {
  separator?: string;
  lowercase?: boolean;
  strict?: boolean;
  locale?: string;
}

export interface MaskOptions {
  maskChar?: string;
  unmaskedStart?: number;
  unmaskedEnd?: number;
}

export interface WrapOptions {
  indent?: string;
  break?: boolean;
  cut?: boolean;
  width?: number;
}

export interface UrlOptions {
  requireProtocol?: boolean;
  allowUnderscore?: boolean;
  allowTrailingDot?: boolean;
  allowProtocols?: string[];
}

export interface RandomOptions {
  uppercase?: boolean;
  lowercase?: boolean;
  numbers?: boolean;
  symbols?: boolean;
  excludeSimilar?: boolean;
  customCharset?: string;
}

export interface TableOptions {
  headers?: boolean;
  border?: boolean;
  padding?: number;
  align?: 'left' | 'center' | 'right';
}

export interface BoxOptions {
  style?: 'single' | 'double' | 'rounded' | 'thick';
  padding?: number;
  margin?: number;
  title?: string;
}

export interface ProgressOptions {
  width?: number;
  complete?: string;
  incomplete?: string;
  showPercent?: boolean;
}

export interface Pattern {
  pattern: string;
  indices: number[];
  length: number;
  frequency: number;
}

export type SimilarityAlgorithm = 'levenshtein' | 'jaro' | 'cosine';
export type SoundsLikeAlgorithm = 'soundex' | 'metaphone';
export type HashAlgorithm = 'md5' | 'sha1' | 'sha256';
export type PadType = 'start' | 'end' | 'both';

export interface IStringPlugin {
  name: string;
  version: string;
  install(core: StringCore): void;
}

export interface StringCore {
  use(plugin: IStringPlugin): void;
  extend(name: string, fn: Function): void;
}

export interface ChainableString {
  trim(chars?: string): ChainableString;
  trimStart(chars?: string): ChainableString;
  trimEnd(chars?: string): ChainableString;
  toLowerCase(): ChainableString;
  toUpperCase(): ChainableString;
  toCamelCase(): ChainableString;
  toPascalCase(): ChainableString;
  toSnakeCase(): ChainableString;
  toKebabCase(): ChainableString;
  toConstantCase(): ChainableString;
  toTitleCase(locale?: string): ChainableString;
  toSentenceCase(): ChainableString;
  removeExtraSpaces(): ChainableString;
  normalizeWhitespace(): ChainableString;
  removeNonPrintable(): ChainableString;
  stripHtml(): ChainableString;
  stripAnsi(): ChainableString;
  removeAccents(): ChainableString;
  reverse(): ChainableString;
  shuffle(): ChainableString;
  repeat(count: number, separator?: string): ChainableString;
  truncate(length: number, options?: TruncateOptions): ChainableString;
  pad(length: number, fillString?: string, type?: PadType): ChainableString;
  wrap(width: number, options?: WrapOptions): ChainableString;
  slugify(options?: SlugifyOptions): ChainableString;
  mask(options?: MaskOptions): ChainableString;
  encodeBase64(): ChainableString;
  decodeBase64(): ChainableString;
  encodeHex(): ChainableString;
  decodeHex(): ChainableString;
  encodeHtml(): ChainableString;
  decodeHtml(): ChainableString;
  encodeUri(): ChainableString;
  decodeUri(): ChainableString;
  value(): string;
}
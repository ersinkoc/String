export function getGraphemes(str: string): string[] {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new (Intl as any).Segmenter(undefined, { granularity: 'grapheme' });
    return Array.from(segmenter.segment(str), (segment: any) => segment.segment);
  }
  
  return [...str];
}

export function getCodePoints(str: string): number[] {
  return Array.from(str, char => char.codePointAt(0) ?? 0);
}

export function isRtl(str: string): boolean {
  const rtlChars = /[\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return rtlChars.test(str);
}

export function reverseUnicode(str: string): string {
  return getGraphemes(str).reverse().join('');
}

export function normalizeUnicode(str: string, form: 'NFC' | 'NFD' | 'NFKC' | 'NFKD' = 'NFC'): string {
  return str.normalize(form);
}

export function removeAccents(str: string): string {
  if (!str || typeof str !== 'string') return '';
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function isEmoji(char: string): boolean {
  const emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/;
  return emojiRegex.test(char);
}

export function stripEmojis(str: string): string {
  const emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;
  return str.replace(emojiRegex, '');
}

export function getStringWidth(str: string): number {
  let width = 0;
  const graphemes = getGraphemes(str);
  
  for (const char of graphemes) {
    const code = char.codePointAt(0) ?? 0;
    
    if (code >= 0x1100 && (
      code <= 0x115f ||
      code === 0x2329 ||
      code === 0x232a ||
      (code >= 0x2e80 && code <= 0xa4cf && code !== 0x303f) ||
      (code >= 0xac00 && code <= 0xd7a3) ||
      (code >= 0xf900 && code <= 0xfaff) ||
      (code >= 0xfe10 && code <= 0xfe19) ||
      (code >= 0xfe30 && code <= 0xfe6f) ||
      (code >= 0xff00 && code <= 0xff60) ||
      (code >= 0xffe0 && code <= 0xffe6) ||
      (code >= 0x20000 && code <= 0x2fffd) ||
      (code >= 0x30000 && code <= 0x3fffd)
    )) {
      width += 2;
    } else if (code >= 0x20 && code <= 0x7e) {
      width += 1;
    } else if (code >= 0xa1) {
      width += 1;
    }
  }
  
  return width;
}
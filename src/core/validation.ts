import type { UrlOptions } from '../types';

export function isEmail(str: string): boolean {
  // Improved email regex that disallows:
  // - Consecutive dots (..)
  // - Leading/trailing dots in local part
  // - Invalid characters
  const emailRegex = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  return emailRegex.test(str);
}

export function isUrl(str: string, options: UrlOptions = {}): boolean {
  const {
    requireProtocol = false,
    allowUnderscore = false,
    allowTrailingDot = false,
    allowProtocols = ['http', 'https', 'ftp']
  } = options;

  if (!str || typeof str !== 'string') {
    return false;
  }

  try {
    const url = new URL(str);

    if (!allowProtocols.includes(url.protocol.slice(0, -1))) {
      return false;
    }

    if (!allowUnderscore && url.hostname.includes('_')) {
      return false;
    }

    if (!allowTrailingDot && url.hostname.endsWith('.')) {
      return false;
    }

    // Additional hostname validation for edge cases
    const hostname = url.hostname;
    if (
      hostname.includes('..') ||
      hostname.startsWith('.') ||
      (!allowTrailingDot && hostname.endsWith('.'))
    ) {
      return false;
    }

    // Check each label (part between dots) for valid format
    const labels = hostname.split('.');
    for (const label of labels) {
      // Skip empty labels at the end if trailing dot is allowed
      if (label.length === 0 && allowTrailingDot) continue;
      if (label.startsWith('-') || label.endsWith('-') || label.length === 0) {
        return false;
      }
    }

    return true;
  } catch {
    if (!requireProtocol && !str.includes('://')) {
      try {
        const testUrl = new URL(`http://${str}`);
        // Improved validation for domain format
        // - No leading/trailing dots or hyphens
        // - No consecutive dots
        // - Must have at least one dot and valid TLD
        const hostname = testUrl.hostname;
        if (
          !/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/.test(hostname) ||
          hostname.includes('..') ||
          hostname.startsWith('-') ||
          hostname.endsWith('-')
        ) {
          return false;
        }
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }
}

export function isUuid(str: string, version?: number): boolean {
  const uuidRegexes = {
    1: /^[0-9a-f]{8}-[0-9a-f]{4}-1[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    2: /^[0-9a-f]{8}-[0-9a-f]{4}-2[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    3: /^[0-9a-f]{8}-[0-9a-f]{4}-3[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    4: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    5: /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  };

  if (version && uuidRegexes[version as keyof typeof uuidRegexes]) {
    return uuidRegexes[version as keyof typeof uuidRegexes].test(str);
  }

  const generalUuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return generalUuidRegex.test(str);
}

export function isHexColor(str: string): boolean {
  const hexColorRegex = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
  return hexColorRegex.test(str);
}

export function isBase64(str: string): boolean {
  if (!str || str.length % 4 !== 0) {
    return false;
  }
  
  const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
  return base64Regex.test(str);
}

export function isJson(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

export function isNumeric(str: string): boolean {
  // BUG #6 FIX: Empty string should not be considered numeric
  if (str.trim().length === 0) return false;
  return !isNaN(Number(str)) && isFinite(Number(str));
}

export function isAlpha(str: string, locale?: string): boolean {
  if (locale) {
    const localeRegexes: Record<string, RegExp> = {
      'en': /^[a-zA-Z]+$/,
      'es': /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ]+$/,
      'fr': /^[a-zA-ZàâäéèêëïîôöùûüÿçÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ]+$/,
      'de': /^[a-zA-ZäöüßÄÖÜ]+$/,
      'it': /^[a-zA-ZàèéìíîòóùúÀÈÉÌÍÎÒÓÙÚ]+$/,
      'pt': /^[a-zA-ZáàâãéêíóôõúçÁÀÂÃÉÊÍÓÔÕÚÇ]+$/
    };
    
    const regex = localeRegexes[locale];
    if (regex) {
      return regex.test(str);
    }
  }
  
  return /^[a-zA-Z]+$/.test(str);
}

export function isAlphanumeric(str: string, locale?: string): boolean {
  if (locale) {
    const localeRegexes: Record<string, RegExp> = {
      'en': /^[a-zA-Z0-9]+$/,
      'es': /^[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ]+$/,
      'fr': /^[a-zA-Z0-9àâäéèêëïîôöùûüÿçÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ]+$/,
      'de': /^[a-zA-Z0-9äöüßÄÖÜ]+$/,
      'it': /^[a-zA-Z0-9àèéìíîòóùúÀÈÉÌÍÎÒÓÙÚ]+$/,
      'pt': /^[a-zA-Z0-9áàâãéêíóôõúçÁÀÂÃÉÊÍÓÔÕÚÇ]+$/
    };
    
    const regex = localeRegexes[locale];
    if (regex) {
      return regex.test(str);
    }
  }
  
  return /^[a-zA-Z0-9]+$/.test(str);
}

export function isEmpty(str: string, options: { ignoreWhitespace?: boolean } = {}): boolean {
  const { ignoreWhitespace = false } = options;
  
  if (ignoreWhitespace) {
    return str.trim().length === 0;
  }
  
  return str.length === 0;
}
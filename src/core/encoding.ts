export function encodeBase64(str: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(str, 'utf8').toString('base64');
  }

  if (typeof btoa !== 'undefined') {
    // Convert string to UTF-8 bytes without using deprecated escape/unescape
    try {
      // Modern approach using TextEncoder-like conversion
      const utf8Bytes = encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, hex) => {
        return String.fromCharCode(parseInt(hex, 16));
      });
      return btoa(utf8Bytes);
    } catch {
      // Fallback to pure implementation
      return base64Encode(str);
    }
  }

  return base64Encode(str);
}

export function decodeBase64(str: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(str, 'base64').toString('utf8');
  }

  if (typeof atob !== 'undefined') {
    try {
      const decoded = atob(str);
      // Convert from UTF-8 bytes without using deprecated escape/unescape
      const percentEncoded = Array.from(decoded, c => {
        const code = c.charCodeAt(0);
        return code > 127 ? '%' + code.toString(16).toUpperCase().padStart(2, '0') : c;
      }).join('');
      return decodeURIComponent(percentEncoded);
    } catch {
      // Fallback to pure implementation
      return base64Decode(str);
    }
  }

  return base64Decode(str);
}

export function encodeHex(str: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function decodeHex(str: string): string {
  if (str.length % 2 !== 0) {
    throw new Error('Invalid hex string: length must be even');
  }

  // Validate that all characters are valid hex digits
  if (!/^[0-9a-fA-F]*$/.test(str)) {
    throw new Error('Invalid hex string: contains non-hexadecimal characters');
  }

  const bytes = new Uint8Array(str.length / 2);
  for (let i = 0; i < str.length; i += 2) {
    bytes[i / 2] = parseInt(str.slice(i, i + 2), 16);
  }
  
  // For single bytes, use String.fromCharCode for raw byte values
  if (bytes.length === 1) {
    return String.fromCharCode(bytes[0]!);
  }
  
  // For multi-byte sequences, try UTF-8 decoding first
  try {
    const decoder = new TextDecoder('utf-8', { fatal: true });
    return decoder.decode(bytes);
  } catch {
    // Fall back to latin-1 for raw bytes
    return Array.from(bytes, byte => String.fromCharCode(byte)).join('');
  }
}

export function encodeHtml(str: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  };
  
  return str.replace(/[&<>"'/]/g, char => htmlEntities[char] || char);
}

export function decodeHtml(str: string): string {
  const htmlEntities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#x27;': "'",
    '&#x2F;': '/',
    '&apos;': "'",
    '&nbsp;': ' ',
    '&copy;': '©',
    '&reg;': '®',
    '&trade;': '™',
    '&mdash;': '\u2014',
    '&ndash;': '\u2013',
    '&ldquo;': '\u201C',
    '&rdquo;': '\u201D',
    '&lsquo;': '\u2018',
    '&rsquo;': '\u2019',
    '&hellip;': '\u2026',
    '&bull;': '\u2022'
  };

  return str.replace(/&(?:#(\d+)|#x([0-9a-fA-F]+)|([a-zA-Z]+));/g, (match, dec, hex, named) => {
    // Handle decimal numeric entity (&#65;)
    if (dec) {
      const code = parseInt(dec, 10);
      return code >= 0 && code <= 0x10FFFF ? String.fromCodePoint(code) : match;
    }
    // Handle hexadecimal numeric entity (&#x41;)
    if (hex) {
      const code = parseInt(hex, 16);
      return code >= 0 && code <= 0x10FFFF ? String.fromCodePoint(code) : match;
    }
    // Handle named entity (&amp;)
    if (named) {
      return htmlEntities[`&${named};`] || match;
    }
    return match;
  });
}

export function encodeUri(str: string): string {
  return encodeURIComponent(str);
}

export function decodeUri(str: string): string {
  try {
    return decodeURIComponent(str);
  } catch {
    // Return original string if decoding fails
    return str;
  }
}

// Pure JavaScript Base64 implementation
function base64Encode(str: string): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let result = '';
  let i = 0;
  
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  
  while (i < bytes.length) {
    const a = bytes[i++]!;
    const b = i < bytes.length ? bytes[i++]! : 0;
    const c = i < bytes.length ? bytes[i++]! : 0;
    
    const bitmap = (a << 16) | (b << 8) | c;
    
    result += chars.charAt((bitmap >> 18) & 63);
    result += chars.charAt((bitmap >> 12) & 63);
    result += i - 2 < bytes.length ? chars.charAt((bitmap >> 6) & 63) : '=';
    result += i - 1 < bytes.length ? chars.charAt(bitmap & 63) : '=';
  }
  
  return result;
}

function base64Decode(str: string): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const lookup = new Map<string, number>();
  
  for (let i = 0; i < chars.length; i++) {
    lookup.set(chars[i]!, i);
  }
  
  str = str.replace(/[^A-Za-z0-9+/]/g, '');
  
  const bytes: number[] = [];
  let i = 0;
  
  while (i < str.length) {
    const encoded1 = lookup.get(str[i++]!) ?? 0;
    const encoded2 = lookup.get(str[i++]!) ?? 0;
    const encoded3 = lookup.get(str[i++]!) ?? 0;
    const encoded4 = lookup.get(str[i++]!) ?? 0;
    
    const bitmap = (encoded1 << 18) | (encoded2 << 12) | (encoded3 << 6) | encoded4;
    
    bytes.push((bitmap >> 16) & 255);
    if ((str[i - 2] || '') !== '=') bytes.push((bitmap >> 8) & 255);
    if ((str[i - 1] || '') !== '=') bytes.push(bitmap & 255);
  }
  
  const decoder = new TextDecoder();
  return decoder.decode(new Uint8Array(bytes));
}
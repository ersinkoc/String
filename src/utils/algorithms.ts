export function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];
  const len1 = str1.length;
  const len2 = str2.length;

  if (len1 === 0) return len2;
  if (len2 === 0) return len1;

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= len2; j++) {
    matrix[0]![j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i]![j] = Math.min(
        matrix[i - 1]![j]! + 1,
        matrix[i]![j - 1]! + 1,
        matrix[i - 1]![j - 1]! + cost
      );
    }
  }

  return matrix[len1]![len2]!;
}

export function jaroDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;

  if (len1 === 0 && len2 === 0) return 1;
  if (len1 === 0 || len2 === 0) return 0;

  // BUG #7 FIX: Prevent negative match window for short strings
  const matchWindow = Math.max(0, Math.floor(Math.max(len1, len2) / 2) - 1);
  const str1Matches = new Array(len1).fill(false);
  const str2Matches = new Array(len2).fill(false);

  let matches = 0;
  let transpositions = 0;

  for (let i = 0; i < len1; i++) {
    const start = Math.max(0, i - matchWindow);
    const end = Math.min(i + matchWindow + 1, len2);

    for (let j = start; j < end; j++) {
      if (str2Matches[j] || str1[i] !== str2[j]) continue;
      str1Matches[i] = true;
      str2Matches[j] = true;
      matches++;
      break;
    }
  }

  if (matches === 0) return 0;

  let k = 0;
  for (let i = 0; i < len1; i++) {
    if (!str1Matches[i]) continue;
    while (!str2Matches[k]) k++;
    if (str1[i] !== str2[k]) transpositions++;
    k++;
  }

  return (matches / len1 + matches / len2 + (matches - transpositions / 2) / matches) / 3;
}

export function cosineDistance(str1: string, str2: string): number {
  const vec1 = getCharacterBigrams(str1);
  const vec2 = getCharacterBigrams(str2);
  
  const intersection = new Set([...vec1].filter(x => vec2.has(x)));
  const union = new Set([...vec1, ...vec2]);
  
  if (union.size === 0) return 1;
  
  return intersection.size / Math.sqrt(vec1.size * vec2.size);
}

function getCharacterBigrams(str: string): Set<string> {
  const bigrams = new Set<string>();
  // BUG #8 FIX: Handle single characters by treating them as their own "bigram"
  if (str.length === 0) return bigrams;
  if (str.length === 1) {
    bigrams.add(str);
    return bigrams;
  }
  for (let i = 0; i < str.length - 1; i++) {
    bigrams.add(str.slice(i, i + 2));
  }
  return bigrams;
}

export function soundex(str: string): string {
  const word = str.toUpperCase();
  const firstLetter = word[0] || '';
  
  const mapping: Record<string, string> = {
    'B': '1', 'F': '1', 'P': '1', 'V': '1',
    'C': '2', 'G': '2', 'J': '2', 'K': '2', 'Q': '2', 'S': '2', 'X': '2', 'Z': '2',
    'D': '3', 'T': '3',
    'L': '4',
    'M': '5', 'N': '5',
    'R': '6'
  };

  let code = firstLetter;
  for (let i = 1; i < word.length && code.length < 4; i++) {
    const char = word[i]!;
    const digit = mapping[char];
    
    if (digit && digit !== (code[code.length - 1] || '')) {
      code += digit;
    }
  }

  return code.padEnd(4, '0').slice(0, 4);
}

export function metaphone(str: string): string {
  const word = str.toUpperCase().replace(/[^A-Z]/g, '');
  if (!word) return '';

  let metaphone = '';
  let i = 0;

  if (word.length >= 2) {
    if (word.startsWith('KN') || word.startsWith('GN') || word.startsWith('PN') || word.startsWith('AE') || word.startsWith('WR')) {
      i = 1;
    }
  }

  if (word[0] === 'X') {
    metaphone = 'S';
    i = 1;
  }

  while (i < word.length && metaphone.length < 4) {
    const char = word[i]!;
    const next = word[i + 1];
    const prev = word[i - 1];

    switch (char) {
      case 'B':
        if (i === word.length - 1 && prev === 'M') {
        } else {
          metaphone += 'B';
        }
        break;
      case 'C':
        // BUG #9 FIX: Add bounds checking for array access
        if (next === 'H' || (next === 'I' && i + 2 < word.length && word[i + 2] === 'A')) {
          metaphone += 'X';
          i++;
        } else if (next === 'E' || next === 'I' || next === 'Y') {
          metaphone += 'S';
        } else {
          metaphone += 'K';
        }
        break;
      case 'D':
        // BUG #9 FIX: Add bounds checking for array access
        if (next === 'G' && i + 2 < word.length && (word[i + 2] === 'E' || word[i + 2] === 'I' || word[i + 2] === 'Y')) {
          metaphone += 'J';
          i += 2;
        } else {
          metaphone += 'T';
        }
        break;
      case 'F':
        metaphone += 'F';
        break;
      case 'G':
        if (next === 'H' && i > 0) {
        } else if (next === 'N' && i === word.length - 2) {
        } else if (next === 'E' || next === 'I' || next === 'Y') {
          metaphone += 'J';
        } else {
          metaphone += 'K';
        }
        break;
      case 'H':
        if (i === 0 || ('AEIOU'.includes(prev || '') && 'AEIOU'.includes(next || ''))) {
          metaphone += 'H';
        }
        break;
      case 'J':
        metaphone += 'J';
        break;
      case 'K':
        if (prev !== 'C') {
          metaphone += 'K';
        }
        break;
      case 'L':
        metaphone += 'L';
        break;
      case 'M':
        metaphone += 'M';
        break;
      case 'N':
        metaphone += 'N';
        break;
      case 'P':
        if (next === 'H') {
          metaphone += 'F';
          i++;
        } else {
          metaphone += 'P';
        }
        break;
      case 'Q':
        metaphone += 'K';
        break;
      case 'R':
        metaphone += 'R';
        break;
      case 'S':
        // BUG #9 FIX: Add bounds checking for array access
        if (next === 'H' || (next === 'I' && i + 2 < word.length && (word[i + 2] === 'O' || word[i + 2] === 'A'))) {
          metaphone += 'X';
          if (next === 'H') i++;
        } else {
          metaphone += 'S';
        }
        break;
      case 'T':
        if (next === 'H') {
          metaphone += '0';
          i++;
        // BUG #9 FIX: Add bounds checking for array access
        } else if (next === 'I' && i + 2 < word.length && (word[i + 2] === 'O' || word[i + 2] === 'A')) {
          metaphone += 'X';
        } else {
          metaphone += 'T';
        }
        break;
      case 'V':
        metaphone += 'F';
        break;
      case 'W':
        if ('AEIOU'.includes(next || '')) {
          metaphone += 'W';
        }
        break;
      case 'X':
        metaphone += 'KS';
        break;
      case 'Y':
        if ('AEIOU'.includes(next || '')) {
          metaphone += 'Y';
        }
        break;
      case 'Z':
        metaphone += 'S';
        break;
    }
    i++;
  }

  return metaphone;
}

export function boyerMooreSearch(text: string, pattern: string): number[] {
  const indices: number[] = [];
  const patternLength = pattern.length;
  const textLength = text.length;

  if (patternLength === 0 || textLength === 0 || patternLength > textLength) {
    return indices;
  }

  const badCharTable = buildBadCharTable(pattern);
  let skip = 0;

  while (skip <= textLength - patternLength) {
    let j = patternLength - 1;

    while (j >= 0 && pattern[j] === text[skip + j]) {
      j--;
    }

    if (j < 0) {
      indices.push(skip);
      skip += patternLength;
    } else {
      const badCharShift = badCharTable.get(text[skip + j]!) ?? patternLength;
      skip += Math.max(1, j - badCharShift);
    }
  }

  return indices;
}

function buildBadCharTable(pattern: string): Map<string, number> {
  const table = new Map<string, number>();
  
  for (let i = 0; i < pattern.length; i++) {
    table.set(pattern[i]!, i);
  }
  
  return table;
}
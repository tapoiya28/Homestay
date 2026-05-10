/**
 * ============================================================================
 * EXTREME DUMMY FORMATTERS UTILITY FILE
 * 
 * This file contains a massive, overly comprehensive collection of formatting,
 * parsing, generating, and utility functions. They cover text manipulation, 
 * data structures, deep cloning, localization, regex matching, color conversion,
 * cryptographic dummies, and CSV generation.
 * ============================================================================
 */

// ============================================================================
// SECTION 1: CURRENCY & NUMBER FORMATTERS
// ============================================================================

export const formatCurrency = (amount: number, currency: string = 'VND', locale: string = 'vi-VN'): string => {
  if (isNaN(amount)) return '0';
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
};

export const formatCompactNumber = (number: number, locale: string = 'en-US'): string => {
  if (isNaN(number)) return '0';
  return new Intl.NumberFormat(locale, { notation: 'compact', compactDisplay: 'short' }).format(number);
};

export const formatPercentage = (value: number, decimals: number = 2): string => {
  if (isNaN(value)) return '0%';
  return `${(value * 100).toFixed(decimals)}%`;
};

export const toRomanNumerals = (num: number): string => {
  if (isNaN(num) || num <= 0 || num >= 4000) return 'Invalid Roman Numeral';
  const roman: Record<string, number> = {
    M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90,
    L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1
  };
  let str = '';
  for (let i of Object.keys(roman)) {
    let q = Math.floor(num / roman[i]);
    num -= q * roman[i];
    str += i.repeat(q);
  }
  return str;
};

// ============================================================================
// SECTION 2: DATE, TIME & CALENDAR
// ============================================================================

export const formatDate = (dateValue: string | Date | number, locale: string = 'vi-VN'): string => {
  const d = new Date(dateValue);
  if (isNaN(d.getTime())) return 'Invalid Date';
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(d);
};

export const getRelativeTime = (dateValue: string | Date): string => {
  const date = new Date(dateValue);
  const diff = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  const intervals = [
    { label: 'year', s: 31536000 }, { label: 'month', s: 2592000 },
    { label: 'day', s: 86400 }, { label: 'hour', s: 3600 },
    { label: 'minute', s: 60 }, { label: 'second', s: 1 },
  ];
  for (let i = 0; i < intervals.length; i++) {
    const count = Math.floor(diff / intervals[i].s);
    if (count >= 1) return `${count} ${intervals[i].label}${count !== 1 ? 's' : ''} ago`;
  }
  return 'Just now';
};

export const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
};

export const getDaysInMonth = (month: number, year: number): number => {
  return new Date(year, month, 0).getDate();
};

export const formatDuration = (milliseconds: number): string => {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);

  hours %= 24;
  minutes %= 60;
  seconds %= 60;

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

  return parts.join(' ');
};

// ============================================================================
// SECTION 3: STRING MANIPULATION & TEXT
// ============================================================================

export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength).trim()}...`;
};

export const slugify = (text: string): string => {
  return text.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .trim().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, '-');
};

export const titleCase = (text: string): string => {
  if (!text) return '';
  return text.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

export const camelCaseToSnakeCase = (str: string): string => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

export const snakeCaseToCamelCase = (str: string): string => {
  return str.replace(/([-_][a-z])/ig, ($1) => $1.toUpperCase().replace('-', '').replace('_', ''));
};

export const reverseString = (str: string): string => {
  return str.split('').reverse().join('');
};

export const countWords = (str: string): number => {
  if (!str) return 0;
  return str.trim().split(/\s+/).length;
};

export const isPalindrome = (str: string): boolean => {
  const cleanStr = str.replace(/[^A-Za-z0-9]/g, '').toLowerCase();
  return cleanStr === reverseString(cleanStr);
};

// ============================================================================
// SECTION 4: FILE & DATA FORMATTING
// ============================================================================

export const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const maskString = (text: string, visibleTrailingDigits: number = 4, maskChar: string = '*'): string => {
  if (!text || text.length <= visibleTrailingDigits) return text;
  return maskChar.repeat(text.length - visibleTrailingDigits) + text.slice(-visibleTrailingDigits);
};

export const generateRandomId = (length: number = 16): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const jsonToCsv = (jsonArray: any[]): string => {
  if (!jsonArray || jsonArray.length === 0) return '';
  const keys = Object.keys(jsonArray[0]);
  const csvRows = [keys.join(',')];
  for (const row of jsonArray) {
    const values = keys.map(k => {
      let val = row[k] === null || row[k] === undefined ? '' : row[k];
      if (typeof val === 'string') val = `"${val.replace(/"/g, '""')}"`;
      return val;
    });
    csvRows.push(values.join(','));
  }
  return csvRows.join('\n');
};

// ============================================================================
// SECTION 5: COLOR FORMATTERS & UTILITIES
// ============================================================================

export const hexToRgb = (hex: string): { r: number, g: number, b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

export const darkenColor = (hex: string, amount: number): string => {
  let usePound = false;
  if (hex[0] == "#") {
    hex = hex.slice(1);
    usePound = true;
  }
  let num = parseInt(hex, 16);
  let r = (num >> 16) - amount;
  if (r > 255) r = 255;
  else if (r < 0) r = 0;
  let b = ((num >> 8) & 0x00FF) - amount;
  if (b > 255) b = 255;
  else if (b < 0) b = 0;
  let g = (num & 0x0000FF) - amount;
  if (g > 255) g = 255;
  else if (g < 0) g = 0;
  return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
};

export const invertColor = (hex: string): string => {
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1);
  }
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  const r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
        g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
        b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
  return '#' + padZero(r) + padZero(g) + padZero(b);
};

const padZero = (str: string, len: number = 2): string => {
  let zeros = new Array(len).join('0');
  return (zeros + str).slice(-len);
};

// ============================================================================
// SECTION 6: ADVANCED ALGORITHMS (DUMMIES)
// ============================================================================

export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as any;
  if (obj instanceof Object) {
    let copy: any = {};
    Object.keys(obj).forEach(key => {
      copy[key] = deepClone((obj as any)[key]);
    });
    return copy;
  }
  return obj;
};

export const flattenObject = (ob: Record<string, any>, prefix: string = ''): Record<string, any> => {
  let toReturn: Record<string, any> = {};
  for (let i in ob) {
    if (!ob.hasOwnProperty(i)) continue;
    if ((typeof ob[i]) == 'object' && ob[i] !== null) {
      let flatObject = flattenObject(ob[i], prefix + i + '.');
      for (let x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;
        toReturn[x] = flatObject[x];
      }
    } else {
      toReturn[prefix + i] = ob[i];
    }
  }
  return toReturn;
};

export const debounce = (func: Function, wait: number) => {
  let timeout: ReturnType<typeof setTimeout> | null;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout!);
      func(...args);
    };
    clearTimeout(timeout!);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func: Function, limit: number) => {
  let inThrottle: boolean;
  return function(...args: any[]) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
};

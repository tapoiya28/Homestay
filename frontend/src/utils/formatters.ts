/**
 * DUMMY FORMATTERS UTILITY FILE
 * This file contains a wide variety of formatting functions 
 * designed to handle dates, numbers, strings, and other common data types.
 */

// ============================================================================
// CURRENCY & NUMBER FORMATTERS
// ============================================================================

/**
 * Formats a given number into a specific currency format.
 * @param amount - The numerical amount to format.
 * @param currency - The currency code (e.g., 'VND', 'USD', 'EUR').
 * @param locale - The locale string (e.g., 'vi-VN', 'en-US').
 */
export const formatCurrency = (amount: number, currency: string = 'VND', locale: string = 'vi-VN'): string => {
  if (isNaN(amount)) return '0';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Formats a large number into a compact, human-readable string (e.g., 1.5K, 2M).
 */
export const formatCompactNumber = (number: number, locale: string = 'en-US'): string => {
  if (isNaN(number)) return '0';
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(number);
};

/**
 * Formats a decimal number into a percentage string.
 */
export const formatPercentage = (value: number, decimals: number = 2): string => {
  if (isNaN(value)) return '0%';
  return `${(value * 100).toFixed(decimals)}%`;
};

// ============================================================================
// DATE & TIME FORMATTERS
// ============================================================================

/**
 * Formats a Date object or ISO string into a standard localized date string.
 */
export const formatDate = (dateValue: string | Date | number, locale: string = 'vi-VN'): string => {
  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) throw new Error('Invalid date');
    
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid Date';
  }
};

/**
 * Calculates the relative time difference from now (e.g., "2 hours ago").
 */
export const getRelativeTime = (dateValue: string | Date): string => {
  const date = new Date(dateValue);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ];

  for (let i = 0; i < intervals.length; i++) {
    const interval = intervals[i];
    const count = Math.floor(diffInSeconds / interval.seconds);
    
    if (count >= 1) {
      return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
    }
  }
  return 'Just now';
};

/**
 * Extracts and formats the time portion from a Date object.
 */
export const formatTime = (dateValue: string | Date, includeSeconds: boolean = false): string => {
  const date = new Date(dateValue);
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };
  
  if (includeSeconds) {
    options.second = '2-digit';
  }
  
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

// ============================================================================
// STRING & TEXT FORMATTERS
// ============================================================================

/**
 * Truncates a string to a specified length and appends an ellipsis.
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength).trim()}...`;
};

/**
 * Converts a regular string into a URL-friendly slug.
 */
export const slugify = (text: string): string => {
  return text
    .toString()
    .normalize('NFD')                   // split an accented letter in the base letter and the accent
    .replace(/[\u0300-\u036f]/g, '')   // remove all previously split accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 ]/g, '')        // remove all chars not letters, numbers and spaces (to be replaced)
    .replace(/\s+/g, '-');             // separator
};

/**
 * Capitalizes the first letter of each word in a string.
 */
export const titleCase = (text: string): string => {
  if (!text) return '';
  return text.toLowerCase().split(' ').map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
};

// ============================================================================
// FILE & DATA FORMATTERS
// ============================================================================

/**
 * Formats raw byte sizes into human-readable strings (KB, MB, GB, etc.).
 */
export const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

/**
 * Masks a credit card or phone number, showing only the last few digits.
 */
export const maskString = (text: string, visibleTrailingDigits: number = 4, maskChar: string = '*'): string => {
  if (!text || text.length <= visibleTrailingDigits) return text;
  
  const visiblePart = text.slice(-visibleTrailingDigits);
  const maskedPart = maskChar.repeat(text.length - visibleTrailingDigits);
  
  return `${maskedPart}${visiblePart}`;
};

/**
 * Generates a dummy random string of a given length (useful for IDs).
 */
export const generateRandomId = (length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

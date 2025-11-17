// Date formatting and conversion utilities

/**
 * Converts a date from YYYY-MM-DD format to dd/MM/YYYY format
 * @param dateString - Date string in YYYY-MM-DD format (ISO format)
 * @returns Date string in dd/MM/YYYY format
 */
export const formatDateToDDMMYYYY = (dateString: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};

/**
 * Converts a date from dd/MM/YYYY format to YYYY-MM-DD format
 * @param dateString - Date string in dd/MM/YYYY format
 * @returns Date string in YYYY-MM-DD format (ISO format)
 */
export const formatDateToISO = (dateString: string): string => {
  if (!dateString) return '';
  
  const parts = dateString.split('/');
  if (parts.length !== 3) return '';
  
  const [day, month, year] = parts;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

/**
 * Formats a date to "25th Nov 23" format
 * @param dateString - Date string in YYYY-MM-DD or dd/MM/YYYY format
 * @returns Date string in "25th Nov 23" format
 */
export const formatDateToReadable = (dateString: string): string => {
  if (!dateString) return '';
  
  let date: Date;
  
  // Check if it's in dd/MM/YYYY format
  if (dateString.includes('/')) {
    const isoDate = formatDateToISO(dateString);
    date = new Date(isoDate);
  } else {
    // Assume it's in YYYY-MM-DD format
    date = new Date(dateString);
  }
  
  if (isNaN(date.getTime())) return '';
  
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = String(date.getFullYear()).slice(-2);
  
  // Add ordinal suffix to day (1st, 2nd, 3rd, 4th, etc.)
  const suffix = getOrdinalSuffix(day);
  
  return `${day}${suffix} ${month} ${year}`;
};

/**
 * Gets the ordinal suffix for a number (st, nd, rd, th)
 * @param day - Day of the month
 * @returns Ordinal suffix
 */
const getOrdinalSuffix = (day: number): string => {
  if (day > 3 && day < 21) return 'th';
  
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
};

/**
 * Validates if a date string is in valid YYYY-MM-DD format
 * @param dateString - Date string to validate
 * @returns true if valid, false otherwise
 */
export const isValidDate = (dateString: string): boolean => {
  if (!dateString) return false;
  
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

/**
 * Checks if endDate is after startDate
 * @param startDate - Start date in YYYY-MM-DD or dd/MM/YYYY format
 * @param endDate - End date in YYYY-MM-DD or dd/MM/YYYY format
 * @returns true if endDate is after startDate, false otherwise
 */
export const isEndDateAfterStartDate = (startDate: string, endDate: string): boolean => {
  if (!startDate || !endDate) return false;
  
  let start: Date;
  let end: Date;
  
  // Convert dd/MM/YYYY to Date if needed
  if (startDate.includes('/')) {
    start = new Date(formatDateToISO(startDate));
  } else {
    start = new Date(startDate);
  }
  
  if (endDate.includes('/')) {
    end = new Date(formatDateToISO(endDate));
  } else {
    end = new Date(endDate);
  }
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return false;
  
  return end > start;
};

/**
 * Gets today's date in YYYY-MM-DD format
 * @returns Today's date in YYYY-MM-DD format
 */
export const getTodayISO = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};


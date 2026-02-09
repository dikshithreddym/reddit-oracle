export const ET_TIMEZONE_OFFSET = -5; // Default ET offset (UTC-5)

/**
 * Get current time in ET (Eastern Time)
 * @returns Date object in ET
 */
export const getCurrentETTime = (): Date => {
  const now = new Date();
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
  const etOffset = ET_TIMEZONE_OFFSET * 60 * 60 * 1000;
  return new Date(utcTime + etOffset);
};

/**
 * Format time in ET for display
 * @param date Date to format
 * @param includeTime Whether to include time in output
 * @returns Formatted date string in ET
 */
export const formatETTime = (date: Date, includeTime: boolean = true): string => {
  const etDate = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
    options.hour12 = true;
  }
  
  return new Intl.DateTimeFormat('en-US', options).format(etDate);
};

/**
 * Check if current time is past the daily deadline (6 PM ET)
 * @returns Boolean indicating if deadline has passed
 */
export const isAfterDeadline = (): boolean => {
  const now = getCurrentETTime();
  return now.getHours() >= 18; // 6 PM ET
};

/**
 * Get time remaining until next deadline (6 PM ET)
 * @returns Object with hours, minutes, and seconds remaining
 */
export const getTimeUntilDeadline = (): { hours: number, minutes: number, seconds: number } => {
  const now = getCurrentETTime();
  const deadline = new Date(now);
  
  if (isAfterDeadline()) {
    // If past today's deadline, schedule for tomorrow
    deadline.setDate(deadline.getDate() + 1);
  }
  
  // Set time to 18:00:00 ET
  deadline.setHours(18, 0, 0, 0);
  
  const diffMs = deadline.getTime() - now.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
  
  return { hours, minutes, seconds };
};

/**
 * Get the date for today's challenge (in ET)
 * @returns Date string formatted as YYYY-MM-DD
 */
export const getTodaysChallengeDate = (): string => {
  const now = getCurrentETTime();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

/**
 * Format time duration in a human-readable format
 * @param ms Duration in milliseconds
 * @returns Formatted duration string
 */
export const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
};

/**
 * Get the current week number
 * @param date Date to check (defaults to now)
 * @returns Week number
 */
export const getWeekNumber = (date: Date = new Date()): number => {
  // Copy the date to avoid modifying the original
  const tempDate = new Date(date);
  tempDate.setHours(0, 0, 0, 0);
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  tempDate.setDate(tempDate.getDate() + 4 - (tempDate.getDay() || 7));
  // Get first day of year
  const yearStart = new Date(tempDate.getFullYear(), 0, 1);
  // Calculate full weeks to nearest Thursday
  const weekNumber = Math.ceil((((tempDate.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  
  return weekNumber;
};
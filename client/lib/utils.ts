
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateString));
};

export const calculateGST = (amount: number, rate: number = 18): number => {
  return (amount * rate) / 100;
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .filter(word => word.length > 0)
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

/**
 * Checks if a date falls within an Indian Financial Year (April 1 to March 31).
 * Season format: "2024-25" or "All"
 */
export const isInSeason = (dateString: string, season: string): boolean => {
  if (season === 'All') return true;
  
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 1-12
  
  const [startYearStr] = season.split('-');
  const startYear = parseInt(startYearStr);
  
  // FY 2024-25 is April 2024 to March 2025
  const isAfterAprilOfStartYear = year === startYear && month >= 4;
  const isBeforeMarchOfEndYear = year === startYear + 1 && month <= 3;
  
  return isAfterAprilOfStartYear || isBeforeMarchOfEndYear;
};

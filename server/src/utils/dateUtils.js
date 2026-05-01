const MS_PER_DAY = 24 * 60 * 60 * 1000;

export const startOfUtcDay = (date) =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));

export const calculateDaysBetween = (fromDate, toDate = new Date()) => {
  const from = startOfUtcDay(new Date(fromDate));
  const to = startOfUtcDay(new Date(toDate));

  return Math.floor((to - from) / MS_PER_DAY);
};

export const isFutureDate = (date) => calculateDaysBetween(date) < 0;

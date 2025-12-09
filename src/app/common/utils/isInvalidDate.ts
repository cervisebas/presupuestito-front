export function isInvalidDate(date: Date) {
  if (!(date instanceof Date)) {
    return true;
  }

  return Number.isNaN(date.getDate());
}

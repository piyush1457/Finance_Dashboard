import { format, parseISO } from 'date-fns';

export function formatDate(dateString, dateFormat = 'dd MMM yyyy') {
  if (!dateString) return '';
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  return format(date, dateFormat);
}

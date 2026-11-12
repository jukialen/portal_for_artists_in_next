'use server';

import { LangType } from 'types/global.types';
import { getCurrentLocale } from 'locales/server';

export const getDate = async (dateField: string) => {
  const locale: LangType = await getCurrentLocale();

  if (!dateField) return '';

  const date = new Date(dateField);

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // optional, forces the 24-hour format
  }).format(date);
};

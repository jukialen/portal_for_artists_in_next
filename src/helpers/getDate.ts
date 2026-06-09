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

export const toLocalISO = (dateStr: string) => {
  const d = new Date(dateStr);
  // Przesunięcie o strefę czasową, by wyświetlić poprawną godzinę w inpucie
  const offset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - offset).toISOString().slice(0, 16);
};
const safeISO = (dateStr?: string) => toLocalISO(dateStr || new Date().toISOString());
const syncDatesToData = () => {
  // if (allChat.length > 0) {
  //   startDate = safeISO(allChat.at(-1)?.createdAt);
  //   endDate = safeISO(allChat[0]?.createdAt);
  //   sortBy = 'date';
  // }
};

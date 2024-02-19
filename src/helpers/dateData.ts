import { getScopedI18n } from 'locales/server'
import { DateObjectType } from "../types/global.types";

export const dateData = async (): Promise<DateObjectType> => {
  const t = await getScopedI18n('Date');

  return {
    second: t('second'),
    minute: t('minute'),
    hour: t('hour'),
    day: t('day'),
    yearDateSeparator: t('yearDateSeparator'),
  };
};

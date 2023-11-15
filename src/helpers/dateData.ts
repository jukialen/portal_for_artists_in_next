import { getScopedI18n } from 'src/locales/server'

export const dateData = async () => {
  const t = await getScopedI18n('Date');

  return {
    second: t('second'),
    minute: t('minute'),
    hour: t('hour'),
    day: t('day'),
    yearDateSeparator: t('yearDateSeparator'),
  };
};

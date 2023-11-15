import { Metadata } from 'next';
import { setStaticParamsLocale } from 'next-international/server';

import { HeadCom } from 'src/constants/HeadCom';

import { getI18n } from 'src/locales/server';

import { dateData } from 'src/helpers/dateData';

import { Wrapper } from 'src/components/atoms/Wrapper/Wrapper';
import { DrawingsWrapper } from 'src/components/molecules/DrawingsWrapper/DrawingsWrapper';

import styles from './page.module.scss';

export const metadata: Metadata = HeadCom('Sites with drawings and photos.');

export default async function Drawings({ params: { locale, pid } }: { params: { locale: string; pid: string } }) {
  setStaticParamsLocale(locale);

  const t = await getI18n();

  const tDrawingsCategories = {
    category: t('Aside.category'),
    noDrawings: t('ZeroFiles.files'),
  };

  const dataDateObject = await dateData();

  return (
    <>
      <em className={styles.title}>
        {tDrawingsCategories.category}: {pid}
      </em>

      <Wrapper>
        <DrawingsWrapper
          locale={locale}
          pid={pid}
          dataDateObject={dataDateObject}
          noDrawings={tDrawingsCategories.noDrawings}
        />
      </Wrapper>
    </>
  );
}

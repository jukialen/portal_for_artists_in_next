import { dateData } from 'helpers/dateData';

import { Metadata } from 'next';
import { setStaticParamsLocale } from 'next-international/server';

import { HeadCom } from 'constants/HeadCom';

import { getI18n } from 'locales/server';

import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
import { AnothersWrapper } from 'components/molecules/AnothersWrapper/AnothersWrapper';

import styles from './page.module.scss';

export const metadata: Metadata = HeadCom('Subpage with another categories');

export default async function Drawings({ params: { locale, index } }: { params: { locale: string; index: string } }) {
  setStaticParamsLocale(locale);

  const t = await getI18n();

  const tAnotherCategories = {
    category: t('Aside.category'),
    noVideos: t('ZeroFiles.videos'),
  };

  const dataDateObject = await dateData();

  return (
    <article className={styles.categories__index__in__account}>
      <em className={styles.title}>
        {tAnotherCategories.category}: {index}
      </em>

      <Wrapper>
        <AnothersWrapper
          locale={locale}
          index={index}
          dataDateObject={dataDateObject}
          noVideos={tAnotherCategories.noVideos}
        />
      </Wrapper>
    </article>
  );
}

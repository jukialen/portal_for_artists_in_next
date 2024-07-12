import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { setStaticParamsLocale } from 'next-international/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

import { cloudFrontUrl } from 'constants/links';
import { Database } from 'types/database.types';
import { FileType, IndexType, LangType } from "types/global.types";

import { getI18n } from 'locales/server';

import { dateData } from 'helpers/dateData';
import { getDate } from 'helpers/getDate';
import { getUserData } from 'helpers/getUserData';

import { HeadCom } from 'constants/HeadCom';

import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
import { AnothersWrapper } from 'components/molecules/AnothersWrapper/AnothersWrapper';

import styles from './page.module.scss';

const downloadDrawings = async ({
  index,
  locale,
  maxItems,
  dataDateObject,
}: {
  index: IndexType;
  locale: LangType;
  maxItems: number;
  dataDateObject: { second: string; minute: string; hour: string; day: string; yearDateSeparator: string };
}) => {
  try {
    const filesArray: FileType[] = [];
    const supabase = createServerComponentClient<Database>({ cookies });
    const select =
      'fileId, name, shortDescription, pseudonym, profilePhoto, authorId, createdAt, updatedAt, Users (pseudonym, profilePhoto, id)';

    const { data } = await supabase
      .from('files')
      .select(select)
      .eq('tags', index)
      .order('name', { ascending: false })
      .limit(maxItems);

    if (data?.length === 0) return filesArray;

    for (const draw of data!) {
      const { fileId, name, shortDescription, Users, authorId, createdAt, updatedAt } = draw;

      filesArray.push({
        fileId,
        name,
        shortDescription,
        pseudonym: Users[0].pseudonym!,
        profilePhoto: `https://${cloudFrontUrl}/${Users[0].profilePhoto!}`,
        fileUrl: `https://${cloudFrontUrl}/${name}`,
        authorId,
        time: getDate(locale!, updatedAt! || createdAt!, dataDateObject),
      });
    }

    return filesArray;
  } catch (e) {
    console.error('10drawingsE', e);
  }
};

export const metadata: Metadata = HeadCom('Subpage with another categories');

export default async function Drawings({ params: { locale, index } }: { params: { locale: LangType; index: IndexType } }) {
  setStaticParamsLocale(locale);

  const t = await getI18n();

  const tAnotherCategories = {
    category: t('Aside.category'),
    noVideos: t('ZeroFiles.videos'),
  };

  const dataDateObject = await dateData();
  const maxItems = 30;

  const filesArray = await downloadDrawings({ index, locale, maxItems, dataDateObject });
  const userData = await getUserData();

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
          filesArray={filesArray!}
          userData={userData!}
        />
      </Wrapper>
    </article>
  );
}

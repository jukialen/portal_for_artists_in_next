import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { setStaticParamsLocale } from 'next-international/server';

import { HeadCom } from 'constants/HeadCom';
import { selectFiles } from 'constants/selects';
import { Database } from 'types/database.types';
import { DateObjectType, FileType, LangType, Tags } from 'types/global.types';

import { getI18n } from 'locales/server';

import { dateData } from 'helpers/dateData';
import { getDate } from 'helpers/getDate';
import { getUserData } from 'helpers/getUserData';

import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
import { DrawingsWrapper } from 'components/molecules/DrawingsWrapper/DrawingsWrapper';

import styles from './page.module.scss';

export const metadata: Metadata = HeadCom('Sites with drawings and photos.');

const supabase = createServerComponentClient<Database>({ cookies });

async function getFirstDrawings(pid: string, maxItems: number, locale: LangType, dataDateObject: DateObjectType) {
  try {
    const filesArray: FileType[] = [];

    const { data, error } = await supabase
      .from('Files')
      .select(selectFiles)
      .eq('tags', pid)
      .order('createdAt', { ascending: false })
      .limit(maxItems);

    if (data?.length === 0 || !!error) return filesArray;

    for (const file of data) {
      const { fileId, fileUrl, name, shortDescription, Users, authorId, createdAt, updatedAt } = file;

      filesArray.push({
        fileId,
        name,
        shortDescription: shortDescription!,
        authorName: Users?.pseudonym!,
        fileUrl: fileUrl,
        authorId: authorId!,
        time: getDate(locale!, updatedAt! || createdAt!, dataDateObject),
      });
    }

    return filesArray;
  } catch (e) {
    console.error(e);
    console.log('No such drawings!');
  }
}

export default async function Drawings({ params: { locale, pid } }: { params: { locale: LangType; pid: Tags } }) {
  setStaticParamsLocale(locale);

  const t = await getI18n();

  const tDrawingsCategories = {
    category: t('Aside.category'),
    noDrawings: t('ZeroFiles.files'),
  };

  const user = await getUserData();
  const dataDateObject = await dateData();

  const drawings = await getFirstDrawings(pid, 30, locale, dataDateObject);

  return (
    <>
      <em className={styles.title}>
        {tDrawingsCategories.category}: {pid}
      </em>

      <Wrapper>
        <DrawingsWrapper
          locale={locale}
          pid={pid}
          pseudonym={user?.pseudonym!}
          dataDateObject={dataDateObject}
          noDrawings={tDrawingsCategories.noDrawings}
          filesDrawings={drawings}
        />
      </Wrapper>
    </>
  );
}

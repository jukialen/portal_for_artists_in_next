import { Metadata } from 'next';
import { setStaticParamsLocale } from 'next-international/server';

import { HeadCom } from 'constants/HeadCom';
import { selectFiles } from 'constants/selects';
import { DateObjectType, FileType, LangType, Tags } from 'types/global.types';

import { getI18n } from 'locales/server';

import { dateData } from 'helpers/dateData';
import { getDate } from 'helpers/getDate';
import { getUserData } from 'helpers/getUserData';
import { createServer } from 'utils/supabase/clientSSR';

import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
import { DrawingsWrapper } from 'components/molecules/DrawingsWrapper/DrawingsWrapper';

import styles from './page.module.scss';

export const metadata: Metadata = HeadCom('Sites with drawings and photos.');

async function getFirstDrawings(pid: string, maxItems: number, locale: LangType, dataDateObject: DateObjectType) {
  const filesArray: FileType[] = [];
  
  try {
    const supabase = await createServer();
    
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
    return filesArray;
  }
}

export default async function Drawings({ params }: { params: Promise<{ locale: LangType; pid: Tags }> }) {
  const { locale, pid } = await params;
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
          profilePhoto={user?.profilePhoto!}
          dataDateObject={dataDateObject}
          noDrawings={tDrawingsCategories.noDrawings}
          filesDrawings={drawings}
        />
      </Wrapper>
    </>
  );
}

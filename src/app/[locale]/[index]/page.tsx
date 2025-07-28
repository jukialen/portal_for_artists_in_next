import { Metadata } from 'next';
import { setStaticParamsLocale } from 'next-international/server';
import { createServer } from 'utils/supabase/clientSSR';

import { selectFiles } from 'constants/selects';
import { DateObjectType, FileType, IndexType, LangType } from 'types/global.types';

import { getI18n } from 'locales/server';

import { dateData } from 'helpers/dateData';
import { getDate } from 'helpers/getDate';

import { HeadCom } from 'constants/HeadCom';

import { AnothersWrapper } from 'components/molecules/AnothersWrapper/AnothersWrapper';

import styles from './page.module.scss';
import { getUserData } from 'helpers/getUserData';
import { error } from '@chakra-ui/utils';
import { getMoreRenderedContent } from '../actions';

const downloadDrawings = async ({
  index,
  locale,
  maxItems,
  dataDateObject,
}: {
  index: IndexType;
  locale: LangType;
  maxItems: number;
  dataDateObject: DateObjectType;
}) => {
  try {
    const filesArray: FileType[] = [];
    const supabase = await createServer();

    const { data } = await supabase
      .from('Files')
      .select(selectFiles)
      .eq('tags', index)
      .order('name', { ascending: false })
      .limit(maxItems);

    if (!!error || data?.length === 0) return filesArray;

    for (const draw of data!) {
      const { fileId, name, shortDescription, Users, fileUrl, authorId, createdAt, updatedAt } = draw;

      filesArray.push({
        authorName: Users?.pseudonym!,
        fileId,
        name,
        shortDescription: shortDescription!,
        fileUrl,
        authorId: authorId!,
        time: getDate(locale!, updatedAt! || createdAt!, dataDateObject),
      });
    }

    return filesArray;
  } catch (e) {
    console.error('10drawingsE', e);
  }
};

export const metadata: Metadata = HeadCom('Subpage with another categories');

export default async function Drawings({ params }: { params: Promise<{ locale: LangType; index: IndexType }> }) {
  const { locale, index } = await params;
  setStaticParamsLocale(locale);

  const t = await getI18n();

  const tAnotherCategories = {
    category: t('Aside.category'),
    noVideos: t('ZeroFiles.videos'),
  };

  const user = await getUserData();

  const dataDateObject = await dateData();
  const maxItems = 30;

  const filesArray = await downloadDrawings({ index, locale, maxItems, dataDateObject });

  return (
    <article className={styles.categories__index__in__account}>
      <em className={styles.title}>
        {tAnotherCategories.category}: {index}
      </em>

      <AnothersWrapper
        index={index}
        pseudonym={user?.pseudonym!}
        profilePhoto={user?.profilePhoto!}
        noVideos={tAnotherCategories.noVideos}
        filesArray={filesArray!}
        initialRenderedContentAction={() => getMoreRenderedContent({ files: filesArray!, noEls: 1 })}
      />
    </article>
  );
}

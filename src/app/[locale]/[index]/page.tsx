import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { setStaticParamsLocale } from 'next-international/server';

import { HeadCom } from 'constants/HeadCom';
import { selectFiles } from 'constants/selects';
import { FileType, IndexType, LangType } from 'types/global.types';

import { getI18n } from 'locales/server';

import { getDate } from 'helpers/getDate';
import { getUserData } from 'helpers/getUserData';
import { getFileRoleId } from 'utils/server/roles';
import { createServer } from 'utils/supabase/clientSSR';

const FileContainerClient = dynamic(() =>
  import('components/functional/organisms/FileContainerClient/FileContainerClient').then(
    (fc) => fc.FileContainerClient,
  ),
);

import styles from './page.module.css';
import { likeList } from '../../../utils/likes';

const downloadDrawings = async ({ index, maxItems }: { index: IndexType; locale: LangType; maxItems: number }) => {
  const filesArray: FileType[] = [];

  try {
    const supabase = await createServer();

    const { data, error } = await supabase
      .from('Files')
      .select(selectFiles)
      .eq('tags', index)
      .order('name', { ascending: false })
      .limit(maxItems);

    if (!!error || data?.length === 0) return filesArray;

    for (const draw of data!) {
      const { fileId, name, shortDescription, Users, fileUrl, createdAt, updatedAt, authorId, tags } = draw;

      const role = await getFileRoleId(fileId, authorId!);
      if (role.roleId === 'no id') return filesArray;

      filesArray.push({
        fileId,
        shortDescription: shortDescription!,
        fileUrl,
        tags,
        name,
        authorName: Users?.pseudonym!,
        authorId: authorId!,
        roleId: role.roleId,
        time: await getDate(updatedAt || createdAt!),
        liked: (await likeList(authorId!, fileId)).liked,
        likes: (await likeList(authorId!, fileId)).likes,
        idLiked: (await likeList(authorId!, fileId)).idLiked,
      });
    }

    return filesArray;
  } catch (e) {
    console.error('10drawingsE', e);
    return filesArray;
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

  const maxItems = 30;
  const userData = await getUserData();

  const filesArray = await downloadDrawings({ index, locale, maxItems });

  return (
    <article className={styles.categories__index__in__account}>
      <em className={styles.title}>
        {tAnotherCategories.category}: {index}
      </em>

      <FileContainerClient index={index} pseudonym={userData?.pseudonym!} filesArray={filesArray} />
    </article>
  );
}

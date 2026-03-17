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

import { DrawingsWrapper } from 'components/wrappers/DrawingsWrapper/DrawingsWrapper';

import styles from './page.module.scss';
import { getFileRoleId } from '../../../../utils/roles';

export const metadata: Metadata = HeadCom('Sites with drawings and photos.');

async function getFirstDrawings(pid: Tags, maxItems: number, dataDateObject: DateObjectType) {
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
      const { fileId, fileUrl, name, authorId, shortDescription, tags, Users, createdAt, updatedAt } = file;

      const role = await getFileRoleId(fileId, authorId!);
      if (role.roleId === 'no id') return filesArray;

      filesArray.push({
        fileId,
        name,
        shortDescription: shortDescription!,
        authorName: Users?.pseudonym!,
        fileUrl: fileUrl,
        authorId: authorId!,
        roleId: role.roleId,
        tags,
        time: await getDate(updatedAt! || createdAt!, dataDateObject),
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
  };

  const dataDateObject = await dateData();
  const userData = await getUserData();
  const pseudonym = userData?.pseudonym!;

  const drawings = await getFirstDrawings(pid, 30, dataDateObject);

  return (
    <>
      <em className={styles.title}>
        {tDrawingsCategories.category}: {pid}
      </em>

      <DrawingsWrapper pid={pid} pseudonym={pseudonym} filesDrawings={drawings} />
    </>
  );
}

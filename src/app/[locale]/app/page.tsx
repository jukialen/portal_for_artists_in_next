import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { NextResponse } from 'next/server';
import { setStaticParamsLocale } from 'next-international/server';

import { HeadCom } from 'constants/HeadCom';
import { selectFiles } from 'constants/selects';
import { DateObjectType, FileType, LangType, Tags } from 'types/global.types';

import { getScopedI18n } from 'locales/server';

import { getDate } from 'helpers/getDate';
import { getUserData } from 'helpers/getUserData';
import { dateData } from 'helpers/dateData';
import { getFileRoleId } from 'utils/roles';
import { createServer } from 'utils/supabase/clientSSR';

import { AppWrapper } from 'components/atoms/AppWrapper/AppWrapper';
const ZeroFiles = dynamic(() => import('components/atoms/ZeroFiles/ZeroFiles').then((zf) => zf.ZeroFiles));
const FileContainer = dynamic(() =>
  import('components/molecules/FileContainer/FileContainer').then((fc) => fc.FileContainer),
);

import styles from './page.module.scss';

export const metadata: Metadata = HeadCom('Main site for logged in users.');

async function getTop10Drawings(maxItems: number, dataDateObject: DateObjectType) {
  try {
    const filesArray: FileType[] = [];

    const supabase = await createServer();

    const { data, error } = await supabase
      .from('Files')
      .select(selectFiles)
      .in('tags', ['realistic', 'manga', 'anime', 'comics'])
      .order('createdAt', { ascending: false })
      .limit(maxItems);

    if (data?.length === 0 || !!error) {
      return filesArray;
    }

    for (const draw of data) {
      const { fileId, name, shortDescription, fileUrl, Users, authorId, createdAt, updatedAt } = draw;

      const roleId = await getFileRoleId(fileId, authorId!);

      roleId === 'no id' && NextResponse.json(filesArray);
      filesArray.push({
        fileId,
        name,
        shortDescription: shortDescription!,
        authorName: Users?.pseudonym!,
        fileUrl,
        time: await getDate(updatedAt! || createdAt!, dataDateObject),
      });
    }

    return filesArray;
  } catch (e) {
    console.error('10drawingsE', e);
  }
}

async function getTop10Pavo(maxItems: number, tag: Tags, dataDateObject: DateObjectType) {
  try {
    const filesArray: FileType[] = [];

    const supabase = await createServer();

    const { data } = await supabase
      .from('Files')
      .select(selectFiles)
      .eq('tags', tag)
      .order('createdAt', { ascending: false })
      .limit(maxItems);

    if (data?.length === 0) {
      return filesArray;
    }

    if (!!data && data.length > 0) {
      for (const draw of data!) {
        const { fileId, name, shortDescription, fileUrl, Users, authorId, createdAt, updatedAt } = draw;

        const roleId = await getFileRoleId(fileId, authorId!);

        filesArray.push({
          fileId,
          name,
          shortDescription: shortDescription!,
          authorName: Users?.pseudonym!,
          fileUrl,
          time: await getDate(updatedAt! || createdAt!, dataDateObject),
        });
      }
    }

    return filesArray;
  } catch (e) {
    console.error(`10d${tag}E`, e);
  }
}

export default async function App({ params }: { params: Promise<{ locale: LangType }> }) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  const tApp = await getScopedI18n('App');
  const tZero = await getScopedI18n('ZeroFiles');

  const dataDateObject = await dateData();

  const maxItems = 10;
  const tags: Tags[] = ['photographs', 'animations', 'videos'];
  const userData = await getUserData();
  const pseudonym = userData?.pseudonym!;

  const drawings = await getTop10Drawings(maxItems, dataDateObject);
  const photos = await getTop10Pavo(maxItems, tags[0], dataDateObject);
  const animations = await getTop10Pavo(maxItems, tags[1], dataDateObject);
  const videos = await getTop10Pavo(maxItems, tags[2], dataDateObject);

  const appData = (data: FileType[]) =>
    data.map(({ fileId, name, fileUrl, shortDescription, tags, authorName, time }: FileType, index) => (
      <FileContainer
        fileId={fileId!}
        name={name!}
        fileUrl={fileUrl}
        shortDescription={shortDescription!}
        tags={tags!}
        authorName={authorName!}
        authorBool={authorName === pseudonym!}
        time={time}
        key={index}
      />
    ));

  return (
    <>
      <h2 className={styles.top__among__users}>{tApp('lastDrawings')}</h2>
      <AppWrapper>
        {!!drawings && drawings?.length > 0 ? appData(drawings) : <ZeroFiles text={tZero('drawings')} />}
      </AppWrapper>

      <h2 className={styles.top__among__users}>{tApp('lastPhotos')}</h2>
      <AppWrapper>{!!photos && photos?.length > 0 ? appData(photos) : <ZeroFiles text={tZero('photos')} />}</AppWrapper>

      <h2 className={styles.top__among__users}>{tApp('lastAnimations')}</h2>
      <AppWrapper>
        {!!animations && animations?.length > 0 ? appData(animations) : <ZeroFiles text={tZero('animations')} />}
      </AppWrapper>

      <h2 className={styles.liked}>{tApp('lastVideos')}</h2>
      <AppWrapper>{!!videos && videos?.length > 0 ? appData(videos) : <ZeroFiles text={tZero('videos')} />}</AppWrapper>
    </>
  );
}

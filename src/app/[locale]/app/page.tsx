import { Metadata } from 'next';
import { setStaticParamsLocale } from 'next-international/server';

import { HeadCom } from 'constants/HeadCom';
import { selectFiles } from 'constants/selects';
import { DateObjectType, FileType, LangType, Tags } from 'types/global.types';

import { getScopedI18n } from 'locales/server';

import { getDate } from 'helpers/getDate';
import { dateData } from 'helpers/dateData';
import { getFileRoleId } from 'utils/roles';
import { createServer } from 'utils/supabase/clientSSR';

import { AppWrapper } from 'components/atoms/AppWrapper/AppWrapper';
import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';
import { AppTop10s } from 'components/molecules/AppTop10s/AppTop10s';

import styles from './page.module.scss';

export const metadata: Metadata = HeadCom('Main site for logged in users.');

async function getTop10Drawings(maxItems: number, locale: LangType, dataDateObject: DateObjectType) {
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

      filesArray.push({
        fileId,
        name,
        shortDescription: shortDescription!,
        authorName: Users?.pseudonym!,
        fileUrl,
        authorId: authorId!,
        time: getDate(locale!, updatedAt! || createdAt!, dataDateObject),
        roleId,
      });
    }

    return filesArray;
  } catch (e) {
    console.error('10drawingsE', e);
  }
}

async function getTop10Pavo(maxItems: number, tag: Tags, locale: LangType, dataDateObject: DateObjectType) {
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
          authorId: authorId!,
          time: getDate(locale!, updatedAt! || createdAt!, dataDateObject),
          roleId,
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

  const drawings = await getTop10Drawings(maxItems, locale, dataDateObject);
  const photos = await getTop10Pavo(maxItems, tags[0], locale, dataDateObject);
  const animations = await getTop10Pavo(maxItems, tags[1], locale, dataDateObject);
  const videos = await getTop10Pavo(maxItems, tags[2], locale, dataDateObject);

  return (
    <>
      <h2 className={styles.top__among__users}>{tApp('lastDrawings')}</h2>
      <AppWrapper>
        {!!drawings && drawings?.length > 0 ? (
          <AppTop10s data={drawings!} type="others" />
        ) : (
          <ZeroFiles text={tZero('drawings')} />
        )}
      </AppWrapper>

      <h2 className={styles.top__among__users}>{tApp('lastPhotos')}</h2>
      <AppWrapper>
        {!!photos && photos?.length > 0 ? (
          <AppTop10s data={photos!} type="others" />
        ) : (
          <ZeroFiles text={tZero('photos')} />
        )}
      </AppWrapper>

      <h2 className={styles.top__among__users}>{tApp('lastAnimations')}</h2>
      <AppWrapper>
        {!!animations && animations?.length > 0 ? (
          <AppTop10s data={animations!} type="others" />
        ) : (
          <ZeroFiles text={tZero('animations')} />
        )}
      </AppWrapper>

      <h2 className={styles.liked}>{tApp('lastVideos')}</h2>
      <AppWrapper>
        {!!videos && videos?.length > 0 ? (
          <AppTop10s data={videos!} type="videos" />
        ) : (
          <ZeroFiles text={tZero('videos')} />
        )}
      </AppWrapper>
    </>
  );
}

import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { setStaticParamsLocale } from 'next-international/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

import { HeadCom } from 'constants/HeadCom';
import { cloudFrontUrl } from 'constants/links';
import { selectFiles } from 'constants/selects';
import { Database } from 'types/database.types';
import { DateObjectType, FileType, LangType } from 'types/global.types';

import { getScopedI18n } from 'locales/server';

import { getDate } from 'helpers/getDate';
import { dateData } from 'helpers/dateData';

import { AppWrapper } from 'components/atoms/AppWrapper/AppWrapper';
import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';
import { AppTop10s } from 'components/molecules/AppTop10s/AppTop10s';

import styles from './page.module.scss';

export const metadata: Metadata = HeadCom('Main site for logged in users.');

const supabase = createServerComponentClient<Database>({ cookies });

async function getTop10Drawings(maxItems: number, locale: LangType, dataDateObject: DateObjectType) {
  try {
    const filesArray: FileType[] = [];

    const { data } = await supabase
      .from('files')
      .select(selectFiles)
      .in('tags', ['realistic', 'manga', 'anime', 'comics'])
      .order('createdAt', { ascending: false })
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
}

async function getTop10Photos(maxItems: number, locale: LangType, dataDateObject: DateObjectType) {
  try {
    const filesArray: FileType[] = [];

    const { data } = await supabase
      .from('files')
      .select(selectFiles)
      .eq('tags', 'photographs')
      .order('createdAt', { ascending: false })
      .limit(maxItems);

    if (data?.length === 0) return filesArray;

    for (const photo of data!) {
      const { fileId, name, shortDescription, Users, authorId, createdAt, updatedAt } = photo;

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
    console.error('10photosE', e);
  }
}

async function getTop10Animations(maxItems: number, locale: LangType, dataDateObject: DateObjectType) {
  try {
    const filesArray: FileType[] = [];

    const { data } = await supabase
      .from('files')
      .select(selectFiles)
      .eq('tags', 'animations')
      .order('createdAt', { ascending: false })
      .limit(maxItems);

    if (data?.length === 0) return filesArray;

    for (const animation of data!) {
      const { fileId, name, shortDescription, Users, authorId, createdAt, updatedAt } = animation;

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
    console.error('10animationsE', e);
  }
}

async function getTop10Videos(maxItems: number, locale: LangType, dataDateObject: DateObjectType) {
  try {
    const filesArray: FileType[] = [];

    const { data } = await supabase
      .from('files')
      .select(selectFiles)
      .eq('tags', 'videos')
      .order('createdAt', { ascending: false })
      .limit(maxItems);

    if (data?.length === 0) return filesArray;

    for (const video of data!) {
      const { fileId, name, shortDescription, Users, authorId, createdAt, updatedAt } = video;

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
    console.error('10videoE', e);
  }
}

async function getTop10Others(maxItems: number, locale: LangType, dataDateObject: DateObjectType) {
  try {
    const filesArray: FileType[] = [];

    const { data } = await supabase
      .from('files')
      .select(selectFiles)
      .eq('tags', 'others')
      .order('createdAt', { ascending: false })
      .limit(maxItems);

    if (data?.length === 0) return filesArray;

    for (const other of data!) {
      const { fileId, name, shortDescription, Users, authorId, createdAt, updatedAt } = other;

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
    console.error('10othersE', e);
  }
}

export default async function App({ params: { locale } }: { params: { locale: LangType } }) {
  setStaticParamsLocale(locale);

  const tApp = await getScopedI18n('App');
  const tZero = await getScopedI18n('ZeroFiles');

  const dataDateObject = await dateData();

  const maxItems = 10;

  const drawings = await getTop10Drawings(maxItems, locale, dataDateObject);

  const photos = await getTop10Photos(maxItems, locale, dataDateObject);

  const downloadAnimations = await getTop10Animations(maxItems, locale, dataDateObject);

  const videos = await getTop10Videos(maxItems, locale, dataDateObject);

  const others = await getTop10Others(maxItems, locale, dataDateObject);

  return (
    <>
      <h2 className={styles.top__among__users}>{tApp('lastDrawings')}</h2>
      <AppWrapper>
        {drawings!.length > 0 ? <AppTop10s data={drawings!} type="others" /> : <ZeroFiles text={tZero('drawings')} />}
      </AppWrapper>

      <h2 className={styles.top__among__users}>{tApp('lastPhotos')}</h2>
      <AppWrapper>
        {photos!.length > 0 ? <AppTop10s data={photos!} type="others" /> : <ZeroFiles text={tZero('photos')} />}
      </AppWrapper>

      <h2 className={styles.top__among__users}>{tApp('lastAnimations')}</h2>
      <AppWrapper>
        {downloadAnimations!.length > 0 ? (
          <AppTop10s data={downloadAnimations!} type="others" />
        ) : (
          <ZeroFiles text={tZero('animations')} />
        )}
      </AppWrapper>

      <h2 className={styles.liked}>{tApp('lastVideos')}</h2>
      <AppWrapper>
        {videos!.length > 0 ? <AppTop10s data={videos!} type="videos" /> : <ZeroFiles text={tZero('videos')} />}
      </AppWrapper>

      <h2 className={styles.top__among__users}>{tApp('lastOthers')}</h2>
      <AppWrapper>
        {others!.length > 0 ? <AppTop10s data={others!} type="others" /> : <ZeroFiles text={tZero('others')} />}
      </AppWrapper>
    </>
  );
}

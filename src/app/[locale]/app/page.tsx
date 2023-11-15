import { Metadata } from 'next';
import { setStaticParamsLocale } from 'next-international/server';

import { HeadCom } from 'src/constants/HeadCom';
import { backUrl, cloudFrontUrl } from 'src/constants/links';

import { getScopedI18n } from 'src/locales/server';

import { FileType } from 'src/types/global.types';

import { getDate } from 'src/helpers/getDate';
import { get } from 'src/helpers/methods';

import { dateData } from 'src/helpers/dateData';

import { AppWrapper } from 'src/components/atoms/AppWrapper/AppWrapper';
import { ZeroFiles } from 'src/components/atoms/ZeroFiles/ZeroFiles';
import { AppTop10s } from 'src/components/molecules/AppTop10s/AppTop10s';
import { SkeletonRootLayout } from 'src/components/organisms/SkeletonRootLayout/SkeletonRootLayout';

import styles from './page.module.scss';

type DataDateObjectType = { second: string; minute: string; hour: string; day: string; yearDateSeparator: string };

export const metadata: Metadata = HeadCom('Main site for logged in users.');

async function getTop10Drawings(maxItems: string, locale: string, dataDateObject: DataDateObjectType) {
  try {
    const filesArray: FileType[] = [];

    const drawings = await get(`${backUrl}/files/all`, {
      queryData: {
        where: {
          AND: [{ tags: 'realistic' }, { tags: 'manga' }, { tags: 'anime' }, { tags: 'comics' }],
        },
        orderBy: { createdAt: 'desc' },
        limit: maxItems,
      },
    });

    for (const draw of drawings) {
      const { fileId, name, shortDescription, pseudonym, profilePhoto, authorId, createdAt, updatedAt } = draw;

      filesArray.push({
        fileId,
        name,
        shortDescription,
        pseudonym,
        profilePhoto,
        fileUrl: `https://${cloudFrontUrl}/${name}`,
        authorId,
        time: getDate(locale!, updatedAt! || createdAt!, dataDateObject),
      });
    }

    return filesArray;
  } catch (e) {
    console.log('e', e);
  }
}

async function getTop10Photos(maxItems: string, locale: string, dataDateObject: DataDateObjectType) {
  const filesArray: FileType[] = [];

  const photographs: { data: FileType[] } = await get(`${backUrl}/files/all`, {
    queryData: {
      where: { tags: 'photographs' },
      orderBy: { createdAt: 'desc' },
      limit: maxItems,
    },
  });

  for (const photo of photographs.data) {
    const { fileId, name, shortDescription, pseudonym, profilePhoto, authorId, createdAt, updatedAt } = photo;

    filesArray.push({
      fileId,
      name,
      shortDescription,
      pseudonym,
      profilePhoto,
      fileUrl: `https://${cloudFrontUrl}/${name}`,
      authorId,
      time: getDate(locale!, updatedAt! || createdAt!, dataDateObject),
    });
  }

  return filesArray;
}

async function getTop10Animations(maxItems: string, locale: string, dataDateObject: DataDateObjectType) {
  const filesArray: FileType[] = [];

  const animations: { data: FileType[] } = await get(`${backUrl}/files/all`, {
    queryData: {
      where: { tags: 'animations' },
      orderBy: { createdAt: 'desc' },
      limit: maxItems,
    },
  });

  for (const animation of animations.data) {
    const { fileId, name, shortDescription, pseudonym, profilePhoto, authorId, createdAt, updatedAt } = animation;

    filesArray.push({
      fileId,
      name,
      shortDescription,
      pseudonym,
      profilePhoto,
      fileUrl: `https://${cloudFrontUrl}/${name}`,
      authorId,
      time: getDate(locale!, updatedAt! || createdAt!, dataDateObject),
    });
  }
  return filesArray;
}

async function getTop10Videos(maxItems: string, locale: string, dataDateObject: DataDateObjectType) {
  const filesArray: FileType[] = [];

  const videos: { data: FileType[] } = await get(`${backUrl}/files/all`, {
    queryData: {
      where: { tags: 'videos' },
      orderBy: { createdAt: 'desc' },
      limit: maxItems,
    },
  });

  for (const video of videos.data) {
    const { fileId, name, shortDescription, pseudonym, profilePhoto, authorId, createdAt, updatedAt } = video;

    filesArray.push({
      fileId,
      name,
      shortDescription,
      pseudonym,
      profilePhoto,
      fileUrl: `https://${cloudFrontUrl}/${name}`,
      authorId,
      time: getDate(locale!, updatedAt! || createdAt!, dataDateObject),
    });
  }

  return filesArray;
}

async function getTop10Others(maxItems: string, locale: string, dataDateObject: DataDateObjectType) {
  const filesArray: FileType[] = [];

  const others: { data: FileType[] } = await get(`${backUrl}/files/all`, {
    queryData: {
      where: { tags: 'others' },
      orderBy: { createdAt: 'desc' },
      limit: maxItems,
    },
  });

  for (const other of others.data) {
    const { fileId, name, shortDescription, pseudonym, profilePhoto, authorId, createdAt, updatedAt } = other;

    filesArray.push({
      fileId,
      name,
      shortDescription,
      pseudonym,
      profilePhoto,
      fileUrl: `https://${cloudFrontUrl}/${name}`,
      authorId,
      time: getDate(locale!, updatedAt! || createdAt!, dataDateObject),
    });
  }

  return filesArray;
}

export default async function App({ params: { locale } }: { params: { locale: string } }) {
  setStaticParamsLocale(locale);

  const tApp = await getScopedI18n('App');
  const tZero = await getScopedI18n('ZeroFiles');

  const dataDateObject = await dateData();

  const maxItems = '10';

  const downloadDrawings = await getTop10Drawings(maxItems, locale, dataDateObject);

  const downloadPhotos = await getTop10Photos(maxItems, locale, dataDateObject);

  const downloadAnimations = await getTop10Animations(maxItems, locale, dataDateObject);

  const downloadVideos = await getTop10Videos(maxItems, locale, dataDateObject);

  const downloadOthers = await getTop10Others(maxItems, locale, dataDateObject);

  return (
    <>
      <h2 className={styles.top__among__users}>{tApp('lastDrawings')}</h2>
      <AppWrapper>
        {downloadDrawings!.length > 0 ? (
          <AppTop10s data={downloadDrawings!} type="other" />
        ) : (
          <ZeroFiles text={tZero('drawings')} />
        )}
      </AppWrapper>

      <h2 className={styles.top__among__users}>{tApp('lastPhotos')}</h2>
      <AppWrapper>
        {downloadPhotos.length > 0 ? (
          <AppTop10s data={downloadPhotos} type="other" />
        ) : (
          <ZeroFiles text={tZero('photos')} />
        )}
      </AppWrapper>

      <h2 className={styles.top__among__users}>{tApp('lastAnimations')}</h2>
      <AppWrapper>
        {downloadAnimations.length > 0 ? (
          <AppTop10s data={downloadAnimations} type="other" />
        ) : (
          <ZeroFiles text={tZero('animations')} />
        )}
      </AppWrapper>

      <h2 className={styles.liked}>{tApp('lastVideos')}</h2>
      <AppWrapper>
        {downloadVideos.length > 0 ? (
          <AppTop10s data={downloadVideos} type="videos" />
        ) : (
          <ZeroFiles text={tZero('videos')} />
        )}
      </AppWrapper>

      <h2 className={styles.top__among__users}>{tApp('lastOthers')}</h2>
      <AppWrapper>
        {downloadOthers.length > 0 ? (
          <AppTop10s data={downloadOthers} type="other" />
        ) : (
          <ZeroFiles text={tZero('others')} />
        )}
      </AppWrapper>
    </>
  );
}

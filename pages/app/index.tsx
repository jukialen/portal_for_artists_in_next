import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

import { backUrl, cloudFrontUrl } from 'utilites/constants';

import { FileType } from 'types/global.types';

import { getDate } from 'helpers/getDate';

import { useCurrentUser } from 'hooks/useCurrentUser';
import { useDateData } from 'hooks/useDateData';
import { useHookSWR } from 'hooks/useHookSWR';

import { AppWrapper } from 'components/atoms/AppWrapper/AppWrapper';
import { HeadCom } from 'components/atoms/HeadCom/HeadCom';
import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';
import { Article } from 'components/molecules/Article/Article';
import { Videos } from 'components/molecules/Videos/Videos';

import styles from './index.module.scss';

export default function App() {
  const [userDrawings, setUserDrawings] = useState<FileType[]>([]);
  const [userPhotos, setUserPhotos] = useState<FileType[]>([]);
  const [userAnimations, setUserAnimations] = useState<FileType[]>([]);
  const [userVideos, setUserVideos] = useState<FileType[]>([]);
  const [userOthers, setUserOthers] = useState<FileType[]>([]);

  const { asPath, locale } = useRouter();

  const dataDateObject = useDateData();
  const data = useHookSWR();

  const maxItems = 10;

  const downloadDrawings = async () => {
    try {
      const filesArray: FileType[] = [];
      const drawings: { data: FileType[] } = await axios.get(`${backUrl}/files/all`, {
        params: {
          queryData: {
            where: {
              AND: [{ tags: 'realistic' }, { tags: 'manga' }, { tags: 'anime' }, { tags: 'comics' }],
            },
            orderBy: { createdAt: 'desc' },
            limit: maxItems,
          },
        },
      });

      for (const draw of drawings.data) {
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

      setUserDrawings(filesArray);
    } catch (e) {
      console.error('Error', e);
      console.error('No such drawings!');
    }
  };

  const downloadPhotos = async () => {
    try {
      const filesArray: FileType[] = [];
      const photographs: { data: FileType[] } = await axios.get(`${backUrl}/files/all`, {
        params: {
          queryData: {
            where: { tags: 'photographs' },
            orderBy: { createdAt: 'desc' },
            limit: maxItems,
          },
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

      setUserPhotos(filesArray);
    } catch (e) {
      console.error('Error', e);
      console.error('No such photos!');
    }
  };

  const downloadAnimations = async () => {
    try {
      const filesArray: FileType[] = [];
      const animations: { data: FileType[] } = await axios.get(`${backUrl}/files/all`, {
        params: {
          queryData: {
            where: { tags: 'animations' },
            orderBy: { createdAt: 'desc' },
            limit: maxItems,
          },
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

      setUserAnimations(filesArray);
    } catch (e) {
      console.error('Error', e);
      console.error('No such animations!');
    }
  };

  const downloadVideos = async () => {
    try {
      const filesArray: FileType[] = [];
      const videos: { data: FileType[] } = await axios.get(`${backUrl}/files/all`, {
        params: {
          queryData: {
            where: { tags: 'videos' },
            orderBy: { createdAt: 'desc' },
            limit: maxItems,
          },
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

      setUserVideos(filesArray);
    } catch (e) {
      console.error('Error', e);
      console.error('No such videos!');
    }
  };

  const downloadOthers = async () => {
    try {
      const filesArray: FileType[] = [];
      const others: { data: FileType[] } = await axios.get(`${backUrl}/files/all`, {
        params: {
          queryData: {
            where: { tags: 'others' },
            orderBy: { createdAt: 'desc' },
            limit: maxItems,
          },
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

      setUserOthers(filesArray);
    } catch (e) {
      console.error('Error', e);
      console.error('No such others!');
    }
  };

  useEffect(() => {
    downloadDrawings();
  }, []);
  useEffect(() => {
    downloadPhotos();
  }, []);
  useEffect(() => {
    downloadAnimations();
  }, []);
  useEffect(() => {
    downloadVideos();
  }, []);
  useEffect(() => {
    downloadOthers();
  }, []);

  useCurrentUser('/signin');
  //    return null;
  //  }

  return (
    <>
      <HeadCom path={asPath} content="Main site for logged in users." />

      <h2 className={styles.top__among__users}>{data?.App?.lastDrawings}</h2>
      <AppWrapper>
        {userDrawings.length > 0 && userDrawings.length > 0 ? (
          userDrawings.map(
            (
              { fileId, name, fileUrl, shortDescription, tags, pseudonym, profilePhoto, authorId, time }: FileType,
              index,
            ) => (
              <Article
                key={index}
                fileId={fileId!}
                name={name!}
                fileUrl={fileUrl}
                shortDescription={shortDescription!}
                tags={tags!}
                authorName={pseudonym!}
                profilePhoto={profilePhoto}
                authorId={authorId}
                time={time}
              />
            ),
          )
        ) : (
          <ZeroFiles text={data?.ZeroFiles?.drawings} />
        )}
      </AppWrapper>

      <h2 className={styles.top__among__users}>{data?.App?.lastPhotos}</h2>
      <AppWrapper>
        {userPhotos.length > 0 ? (
          userPhotos.map(
            (
              { fileId, name, fileUrl, shortDescription, tags, pseudonym, profilePhoto, authorId, time }: FileType,
              index,
            ) => (
              <Article
                key={index}
                fileId={fileId!}
                name={name!}
                fileUrl={fileUrl}
                shortDescription={shortDescription!}
                tags={tags!}
                authorName={pseudonym!}
                profilePhoto={profilePhoto}
                authorId={authorId}
                time={time}
              />
            ),
          )
        ) : (
          <ZeroFiles text={data?.ZeroFiles?.photos} />
        )}
      </AppWrapper>

      <h2 className={styles.top__among__users}>{data?.App?.lastAnimations}</h2>
      <AppWrapper>
        {userAnimations.length > 0 ? (
          userAnimations.map(
            (
              { fileId, name, fileUrl, shortDescription, tags, pseudonym, profilePhoto, authorId, time }: FileType,
              index,
            ) => (
              <Article
                key={index}
                fileId={fileId!}
                name={name!}
                fileUrl={fileUrl}
                shortDescription={shortDescription!}
                tags={tags!}
                authorName={pseudonym!}
                profilePhoto={profilePhoto}
                authorId={authorId}
                time={time}
              />
            ),
          )
        ) : (
          <ZeroFiles text={data?.ZeroFiles?.animations} />
        )}
      </AppWrapper>

      <h2 className={styles.liked}>{data?.App?.lastVideos}</h2>
      <AppWrapper>
        {userVideos.length > 0 ? (
          userVideos.map(
            (
              { fileId, name, fileUrl, shortDescription, tags, pseudonym, profilePhoto, authorId, time }: FileType,
              index,
            ) => (
              <Videos
                key={index}
                fileId={fileId!}
                name={name!}
                fileUrl={fileUrl}
                shortDescription={shortDescription!}
                tags={tags!}
                authorName={pseudonym!}
                profilePhoto={profilePhoto}
                authorId={authorId}
                time={time}
              />
            ),
          )
        ) : (
          <ZeroFiles text={data?.ZeroFiles?.videos} />
        )}
      </AppWrapper>

      <h2 className={styles.top__among__users}>{data?.App?.lastOthers}</h2>
      <AppWrapper>
        {userOthers.length > 0 ? (
          userOthers.map(
            (
              { fileId, name, fileUrl, shortDescription, tags, pseudonym, profilePhoto, authorId, time }: FileType,
              index,
            ) => (
              <Article
                key={index}
                fileId={fileId!}
                name={name!}
                fileUrl={fileUrl}
                shortDescription={shortDescription!}
                tags={tags!}
                authorName={pseudonym!}
                profilePhoto={profilePhoto}
                authorId={authorId}
                time={time}
              />
            ),
          )
        ) : (
          <ZeroFiles text={data?.ZeroFiles?.others} />
        )}
      </AppWrapper>
    </>
  );
}

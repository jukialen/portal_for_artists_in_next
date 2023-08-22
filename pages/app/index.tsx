import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import url from 'url';

import { backUrl, cloudFrontUrl } from 'utilites/constants';

import { FileType, Tags } from 'types/global.types';

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
    const queryParams = {
      orderBy: 'name, desc',
      where: `{
            AND: [{ tags: ${Tags.realistic} }, { tags: ${Tags.manga} }, { tags: ${Tags.anime} }, { tags: ${Tags.comics} }],
          }`,
      limit: maxItems.toString(),
    };
    const params = new url.URLSearchParams(queryParams);

    try {
      const filesArray: FileType[] = [];
      const drawings: FileType[] = await axios.get(`${backUrl}/files/all?${params}`);

      for (const draw of drawings) {
        const { fileId, name, shortDescription, pseudonym, profilePhoto, authorId, createdAt, updatedAt } = draw;

        filesArray.push({
          fileId,
          name,
          shortDescription,
          pseudonym,
          profilePhoto,
          fileUrl: `${cloudFrontUrl}/${name}`,
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
    const queryParams = {
      orderBy: 'name, desc',
      where: `{ tags: ${Tags.photographs} }`,
      limit: maxItems.toString(),
    };
    const params = new url.URLSearchParams(queryParams);

    try {
      const filesArray: FileType[] = [];
      const photographs: FileType[] = await axios.get(`${backUrl}/files/all?${params}`);

      for (const photo of photographs) {
        const { fileId, name, shortDescription, pseudonym, profilePhoto, authorId, createdAt, updatedAt } = photo;

        filesArray.push({
          fileId,
          name,
          shortDescription,
          pseudonym,
          profilePhoto,
          fileUrl: `${cloudFrontUrl}/${name}`,
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
    const queryParams = {
      orderBy: 'name, desc',
      where: `{ tags: ${Tags.animations} }`,
      limit: maxItems.toString(),
    };
    const params = new url.URLSearchParams(queryParams);

    try {
      const filesArray: FileType[] = [];
      const animations: FileType[] = await axios.get(`${backUrl}/files?${params}`);

      for (const animation of animations) {
        const { fileId, name, shortDescription, pseudonym, profilePhoto, authorId, createdAt, updatedAt } = animation;

        filesArray.push({
          fileId,
          name,
          shortDescription,
          pseudonym,
          profilePhoto,
          fileUrl: `${cloudFrontUrl}/${name}`,
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
    const queryParams = {
      orderBy: 'name, desc',
      where: `{ tags: ${Tags.videos} }`,
      limit: maxItems.toString(),
    };
    const params = new url.URLSearchParams(queryParams);

    try {
      const filesArray: FileType[] = [];
      const videos: FileType[] = await axios.get(`${backUrl}/files?${params}`);

      for (const video of videos) {
        const { fileId, name, shortDescription, pseudonym, profilePhoto, authorId, createdAt, updatedAt } = video;

        filesArray.push({
          fileId,
          name,
          shortDescription,
          pseudonym,
          profilePhoto,
          fileUrl: `${cloudFrontUrl}/${name}`,
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
    const queryParams = {
      orderBy: 'name, desc',
      where: `{ tags: ${Tags.others} }`,
      limit: maxItems.toString(),
    };
    const params = new url.URLSearchParams(queryParams);

    try {
      const filesArray: FileType[] = [];
      const others: FileType[] = await axios.get(`${backUrl}/files?${params}`);

      for (const other of others) {
        const { fileId, name, shortDescription, pseudonym, profilePhoto, authorId, createdAt, updatedAt } = other;

        filesArray.push({
          fileId,
          name,
          shortDescription,
          pseudonym,
          profilePhoto,
          fileUrl: `${cloudFrontUrl}/${name}`,
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

  if (useCurrentUser('/signin')) {
    return null;
  }

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

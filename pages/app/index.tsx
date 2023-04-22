import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

import { backUrl, cloudFrontUrl } from 'utilites/constants';

import { FileType, UserType } from 'types/global.types';

import { useCurrentUser } from 'hooks/useCurrentUser';
import { useHookSWR } from 'hooks/useHookSWR';
import { useUserData } from 'hooks/useUserData';

import { Article } from 'components/molecules/Article/Article';
import { Videos } from 'components/molecules/Videos/Videos';
import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';
import { HeadCom } from 'components/atoms/HeadCom/HeadCom';
import { AppWrapper } from 'components/atoms/AppWrapper/AppWrapper';

import styles from './index.module.scss';

export default function Application() {
  const { asPath } = useRouter();

  const data = useHookSWR();
  const loading = useCurrentUser('/');
  const { id } = useUserData();

  const [userDrawings, setUserDrawings] = useState<FileType[]>([]);
  const [userPhotos, setUserPhotos] = useState<FileType[]>([]);
  const [userAnimations, setUserAnimations] = useState<FileType[]>([]);
  const [userVideos, setUserVideos] = useState<FileType[]>([]);
  const [userOthers, setUserOthers] = useState<FileType[]>([]);

  const maxItems = 30;

  const downloadDrawings = async () => {
    try {
      const filesArray: FileType[] = [];

      const drawings: FileType[] = await axios.get(`${backUrl}/files`, {
        params: {
          where: {
            AND: [{ tags: 'realistic' }, { tags: 'manga' }, { tags: 'anime' }, { tags: 'comics' }],
          },
          limit: maxItems,
          sortBy: 'name, DESC',
        },
      });
      for (const draw of drawings) {
        const owner: UserType = await axios.get(`${backUrl}/users/${draw.ownerFile}`);

        filesArray.push({
          name: draw.name,
          fileUrl: `${cloudFrontUrl}/${draw.name}`,
          tags: draw.tags,
          time: draw.updatedAt! || draw.createdAt!,
          authorName: owner.pseudonym,
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
      const photographs: FileType[] = await axios.get(`${backUrl}/files`, {
        params: {
          where: {
            AND: [{ tags: 'photographs' }],
          },
          limit: maxItems,
          sortBy: 'name, DESC',
        },

      });
      for (const photo of photographs) {
        const owner: UserType = await axios.get(`${backUrl}/users/${photo.ownerFile}`);

        filesArray.push({
          name: photo.name,
          fileUrl: `${cloudFrontUrl}/${photo.name}`,
          tags: photo.tags,
          time: photo.updatedAt! || photo.createdAt!,
          authorName: owner.pseudonym,
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
      const animations: FileType[] = await axios.get(`${backUrl}/files`, {
        params: {
          where: {
            AND: [{ tags: 'photographs' }],
          },
          limit: maxItems,
          sortBy: 'name, DESC',
        },
      });
      for (const animation of animations) {
        const owner: UserType = await axios.get(`${backUrl}/users/${animation.ownerFile}`);

        filesArray.push({
          name: animation.name,
          fileUrl: `${cloudFrontUrl}/${animation.name}`,
          tags: animation.tags,
          time: animation.updatedAt! || animation.createdAt!,
          authorName: owner.pseudonym,
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
      const videos: FileType[] = await axios.get(`${backUrl}/files`, {
        params: {
          where: {
            AND: [{ tags: 'photographs' }],
          },
          limit: maxItems,
          sortBy: 'name, DESC',
        },
      });
      for (const video of videos) {
        const owner: UserType = await axios.get(`${backUrl}/users/${video.ownerFile}`);

        filesArray.push({
          name: video.name,
          fileUrl: `${cloudFrontUrl}/${video.name}`,
          tags: video.tags,
          time: video.updatedAt! || video.createdAt!,
          authorName: owner.pseudonym,
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
      const others: FileType[] = await axios.get(`${backUrl}/files`, {
        params: {
          where: {
            AND: [{ tags: 'photographs' }],
          },
          limit: maxItems,
          sortBy: 'name, DESC',
        },
      });
      for (const other of others) {
        const owner: UserType = await axios.get(`${backUrl}/users/${other.ownerFile}`);

        filesArray.push({
          name: other.name,
          fileUrl: `${cloudFrontUrl}/${other.name}`,
          tags: other.tags,
          time: other.updatedAt! || other.createdAt!,
          authorName: owner.pseudonym,
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

  if (loading) {
    return null;
  }

  return (
    <>
      <HeadCom path={asPath} content="Main site for logged in users." />

      <h2 className={styles.top__among__users}>{data?.App?.lastDrawings}</h2>
      <AppWrapper>
        {userDrawings.length > 0 && userDrawings.length > 0 ? (
          userDrawings.map(({ name, fileUrl, authorName, tags, time }: FileType, index) => (
            <Article key={index} name={name} fileUrl={fileUrl} authorName={authorName} tags={tags} time={time} />
          ))
        ) : (
          <ZeroFiles text={data?.ZeroFiles?.drawings} />
        )}
      </AppWrapper>

      <h2 className={styles.top__among__users}>{data?.App?.lastPhotos}</h2>
      <AppWrapper>
        {userPhotos.length > 0 ? (
          userPhotos.map(({ name, fileUrl, authorName, tags, time }: FileType, index) => (
            <Article key={index} name={name} fileUrl={fileUrl} authorName={authorName} tags={tags} time={time} />
          ))
        ) : (
          <ZeroFiles text={data?.ZeroFiles?.photos} />
        )}
      </AppWrapper>

      <h2 className={styles.top__among__users}>{data?.App?.lastAnimations}</h2>
      <AppWrapper>
        {userAnimations.length > 0 ? (
          userAnimations.map(({ name, fileUrl, authorName, tags, time }: FileType, index) => (
            <Article key={index} name={name} fileUrl={fileUrl} authorName={authorName} tags={tags} time={time} />
          ))
        ) : (
          <ZeroFiles text={data?.ZeroFiles?.animations} />
        )}
      </AppWrapper>

      <h2 className={styles.liked}>{data?.App?.lastVideos}</h2>
      <AppWrapper>
        {userVideos.length > 0 ? (
          userVideos.map(({ name, fileUrl, authorName, tags, time }: FileType, index) => (
            <Videos key={index} name={name} fileUrl={fileUrl} authorName={authorName} tags={tags} time={time} />
          ))
        ) : (
          <ZeroFiles text={data?.ZeroFiles?.videos} />
        )}
      </AppWrapper>

      <h2 className={styles.top__among__users}>{data?.App?.lastOthers}</h2>
      <AppWrapper>
        {userOthers.length > 0 ? (
          userOthers.map(({ name, fileUrl, authorName, tags, time }: FileType, index) => (
            <Article key={index} name={name} fileUrl={fileUrl} authorName={authorName} tags={tags} time={time} />
          ))
        ) : (
          <ZeroFiles text={data?.ZeroFiles?.others} />
        )}
      </AppWrapper>
    </>
  );
}

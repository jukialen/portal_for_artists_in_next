import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import url from 'url';

import { Skeleton } from '@chakra-ui/react';

import { FileType, Tags } from 'types/global.types';

import { backUrl, cloudFrontUrl } from 'utilites/constants';

import { getDate } from 'helpers/getDate';

import { useCurrentUser } from 'hooks/useCurrentUser';
import { useDateData } from 'hooks/useDateData';
import { useHookSWR } from 'hooks/useHookSWR';

import { MoreButton } from 'components/atoms/MoreButton/MoreButton';
import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';
import { HeadCom } from 'components/atoms/HeadCom/HeadCom';
import { Article } from 'components/molecules/Article/Article';
import { Videos } from 'components/molecules/Videos/Videos';

import styles from './categories_index.module.scss';

export default function Drawings() {
  const [userDrawings, setUserDrawings] = useState<FileType[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [lastVisible, setLastVisible] = useState<string>();
  let [i, setI] = useState(1);

  const data = useHookSWR();
  const dataDateObject = useDateData();
  const router = useRouter();
  const { index } = router.query;

  const maxItems: number = 10;

  const downloadDrawings = async () => {
    const queryParams = {
      orderBy: 'name, desc',
      where: `{ tags: ${index} }`,
      limit: maxItems.toString(),
    };
    const params = new url.URLSearchParams(queryParams);

    try {
      const filesArray: FileType[] = [];
      const firstPage: FileType[] = await axios.get(`${backUrl}/files/all?${params}`);

      for (const file of firstPage) {
        const { fileId, name, shortDescription, pseudonym, profilePhoto, authorId, createdAt, updatedAt } = file;

        filesArray.push({
          fileId,
          name,
          shortDescription,
          pseudonym,
          profilePhoto,
          fileUrl: `${cloudFrontUrl}/${name}`,
          authorId,
          time: getDate(router.locale!, updatedAt! || createdAt!, dataDateObject),
        });
      }

      setUserDrawings(filesArray);
      setLoadingFiles(true);
    } catch (e) {
      console.error('Error', e);
      console.error('No such document!');
    }
  };

  useEffect(() => {
    !!index && downloadDrawings();
  }, [index]);

  const nextElements = async () => {
    const queryParamsWithCursor = {
      orderBy: 'name, desc',
      where: `{ tags: ${index} }`,
      limit: maxItems.toString(),
      cursor: lastVisible!,
    };
    const params = new url.URLSearchParams(queryParamsWithCursor);

    try {
      const filesArray: FileType[] = [];
      const nextArray: FileType[] = await axios.get(`${backUrl}/files/all?${params}`);

      for (const file of nextArray) {
        const { fileId, name, shortDescription, pseudonym, profilePhoto, authorId, createdAt, updatedAt } = file;

        filesArray.push({
          fileId,
          name,
          shortDescription,
          pseudonym,
          profilePhoto,
          fileUrl: `${cloudFrontUrl}/${name}`,
          authorId,
          time: getDate(router.locale!, updatedAt! || createdAt!, dataDateObject),
        });
      }

      setLastVisible(filesArray[filesArray.length - 1].fileId);
      const newArray = userDrawings.concat(...nextArray);
      setUserDrawings(newArray);
      setI(++i);
    } catch (e) {
      console.error(e);
    }
  };

  if (useCurrentUser('/signin')) {
    return null;
  }

  return (
    <article className={styles.categories__index__in__account}>
      <HeadCom path={router.asPath} content={`Subpage with ${index}`} />

      <em className={styles.title}>
        {data?.Aside?.category}: {index}
      </em>

      <Wrapper>
        {userDrawings.length > 0 ? (
          userDrawings.map(
            (
              { fileId, name, fileUrl, shortDescription, tags, pseudonym, profilePhoto, authorId, time }: FileType,
              keyIndex,
            ) => (
              <Skeleton isLoaded={loadingFiles} key={keyIndex}>
                {tags === Tags.videos ? (
                  <Videos
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
                ) : (
                  <Article
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
                )}
              </Skeleton>
            ),
          )
        ) : (
          <ZeroFiles text={data?.ZeroFiles?.videos} />
        )}
        {!!lastVisible && userDrawings.length === maxItems * i && <MoreButton nextElements={nextElements} />}
      </Wrapper>
    </article>
  );
}

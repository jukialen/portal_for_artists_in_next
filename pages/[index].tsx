import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Skeleton } from '@chakra-ui/react';

import { FileType } from 'types/global.types';

import { backUrl, cloudFrontUrl } from 'utilites/constants';

import { getDate } from 'helpers/getDate';

import { useCurrentUser } from 'hooks/useCurrentUser';
import { useDateData } from 'hooks/useDateData';
import { useHookSWR } from 'hooks/useHookSWR';

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
  const date = useDateData();
  const router = useRouter();
  const { index } = router.query;
  const loading = useCurrentUser('/');

  const maxItems: number = 10;

  const downloadDrawings = async () => {
    try {
      const filesArray: FileType[] = [];

      const firstPage: FileType[] = await axios.get(`${backUrl}/files`, {
        params: {
          where: { tags: index },
          orderBy: 'timeCreated, desc',
          limit: maxItems,
        },
      });
      for (const file of firstPage) {
        filesArray.push({
          name: file.name,
          fileUrl: `${cloudFrontUrl}/${file.name}`,
          pseudonym: file.pseudonym,
          profilePhoto: file.profilePhoto,
          time: getDate(router.locale!, file.updatedAt! || file.createdAt!, date),
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
    try {
      const filesArray: FileType[] = [];

      const nextArray: FileType[] = await axios.get(`${backUrl}/files`, {
        params: {
          where: { tags: index },
          orderBy: 'createdAt, desc',
          limit: maxItems,
          cursor: lastVisible,
        },
      });

      for (const file of nextArray) {
        filesArray.push({
          name: file.name,
          fileUrl: `${cloudFrontUrl}/${file.name}`,
          pseudonym: file.pseudonym,
          profilePhoto: file.profilePhoto,
          time: getDate(router.locale!, file.updatedAt! || file.createdAt!, date),
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

  return !loading ? (
    <>
      <article className={styles.categories__index__in__account}>
        <HeadCom path={router.asPath} content={`Subpage with ${index}`} />

        <em className={styles.title}>
          {data?.Aside?.category}: {index}
        </em>

        <Wrapper>
          {userDrawings.length > 0 ? (
            userDrawings.map(({ fileUrl, time, name, pseudonym, tags }: FileType) => (
              <Skeleton isLoaded={loadingFiles} key={time}>
                {index === 'videos' ? (
                  <Videos fileUrl={fileUrl} name={name} pseudonym={pseudonym} tags={tags} time={time} />
                ) : (
                  <Article fileUrl={fileUrl} name={name} authorName={pseudonym!} tags={tags} time={time} />
                )}
              </Skeleton>
            ))
          ) : (
            <ZeroFiles text={data?.ZeroFiles?.videos} />
          )}
        </Wrapper>
      </article>
    </>
  ) : null;
}

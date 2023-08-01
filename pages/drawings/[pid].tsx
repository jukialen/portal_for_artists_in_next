import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

import { FileType } from 'types/global.types';

import { getDate } from 'helpers/getDate';

import { backUrl, cloudFrontUrl } from 'utilites/constants';

import { useCurrentUser } from 'hooks/useCurrentUser';
import { useDateData } from 'hooks/useDateData';
import { useHookSWR } from 'hooks/useHookSWR';

import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';
import { HeadCom } from 'components/atoms/HeadCom/HeadCom';
import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';
import { Article } from 'components/molecules/Article/Article';

import styles from './index.module.scss';

export default function Drawings() {
  const [userDrawings, setUserDrawings] = useState<FileType[]>([]);
  const [lastVisible, setLastVisible] = useState<string>();
  let [i, setI] = useState(1);

  const router = useRouter();
  const { pid } = router.query;
  const data = useHookSWR();
  const date = useDateData();

  const maxItems = 30;

  const downloadDrawings = async () => {
    try {
      const filesArray: FileType[] = [];

      const firstPage: FileType[] = await axios.get(`${backUrl}/files`, {
        params: {
          where: { tags: pid! },
          orderBy: 'createdAt, desc',
          limit: maxItems,
          cursor: lastVisible,
        },
      });

      for (const file of firstPage) {
        filesArray.push({
          fileId: file.fileId,
          name: file.name,
          fileUrl: `${cloudFrontUrl}/${file.name}`,
          pseudonym: file.pseudonym,
          profilePhoto: file.profilePhoto,
          time: getDate(router.locale!, file.updatedAt! || file.createdAt!, date),
        });
      }

      setUserDrawings(filesArray);
      filesArray.length === maxItems && setLastVisible(filesArray[filesArray.length - 1].fileId);
    } catch (e) {
      console.error(e);
      console.log('No such drawings!');
    }
  };

  const nextElements = async () => {
    try {
      const filesArray: FileType[] = [];

      const nextArray: FileType[] = await axios.get(`${backUrl}/files`, {
        params: {
          where: { tags: pid! },
          orderBy: 'createdAt, desc',
          limit: maxItems,
          cursor: lastVisible,
        },
      });

      for (const file of nextArray) {
        filesArray.push({
          fileId: file.fileId,
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

  useCurrentUser('/');

  useEffect(() => {
    !!pid && downloadDrawings();
  }, [pid]);

  return (
    <>
      <HeadCom path={router.asPath} content="Sites with drawings and photos." />

      <em className={styles.title}>
        {data?.Aside?.category}: {pid}
      </em>

      <Wrapper>
        {userDrawings.length > 0 ? (
          userDrawings.map(({ fileUrl, time, pseudonym, tags, fileId }: FileType, index) => (
            <Article key={index} fileUrl={fileUrl} authorName={pseudonym!} tags={tags} fileId={fileId} time={time} />
          ))
        ) : (
          <ZeroFiles text={data?.ZeroFiles?.files} />
        )}

        {!!lastVisible && userDrawings.length === maxItems * i && <MoreButton nextElements={nextElements} />}
      </Wrapper>
    </>
  );
}

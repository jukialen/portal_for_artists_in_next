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
  const maxItems = 30;
  const dataDateObject = useDateData();

  const downloadDrawings = async () => {
    try {
      const filesArray: FileType[] = [];

      const firstPage: { data: FileType[] } = await axios.get(`${backUrl}/files/all`, {
        params: {
          queryData: {
            orderBy: { createdAt: 'desc' },
            where: { tags: pid },
            limit: maxItems,
          },
        },
      });

      for (const file of firstPage.data) {
        const { fileId, name, shortDescription, pseudonym, profilePhoto, authorId, createdAt, updatedAt } = file;

        filesArray.push({
          fileId,
          name,
          shortDescription,
          pseudonym,
          profilePhoto,
          fileUrl: `https://${cloudFrontUrl}/${name}`,
          authorId,
          time: getDate(router.locale!, updatedAt! || createdAt!, dataDateObject),
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

      const nextArray: { data: FileType[] } = await axios.get(`${backUrl}/files/all`, {
        params: {
          queryData: {
            orderBy: { createdAt: 'desc' },
            where: { tags: pid },
            limit: maxItems,
            cursor: lastVisible,
          },
        },
      });

      for (const file of nextArray.data) {
        const { fileId, name, shortDescription, pseudonym, profilePhoto, authorId, createdAt, updatedAt } = file;

        filesArray.push({
          fileId,
          name,
          shortDescription,
          pseudonym,
          profilePhoto,
          fileUrl: `https://${cloudFrontUrl}/${name}`,
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

  useEffect(() => {
    !!pid && downloadDrawings();
  }, [pid]);

  if (useCurrentUser('/signin')) {
    return null;
  }

  return (
    <>
      <HeadCom path={router.asPath} content="Sites with drawings and photos." />

      <em className={styles.title}>
        {data?.Aside?.category}: {pid}
      </em>

      <Wrapper>
        {userDrawings.length > 0 ? (
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
          <ZeroFiles text={data?.ZeroFiles?.files} />
        )}

        {!!lastVisible && userDrawings.length === maxItems * i && <MoreButton nextElements={nextElements} />}
      </Wrapper>
    </>
  );
}

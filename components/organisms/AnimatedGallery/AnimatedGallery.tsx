import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

import { FileType, UserType } from 'types/global.types';

import { backUrl, cloudFrontUrl } from 'utilites/constants';

import { filesElements } from 'helpers/fileElements';

import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';
import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';
import { Article } from 'components/molecules/Article/Article';

export const AnimatedGallery = ({ user, pseudonym, data }: UserType) => {
  const [userAnimatedPhotos, setUserAnimatedPhotos] = useState<FileType[]>([]);
  const [lastVisible, setLastVisible] = useState<FileType>();
  let [i, setI] = useState(1);

  const { asPath } = useRouter();

  const maxItems = 30;

  const downloadAnimations = async () => {
    try {
      const firstPage: [{ name: string; ownerFile: string; createdAt: string; updatedAt: string }] = await axios.get(
        `${backUrl}/files`,
        {
          params: {
            where: {
              AND: [{ tags: 'animations' }, { pseudonym }],
            },
            limit: maxItems,
            sortBy: 'name, DESC',
          },
        },
      );

      const filesArray: FileType[] = [];

      for (const file of firstPage) {
        filesArray.push({
          fileUrl: `${cloudFrontUrl}/${file.name}`,
          time: file.updatedAt || file.createdAt,
          pseudonym,
          description: file.name,
        });
      }

      setUserAnimatedPhotos(filesArray);
      filesArray.length === maxItems && setLastVisible(filesArray[filesArray.length - 1]);
    } catch (e) {
      console.log('No such document!', e);
    }
  };

  useEffect(() => {
    !!user && downloadAnimations();
  }, [user]);

  const nextElements = async () => {
    try {
      const nextPage: [{ name: string; ownerFile: string; createdAt: string; updatedAt: string }] = await axios.get(
        `${backUrl}/files`,
        {
          params: {
            where: {
              AND: [{ tags: 'animations' }, { pseudonym }],
            },
            limit: maxItems,
            sortBy: 'name, DESC',
            cursor: lastVisible,
          },
        },
      );

      const nextArray: FileType[] = [];

      for (const file of nextPage) {
        nextArray.push({
          fileUrl: `${cloudFrontUrl}/files`,
          time: file.updatedAt || file.createdAt,
          pseudonym,
          description: file.name,
        });
      }
      const newArray = userAnimatedPhotos.concat(...nextArray);
      setLastVisible(newArray[newArray.length - 1]);
      setUserAnimatedPhotos(newArray);
      setI(++i);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <article id="user__gallery__in__account" className="user__gallery__in__account">
      {decodeURIComponent(asPath) === `/account/${pseudonym}` && (
        <em className="title">{data?.Account?.gallery?.userAnimationsTitle}</em>
      )}

      <Wrapper>
        {userAnimatedPhotos.length > 0 ? (
          userAnimatedPhotos.map(({ fileUrl, description, time, tags }: FileType, index) => (
            <Article
              key={index}
              link={fileUrl}
              subCollection="animations"
              time={time}
              description={description}
              tag={tags}
              unopt
            />
          ))
        ) : (
          <ZeroFiles text={data?.ZeroFiles?.animations} />
        )}

        {!!lastVisible && userAnimatedPhotos.length === maxItems * i && <MoreButton nextElements={nextElements} />}
      </Wrapper>
    </article>
  );
};

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

import { FileType, UserType } from 'types/global.types';

import { backUrl, cloudFrontUrl } from 'utilites/constants';

import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';
import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';
import { Article } from 'components/molecules/Article/Article';

export const AnimatedGallery = ({ id, pseudonym, data }: UserType) => {
  const [userAnimatedPhotos, setUserAnimatedPhotos] = useState<FileType[]>([]);
  const [lastVisible, setLastVisible] = useState<FileType>();
  let [i, setI] = useState(1);

  const { asPath } = useRouter();

  const maxItems = 30;

  const downloadAnimations = async () => {
    try {
      const firstPage: FileType[] = await axios.get(`${backUrl}/files`, {
        params: {
          where: {
            AND: [{ tags: 'animations' }, { ownerFile: id }],
          },
          limit: maxItems,
          sortBy: 'name, DESC',
        },
      });

      const filesArray: FileType[] = [];

      for (const file of firstPage) {
        filesArray.push({
          name: file.name,
          fileUrl: `${cloudFrontUrl}/files`,
          tags: file.tags,
          time: file.updatedAt! || file.createdAt!,
        });
      }

      setUserAnimatedPhotos(filesArray);
      filesArray.length === maxItems && setLastVisible(filesArray[filesArray.length - 1]);
    } catch (e) {
      console.log('No such document!', e);
    }
  };

  useEffect(() => {
    !!id && downloadAnimations();
  }, [id]);

  const nextElements = async () => {
    try {
      const nextPage: FileType[] = await axios.get(`${backUrl}/files`, {
        params: {
          where: {
            AND: [{ tags: 'animations' }, { ownerFile: id }],
          },
          limit: maxItems,
          sortBy: 'name, DESC',
          cursor: lastVisible,
        },
      });

      const nextArray: FileType[] = [];

      for (const file of nextPage) {
        nextArray.push({
          name: file.name,
          fileUrl: `${cloudFrontUrl}/files`,
          tags: file.tags,
          time: file.updatedAt! || file.createdAt!,
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
          userAnimatedPhotos.map(({ name, fileUrl, time, tags }: FileType, index) => (
            <Article key={index} name={name} fileUrl={fileUrl} authorName={pseudonym} time={time} tags={tags} />
          ))
        ) : (
          <ZeroFiles text={data?.ZeroFiles?.animations} />
        )}

        {!!lastVisible && userAnimatedPhotos.length === maxItems * i && <MoreButton nextElements={nextElements} />}
      </Wrapper>
    </article>
  );
};

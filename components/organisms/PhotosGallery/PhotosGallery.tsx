import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

import { backUrl, cloudFrontUrl } from 'utilites/constants';

import { FileType, UserType } from 'types/global.types';

import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';
import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';
import { Article } from 'components/molecules/Article/Article';

export const PhotosGallery = ({ id, pseudonym, data }: UserType) => {
  const [userPhotos, setUserPhotos] = useState<FileType[]>([]);
  const [lastVisible, setLastVisible] = useState<FileType>();
  let [i, setI] = useState(1);

  const maxItems = 30;
  const { asPath } = useRouter();

  const downloadFiles = async () => {
    try {
      const firstPage: FileType[] = await axios.get(`${backUrl}/files`, {
        params: {
          where: {
            AND: [
              { tags: 'realistic' },
              { tags: 'manga' },
              { tags: 'anime' },
              { tags: 'comics' },
              { tags: 'photograpths' },
              { ownerFile: id },
            ],
          },
          limit: maxItems,
          sortBy: 'name, DESC',
        },
      });

      const filesArray: FileType[] = [];

      for (const file of firstPage) {
        filesArray.push({
          name: file.name,
          fileUrl: `${cloudFrontUrl}/${file.name}`,
          tags: file.tags,
          time: file.updatedAt! || file.createdAt!,
        });
      }
      setUserPhotos(filesArray);
      filesArray.length === maxItems && setLastVisible(filesArray[filesArray.length - 1]);
    } catch (e) {
      console.log('No such document!', e);
    }
  };

  useEffect(() => {
    !!id && downloadFiles();
  }, [id]);

  const nextElements = async () => {
    try {
      const nextPage: FileType[] = await axios.get(`${backUrl}/files`, {
        params: {
          where: {
            AND: [
              { tags: 'realistic' },
              { tags: 'manga' },
              { tags: 'anime' },
              { tags: 'comics' },
              { tags: 'photographs' },
              { ownerFile: id },
            ],
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
          fileUrl: `${cloudFrontUrl}/${file.name}`,
          tags: file.tags,
          time: file.updatedAt! || file.createdAt!,
        });
      }

      const newArray = userPhotos.concat(...nextArray);
      setUserPhotos(newArray);
      setLastVisible(nextArray[nextArray.length - 1]);
      setI(++i);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <article id="user__gallery__in__account" className="user__gallery__in__account">
      {decodeURIComponent(asPath) === `/account/${pseudonym}` && (
        <em className="title">{data?.Account?.gallery?.userPhotosTitle}</em>
      )}
      <Wrapper>
        {userPhotos.length > 0 ? (
          userPhotos.map(({ name, fileUrl, tags, time }: FileType, index) => (
            <Article key={index} name={name} fileUrl={fileUrl} tags={tags} authorName={pseudonym} time={time} />
          ))
        ) : (
          <ZeroFiles text={data?.ZeroFiles?.photos} />
        )}

        {!!lastVisible && userPhotos.length === maxItems * i && <MoreButton nextElements={nextElements} />}
      </Wrapper>
    </article>
  );
};

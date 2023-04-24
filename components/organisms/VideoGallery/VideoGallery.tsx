import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

import { FileType, UserType } from 'types/global.types';

import { backUrl, cloudFrontUrl } from 'utilites/constants';

import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';
import { Videos } from 'components/molecules/Videos/Videos';

export const VideoGallery = ({ id, pseudonym, data }: UserType) => {
  const [userVideos, setUserVideos] = useState<FileType[]>([]);
  const [lastVisible, setLastVisible] = useState<FileType>();
  let [i, setI] = useState(1);

  const { asPath } = useRouter();

  const maxItems = 30;

  const downloadVideos = async () => {
    try {
      const firstPage: FileType[] = await axios.get(`${backUrl}/files`, {
        params: {
          where: {
            AND: [{ tags: 'videos' }, { ownerFile: id }],
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

      setUserVideos(filesArray);
      filesArray.length === maxItems && setLastVisible(filesArray[filesArray.length - 1]);
    } catch (e) {
      console.log('No such document!', e);
    }
  };

  useEffect(() => {
    !!id && downloadVideos();
  }, [id]);

  const nextElements = async () => {
    try {
      const nextPage: FileType[] = await axios.get(`${backUrl}/files`, {
        params: {
          where: {
            AND: [{ tags: 'videos' }, { ownerFile: id }],
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

      const newArray = userVideos.concat(...nextArray);
      setUserVideos(newArray);
      setI(++i);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <article id="user__gallery__in__account" className="user__gallery__in__account">
      {decodeURIComponent(asPath) === `/account/${pseudonym}` && (
        <em className="title">{data?.Account?.gallery?.userVideosTitle}</em>
      )}

      <Wrapper>
        {userVideos.length > 0 ? (
          userVideos.map(({ name, fileUrl, time, tags }: FileType, index) => (
            <Videos key={index} name={name} fileUrl={fileUrl} authorName={pseudonym} tags={tags} time={time} />
          ))
        ) : (
          <ZeroFiles text={data?.ZeroFiles?.videos} />
        )}

        {!!lastVisible && userVideos.length === maxItems * i && <MoreButton nextElements={nextElements} />}
      </Wrapper>
    </article>
  );
};

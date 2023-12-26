'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import axios from 'axios';

import { dateData } from 'helpers/dateData';

import { FileType } from 'types/global.types';
import { backUrl, cloudFrontUrl } from 'constants/links';

import { getDate } from 'helpers/getDate';

import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
import { Article } from 'components/molecules/Article/Article';
import { Videos } from 'components/molecules/Videos/Videos';

export const AuthorPost = ({ locale }: { locale: string }) => {
  const [container, setContainer] = useState<FileType>();
  const dataDateObject = dateData();

  const pathname = usePathname();

  const split = pathname.split('/');
  const pseudonym = decodeURIComponent(split[2]);
  const tag = split[3];
  const name = split[4];

  const simpleUserPost = async () => {
    try {
      const file: { data: FileType } = await axios.get(`${backUrl}/files`, {
        params: {
          where: { name },
        },
      });
      const { fileId, shortDescription, pseudonym, profilePhoto, tags, authorId, createdAt, updatedAt } = file.data;

      setContainer({
        name,
        authorId,
        fileId,
        pseudonym,
        profilePhoto,
        fileUrl: `https://${cloudFrontUrl}/${name}`,
        shortDescription,
        authorName: pseudonym,
        tags,
        time: getDate(locale, updatedAt! || createdAt!, await dataDateObject),
      });
    } catch (e) {
      console.error(e);
      console.log("This file isn't existed or you don't have permission to see.");
    }
  };

  useEffect(() => {
    !!pathname && simpleUserPost();
  }, [pathname]);

  return (
    <Wrapper>
      {tag === 'videos' ? (
        <Videos
          fileId={container?.fileId!}
          name={name!}
          fileUrl={container?.fileUrl!}
          shortDescription={container?.shortDescription!}
          tags={container?.tags!}
          authorName={container?.pseudonym!}
          profilePhoto={container?.profilePhoto!}
          authorId={container?.authorId!}
          time={container?.time!}
        />
      ) : (
        <Article
          fileId={container?.fileId!}
          name={name!}
          fileUrl={container?.fileUrl!}
          shortDescription={container?.shortDescription!}
          tags={container?.tags!}
          authorName={pseudonym!}
          profilePhoto={container?.profilePhoto!}
          authorId={container?.authorId!}
          time={container?.time!}
        />
      )}
    </Wrapper>
  );
};

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import url from 'url';

import { FileType } from 'types/global.types';
import { backUrl, cloudFrontUrl } from 'utilites/constants';

import { useDateData } from 'hooks/useDateData';
import { useCurrentUser } from 'hooks/useCurrentUser';

import { getDate } from 'helpers/getDate';

import { HeadCom } from 'components/atoms/HeadCom/HeadCom';
import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
import { Article } from 'components/molecules/Article/Article';
import { Videos } from 'components/molecules/Videos/Videos';

export default function Post() {
  const [container, setContainer] = useState<FileType>();
  const dataDateObject = useDateData();

  const { asPath, locale } = useRouter();

  const split = asPath.split('/');
  const pseudonym = decodeURIComponent(split[2]);
  const tag = split[3];
  const name = split[4];

  const simpleUserPost = async () => {
    const queryParams = {
      where: `{ name: ${name} }`,
    };
    const params = new url.URLSearchParams(queryParams);

    try {
      const file: FileType = await axios.get(`${backUrl}/files?${params}`);
      const { fileId, shortDescription, pseudonym, profilePhoto, tags, authorId, createdAt, updatedAt } = file;

      setContainer({
        name,
        authorId,
        fileId,
        pseudonym,
        profilePhoto,
        fileUrl: `${cloudFrontUrl}/${name}`,
        shortDescription,
        authorName: pseudonym,
        tags,
        time: getDate(locale!, updatedAt! || createdAt!, dataDateObject),
      });
    } catch (e) {
      console.error(e);
      console.log("This file isn't existed or you don't have permision to see.");
    }
  };

  useEffect(() => {
    asPath && simpleUserPost();
  }, [asPath]);

  if (useCurrentUser('/signin')) {
    return null;
  }

  return (
    <>
      <HeadCom path={asPath} content={`${pseudonym} user post subpage`} />

      <Wrapper>
        {tag === 'videos' ? (
          <Videos
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
    </>
  );
}

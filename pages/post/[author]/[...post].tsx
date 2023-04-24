import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

import { FileType } from 'types/global.types';
import { backUrl, cloudFrontUrl } from 'utilites/constants';

import { HeadCom } from 'components/atoms/HeadCom/HeadCom';
import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
import { Article } from 'components/molecules/Article/Article';
import { Videos } from 'components/molecules/Videos/Videos';

export default function Post() {
  const [container, setContainer] = useState<FileType>();

  const { asPath } = useRouter();

  const split = asPath.split('/');
  const pseudonym = decodeURIComponent(split[2]);
  const tag = split[3];
  const name = split[4];

  const simpleUserPost = async () => {
    const file: FileType = await axios.get(`${backUrl}/files`, { params: { where: { name } } });

    setContainer({
      name,
      fileUrl: `${cloudFrontUrl}/${name}`,
      authorName: pseudonym,
      tags: file.tags,
      time: file.time,
    });
  };

  useEffect(() => {
    simpleUserPost();
  }, [asPath]);

  return (
    <>
      <HeadCom path={asPath} content={`${pseudonym} user post subpage`} />

      <Wrapper>
        {tag === 'videos' ? (
          <Videos
            name={name}
            fileUrl={container!.fileUrl}
            tags={container?.tags!}
            authorName={container?.authorName}
            time={container!.time}
          />
        ) : (
          <Article
            name={name}
            fileUrl={container!.fileUrl}
            tags={container?.tags!}
            authorName={container?.authorName}
            time={container!.time}
          />
        )}
      </Wrapper>
    </>
  );
}

import { TagConstants } from 'constants/values';
import { FileType } from 'types/global.types';

import { getUserData } from 'helpers/getUserData';

import { Article } from 'components/molecules/Article/Article';
import { Videos } from 'components/molecules/Videos/Videos';

export const AppTop10s = async ({ data, type }: { data: FileType[]; type: 'videos' | 'others' }) => {
  const userData = await getUserData();

  return data.map(
    ({ fileId, name, fileUrl, shortDescription, tags, pseudonym, authorId, time }: FileType, index) => (
      <>
        {type === TagConstants[TagConstants.findIndex((v) => v === 'videos')] ? (
          <Article
            key={index}
            fileId={fileId!}
            name={name!}
            fileUrl={fileUrl}
            shortDescription={shortDescription!}
            tags={tags!}
            authorName={userData?.pseudonym!}
            profilePhoto={userData?.profilePhoto!}
            authorId={authorId}
            pseudonym={pseudonym!}
            time={time}
          />
        ) : (
          <Videos
            key={index}
            fileId={fileId!}
            name={name!}
            fileUrl={fileUrl}
            shortDescription={shortDescription!}
            tags={tags!}
            authorName={userData?.pseudonym!}
            profilePhoto={userData?.profilePhoto!}
            authorId={authorId}
            pseudonym={pseudonym!}
            time={time}
          />
        )}
      </>
    ),
  );
};

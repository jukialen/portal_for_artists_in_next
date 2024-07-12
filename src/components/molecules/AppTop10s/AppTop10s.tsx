import { FileType } from 'types/global.types';

import { getUserData } from 'helpers/getUserData';

import { Article } from 'components/molecules/Article/Article';
import { Videos } from 'components/molecules/Videos/Videos';
import { ClientPortalWrapper } from 'components/atoms/ClientPortalWrapper/ClientPortalWrapper';

export const AppTop10s = async ({ data, type }: { data: FileType[]; type: 'videos' | 'other' }) => {
  const userData = await getUserData();

  return data.map(
    ({ fileId, name, fileUrl, shortDescription, tags, pseudonym, profilePhoto, authorId, time }: FileType, index) => (
      <ClientPortalWrapper key={index}>
        {type === 'videos' ? (
          <Article
            key={index}
            fileId={fileId!}
            name={name!}
            fileUrl={fileUrl}
            shortDescription={shortDescription!}
            tags={tags!}
            authorName={userData!.pseudonym}
            authorId={authorId}
            pseudonym={pseudonym!}
            profilePhoto={profilePhoto}
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
            authorName={userData!.pseudonym}
            authorId={authorId}
            pseudonym={pseudonym!}
            profilePhoto={profilePhoto}
            time={time}
          />
        )}
      </ClientPortalWrapper>
    ),
  );
};

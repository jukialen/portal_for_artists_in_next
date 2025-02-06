import { Skeleton } from '@chakra-ui/react';

import { TagConstants } from 'constants/values';
import { FileType } from "types/global.types";

import { ClientPortalWrapper } from 'components/atoms/ClientPortalWrapper/ClientPortalWrapper';
import { Videos } from 'components/molecules/Videos/Videos';
import { Article } from 'components/molecules/Article/Article';

export const AnothersWrapperContent = async ({ loadingFiles, userDrawings, pseudonym, profilePhoto }: { loadingFiles: boolean; userDrawings:  FileType[], pseudonym: string, profilePhoto: string }) => {
  return <>
    {userDrawings.map(
      ({ fileId, name, fileUrl, shortDescription, tags, authorName, authorId, time, roleId }: FileType, index) => (
    <Skeleton loading={loadingFiles} variant="shine" key={index}>
      {tags === TagConstants[TagConstants.findIndex((v) => v === 'videos')] ? (
        // <ClientPortalWrapper>
          <Videos
            fileId={fileId!}
            name={name!}
            fileUrl={fileUrl}
            shortDescription={shortDescription!}
            tags={tags}
            authorName={authorName!}
            authorId={authorId}
            authorBool={authorName === pseudonym!}
            profilePhoto={profilePhoto}
            time={time}
            roleId={roleId!}
          />
        // </ClientPortalWrapper>
      ) : (
        // <ClientPortalWrapper>
          <Article
            fileId={fileId!}
            name={name!}
            fileUrl={fileUrl}
            shortDescription={shortDescription!}
            tags={tags!}
            authorName={pseudonym!}
            authorId={authorId}
            authorBool={authorName === pseudonym!}
            profilePhoto={profilePhoto}
            time={time}
            roleId={roleId!}
          />
        // </ClientPortalWrapper>
      )}
    </Skeleton>
  ))}
  </>;
};

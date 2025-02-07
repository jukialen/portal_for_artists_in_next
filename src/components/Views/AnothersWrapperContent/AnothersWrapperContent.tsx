import { Skeleton } from 'components/ui/skeleton';
import { TagConstants } from 'constants/values';
import { FileType } from 'types/global.types';

import { Videos } from 'components/molecules/Videos/Videos';
import { Article } from 'components/molecules/Article/Article';

export const AnothersWrapperContent = async ({
  loadingFiles,
  userFiles,
  pseudonym,
  profilePhoto,
}: {
  loadingFiles: boolean;
  userFiles: FileType[];
  pseudonym: string;
  profilePhoto: string;
}) => {
  return (
    <>
      {userFiles.map(
        ({ fileId, name, fileUrl, shortDescription, tags, authorName, authorId, time, roleId }: FileType, index) => (
          <Skeleton loading={loadingFiles} variant="shine" key={index}>
            {tags === TagConstants[TagConstants.findIndex((v) => v === 'videos')] ? (
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
            ) : (
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
            )}
          </Skeleton>
        ),
      )}
    </>
  );
};

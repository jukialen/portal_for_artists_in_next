import { FileType } from 'source/types/global.types';

import { Article } from 'source/components/molecules/Article/Article';
import { Videos } from 'source/components/molecules/Videos/Videos';

export const AppTop10s = ({data, type}: { data: FileType[], type: 'videos' | 'other'}) => {
  return data.map(
    ({ fileId, name, fileUrl, shortDescription, tags, pseudonym, profilePhoto, authorId, time }: FileType, index) =>
      type === 'videos' ? (
        <Article
          key={index}
          fileId={fileId!}
          name={name!}
          fileUrl={fileUrl}
          shortDescription={shortDescription!}
          tags={tags!}
          authorName={pseudonym!}
          profilePhoto={profilePhoto}
          authorId={authorId}
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
          authorName={pseudonym!}
          profilePhoto={profilePhoto}
          authorId={authorId}
          time={time}
        />
      ),
  );
};

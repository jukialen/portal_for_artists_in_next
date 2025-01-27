import { useEffect, useState } from 'react';

import { againLastComments, firstLastComments } from 'utils/comments';

import { LastCommentType } from 'types/global.types';

import { DCProvider } from 'providers/DeleteCommentProvider';

import { LastComment } from 'components/atoms/LastComment/LastComment';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';

type LastCommentsType = { subCommentId: string; roleId: string };

export const LastComments = ({ subCommentId, roleId }: LastCommentsType) => {
  const [lastCommentsArray, setLastCommentsArray] = useState<LastCommentType[]>([]);
  const [lastVisible, setLastVisible] = useState<string | null>(null);
  let [i, setI] = useState(1);

  const maxItems = 5;

  useEffect(() => {
    firstLastComments(subCommentId, maxItems, roleId).then((t) => {
      setLastCommentsArray(t!);
      !!t && t.length === maxItems && setLastVisible(t[t.length - 1].createdAt!);
    });
  }, [roleId, subCommentId]);

  const nextShowingComments = async () => {
    lastVisible !== '' &&
      againLastComments(subCommentId, maxItems, roleId).then((t) => {
        setLastCommentsArray(t!);
        if (!!t && t.length === maxItems) {
          setLastVisible(t[t.length - 1].createdAt!);
          setI(++i);
        }
      });
  };

  return (
    <>
      {lastCommentsArray.length > 0 &&
        lastCommentsArray.map(
          (
            {
              lastCommentId,
              subCommentId,
              content,
              authorName,
              authorProfilePhoto,
              authorId,
              role,
              roleId,
              date,
            }: LastCommentType,
            index,
          ) => (
            <DCProvider key={index}>
              <LastComment
                lastCommentId={lastCommentId}
                content={content}
                authorName={authorName}
                role={role}
                roleId={roleId}
                authorId={authorId}
                subCommentId={subCommentId}
                date={date}
                authorProfilePhoto={authorProfilePhoto}
              />
            </DCProvider>
          ),
        )}
      {!!lastVisible && lastCommentsArray.length === maxItems * i && <MoreButton nextElements={nextShowingComments} />}
    </>
  );
};

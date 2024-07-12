import { useEffect, useState } from 'react';

import { LastCommentType } from 'types/global.types';
import { backUrl } from 'constants/links';

import { DCProvider } from 'providers/DeleteCommentProvider';

import { LastComment } from 'components/atoms/LastComment/LastComment';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';

type LastCommentsType = { subCommentId: string; fileId?: string; };

export const LastComments = ({ subCommentId, fileId }: LastCommentsType) => {
  const [lastCommentsArray, setLastCommentsArray] = useState<LastCommentType[]>([]);
  const [lastVisible, setLastVisible] = useState<string | null>(null);
  let [i, setI] = useState(1);
  
  const maxItems = 5;
  
  const params = encodeURI(
    JSON.stringify({
      commentId: subCommentId || fileId,
      where: !!subCommentId ? 'subCommentId' : 'fileId',
      maxItems,
      cursor: lastVisible,
    }),
  );

  const firstLastComments = async () => {
    try {
      const firstPage: LastCommentType[] = await fetch(`${backUrl}/api/last-comments?${params}`, { method: 'GET' }).then(
        (data) => data.json(),
      );

      setLastCommentsArray(firstPage);
      firstPage.length === maxItems && setLastVisible(firstPage[firstPage.length - 1].createdAt!);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    firstLastComments();
  }, []);

  const nextShowingComments = async () => {
    try {
      const lastComments: LastCommentType[] = await fetch(`${backUrl}/api/last-comments?${params}`, {
        method: 'GET',
      }).then((data) => data.json());
      
      lastComments.length === maxItems &&
        setLastVisible(lastComments[lastComments.length - 1].createdAt!);

      const nextArray = lastCommentsArray.concat(...lastComments);
      setLastCommentsArray(nextArray);
      setI(++i);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {lastCommentsArray.length > 0 &&
        lastCommentsArray.map(
          (
            {
              lastCommentId,
              subCommentId,
              lastComment,
              authorName,
              authorProfilePhoto,
              authorId,
              role,
              roleId,
              groupRole,
              date,
              profilePhoto,
            }: LastCommentType,
            index,
          ) => (
            <DCProvider key={index}>
              <LastComment
                lastCommentId={lastCommentId}
                lastComment={lastComment}
                authorName={authorName}
                role={role}
                roleId={roleId}
                groupRole={groupRole}
                authorId={authorId}
                subCommentId={subCommentId}
                date={date}
                authorProfilePhoto={authorProfilePhoto}
                profilePhoto={profilePhoto}
              />
            </DCProvider>
          ),
        )}
      {!!lastVisible && lastCommentsArray.length === maxItems * i && <MoreButton nextElements={nextShowingComments} />}
    </>
  );
};

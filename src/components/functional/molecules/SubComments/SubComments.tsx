import { useEffect, useState } from 'react';

import { SubCommentType } from 'types/global.types';

import { subComments } from 'utils/comments';

import { DCProvider } from 'providers/DeleteCommentProvider';

import { SubComment } from 'components/functional/atoms/SubComment/SubComment';
import { MoreButton } from 'components/ui/atoms/MoreButton/MoreButton';

type SubCommentsType = {
  fileCommentId?: string;
  commentId?: string;
  fileId?: string;
  postId?: string;
  groupsPostsRoleId?: string;
};

export const SubComments = ({ fileCommentId, commentId, fileId, postId, groupsPostsRoleId }: SubCommentsType) => {
  const [subCommentsArray, setSubCommentsArray] = useState<SubCommentType[]>([]);
  const [lastVisible, setLastVisible] = useState('');
  let [i, setI] = useState(1);

  const maxItems = 30;

  useEffect(() => {
    subComments(maxItems, 'first', groupsPostsRoleId, commentId, fileCommentId, '').then((t) => {
      setSubCommentsArray(t!);
      t!.length === maxItems &&
        setLastVisible(t![t!.length - 1].commentId ? t![t!.length - 1].commentId! : t![t!.length - 1].fileCommentId!);
    });
  }, [commentId, fileCommentId, groupsPostsRoleId]);

  const nextComments = async () => {
    lastVisible !== '' &&
      subComments(maxItems, 'again', groupsPostsRoleId, commentId, fileCommentId, lastVisible).then((t) => {
        const nextArray = subCommentsArray.concat(...t!);
        setSubCommentsArray(nextArray);
        if (t!.length === maxItems) {
          setLastVisible(t![t!.length - 1].commentId ? t![t!.length - 1].commentId! : t![t!.length - 1].fileCommentId!);
          setI(++i);
        }
      });
  };

  return (
    <>
      {subCommentsArray.length > 0 &&
        subCommentsArray.map(
          (
            {
              subCommentId,
              content,
              authorName,
              authorProfilePhoto,
              role,
              roleId,
              authorId,
              date,
              liked,
              likes,
            }: SubCommentType,
            index,
          ) => (
            <DCProvider key={index}>
              <SubComment
                subCommentId={subCommentId}
                content={content}
                authorName={authorName}
                authorProfilePhoto={authorProfilePhoto}
                role={role}
                roleId={roleId}
                authorId={authorId}
                fileCommentId={fileCommentId}
                fileId={fileId}
                postId={postId}
                likes={likes}
                liked={liked}
                date={date}
              />
            </DCProvider>
          ),
        )}
      {!!lastVisible && subCommentsArray.length === maxItems * i && <MoreButton nextElementsAction={nextComments} />}
    </>
  );
};

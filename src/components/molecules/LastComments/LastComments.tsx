import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import { LastCommentType } from 'types/global.types';
import { backUrl } from 'constants/links';

import { getDate } from 'helpers/getDate';

import { dateData } from 'helpers/dateData';

import { DCProvider } from 'providers/DeleteCommentProvider';

import { LastComment } from 'components/atoms/LastComment/LastComment';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';

type LastCommentsType = { subCommentId: string; fileId?: string; postId?: string };

export const LastComments = ({ subCommentId, fileId, postId }: LastCommentsType) => {
  const [lastCommentsArray, setLastCommentsArray] = useState<LastCommentType[]>([]);
  const [lastVisible, setLastVisible] = useState<string>();
  let [i, setI] = useState(1);

  const { locale } = useRouter();
  const dataDateObject = dateData();

  const maxItems = 5;

  const firstLastComments = async () => {
    try {
      const lastComments: { data: LastCommentType[] } = await axios.get(`${backUrl}/last-comments/all`, {
        params: {
          orderBy: 'createdAt, desc',
          where: { subCommentId },
          limit: maxItems,
        },
      });

      const lastCommentArray: LastCommentType[] = [];
      for (const _last of lastComments.data) {
        const {
          lastCommentId,
          lastComment,
          pseudonym,
          profilePhoto,
          role,
          roleId,
          groupRole,
          authorId,
          subCommentId,
          createdAt,
          updatedAt,
        } = _last;

        lastCommentArray.push({
          lastCommentId,
          lastComment,
          pseudonym,
          profilePhoto,
          role,
          roleId,
          groupRole,
          authorId,
          subCommentId,
          date: getDate(locale!, updatedAt! || createdAt!, await dataDateObject),
        });
      }

      setLastCommentsArray(lastCommentArray);
      lastCommentArray.length === maxItems &&
        setLastVisible(lastCommentArray[lastCommentArray.length - 1].subCommentId);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    firstLastComments();
  }, []);

  const nextShowingComments = async () => {
    try {
      const lastComments: { data: LastCommentType[] } = await axios.get(`${backUrl}/last-comments/all`, {
        params: {
          orderBy: 'createdAt, desc',
          where: { subCommentId },
          limit: maxItems,
          cursor: lastVisible,
        },
      });

      const nextCommentArray: LastCommentType[] = [];

      for (const _last of lastComments.data) {
        const {
          lastCommentId,
          lastComment,
          pseudonym,
          profilePhoto,
          role,
          roleId,
          groupRole,
          authorId,
          subCommentId,
          createdAt,
          updatedAt,
        } = _last;
        nextCommentArray.push({
          lastCommentId,
          lastComment,
          pseudonym,
          profilePhoto,
          role,
          roleId,
          groupRole,
          authorId,
          subCommentId,
          date: getDate(locale!, updatedAt! || createdAt!, await dataDateObject),
        });
      }

      nextCommentArray.length === maxItems &&
        setLastVisible(nextCommentArray[nextCommentArray.length - 1].subCommentId);

      const nextArray = lastCommentsArray.concat(...nextCommentArray);
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
              lastComment,
              pseudonym,
              profilePhoto,
              role,
              roleId,
              groupRole,
              authorId,
              subCommentId,
              date,
            }: LastCommentType,
            index,
          ) => (
            <DCProvider key={index}>
              <LastComment
                lastCommentId={lastCommentId}
                lastComment={lastComment}
                pseudonym={pseudonym}
                profilePhoto={profilePhoto}
                role={role}
                roleId={roleId}
                groupRole={groupRole}
                authorId={authorId}
                subCommentId={subCommentId}
                fileId={fileId}
                postId={postId}
                date={date}
              />
            </DCProvider>
          ),
        )}
      {!!lastVisible && lastCommentsArray.length === maxItems * i && <MoreButton nextElements={nextShowingComments} />}
    </>
  );
};
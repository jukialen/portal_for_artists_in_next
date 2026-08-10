import {
  BillingCycleType,
  ColumnCommentsTableNameType,
  CommentsTableNameType,
  LangType,
  Plan,
  Tags,
} from 'types/global.types';

export const TagConstants: Tags[] = [
  'realistic',
  'manga',
  'anime',
  'comics',
  'photographs',
  'videos',
  'animations',
  'others',
  'profile',
  'group',
];

export const locales: LangType[] = ['en', 'pl', 'ja'];
export const plans: Plan[] = ['FREE', 'PREMIUM', 'GOLD'];
export const cycles: BillingCycleType[] = ['month', 'year'];

export const selectCommentsData = (
  postId?: string,
  fileId?: string,
  commentId?: string | null,
  fileCommentId?: string | null,
  subCommentId?: string,
  lastCommentId?: string,
) => {
  const tableName: CommentsTableNameType = postId
    ? 'Comments'
    : fileId
      ? 'FilesComments'
      : commentId || fileCommentId
        ? 'SubComments'
        : 'LastComments';

  const columnValue = postId || fileId || commentId || fileCommentId || subCommentId || lastCommentId;

  const columnIdName: ColumnCommentsTableNameType = postId
    ? 'postId'
    : fileId
      ? 'fileId'
      : commentId
        ? 'commentId'
        : fileCommentId
          ? 'fileCommentId'
          : subCommentId
            ? 'subCommentId'
            : 'lastCommentId';

  return { tableName, columnValue, columnIdName };
};

export const updDelCommentsData = (
  commentId?: string | null,
  fileCommentId?: string | null,
  subCommentId?: string,
  lastCommentId?: string,
) => {
  const tableName: CommentsTableNameType = commentId
    ? 'Comments'
    : fileCommentId
      ? 'FilesComments'
      : subCommentId
        ? 'SubComments'
        : 'LastComments';

  const columnValue = commentId || fileCommentId || subCommentId || lastCommentId;

  const columnIdName: 'commentId' | 'subCommentId' | 'lastCommentId' | 'id' = commentId
    ? 'commentId'
    : fileCommentId
      ? 'id'
      : subCommentId
        ? 'subCommentId'
        : 'lastCommentId';

  return { tableName, columnValue, columnIdName };
};

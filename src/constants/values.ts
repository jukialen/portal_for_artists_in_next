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
  let tableName: CommentsTableNameType;
  let columnValue: string | undefined;
  let columnIdName: ColumnCommentsTableNameType;

  if (lastCommentId) {
    tableName = 'LastComments';
    columnValue = lastCommentId;
    columnIdName = 'lastCommentId';
  } else if (subCommentId) {
    tableName = 'LastComments';
    columnValue = subCommentId;
    columnIdName = 'subCommentId';
  } else if (fileCommentId) {
    tableName = 'SubComments';
    columnValue = fileCommentId;
    columnIdName = 'fileCommentId';
  } else if (commentId) {
    tableName = 'SubComments';
    columnValue = commentId;
    columnIdName = 'commentId';
  } else if (fileId) {
    tableName = 'FilesComments';
    columnValue = fileId;
    columnIdName = 'fileId';
  } else if (postId) {
    tableName = 'Comments';
    columnValue = postId;
    columnIdName = 'postId';
  } else {
    tableName = 'Comments';
    columnValue = '';
    columnIdName = 'postId';
  }

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

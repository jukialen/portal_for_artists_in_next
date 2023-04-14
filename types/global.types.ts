import { ChangeEvent } from 'react';

export type GroupNameType = string | string[];

export type DataType = any;

export type UserType = {
  user: string | undefined;
  pseudonym: string;
  data: DataType;
};

export type EventType = ChangeEvent<EventTarget & HTMLInputElement>;

export type FormType = {
  resetForm: any;
};

export type UserDataType = {
  email: string;
  password?: string;
};

export type FileType = {
  name: string;
  pseudonym: string;
  fileUrl: string;
  tags: string;
  time: string;
};

export type FileContainerType = {
  name: string;
  link: string;
  description?: string;
  authorName?: string;
  time: string;
  tag: string;
  unopt?: boolean;
  titleShare?: string;
};

export type GroupType = {
  nameGroup: string;
  logoUrl: string;
  description?: string;
};

export type MembersAndModeratorsType = {
  mid: string;
  cid?: string;
  pseudonym: string;
  profilePhoto: string;
};

export type AuthorType = {
  nameGroup?: GroupNameType;
  currentUser?: string;
  profilePhoto?: string;
  subCollection?: string;
  authorId?: string;
  userId?: string | null;
  idPost?: string;
  idComment?: string;
  idSubComment?: string;
  idLastComment?: string;
  groupSource?: boolean;
};

export type PostType = {
  author: string;
  title: string;
  date: string;
  description: string;
  nameGroup: GroupNameType;
  idPost?: string;
  currentUser?: string;
  userId?: string | null;
  likes: number;
  liked?: string[];
  logoUser?: string;
};
export type NewCommentsType = {
  name?: GroupNameType;
  comment?: string;
};

export type CommentType = {
  author?: string;
  date?: string;
  description?: string;
  nameGroup?: GroupNameType;
  post?: string;
  profilePhoto?: string;
  authorId?: string;
  userId?: string;
  subCollection?: string;
  likes: number;
  liked?: string[];
  idPost?: string;
  idComment?: string;
  idSubComment?: string;
  idLastComment?: string;
  groupSource?: boolean;
};

import { ChangeEvent } from 'react';
import { CollectionReference, DocumentReference, Query } from 'firebase/firestore';
import { StorageReference } from 'firebase/storage';

export type GroupNameType = string | string[]

export type DataType = any;

export type UserType = {
  user: string | undefined;
  pseudonym?: string;
  data: DataType
};

export type EventType =  ChangeEvent<EventTarget & HTMLInputElement>;

export type FormType = {
  resetForm: any
}

export type UserDataType = {
  email?: string;
  password?: string
}

export type FileType = {
  fileUrl: string;
  description: string;
  time?: string;
  tags: string;
  pseudonym: string;
  uid: string;
  idPost: string;
}

export type FileContainerType = {
  link?: string;
  refFile?:  CollectionReference | Query;
  subCollection?: string;
  refStorage?:  StorageReference;
  description?: string;
  authorName?: string;
  tag?: string;
  unopt?: boolean;
  titleShare?: string;
  uid?: string;
  idPost?: string;
};

export type GroupType = {
  nameGroup: string;
  logoUrl: string;
  description?: string;
}

export type AuthorType = {
  nameGroup?: GroupNameType;
  currentUser?: string;
  profilePhoto?: string;
  subCollection?: string;
  authorId?: string;
  userId?: string | null;
  refCom?: CollectionReference | Query;
  refSubCom?: CollectionReference | Query;
  refLastCom?: CollectionReference | Query;
  refDocCom?: DocumentReference;
  refDocSubCom?: DocumentReference;
  refDocLastCom?: DocumentReference;
  idPost?: string;
  idComment?: string;
  idSubComment?: string;
  idLastComment?: string;
  groupSource?: boolean;
}

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
}
export type NewCommentsType = {
  name?: GroupNameType;
  refCom?: CollectionReference;
  comment?: string;
}

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
  refDelCom?: DocumentReference;
  refCom?: CollectionReference | Query;
  refSubCom?: CollectionReference | Query;
  refLastCom?: CollectionReference | Query;
  refDocCom?: DocumentReference;
  refDocSubCom?: DocumentReference;
  refDocLastCom?: DocumentReference;
  groupSource?: boolean;
}
import { ChangeEvent } from 'react';
import { CollectionReference, Query } from 'firebase/firestore';
import { StorageReference } from 'firebase/storage';

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
  description: string;
}

export type AuthorType = {
  name: string | string[];
  refCom?: Query;
  join?: boolean;
  currentUser?: string;
  userId?: string | null;
}

export type PostType = {
  author: string;
  title: string;
  date: string;
  description: string;
  name: AuthorType;
  idPost?: string;
  join?: boolean;
  currentUser?: string;
  userId?: string | null;
  likes: number,
  liked?: string[]
}

export type CommentType = {
  author?: string;
  date: string;
  description: string;
  name: string;
  post?: string;
  idPost?: string;
}
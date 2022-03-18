import { CollectionReference } from 'firebase/firestore';
import { StorageReference } from 'firebase/storage';
import { ChangeEvent } from 'react';

export type DataType = any;

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
  description?: string;
  time: string;
  tags?: string;
  pseudonym?: string;
}

export type ArticleImgType = {
  imgLink: string;
  refFile:  CollectionReference;
  subCollection: string;
  refStorage?:  StorageReference;
  imgDescription?: string;
  authorName?: string;
  unopt?: boolean;
};
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
  imgDescription?: string;
  authorName?: string;
  unopt?: boolean;
};
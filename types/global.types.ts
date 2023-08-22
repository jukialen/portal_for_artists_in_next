import { ChangeEvent } from 'react';

//ENUMS
export enum Plan {
  FREE,
  PREMIUM,
  GOLD,
}

export enum Tags {
  realistic,
  manga,
  anime,
  comics,
  photographs,
  videos,
  animations,
  others,
}

export enum Role {
  ADMIN,
  MODERATOR,
  USER,
  AUTHOR,
}

//GENERAL
type Like = {
  likes: number;
  liked: boolean;
};

type Logo = {
  profilePhoto?: string;
};

type Time = {
  createdAt?: string;
  updatedAt?: string;
};

type UserPost = Time &
  Logo & {
    pseudonym: string;
    date?: string;
    name: string;
    postId?: string;
    authorId: string;
  };

export type DataType = any;

//FORMS & CONTROLLERS ELEMENTS
export type EventType = ChangeEvent<EventTarget & HTMLInputElement>;

export type ResetFormType = {
  resetForm: any;
};

//USERS
export type PlanType = {
  newPlan?: Plan;
};

export type UserType = Logo &
  PlanType &
  Time & {
    id?: string;
    pseudonym: string;
    description?: string;
    data?: any;
    email?: string;
    plan: string;
    provider?: boolean;
  };

export type UserFormType = {
  email: string;
  password?: string;
};

//FiLES
export type FileType = Time & {
  fileId?: string;
  name?: string;
  shortDescription?: string;
  tags?: Tags;
  pseudonym?: string;
  profilePhoto: string;
  authorName?: string;
  profileType?: boolean;
  authorId: string;
  fileUrl: string;
  time: string;
};

export type ArticleVideosType = {
  fileId: string;
  name: string;
  fileUrl: string;
  shortDescription: string;
  authorName: string;
  profilePhoto: string;
  tags: Tags;
  authorId: string;
  time: string;
};

//FRIENDS
export type FriendType = Time & {
  id?: string;
  usernameId: string;
  friendId: string;
  favorite?: boolean;
  time?: string;
};

//GROUPS
export type GroupType = Time & {
  groupId?: string;
  name?: string;
  description: string;
  regulation: string;
  logo: string;
  usersGroupsId: string;
  favorited?: boolean;
  favorites: number;
  role: Role;
  roleId: string;
  time?: string;
};

export type MemberType = {
  usersGroupsId?: string;
  pseudonym: string;
  profilePhoto: string;
};

//POSTS
export type PostType = UserPost &
  Like & {
    title: string;
    content: string;
    likes: number;
    liked: boolean;
    shared: number;
    commented: number;
    groupId: string;
  };

// COMMENTS
export type NewCommentsType = {
  profilePhoto: string;
  comment?: string;
  postId?: string;
  fileId?: string;
  fromFile?: boolean;
};

type Comment = Time & {
  authorId: string;
  pseudonym: string;
  profilePhoto: string;
  role: Role;
  roleId: string;
  date?: string;
};

export type CommentType = Comment & {
  commentId: string;
  postId?: string;
  comment: string;
  adModRoleId: string;
  groupRole: Role;
};

export type FilesCommentsType = Comment & {
  id: string;
  fileId: string;
  comment: string;
};

export type CommentsType = Comment & {
  commentId: string;
  postId: string;
  comment: string;
  adModRoleId: string;
  groupRole: Role;
};

export type SubCommentType = Comment & {
  subCommentId: string;
  commentId?: string;
  subComment: string;
  fileCommentId?: string;
  adModRoleId?: string;
  groupRole?: Role;
};

export type LastCommentType = Time & {
  lastCommentId: string;
  subCommentId: string;
  lastComment: string;
  adModRoleId?: string;
  groupRole: Role;
};

//DATE OBJECT
export type DateObjectType = {
  second: string;
  minute: string;
  hour: string;
  day: string;
  yearDateSeparator: string;
};

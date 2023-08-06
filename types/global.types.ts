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
    postId: string;
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
  fileUrl: string;
  tags?: Tags;
  time: string;
  pseudonym?: string;
  profilePhoto: string;
  authorName?: string;
  profileType?: boolean;
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
type Group = Time & {
  name: string;
  logo: string;
  description?: string;
  time?: string;
  favorites?: number;
  favorited?: boolean;
  role?: Role;
  usersGroupsId?: string;
  roleId?: string;
};

export type GroupType = Group & {
  groupId?: string;
};

export type MemberType = {
  usersGroupsId?: string;
  pseudonym: string;
  profilePhoto: string;
};

//POSTS
export type PostType = UserPost &
  Like & {
    groupsPostsId?: string;
    groupId?: string;
    title: string;
    content: string;
    shared?: number;
  };

// COMMENTS
type Comment = UserPost & {
  comment: string;
};

export type NewCommentsType = Comment;

export type CommentType = Comment & {
  commentId: string;
};

export type SubCommentType = CommentType;

export type LastCommentType = Comment & {
  subCommenId: string;
};

//DATE OBJECT
export type DateObjectType = {
  second: string;
  minute: string;
  hour: string;
  day: string;
  yearDateSeparator: string;
};

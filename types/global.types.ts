import { ChangeEvent } from 'react';

//ENUMS
enum MembershipStatus {
  MEMBER,
  MODERATOR,
  ADMIN,
}

enum Plan {
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

//GENERAL
type Like = {
  likes: number;
  liked?: string[];
};

type Logo = {
  profilePhoto?: string;
};

type UserPost = Logo & {
  pseudonym: string;
  date?: string;
  nameGroup: string;
  userId?: string | null;
  authorId?: string;
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
  PlanType & {
    id: string;
    pseudonym: string;
    description?: string;
    data: any;
  };

export type UserFormType = {
  email: string;
  password?: string;
};

//FILES
export type FileType = {
  ownerFile?: string;
  name: string;
  fileUrl: string;
  tags: Tags;
  time: string;
  authorName?: string;
  profileType?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

//FRIENDS
export type FriendType = {
  id?: string;
  usernameId: string;
  friendId: string;
  favorite: string;
  time: string;
};

//GROUPS
type Group = {
  name: string;
  logoUrl: string;
  description?: string;
  time: string;
  status: MembershipStatus;
};

export type GroupType = Group & {
  id?: string;
};

export type MembersType = Group & {
  groupId: string;
  userId: string;
};

//POSTS
export type PostType = UserPost &
  Like & {
    title: string;
    content: string;
    idPost?: string;
  };

// COMMENTS
export type NewCommentsType = Comment & {};

type Comment = UserPost & {
  comment: string;
  idPost: string;
};

export type CommentType = Comment & {
  commentId: string;
};

export type SubCommentType = CommentType;

export type LastCommentType = Comment & {
  subCommenId: string;
};

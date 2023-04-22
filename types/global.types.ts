import { ChangeEvent } from 'react';

//ENUMS
enum MembershipStatus {
  MEMBER,
  MODERATOR,
  ADMIN
}

enum Plan {
  FREE,
  PREMIUM,
  GOLD
}

export enum Tags {
  realistic,
  manga,
  anime,
  comics,
  photographs,
  videos,
  animations,
  others
}

//GENERAL
type Like = {
  likes: number;
  liked?: string[];
}

type Logo = {
  profilePhoto?: string;
}

//DELETE
export type AuthorType = Logo & {
  nameGroup?: string;
  currentUser?: string;
  authorId?: string;
  userId?: string | null;
}; 
// DELETE

type UserPost = Logo & {
  pseudonym: string;
  date?: string;
  nameGroup: string;
  userId?: string | null;
  authorId?: string;
}

export type DataType = any;

//FORMS & CONTROLLERS ELEMENTS
export type EventType = ChangeEvent<EventTarget & HTMLInputElement>;

export type ResetFormType = {
  resetForm: any;
};

//USERS
export type PlanType = {
  newPlan: Plan
}

export type UserType = Logo & PlanType & {
  id: string;
  pseudonym: string;
  destination: string;
  data: any;
};

export type UserFormType = {
  email: string;
  password?: string;
};

//FILES
type File = {
  name: string;
  fileUrl: string;
  tags: Tags;
  time: string;
}

export type FileType = File & {
  ownerId: string;
  profileType?: boolean;
};

export type FileContainerType = File & {
  authorName?: string;
  unopt?: boolean;
  titleShare?: string;
};

//FRIENDS
export type FriendType = {
  id?: string;
  usernameId: string;
  friendId: string;
  favorite: string;
  time: string;
}

//GROUPS
type Group = {
  name: string;
  logoUrl: string;
  description?: string;
  time: string;
  status: MembershipStatus
}

export type GroupType = Group & {
  id?: string;
};

export type MembersType = Group & {
  groupId: string;
  userId: string;
};

//POSTS
export type PostType = UserPost & Like & {
  title: string;
  content: string;
  idPost?: string;
};

// COMMENTS
export type NewCommentsType = Comment & {
};

type Comment = UserPost & {
  comment: string;
  idPost: string;
}

export type CommentType = Comment & {
  commentId: string;
};

export type SubCommentType = CommentType

export type LastCommentType = Comment & {
  subCommenId: string;
}
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
  profile,
  group,
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

export type LangType = 'en' | 'pl' | 'jp';

export type IndexType = 'photographs' | 'videos' | 'animations';

export type LanguageType = any;

//FORMS & CONTROLLERS ELEMENTS
export type EventType = ChangeEvent<EventTarget & HTMLInputElement>;

export type ResetFormType = {
  resetForm: any;
};

export type PlanType = {
  newPlan?: Plan;
};

//DATE OBJECT
export type DateObjectType = {
  second: string;
  minute: string;
  hour: string;
  day: string;
  yearDateSeparator: string;
};

//USERS
export type UserType = Logo &
  PlanType &
  Time & {
    id?: string;
    pseudonym: string;
    description?: string;
    profilePhoto?: string;
    email: string;
    plan: 'FREE' | 'PREMIUM' | 'GOLD';
    provider?: 'email' | 'google' | 'discord' | 'spotify';
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
  pseudonym: string;
};

//FRIENDS
export type FriendType = Time & {
  id?: string;
  usernameId: string;
  favorite: boolean;
  pseudonym: string;
  profilePhoto: string;
  time?: string;
};

export  type FriendsListType = {
  fileUrl: string;
  pseudonym: string;
  plan: string;
  favorite: boolean;
  createdAt: string;
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
  role: string;
  roleId: string;
  time?: string;
};

export type MemberType = {
  usersGroupsId?: string;
  pseudonym: string;
  profilePhoto: string;
};

//POSTS
export type PostsType = Time &
  Logo &
  Like & {
    pseudonym: string;
    name: string;
    postId?: string;
    authorId: string;
    title: string;
    content: string;
    likes: number;
    liked: boolean;
    shared: number;
    commented: number;
    groupId: string;
    roleId: string;
    date?: string;
  };

//GALLERY
export type GalleryType = {
  id: string;
  author: string;
  dataDateObject: DateObjectType;
  locale: LangType;
  firstGraphics?: FileType[];
  firstAnimations?: FileType[];
  firstVideos?: FileType[];
  firstFriendsList?: FriendsListType[];
  tDash?: { friends: string; groups: string; photos: string; animations: string; videos: string };
  tGallery?: {
    userPhotosTitle: string;
    userAnimationsTitle: string;
    userVideosTitle: string;
    noPhotos: string;
    noAnimations: string;
    noVideos: string;
  };
  tFriends?: { friends: string; noFriends: string };
}

// COMMENTS
export type NewCommentsType = {
  profilePhoto: string;
  comment?: string;
  fileId?: string;
  fileCommentId?: string;
  commentId?: string;
  subCommentId?: string;
  roleId?: string;
  postId?: string;
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
  groupRole: Role;
};

export type FilesCommentsType = Comment & {
  id: string;
  fileId: string;
  comment: string;
};

export type SubCommentType = Comment & {
  subCommentId: string;
  commentId?: string;
  subComment: string;
  fileCommentId?: string;
  groupRole?: Role;
  fileId?: string;
  postId?: string;
};

export type LastCommentType = Comment & {
  lastCommentId: string;
  subCommentId: string;
  lastComment: string;
  groupRole: Role;
  fileId?: string;
  postId?: string;
};

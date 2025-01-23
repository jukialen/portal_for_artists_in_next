import { ChangeEvent } from 'react';
import { Database } from './database.types';

//GENERAL
type Like = { likes: number; liked: boolean };
type Time = { createdAt?: string; updatedAt?: string };

export type Tags = Database['public']['Enums']['Tags'];
export type LangType = 'en' | 'pl' | 'jp';
export type IndexType = 'photographs' | 'videos' | 'animations';
export type Provider = Database['public']['Enums']['Provider'];

//FORMS & CONTROLLERS ELEMENTS
export type EventType = ChangeEvent<EventTarget & HTMLInputElement>;

export type ResetFormType = {
  resetForm: any;
};

export type NewPlanType = {
  newPlan?: Database['public']['Enums']['Plan'];
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
export type UserType = NewPlanType &
  Time & {
    id?: string;
    pseudonym: string;
    description?: string;
    profilePhoto?: string;
    email: string;
    plan: Database['public']['Enums']['Plan'];
    provider?: Database['public']['Enums']['Provider'];
  };

export type UserFormType = {
  email: string;
  password?: string;
};

//PROFILE
export type ProfileType = {
  language: { userAvatar: string; defaultAvatar: string; pseudonym: string; aboutMe: string };
  pseudonym: string;
  description: string;
  fileUrl: string;
};

//FILES
export type FileType = Time & {
  fileId?: string;
  name?: string;
  shortDescription?: string;
  tags?: Database['public']['Enums']['Tags'];
  pseudonym?: string;
  authorProfilePhoto?: string;
  authorName: string;
  profileType?: boolean;
  authorId: string;
  fileUrl: string;
  time: string;
  roleId?: string;
};

export type ArticleVideosType = {
  fileId: string;
  name: string;
  fileUrl: string;
  shortDescription: string;
  authorName: string;
  authorBool: boolean;
  profilePhoto: string;
  tags: Database['public']['Enums']['Tags'];
  authorId: string;
  time: string;
  roleId: string;
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

export type FriendsListArrayType = {
  pseudonym: string;
  profilePhoto: string;
  favorites: number;
};

export type FriendsListType = {
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
  role: Database['public']['Enums']['Role'];
  roleId: string;
  time?: string;
};

export type GroupsType = {
  name: string;
  description: string;
  logo: string;
};

export type GroupListType = {
  name: string;
  fileUrl: string;
};

export type GroupUserType = {
  name: string;
  logo: string;
  groupId: string;
};

export type MemberType = {
  usersGroupsId?: string;
  pseudonym: string;
  profilePhoto: string;
  role: Database['public']['Enums']['Role'];
};

export type GroupUsersType = {
  name: string;
  logo: string;
};

export type JoinUser = {
  logo: string;
  description: string;
  regulation: string;
  join: boolean;
  favorite: boolean;
  favoriteLength: number;
  admin: boolean;
  groupId: string;
  roleId: string;
  usersGroupsId: string;
};

export type nameGroupTranslatedType = {
  updateLogo?: {
    upload: string;
    notUpload: string;
    validateRequired: string;
    cancelButton: string;
    submit: string;
  };
  joinedUser?: {
    join: string;
    joined: string;
    addedToFav: string;
    addToFav: string;
    addToFavorite: string;
    maxFav: string;
    maximumAchieved: string;
  };
  groupSections?: {
    general: string;
    members: string;
    description: string;
    noPermission: string;
    deleteGroup: string;
  };
  members?: {
    admin: string;
    moderators: string;
    modsAria: string;
    noMods: string;
    anotherMembers: string;
    addModAria: string;
    noMembers: string;
  };
  posts?: {
    add: string;
    addTitPlaceholder: string;
    addTitAria: string;
    addDescription: string;
    addDesAria: string;
  };
  error?: string;
  noRegulation?: string;
};

//POSTS
export type PostsType = Time &
  Like & {
    authorName: string;
    authorProfilePhoto: string;
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
    idLiked: string;
  };

//GALLERY
export type GalleryType = {
  id: string;
  pseudonym?: string;
  profilePhoto: string;
  author: string;
  dataDateObject: DateObjectType;
  locale: LangType;
  firstGraphics?: FileType[];
  firstAnimations?: FileType[];
  firstVideos?: FileType[];
  firstFriendsList?: FriendsListType[];
  firstAdminList?: GroupUserType[];
  firstModsUsersList?: {
    members: GroupUserType[];
    moderators: GroupUserType[];
  };
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
};

// COMMENTS
type Comment = Time & {
  authorId: string;
  fileUrl?: string;
  roleId?: string;
  role: Database['public']['Enums']['Role'];
  date?: string;
  pseudonym?: string;
  content: string;
};

export type NewCommentsType = {
  authorId: string;
  profilePhoto?: string;
  roleId: string;
  content: string;
  fileId?: string;
  postId?: string;
  fileCommentId?: string;
  commentId?: string;
  subCommentId?: string;
};

export type CommentType = Comment & {
  authorName: string;
  authorProfilePhoto: string;
  commentId: string;
  postId: string;
};

export type FilesCommentsType = Comment & {
  authorName: string;
  authorProfilePhoto: string;
  fileCommentId: string;
  fileId: string;
};

export type SubCommentType = Comment & {
  authorName: string;
  authorProfilePhoto: string;
  subCommentId: string;
  commentId?: string;
  fileCommentId?: string;
  fileId?: string;
  postId?: string;
};

export type LastCommentType = Comment & {
  authorName: string;
  authorProfilePhoto: string;
  lastCommentId: string;
  subCommentId: string;
};

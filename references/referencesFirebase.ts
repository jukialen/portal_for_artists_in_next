import { collection, collectionGroup, doc, limit, orderBy, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase';

import { GroupNameType } from 'types/global.types';

const maxItems = 30;


// USERS
export const user = (username: string) => doc(db, `users/${username}`);
export const usersRef = collection(db, 'users');
export const friends = (username: string) => collection(db, `users/${username}/friends`);
export const delFriends = (username: string, docId: string) => doc(db, `users/${username}/friends/${docId}`);


// FILES
export const allPhotosCollectionRef = () => collectionGroup(db, 'photos');
export const allAnimatedCollectionRef = () => collectionGroup(db, 'animations');
export const allVideosCollectionRef = () => collectionGroup(db, 'videos');

export const nextDrawings = query(allPhotosCollectionRef(),
  where('tag', 'in', ['realistic', 'anime', 'manga', 'comics']),
  orderBy('timeCreated', 'desc'),
  limit(maxItems)
);

export const nextPhotos = query(allPhotosCollectionRef(),
  where('tag', '==', 'photographs'),
  orderBy('timeCreated', 'desc'),
  limit(maxItems)
);

export const nextAnimations = query(allAnimatedCollectionRef(),
  where('tag', '==', 'animations'),
  orderBy('timeCreated', 'desc'),
  limit(maxItems)
);

export const nextVideos = query(allVideosCollectionRef(),
  where('tag', '==', 'videos'),
  orderBy('timeCreated', 'desc'),
  limit(maxItems)
);

export const nextOthers = query(allPhotosCollectionRef(),
  where('tag', '==', 'others'),
  orderBy('timeCreated', 'desc'),
  limit(maxItems)
);

export const userPhotosRef = (user: string) => {
  return collection(db, `users/${user}/photos`);
};

export const userAnimationsRef = (user: string) => {
  return collection(db, `users/${user}/animations`);
};

export const userVideosRef = (user: string) => {
  return collection(db, `users/${user}/videos`);
};


// GROUPS
export const groupRef = collection(db, 'groups');
export const groups = (name: GroupNameType) => doc(db, `groups/${name}`);

export const adminInGroups = (userId: string) => query(
  groupRef, where('admin', '==', userId), orderBy('name'), limit(maxItems)
);

export const moderators = (name: GroupNameType) => collection(db, `groups/${name}/moderators`);
export const moderatorsGroups = () => collectionGroup(db, 'moderators');
export const deleteModerators = (name: GroupNameType, modId: string) => doc(db, `groups/${name}/moderators/${modId}`);

export const members = (name: GroupNameType) => collection(db, `groups/${name}/members`);
export const membersGroup = () => collectionGroup(db, 'members');
export const deleteMembers = (name: GroupNameType, memberId: string) =>
  doc(db, `groups/${name}/members/${memberId}`);


// POSTS
export const addingPost = (name: GroupNameType) => collection(db, `groups/${name}/posts`);

export const posts = (name: GroupNameType) => {
  return query(collectionGroup(db, 'posts'), where('nameGroup', '==', name),
    orderBy('date', 'desc'));
};
export const likePost = (name: GroupNameType, idPost: string) => doc(db, `groups/${name}/posts/${idPost}`);

export const deletingPost = (name: GroupNameType, idPost: string) => doc(db, `groups/${name}/posts/${idPost}`);


// GROUP COMMENTS
export const addingPostComment = (name: GroupNameType, idPost: string) => collection(db,
  `groups/${name}/posts/${idPost}/comments`);

export const postsComments = (name: GroupNameType, idPost: string) => {
  return query(collection(db, `groups/${name}/posts/${idPost}/comments`),
    orderBy('date', 'desc'));
};

export const docPostsComments = (name: GroupNameType, idPost: string, idComment: string) => {
  return doc(db, `groups/${name}/posts/${idPost}/comments/${idComment}`);
};

// GROUP SUBCOMMENTS
export const subPostsComments = (name: GroupNameType, idPost: string, idComment: string) => {
  return collection(db, `groups/${name}/posts/${idPost}/comments/${idComment}/subcomments`);
};

export const docSubPostsComments = (name: GroupNameType, idPost: string, idComment: string, idSubComment: string) => {
  return doc(db, `groups/${name}/posts/${idPost}/comments/${idComment}/subcomments/${idSubComment}`);
};

// GROUP LASTCOMMENTS
export const lastPostsComments = (name: GroupNameType, idPost: string, idComment: string, idSubComment: string) => {
  return collection(db, `groups/${name}/posts/${idPost}/comments/${idComment}/subcomments/${idSubComment}/lastcomments`);
};
export const docLastPostsComments = (name: GroupNameType, idPost: string, idComment: string, idSubComment: string, idLastComment: string) => {
  return doc(db, `groups/${name}/posts/${idPost}/comments/${idComment}/subcomments/${idSubComment}/lastcomments/${idLastComment}`);
};


// FILE COMMENTS
export const addingFilesComment = (uid: string, subCollection: string, idPost: string) => {
  return collection(db, `users/${uid}/${subCollection}/${idPost}/comments`);
};

export const filesComments = (uid: string, subCollection: string, idPost: string) => {
  return collection(db, `users/${uid}/${subCollection}/${idPost}/comments`);
};

export const docFilesComments = (userId: string, subCollection: string, idPost: string, idComment: string) => {
  return doc(db, `users/${userId}/${subCollection}/${idPost}/comments/${idComment}`);
};

export const commentsFiles = (subCollection: string, description: string) => {
  return query(collectionGroup(db, subCollection),
    where('description', '==', description), orderBy('timeCreated', 'desc'));
}

// FILE SUBCOMMENTS
export const subFilesComments = (uid: string, subCollection: string, idPost: string, idComment: string) => {
  return collection(db, `users/${uid}/${subCollection}/${idPost}/comments/${idComment}/subcomments`)
}

export const docSubFilesComment = (userId: string, subCollection: string, idPost: string, idComment: string, idSubComment: string) => {
  return doc(db, `users/${userId}/${subCollection}/${idPost}/comments/${idComment}/subcomments/${idSubComment}`)
}

//FILE LASTCOMMENTS
export const subLastFilesComments = (uid: string, subCollection: string, idPost: string, idComment: string, idSubComment: string) => {
  return collection(db, `users/${uid}/${subCollection}/${idPost}/comments/${idComment}/subcomments/${idSubComment}/lastcomment`)
}

export const docLastFilesComment = (userId: string, subCollection: string, idPost: string, idComment: string, idSubComment: string, idLastComment: string) => {
  return doc(db, `users/${userId}/${subCollection}/${idPost}/comments/${idComment}/subcomments/${idSubComment}/lastcomment/${idLastComment}`)
}
import { collection, collectionGroup, doc, limit, orderBy, query, where } from 'firebase/firestore';
import { db } from '../firebase';

import { GroupNameType } from 'types/global.types';

// USERS
export const user = (username: string) => doc(db, `users/${username}`);
export const usersRef = collection(db, 'users');

// FILES
const maxItems = 10;

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
export const groupsQuery = (currentUser: string) => query(groupRef, where('admin', '==', currentUser),
  orderBy('name'));
query(groupRef, limit(5), orderBy('name'));

export const usersInGroup = (name: GroupNameType) => doc(db, `groups/${name}`);

export const groupSection = (name: GroupNameType) => query(groupRef, where('name', '==', name));

// POSTS
export const addingPost = (name: GroupNameType) => collection(db, `groups/${name}/posts`);

export const posts = (name: GroupNameType) => {
  return query(collectionGroup(db, 'posts'), where('nameGroup', '==', name),
    orderBy('date', 'desc'));
};
export const likePost = (name: GroupNameType, idPost: string) => doc(db, `groups/${name}/posts/${idPost}`);

export const deletingPost = (name: GroupNameType, idPost: string) => doc(db, `groups/${name}/posts/${idPost}`);

// COMMENTS
export const addingPostComment = (name: GroupNameType, idPost: string) => collection(db,
  `groups/${name}/posts/${idPost}/comments`);

export const addingFilesComment = (uid: string, subCollection: string, idPost: string) => {
  return collection(db, `users/${uid}/${subCollection}/${idPost}/comments`);
}

export const postsComments = (name: GroupNameType, idPost: string) => {
  return query(collection(db, `groups/${name}/posts/${idPost}/comments`),
    orderBy('date', 'desc'));
};

export const filesComments = (uid: string, subCollection: string, idPost: string) => {
  return collection(db, `users/${uid}/${subCollection}/${idPost}/comments`)
}

export const docFilesComments = (userId: string, subCollection: string, idPost: string, idComment: string) => {
  return doc(db, `users/${userId}/${subCollection}/${idPost}/comments/${idComment}`)
}

export const commentsFiles = (subCollection: string, description: string) => {
  return query(collectionGroup(db, subCollection),
    where('description', '==', description), orderBy('timeCreated', 'desc'));
}

// SUBCOMMENTS
export const subFilesComments = (uid: string, subCollection: string, idPost: string, idComment: string) => {
  return collection(db, `users/${uid}/${subCollection}/${idPost}/comments/${idComment}/subcomments`)
}

export const docSubFilesComment = (userId: string, subCollection: string, idPost: string, idComment: string, idSubComment: string) => {
  return doc(db, `users/${userId}/${subCollection}/${idPost}/comments/${idComment}/subcomments/${idSubComment}`)
}

//LAST SUBCOMMENTS
export const subLastFilesComments = (uid: string, subCollection: string, idPost: string, idComment: string, idSubComment: string) => {
  return collection(db, `users/${uid}/${subCollection}/${idPost}/comments/${idComment}/subcomments/${idSubComment}/lastcomment`)
}

export const docLastFilesComment = (userId: string, subCollection: string, idPost: string, idComment: string, idSubComment: string, idLastComment: string) => {
  return doc(db, `users/${userId}/${subCollection}/${idPost}/comments/${idComment}/subcomments/${idSubComment}/lastcomment/${idLastComment}`)
}
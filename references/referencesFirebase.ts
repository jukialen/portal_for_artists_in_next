import { collection, collectionGroup, doc, limit, orderBy, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { animationsTags, drawingsTags, othersTags, photosTags, videosTags } from 'helpers/arrayTags';

import { AuthorType } from 'types/global.types';

const maxItems: number = 10;

const user = auth.currentUser;

export const allPhotosCollectionRef = () => collectionGroup(db, 'photos');
export const allAnimatedCollectionRef = () => collectionGroup(db, 'animations');
export const allVideosCollectionRef = () => collectionGroup(db, 'videos');

export const nextDrawings = query(allPhotosCollectionRef(),
  where('tag', 'in', drawingsTags),
  orderBy('timeCreated', 'desc'),
  limit(maxItems)
);

export const nextPhotos = query(allPhotosCollectionRef(),
  where('tag', 'in', photosTags),
  orderBy('timeCreated', 'desc'),
  limit(maxItems)
);

export const nextAnimations = query(allAnimatedCollectionRef(),
  where('tag', 'in', animationsTags),
  orderBy('timeCreated', 'desc'),
  limit(maxItems)
);

export const nextVideos = query(allVideosCollectionRef(),
  where('tag', 'in', videosTags),
  orderBy('timeCreated', 'desc'),
  limit(maxItems)
);

export const nextOthers = query(allPhotosCollectionRef(),
  where('tag', 'in', othersTags),
  orderBy('timeCreated', 'desc'),
  limit(maxItems)
);


export const userPhotosRef = (user?: string) => {
  return collection(db, `users/${user}/photos`)
}

export const userAnimationsRef = (user?: string) => {
  return collection(db, `users/${user}/animations`)
}

export const userVideosRef = (user?: string) => {
  return collection(db, `users/${user}/videos`)
}

export const groupRef = collection(db, 'groups');
export const groupsQuery = query(groupRef, where('admin', '==', `${user?.uid}`));

export const usersInGroup = (name: AuthorType) => collection(db, `groups/${name}/users`);
export const deleteUserFromGroup = (name: AuthorType, username: string) => {
  return query(usersInGroup(name!), where('username', '==', username));
}

export const groupSection = (name: AuthorType) => query(groupRef, where('name', '==', name));

export const addingPost = (name: AuthorType) => collection(db, `groups/${name}/posts`);

export const posts = (name: AuthorType) => {
  return query(collectionGroup(db, 'posts'), where('nameGroup', '==', name), orderBy('date', 'desc'));
};

export const deletingPost = (name: string, idPost: string) => doc(db, `groups/${name}/posts/${idPost}`);

export const addingComment = (name: string, idPost: string) => collection(db, `groups/${name}/posts/${idPost}/comments`);

export const comments = (name: AuthorType) => {
  return query(collectionGroup(db, 'comments'), where('nameGroup', '==', name), orderBy('date', 'desc'));
};

export const addingCommentFiles = (uid: string, subCollection: string, idPost: string) => {
  return collection(db, `users/${uid}/${subCollection}/${idPost}/comments`);
}

export const commentsFiles = (subCollection: string, description: string) => {
  return query(collectionGroup(db, `${subCollection}`), where('description', '==', description), orderBy('timeCreated', 'desc'));
}
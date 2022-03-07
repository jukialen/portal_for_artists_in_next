import { collection, collectionGroup } from 'firebase/firestore';
import { auth, db } from '../firebase';

export const photosCollectionRef = () => {
  const user = auth?.currentUser;
  return collection(db, `users/${user?.uid}/photos`);
}

export const videosCollectionRef = () => {
  const user = auth?.currentUser;
  return collection(db, `users/${user?.uid}/videos`);
}

export const animationsCollectionRef = () => {
  const user = auth?.currentUser;
  return collection(db, `users/${user?.uid}/animations`);
}

export const allPhotosCollectionRef = () => collectionGroup(db, 'photos');
export const allAnimatedCollectionRef = () => collectionGroup(db, 'animations');
export const allVideosCollectionRef = () => collectionGroup(db, 'videos');
import { collection, collectionGroup, limit, orderBy, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { animationsTags, drawingsTags, othersTags, photosTags, videosTags } from 'helpers/arrayTags';

const maxItems: number = 10;

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
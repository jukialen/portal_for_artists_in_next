import { addDoc, collection, CollectionReference } from 'firebase/firestore';
import { auth, db, storage } from '../firebase';
import { UploadTaskSnapshot } from '@firebase/storage';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

export const photosCollectionRef = () => {
  const user = auth?.currentUser;
  const ref = collection(db, `users/${user?.uid}/photos`);
  
  return ref;
}

export const videosCollectionRef = () => {
  const user = auth?.currentUser;
  const ref = collection(db, `users/${user?.uid}/videos`);
  
  return ref;
}

export const animationsCollectionRef = () => {
  const user = auth?.currentUser;
  const ref = collection(db, `users/${user?.uid}/animations`);
  
  return ref;
}
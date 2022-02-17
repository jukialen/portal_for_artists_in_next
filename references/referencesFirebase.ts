import { collection } from 'firebase/firestore';
import { auth, db } from '../firebase';

export const photosCollectionRef = () => {
  const user = auth?.currentUser;
  const ref = collection(db, `users/${user?.uid}/photos`);
  
  return ref;
}

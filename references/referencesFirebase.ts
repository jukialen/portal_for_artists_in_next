import { collection } from 'firebase/firestore';
import { auth, db } from '../firebase';

const user = auth.currentUser;

export const photosCollectionRef = collection(db, `users/${user?.uid}/photos`);

import { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export const useUserData = () => {
  const [pseudonym, setPseudonym] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const user = auth.currentUser;

  const docRef = doc(db, `users/${user?.uid}`);
  const getUserData = async () => {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setPseudonym(docSnap.data().pseudonym);
      setDescription(docSnap.data().description);
    } else {
      console.log('No such document!');
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => !!user && getUserData());
  }, [docRef]);

  return { pseudonym, description };
};

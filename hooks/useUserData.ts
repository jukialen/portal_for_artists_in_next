import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export const useUserData = () => {
  const [pseudonym, setPseudonym] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  
  const user = auth.currentUser;

  const docRef = doc(db, 'users', `${user?.uid}`);
  const getUserData = async () => {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setPseudonym(docSnap.data()?.pseudonym || user?.providerData[0].displayName);
      setDescription(docSnap.data()?.description)
    } else {
      console.log("No such document!");
    }
  }
  
  useEffect(() => {
    onAuthStateChanged(auth, (user) => !!user && getUserData())
  }, [docRef, pseudonym, description])
  
  return { pseudonym, description }
}
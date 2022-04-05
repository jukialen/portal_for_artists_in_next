import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

export const useCurrentUser = (adress: string) => {
  const { push } = useRouter();
  const [loading, setLoading] = useState(true);
  
  const currentUser = onAuthStateChanged(auth, (user) => !!user ? setLoading(false) : push(adress))
  
  useEffect(() => { return currentUser() }, [currentUser])
  return loading
};
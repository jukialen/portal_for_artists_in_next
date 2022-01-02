import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

export const useCurrentUser = (adress: string) => {
  const { push } = useRouter();
  const [loading, setLoading] = useState(true);
  
  const currentUser = onAuthStateChanged(auth, (user) => !!user ? setLoading(false) : push(adress))
  
  useEffect(() => { currentUser() }, [currentUser])
  return loading
};
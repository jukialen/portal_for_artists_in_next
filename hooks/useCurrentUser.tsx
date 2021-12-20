import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { useState } from 'react';
import { useRouter } from 'next/router';

export const useCurrentUser = (adress: string) => {
  const { push } = useRouter();
  const [loading, setLoading] = useState(true);
  onAuthStateChanged(auth, (user) => user ? setLoading(false) : push(adress))
  return loading
};
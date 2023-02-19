import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Session from 'supertokens-web-js/recipe/session';

export const useCurrentUser = (adress: string) => {
  const { push } = useRouter();
  const [loading, setLoading] = useState(true);

 
  const currentUser = async () => {
    if (await Session.doesSessionExist()) {
      setLoading(false)
    } else {
      push(adress)
    }
  }

  useEffect(() => {
    currentUser();
  }, []);
  return loading;
};

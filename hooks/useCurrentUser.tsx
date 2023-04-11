import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Session from 'supertokens-web-js/recipe/session';

export const useCurrentUser = (adress: string) => {
  const { push } = useRouter();
  const [loading, setLoading] = useState(true);

 
  const currentUser = async () => {
    await Session.doesSessionExist() ? setLoading(false) : push(adress);
  }

  useEffect(() => {
    currentUser();
  }, []);

  return loading;
};

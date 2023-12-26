'use client';

import { useEffect, useState } from 'react';
import Session from 'supertokens-web-js/recipe/session';

import { UserType } from 'types/global.types';

import { backUrl } from 'constants/links';

export const useUserData = () => {
  const [userInfo, setUserInfo] = useState<UserType>();

  const getUserData = async () => {
    if (await Session.doesSessionExist()) {
      const userId = await Session.getUserId();

      const data: UserType = await fetch(`${backUrl}/users/current/${userId}`)
        .then((e) => e.json())
        .catch((e) => console.log('e u', e));
      
      setUserInfo({
        id: userId,
        pseudonym: data.pseudonym!,
        description: data.description,
        profilePhoto: data.profilePhoto,
        plan: data.plan,
        provider: data.provider,
      });
    } else {
      console.error('not user');
    }
  };

  useEffect(() => {
    getUserData()
  }, []);

  return userInfo;
};

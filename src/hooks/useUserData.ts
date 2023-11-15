'use client';

import { useEffect, useState } from 'react';
import Session from 'supertokens-web-js/recipe/session';
import axios from 'axios';

import { UserType } from 'src/types/global.types';

<<<<<<< Updated upstream:hooks/useUserData.ts
import { backUrl } from 'utilites/constants';
=======
import { backUrl } from 'src/constants/links';
>>>>>>> Stashed changes:source/hooks/useUserData.ts

export const useUserData = () => {
  const [userInfo, setUserInfo] = useState<UserType | {}>({});
  const [userId, setUserId] = useState<string>();

  const getUserId = async () => {
    if (await Session.doesSessionExist()) {
      setUserId(await Session.getUserId());
    }
  };

  const getUserData = async () => {
    try {
      if (await Session.doesSessionExist()) {
        const userId = await Session.getUserId();
        const accessTokenPayload = await Session.getAccessTokenPayloadSecurely();

        const data: { data: UserType } = await axios.get(`${backUrl}/users/current/${userId}`);

        const { id, pseudonym, description, profilePhoto, plan, provider } = data.data;

        setUserInfo({
          id,
          pseudonym,
          description,
          profilePhoto,
          plan,
          email: accessTokenPayload.email,
          provider,
        });
      } else {
        setUserInfo({});
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getUserId();
  }, []);

  useEffect(() => {
    getUserData();
  }, [userId]);

  return !!userInfo ? { ...userInfo } : {};
};

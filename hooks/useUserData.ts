import { useEffect, useState } from 'react';
import Session from 'supertokens-web-js/recipe/session';
import axios from 'axios';

import { UserType } from 'types/global.types';

import { backUrl } from 'utilites/constants';

export const useUserData = () => {
  const [userInfo, setUserInfo] = useState<UserType | {}>({});

  const getUserData = async () => {
    if (await Session.doesSessionExist()) {
      const userId = await Session.getUserId();
      const accessTokenPayload = await Session.getAccessTokenPayloadSecurely();
      const data: {
        data: UserType;
      } = await axios.get(`${backUrl}/users`, { params: { where: { id: userId } } });

      const { id, pseudonym, description, profilePhoto, plan } = data.data;

      setUserInfo({
        id,
        pseudonym,
        description,
        profilePhoto,
        plan,
        email: accessTokenPayload.email,
      });
    } else {
      setUserInfo({});
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return !!userInfo ? { ...userInfo } : {};
};

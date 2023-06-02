import { useEffect, useState } from 'react';
import Session from 'supertokens-web-js/recipe/session';
import axios from 'axios';

import { UserType } from 'types/global.types';

import { backUrl } from 'utilites/constants';

export const useUserData = () => {
  const [userInfo, setUserInfo] = useState<UserType>({
    id: '',
    pseudonym: '',
    description: '',
    profilePhoto: '',
    plan: '',
  });

  const getUserData = async () => {
    if (await Session.doesSessionExist()) {
      const userId = await Session.getUserId();
      const data: { data: UserType } = await axios.get(`${backUrl}/users`, { params: { where: { id: userId } } });

      const { id, pseudonym, description, profilePhoto, plan } = data.data;

      setUserInfo({
        id,
        pseudonym,
        description,
        profilePhoto,
        plan,
      });
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return {
    id: userInfo.id,
    pseudonym: userInfo.pseudonym,
    description: userInfo.description,
    profilePhoto: userInfo.profilePhoto,
    plan: userInfo.plan,
  };
};

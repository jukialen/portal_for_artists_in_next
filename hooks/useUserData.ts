import { useEffect, useState } from 'react';
import Session from 'supertokens-web-js/recipe/session';
import axios from 'axios';
import { backUrl } from 'utilites/constants';

export const useUserData = () => {
  const [userInfo, setUserInfo] = useState({
    id: '',
    pseudonym: '',
    description: '',
    profilePhoto: '',
    plan: '',
  });

  const getUserData = async () => {
    if (await Session.doesSessionExist()) {
      const userId = await Session.getUserId();
      const data: {
        id: string;
        pseudonym: string;
        destription: string;
        profilePhoto: string;
        plan: string;
      } = await axios.get(`${backUrl}/users`, { params: { where: { id: userId } } });

      setUserInfo({
        id: data.id,
        pseudonym: data.pseudonym,
        description: data.destription,
        profilePhoto: data.profilePhoto,
        plan: data.plan,
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

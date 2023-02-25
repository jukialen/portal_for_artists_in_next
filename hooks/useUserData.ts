import { useState } from 'react';
import Session from 'supertokens-web-js/recipe/session';
import axios from 'axios';
import { useCurrentUser } from './useCurrentUser';

export const useUserData = () => {
  const [pseudonym, setPseudonym] = useState('');
  const [description, setDescription] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');

  const getUserData = async () => {
    if (await Session.doesSessionExist()) {
      const userId = await Session.getUserId();
      const data: { pseudonym: string, destription: string, profilePhoto: string } = await axios.get('/users', { params: { where: {id: userId}}});

      if (!!data) {
        setPseudonym(data.pseudonym);
        setDescription(data.destription);
        setProfilePhoto(data.profilePhoto);
      }
    } else {
      console.log('No such document!');
    }    
  };

  
  !!useCurrentUser('/') && getUserData();

  return { pseudonym, description, profilePhoto };
};


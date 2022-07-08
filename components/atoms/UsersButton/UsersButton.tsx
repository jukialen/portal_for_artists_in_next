import styles from './UsersButton.module.scss';
import { Avatar, IconButton, Link } from '@chakra-ui/react';
import group from '../../../public/group.svg';
import NextLink from 'next/link';
import { AddIcon, CheckIcon } from '@chakra-ui/icons';
import { auth } from '../../../firebase';
import { AuthorType } from '../../../types/global.types';
import { arrayUnion, setDoc } from 'firebase/firestore';
import { usersInGroup } from '../../../references/referencesFirebase';
import { useEffect, useState } from 'react';

type ModeratorsType = {
  modId: string;
  pseudonymModerators?: string;
  logo?: string;
}

type UsersButtonType = {
  id: string
  name: AuthorType;
  pseudonym: string;
  logo: string;
  admin: string;
  moderatorsArray: ModeratorsType[];
};

export const UsersButton = ({ id, name, pseudonym, logo, admin, moderatorsArray }: UsersButtonType) => {
  const [toggleModRole, setToggleModRole] = useState(false);
  
  
  useEffect(() => {
    console.log(toggleModRole)
    moderatorsArray.length > 0 && moderatorsArray.map(({ modId }: ModeratorsType) => {
      console.log(id)
      console.log(modId)
      id === modId ? setToggleModRole(true) : setToggleModRole(false)
      console.log(toggleModRole)
    })
  }, [name, id])
  
  const user = auth.currentUser;
  const currentUser = user?.uid;
  
  const addingModerators = async (name: AuthorType, pseudonym: string) => {
    try {
      await setDoc(usersInGroup(name!),
        { moderators: arrayUnion(pseudonym) },
        { merge: true });
      await setToggleModRole(true);
    } catch (e) {
      console.error(e);
    }
  };
  
  return <div className={styles.usersButton}>
    <Avatar name={pseudonym} src={!!logo ? logo : group} />
    <NextLink href={`/user/${pseudonym}`} passHref>
      <Link>{pseudonym}</Link>
    </NextLink>
    {admin === currentUser && <IconButton
      type='submit'
      aria-label={toggleModRole ? 'Added a moderator' : 'Add a moderator'}
      icon={toggleModRole ? <CheckIcon /> : <AddIcon />}
      onClick={() => addingModerators(name, id)}
    />}
  </div>
}
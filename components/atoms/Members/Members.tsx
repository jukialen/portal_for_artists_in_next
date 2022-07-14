import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { auth, db } from '../../../firebase';
import { arrayRemove, doc, getDoc, setDoc } from 'firebase/firestore';
import { Avatar, Divider, IconButton, Link } from '@chakra-ui/react';

import { usersInGroup } from 'references/referencesFirebase';

import { GroupNameType } from 'types/global.types';

import { UsersButton } from 'components/atoms/UsersButton/UsersButton';

import styles from './Members.module.scss';
import group from 'public/group.svg';
import { MinusIcon } from '@chakra-ui/icons';

type MembersType = {
  admin: string;
  moderators: string[];
  users: string[];
}

type ModeratorsType = {
  modId: string;
  pseudonymModerators: string;
  profilePhoto: string;
}

type UsersType = {
  id: string;
  pseudonymUsers: string;
  profilePhoto: string;
}

export const Members = ({ admin, moderators, users }: MembersType) => {
  const [pseudonymAdmin, setPseudonymAdmin] = useState('');
  const [profilePhotoAdmin, setProfilePhotoAdmin] = useState('');
  const [usersArray, setUsersArray] = useState<UsersType[]>([]);
  const [moderatorsArray, setModeratorsArray] = useState<ModeratorsType[]>([]);
  
  const { asPath } = useRouter();
  
  const user = auth.currentUser;
  const currentUser = user?.uid;
  const name = decodeURIComponent(asPath.split('/')[2]);
  
  const downloadAdmin = async (admin: string) => {
    const docRef = doc(db, `users/${admin}`);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      setPseudonymAdmin(docSnap.data().pseudonym);
      setProfilePhotoAdmin(docSnap.data().profilePhoto);
    } else {
      console.log('No admin found');
    }
  };
  
  useEffect(() => {
    !!admin && downloadAdmin(admin);
  }, [admin, name]);
  
  const moderatorsList = async () => {
    try {
      const moderatorArray: ModeratorsType[] = [];
      moderators.sort();
      
      for (const moderator of (moderators)) {
        const docRef = doc(db, `users/${moderator}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          moderatorArray.push({
            modId: moderator,
            pseudonymModerators: docSnap.data().pseudonym,
            profilePhoto: docSnap.data().profilePhoto,
          });
        }
      }
      setModeratorsArray(moderatorArray);
    } catch (e) {
      console.error(e);
    }
  };
  
  useEffect(() => {
    !!moderators && moderatorsList();
  }, [moderators]);
  
  const usersList = async () => {
    try {
      const userArray: UsersType[] = [];
      users.sort();
      
      for (const user of (users)) {
        const docRef = doc(db, `users/${user}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          userArray.push({
            id: user,
            pseudonymUsers: docSnap.data().pseudonym,
            profilePhoto: docSnap.data().profilePhoto,
          });
        }
      }
      setUsersArray(userArray);
    } catch (e) {
      console.error(e);
    }
  };
  
  useEffect(() => {
    !!users && usersList();
  }, [users]);
  
  const removingModerators = async (name: GroupNameType, pseudonym: string) => {
    try {
      await setDoc(usersInGroup(name!),
        { moderators: arrayRemove(pseudonym) },
        { merge: true });
      await moderatorsList();
    } catch (e) {
      console.error(e);
    }
  };
  
  return <>
    <h2>Members list</h2>
    <p className={styles.roles}>Admin</p>
    <Divider orientation='horizontal' />
    
    <div className={styles.usersButton}>
      <Avatar name={pseudonymAdmin} src={profilePhotoAdmin} />
      <NextLink href={`/user/${pseudonymAdmin}`} passHref>
        <Link>{pseudonymAdmin}</Link>
      </NextLink>
    </div>
    <p className={styles.roles}>Moderators</p>
    <Divider orientation='horizontal' />
    
    {moderatorsArray.length > 0 ? moderatorsArray.map(({ modId, pseudonymModerators, profilePhoto }: ModeratorsType) =>
      <div className={styles.usersButton} key={pseudonymModerators}>
        <Avatar name={pseudonymModerators} src={!!profilePhoto ? profilePhoto : group} />
          <NextLink href={`/user/${pseudonymModerators}`} passHref>
            <Link>{pseudonymModerators}</Link>
          </NextLink>
        {admin === currentUser && <IconButton
          type='submit'
          aria-label='Removing a moderator'
          icon={<MinusIcon />}
          onClick={() => removingModerators(name, modId)}
        />}
      </div>) : <p>No moderators</p>}
    
    <p className={styles.roles}>Users</p>
    <Divider orientation='horizontal' />
    
    {usersArray.length > 0 ? usersArray.map(({ id, pseudonymUsers, profilePhoto }: UsersType) =>
      <UsersButton
        key={id}
        id={id}
        name={name}
        pseudonym={pseudonymUsers}
        logo={profilePhoto}
        admin={admin}
        moderatorsArray={moderatorsArray}
      />
    ) : <p>No users</p>}
  </>;
};
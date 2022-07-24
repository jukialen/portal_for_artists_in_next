import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { auth } from '../../../firebase';
import { arrayRemove, getDoc, setDoc } from 'firebase/firestore';
import { Avatar, Divider, IconButton, Link } from '@chakra-ui/react';

import { user as user_ref, usersInGroup } from 'references/referencesFirebase';

import { GroupNameType } from 'types/global.types';

import { useHookSWR } from 'hooks/useHookSWR';

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

type AnotherMembersType = {
  id: string;
  pseudonymMembers: string;
  profilePhoto: string;
}

export const Members = ({ admin, moderators, users }: MembersType) => {
  const [pseudonymAdmin, setPseudonymAdmin] = useState('');
  const [profilePhotoAdmin, setProfilePhotoAdmin] = useState('');
  const [membersArray, setMembersArray] = useState<AnotherMembersType[]>([]);
  const [moderatorsArray, setModeratorsArray] = useState<ModeratorsType[]>([]);
  
  const { asPath } = useRouter();
  const data = useHookSWR();
  
  const currentUser = auth.currentUser?.uid;
  
  const name = decodeURIComponent(asPath.split('/')[2]);
  
  const downloadAdmin = async (admin: string) => {
    const docSnap = await getDoc(user_ref(admin));
    
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
        const docSnap = await getDoc(user_ref(moderator));
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
  
  const membersList = async () => {
    try {
      const memberArray: AnotherMembersType[] = [];
      users.sort();
      
      for (const user of (users)) {
        const docSnap = await getDoc(user_ref(user));
        if (docSnap.exists()) {
          memberArray.push({
            id: user,
            pseudonymMembers: docSnap.data().pseudonym,
            profilePhoto: docSnap.data().profilePhoto,
          });
        }
      }
      setMembersArray(memberArray);
    } catch (e) {
      console.error(e);
    }
  };
  
  useEffect(() => {
    !!users && membersList();
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
    <p className={styles.roles}>{data?.Members?.admin}</p>
    <Divider orientation='horizontal' />
    
    <div className={styles.usersButton}>
      <Avatar name={pseudonymAdmin} src={profilePhotoAdmin} />
      <NextLink href={`/user/${pseudonymAdmin}`} passHref>
        <Link>{pseudonymAdmin}</Link>
      </NextLink>
    </div>
    <p className={styles.roles}>{data?.Members?.moderators}</p>
    <Divider orientation='horizontal' />
    
    {moderatorsArray.length > 0 ? moderatorsArray.map(({ modId, pseudonymModerators, profilePhoto }: ModeratorsType) =>
      <div className={styles.usersButton} key={pseudonymModerators}>
        <Avatar name={pseudonymModerators} src={!!profilePhoto ? profilePhoto : group} />
          <NextLink href={`/user/${pseudonymModerators}`} passHref>
            <Link>{pseudonymModerators}</Link>
          </NextLink>
        {admin === currentUser && <IconButton
          type='submit'
          aria-label={data?.Members?.modsAria}
          icon={<MinusIcon />}
          onClick={() => removingModerators(name, modId)}
        />}
      </div>) : <p>{data?.Members?.noMods}</p>}
    
    <p className={styles.roles}>{data?.Members?.anotherMembers}</p>
    <Divider orientation='horizontal' />
    
    {membersArray.length > 0 ? membersArray.map(({ id, pseudonymMembers, profilePhoto }: AnotherMembersType) =>
      <UsersButton
        key={id}
        id={id}
        name={name}
        pseudonym={pseudonymMembers}
        logo={profilePhoto}
        admin={admin}
        moderatorsArray={moderatorsArray}
      />
    ) : <p>{data?.Members?.noMembers}</p>}
  </>;
};
import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { auth } from '../../../firebase';
import {
  deleteDoc, DocumentData, getDoc, getDocs, limit, query, QueryDocumentSnapshot, startAfter
} from 'firebase/firestore';
import { Avatar, Divider, IconButton, Link } from '@chakra-ui/react';

import { deleteModerators, moderators, user as user_ref, usersGroups } from 'references/referencesFirebase';

import { GroupNameType } from 'types/global.types';

import { useHookSWR } from 'hooks/useHookSWR';

import { UsersButton } from 'components/atoms/UsersButton/UsersButton';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';

import styles from './Members.module.scss';
import group from 'public/group.svg';
import { MinusIcon } from '@chakra-ui/icons';

type MembersType = {
  admin: string;
  name: string | string[];
}

type ModeratorsType = {
  modId: string;
  pseudonym: string;
  profilePhoto: string;
}

type AnotherMembersType = {
  userId: string;
  pseudonym: string;
  profilePhoto: string;
}

export const Members = ({ admin, name }: MembersType) => {
  const [pseudonymAdmin, setPseudonymAdmin] = useState('');
  const [profilePhotoAdmin, setProfilePhotoAdmin] = useState('');
  const [moderatorsArray, setModeratorsArray] = useState<ModeratorsType[]>([]);
  const [lastModeratorsVisible, setModeratorsLastVisible] = useState<QueryDocumentSnapshot>();
  let [iModerators, setIModerators] = useState(1);
  const [membersArray, setMembersArray] = useState<AnotherMembersType[]>([]);
  const [lastMembersVisible, setMembersLastVisible] = useState<QueryDocumentSnapshot>();
  let [iMembers, setIMembers] = useState(1);
  
  const data = useHookSWR();
  const maxItems = 30;
  
  const currentUser = auth.currentUser?.uid;
  
  const downloadAdmin = async () => {
    const docSnap = await getDoc(user_ref(admin));
    
    if (docSnap.exists()) {
      setPseudonymAdmin(docSnap.data().pseudonym);
      setProfilePhotoAdmin(docSnap.data().profilePhoto);
    } else {
      console.log('No admin found');
    }
  };
  
  useEffect(() => { !!admin && downloadAdmin() }, [admin, name]);
  
  const moderatorsList = async () => {
    try {
      const firstModerators = query(moderators(name), limit(maxItems));
      const documentSnapshots = await getDocs(firstModerators);
  
      const moderatorArray: ModeratorsType[] = [];
  
      for (const doc of documentSnapshots.docs) {
        const docSnap = await getDoc<DocumentData>(doc.data().moderator);
    
        docSnap.exists() && moderatorArray.push({
          modId: docSnap.id,
          pseudonym: docSnap.data().pseudonym,
          profilePhoto: docSnap.data().profilePhoto
        });
      };
  
      setModeratorsArray(moderatorArray);
      moderatorArray.length === maxItems && setModeratorsLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
    } catch (e) {
      console.error(e);
    }
  };
  
  useEffect(() => { !!name && moderatorsList() }, [name]);
  
  const nextModeratorsList = async () => {
    try {
      const firstModerators = query(moderators(name), limit(maxItems), startAfter(lastModeratorsVisible));
      const documentSnapshots = await getDocs(firstModerators);
      
      const nextModeratorArray: ModeratorsType[] = [];
      
      for (const doc of documentSnapshots.docs) {
        const docSnap = await getDoc<DocumentData>(doc.data().moderator);
        
        docSnap.exists() && nextModeratorArray.push({
          modId: docSnap.id,
          pseudonym: docSnap.data().pseudonym,
          profilePhoto: docSnap.data().profilePhoto
        });
      };
      
      const nextArray = moderatorsArray.concat(...nextModeratorArray);
      setModeratorsArray(nextArray);
      setModeratorsLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
      setIModerators(iModerators++)
    } catch (e) {
      console.error(e);
    }
  };
  
  const membersList = async () => {
    try {
      const firstUsers = query(usersGroups(name), limit(maxItems));
      const documentSnapshots = await getDocs(firstUsers);
      
      const memberArray: AnotherMembersType[] = [];
      
      for (const doc of documentSnapshots.docs) {
        const docSnap = await getDoc<DocumentData>(doc.data().users);
        docSnap.exists() && memberArray.push({
          userId: docSnap.id,
          pseudonym: docSnap.data().pseudonym,
          profilePhoto: docSnap.data().profilePhoto
        });
      };
      
      setMembersArray(memberArray);
      memberArray.length === maxItems && setMembersLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
    } catch (e) {
      console.error(e);
    }
  };
  
  useEffect(() => { !!name && membersList() }, [name]);
  
  const nextMembersList = async () => {
    try {
      const firstUsers = query(usersGroups(name), limit(maxItems), startAfter(lastMembersVisible));
      const documentSnapshots = await getDocs(firstUsers);
      
      const nextMemberArray: AnotherMembersType[] = [];
      
      for (const doc of documentSnapshots.docs) {
        const docSnap = await getDoc<DocumentData>(doc.data().users);
        
        docSnap.exists() && nextMemberArray.push({
          userId: docSnap.id,
          pseudonym: docSnap.data().pseudonym,
          profilePhoto: docSnap.data().profilePhoto
        });
      };
      
      const nextArray = membersArray.concat(...nextMemberArray);
      setMembersArray(nextArray);
      setMembersLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
      setIMembers(iMembers++);
    } catch (e) {
      console.error(e);
    }
  };
  
  const removingModerators = async (name: GroupNameType, modId: string) => {
    try {
      await deleteDoc(deleteModerators(name!, modId));
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
    
    {
      moderatorsArray.length > 0 ? moderatorsArray.map(({ modId, pseudonym, profilePhoto }: ModeratorsType, index) =>
      <div className={styles.usersButton} key={index}>
        <Avatar name={pseudonym} src={!!profilePhoto ? profilePhoto : group} />
        <NextLink href={`/user/${pseudonym}`} passHref>
          <Link>{pseudonym}</Link>
        </NextLink>
        {
          admin === currentUser &&
          <IconButton
            type='submit'
            aria-label={data?.Members?.modsAria}
            icon={<MinusIcon />}
            onClick={() => removingModerators(name, modId)}
          />
        }
      </div>) : <p>{data?.Members?.noMods}</p>
    }
    {
      !!lastModeratorsVisible && moderatorsArray.length === maxItems * iModerators &&
      <MoreButton nextElements={nextModeratorsList} />
    }
    <p className={styles.roles}>{data?.Members?.anotherMembers}</p>
    <Divider orientation='horizontal' />
    { console.log(membersArray) }
    {
      membersArray.length > 0 ? membersArray.map(({ userId, pseudonym, profilePhoto }: AnotherMembersType, index) =>
        <UsersButton
          key={index}
          id={userId}
          name={name}
          pseudonym={pseudonym}
          logo={profilePhoto}
          admin={admin}
          moderatorsArray={moderatorsArray}
        />
      ) : <p>{data?.Members?.noMembers}</p>
    }
    {
      !!lastMembersVisible && membersArray.length === maxItems * iMembers &&
      <MoreButton nextElements={nextMembersList} />
    }
  </>;
};
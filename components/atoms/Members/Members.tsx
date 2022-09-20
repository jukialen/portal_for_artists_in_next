import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { auth } from '../../../firebase';
import {
  deleteDoc, DocumentData, getDoc, getDocs, limit, query, QueryDocumentSnapshot, startAfter
} from 'firebase/firestore';
import { Avatar, Divider, IconButton, Link } from '@chakra-ui/react';

import { deleteModerators, moderators, user as user_ref, members } from 'references/referencesFirebase';

import { GroupNameType, MembersAndModeratorsType } from 'types/global.types';

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

export const Members = ({ admin, name }: MembersType) => {
  const [pseudonymAdmin, setPseudonymAdmin] = useState('');
  const [profilePhotoAdmin, setProfilePhotoAdmin] = useState('');
  const [moderatorsArray, setModeratorsArray] = useState<MembersAndModeratorsType[]>([]);
  const [lastModeratorsVisible, setModeratorsLastVisible] = useState<QueryDocumentSnapshot>();
  let [iModerators, setIModerators] = useState(1);
  const [membersArray, setMembersArray] = useState<MembersAndModeratorsType[]>([]);
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
  
      const moderatorArray: MembersAndModeratorsType[] = [];
  
      for (const doc of documentSnapshots.docs) {
        const docSnap = await getDoc<DocumentData>(doc.data().moderator);

        docSnap.exists() && moderatorArray.push({
          mid: doc.id,
          cid: docSnap.id,
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
      
      const nextModeratorArray: MembersAndModeratorsType[] = [];
      
      for (const doc of documentSnapshots.docs) {
        const docSnap = await getDoc<DocumentData>(doc.data().moderator);

        docSnap.exists() && nextModeratorArray.push({
          mid: docSnap.id,
          cid: docSnap.id,
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
      const firstUsers = query(members(name), limit(maxItems));
      const documentSnapshots = await getDocs(firstUsers);
      
      const memberArray: MembersAndModeratorsType[] = [];

      for (const doc of documentSnapshots.docs) {
        const docSnap = await getDoc<DocumentData>(doc.data().member);

        docSnap.exists() && memberArray.push({
          mid: docSnap.id,
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
  
  useEffect(() => { !!name && membersList() }, []);
  
  const nextMembersList = async () => {
    try {
      const firstUsers = query(members(name), limit(maxItems), startAfter(lastMembersVisible));
      const documentSnapshots = await getDocs(firstUsers);
      
      const nextMemberArray: MembersAndModeratorsType[] = [];
      
      for (const doc of documentSnapshots.docs) {
        const docSnap = await getDoc<DocumentData>(doc.data().users);
        
        docSnap.exists() && nextMemberArray.push({
          mid: docSnap.id,
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
      moderatorsArray.length > 0
        ? moderatorsArray.map(({ mid, pseudonym, profilePhoto }: MembersAndModeratorsType, index) =>
          <div className={styles.usersButton} key={index}>
            <Avatar name={pseudonym} src={!!profilePhoto ? profilePhoto : group} />
            <NextLink href={`/user/${pseudonym}`} passHref>
              <Link>{pseudonym}</Link>
            </NextLink>
            {
              admin === currentUser && !!mid &&
                <IconButton
                  type='submit'
                  aria-label={data?.Members?.modsAria}
                  icon={<MinusIcon />}
                  onClick={() => removingModerators(name, mid)}
                />
            }
          </div>
          )
        : <p>{data?.Members?.noMods}</p>
    }
    {
      !!lastModeratorsVisible && moderatorsArray.length === maxItems * iModerators &&
      <MoreButton nextElements={nextModeratorsList} />
    }
    <p className={styles.roles}>{data?.Members?.anotherMembers}</p>
    <Divider orientation='horizontal' />
    {
      membersArray.length > 0
        ? membersArray.map(({ mid, pseudonym, profilePhoto }: MembersAndModeratorsType, index) =>
          <UsersButton
            key={index}
            id={mid}
            name={name}
            pseudonym={pseudonym}
            logo={profilePhoto}
            admin={admin}
            moderatorsArray={moderatorsArray}
          />
          )
        : <p>{data?.Members?.noMembers}</p>
    }
    {
      !!lastMembersVisible && membersArray.length === maxItems * iMembers &&
      <MoreButton nextElements={nextMembersList} />
    }
  </>;
};
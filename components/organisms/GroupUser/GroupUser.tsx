import { useEffect, useState } from 'react';
import {
  getDoc,
  getDocs,
  limit,
  query,
  QueryDocumentSnapshot,
  startAfter,
  where,
} from 'firebase/firestore';
import { Divider } from '@chakra-ui/react';

import { useHookSWR } from 'hooks/useHookSWR';

import { GroupType } from 'types/global.types';

import {
  adminInGroups,
  groups,
  membersGroup,
  moderatorsGroups,
  user,
} from 'references/referencesFirebase';

import { MoreButton } from 'components/atoms/MoreButton/MoreButton';
import { Tile } from 'components/molecules/GroupTile/Tile';

import styles from './GroupUser.module.scss';

type GroupUserType = {
  uidUser: string;
};

export const GroupUser = ({ uidUser }: GroupUserType) => {
  const [adminsArray, setAdminsArray] = useState<GroupType[]>([]);
  const [lastAdminsVisible, setAdminsLastVisible] = useState<QueryDocumentSnapshot>();
  let [iAdmins, setIAdmins] = useState(1);
  const [moderatorsArray, setModeratorsArray] = useState<GroupType[]>([]);
  const [lastModeratorsVisible, setModeratorsLastVisible] = useState<QueryDocumentSnapshot>();
  let [iModerators, setIModerators] = useState(1);
  const [membersArray, setMembersArray] = useState<GroupType[]>([]);
  const [lastMembersVisible, setMembersLastVisible] = useState<QueryDocumentSnapshot>();
  let [iMembers, setIMembers] = useState(1);

  const data = useHookSWR();
  const maxItems = 30;

  const firstAdminList = async () => {
    try {
      const adminSnapshot = adminInGroups(uidUser!);
      const adminArray: GroupType[] = [];

      const documentSnapshots = await getDocs(adminSnapshot);

      for (const doc of documentSnapshots.docs) {
        adminArray.push({
          nameGroup: doc.data().name,
          logoUrl: doc.data().logo || `${process.env.NEXT_PUBLIC_PAGE}/group.svg`,
        });
      }

      setAdminsArray(adminArray);
      adminArray.length === maxItems &&
        setAdminsLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    !!uidUser && firstAdminList();
  }, []);

  const firstModeratorsList = async () => {
    try {
      const moderatorsSnapshot = query(
        moderatorsGroups(),
        where('moderator', '==', user(uidUser)),
        limit(maxItems),
      );
      const documentSnapshots = await getDocs(moderatorsSnapshot);

      const moderatorArray: GroupType[] = [];

      for (const doc of documentSnapshots.docs) {
        const docSnap = await getDoc(groups(doc.ref.parent.parent!.id));

        docSnap.exists() &&
          moderatorArray.push({
            nameGroup: docSnap.data().name,
            logoUrl: docSnap.data().logo || `${process.env.NEXT_PUBLIC_PAGE}/group.svg`,
          });
      }

      setModeratorsArray(moderatorArray);
      moderatorArray.length === maxItems &&
        setModeratorsLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    !!uidUser && firstModeratorsList();
  }, []);

  const firstMembersList = async () => {
    try {
      const membersSnapshot = query(
        membersGroup(),
        where('member', '==', user(uidUser)),
        limit(maxItems),
      );
      const documentSnapshots = await getDocs(membersSnapshot);

      const memberArray: GroupType[] = [];

      for (const doc of documentSnapshots.docs) {
        const docSnap = await getDoc(groups(doc.ref.parent.parent!.id));

        docSnap.exists() &&
          memberArray.push({
            nameGroup: docSnap.data().name,
            logoUrl: docSnap.data().logo || `${process.env.NEXT_PUBLIC_PAGE}/group.svg`,
          });
      }
      setMembersArray(memberArray);
      memberArray.length === maxItems &&
        setMembersLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    !!uidUser && firstMembersList();
  }, []);

  const nextAdminList = async () => {
    try {
      const adminSnapshot = await adminInGroups(uidUser!);
      const documentSnapshots = await getDocs(adminSnapshot);

      const nextAdminArray: GroupType[] = [];

      for (const doc of documentSnapshots.docs) {
        nextAdminArray.push({
          nameGroup: doc.data().name,
          logoUrl: doc.data().logo || `${process.env.NEXT_PUBLIC_PAGE}/group.svg`,
        });
      }

      const nextArray = adminsArray.concat(...nextAdminArray);
      setAdminsArray(nextArray);
      setAdminsLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
      setIAdmins(iAdmins++);
    } catch (e) {
      console.error(e);
    }
  };

  const nextModeratorsList = async () => {
    try {
      const moderatorsSnapshot = query(
        moderatorsGroups(),
        where('moderator', '==', user(uidUser)),
        limit(maxItems),
        startAfter(lastModeratorsVisible),
      );
      const documentSnapshots = await getDocs(moderatorsSnapshot);

      const nextModeratorArray: GroupType[] = [];

      for (const doc of documentSnapshots.docs) {
        const docSnap = await getDoc(groups(doc.ref.parent.parent!.id));

        docSnap.exists() &&
          nextModeratorArray.push({
            nameGroup: docSnap.data().name,
            logoUrl: docSnap.data().logo || `${process.env.NEXT_PUBLIC_PAGE}/group.svg`,
          });
      }
      const nextArray = moderatorsArray.concat(...nextModeratorArray);

      setModeratorsArray(nextArray);
      setModeratorsLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
      setIModerators(iModerators++);
    } catch (e) {
      console.error(e);
    }
  };

  const nextMembersList = async () => {
    try {
      const membersSnapshot = query(
        membersGroup(),
        where('user', '==', user(uidUser)),
        limit(maxItems),
        startAfter(lastMembersVisible),
      );
      const documentSnapshots = await getDocs(membersSnapshot);

      const nextMemberArray: GroupType[] = [];

      for (const doc of documentSnapshots.docs) {
        const docSnap = await getDoc(groups(doc.ref.parent.parent!.id));

        docSnap.exists() &&
          nextMemberArray.push({
            nameGroup: docSnap.data().name,
            logoUrl: docSnap.data().logo || `${process.env.NEXT_PUBLIC_PAGE}/group.svg`,
          });
      }
      const nextArray = membersArray.concat(...nextMemberArray);
      setMembersArray(nextArray);
      setIMembers(iMembers++);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={styles.tilesSection}>
      <h2 className={styles.title}>{data?.groupsUser?.adminTitle}</h2>
      <Divider className={styles.divider} />
      {adminsArray.length > 0 ? (
        adminsArray.map(({ nameGroup, logoUrl }, index) => (
          <Tile key={index} name={nameGroup} link={`/groups/${nameGroup}`} logoUrl={logoUrl} />
        ))
      ) : (
        <p className={styles.noGroups}>{data?.Account?.groups?.adminTitle}</p>
      )}
      {!!lastAdminsVisible && adminsArray.length === maxItems * iAdmins && (
        <MoreButton nextElements={nextAdminList} />
      )}
      <h2 className={styles.title}>{data?.groupsUser?.modsTitle}</h2>
      <Divider className={styles.divider} />
      {moderatorsArray.length > 0 ? (
        moderatorsArray.map(({ nameGroup, logoUrl }, index) => (
          <Tile key={index} name={nameGroup} link={`/groups/${nameGroup}`} logoUrl={logoUrl} />
        ))
      ) : (
        <p className={styles.noGroups}>{data?.Account?.groups?.noMods}</p>
      )}
      {!!lastModeratorsVisible && moderatorsArray.length == maxItems * iModerators && (
        <MoreButton nextElements={nextModeratorsList} />
      )}
      <h2 className={styles.title}>{data?.groupsUser?.usersTitle}</h2>
      <Divider className={styles.divider} />
      {membersArray.length > 0 ? (
        membersArray.map(({ nameGroup, logoUrl }, index) => (
          <Tile key={index} name={nameGroup} link={`/groups/${nameGroup}`} logoUrl={logoUrl} />
        ))
      ) : (
        <p className={styles.noGroups}>{data?.Account?.groups?.noUsers}</p>
      )}
      {!!lastMembersVisible && membersArray.length === maxItems * iMembers && (
        <MoreButton nextElements={nextMembersList} />
      )}
    </div>
  );
};

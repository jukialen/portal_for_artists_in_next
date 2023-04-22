import { useEffect, useState } from 'react';
import axios from 'axios';
import { Divider } from '@chakra-ui/react';

import { GroupType } from 'types/global.types';

import { backUrl } from 'utilites/constants';

import { useHookSWR } from 'hooks/useHookSWR';

import { Links } from 'components/atoms/Links/Links';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';
import { Tile } from 'components/molecules/GroupTile/Tile';

import styles from './GroupUsers.module.scss';

type GroupUsersType = { id: string };

export const GroupUsers = ({ id }: GroupUsersType) => {
  const [adminsArray, setAdminsArray] = useState<GroupType[]>([]);
  const [lastAdminsVisible, setAdminsLastVisible] = useState<GroupType>();
  let [iAdmins, setIAdmins] = useState(1);
  const [moderatorsArray, setModeratorsArray] = useState<GroupType[]>([]);
  const [lastModeratorsVisible, setModeratorsLastVisible] = useState<GroupType>();
  let [iModerators, setIModerators] = useState(1);
  const [membersArray, setMembersArray] = useState<GroupType[]>([]);
  const [lastMembersVisible, setMembersLastVisible] = useState<GroupType>();
  let [iMembers, setIMembers] = useState(1);

  const data = useHookSWR();
  const maxItems = 30;

  const firstAdminList = async () => {
    try {
      const groupList: [{ name: string; logoUrl: string }] = await axios.get(`${backUrl}/groups`, {
        params: {
          where: { adminId: id },
          orderBy: 'name, DESC',
          limit: maxItems,
        },
      });

      const adminArray: GroupType[] = [];

      for (const group of groupList) {
        adminArray.push({
          name: group.name,
          logoUrl: group.logoUrl || `${process.env.NEXT_PUBLIC_PAGE}/group.svg`,
        });
      }

      setAdminsArray(adminArray);
      adminArray.length === maxItems && setAdminsLastVisible(adminArray[adminArray.length - 1]);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    !!id && firstAdminList();
  }, []);

  const firstModeratorsList = async () => {
    try {
      const groupList: [{ name: string; logoUrl: string }] = await axios.get(`${backUrl}/groups`, {
        params: {
          where: { moderatorsId: id },
          orderBy: 'name, DESC',
          limit: maxItems,
        },
      });

      const moderatorArray: GroupType[] = [];

      for (const group of groupList) {
        moderatorArray.push({
          name: group.name,
          logoUrl: group.logoUrl || `${process.env.NEXT_PUBLIC_PAGE}/group.svg`,
        });
      }

      setModeratorsArray(moderatorArray);
      moderatorArray.length === maxItems && setModeratorsLastVisible(moderatorArray[moderatorArray.length - 1]);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    !!id && firstModeratorsList();
  }, []);

  const firstMembersList = async () => {
    try {
      const groupList: [{ name: string; logoUrl: string }] = await axios.get(`${backUrl}/groups`, {
        params: {
          where: { usersId: id },
          orderBy: 'name, DESC',
          limit: maxItems,
        },
      });

      const memberArray: GroupType[] = [];

      for (const group of groupList) {
        memberArray.push({
          name: group.name,
          logoUrl: group.logoUrl || `${process.env.NEXT_PUBLIC_PAGE}/group.svg`,
        });
      }

      setMembersArray(memberArray);
      memberArray.length === maxItems && setMembersLastVisible(memberArray[memberArray.length - 1]);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    !!id && firstMembersList();
  }, [id]);

  const nextAdminList = async () => {
    try {
      const groupList: [{ name: string; logoUrl: string }] = await axios.get(`${backUrl}/groups`, {
        params: {
          where: { adminId: id },
          orderBy: 'name, DESC',
          limit: maxItems,
          cursor: lastAdminsVisible,
        },
      });

      const nextAdminArray: GroupType[] = [];

      for (const group of groupList) {
        nextAdminArray.push({
          name: group.name,
          logoUrl: group.logoUrl || `${process.env.NEXT_PUBLIC_PAGE}/group.svg`,
        });
      }

      const nextArray = adminsArray.concat(...nextAdminArray);
      setAdminsArray(nextArray);
      setAdminsLastVisible(nextArray[nextArray.length - 1]);
      setIAdmins(iAdmins++);
    } catch (e) {
      console.error(e);
    }
  };

  const nextModeratorsList = async () => {
    try {
      const groupList: [{ name: string; logoUrl: string }] = await axios.get(`${backUrl}/groups`, {
        params: {
          where: { moderatorsId: id },
          orderBy: 'name, DESC',
          limit: maxItems,
          cursor: lastModeratorsVisible,
        },
      });

      const nextModeratorArray: GroupType[] = [];

      for (const group of groupList) {
        nextModeratorArray.push({
          name: group.name,
          logoUrl: group.logoUrl || `${process.env.NEXT_PUBLIC_PAGE}/group.svg`,
        });
      }

      const nextArray = moderatorsArray.concat(...nextModeratorArray);

      setModeratorsArray(nextArray);
      setModeratorsLastVisible(nextArray[nextArray.length - 1]);
      setIModerators(iModerators++);
    } catch (e) {
      console.error(e);
    }
  };

  const nextMembersList = async () => {
    try {
      const groupList: [{ name: string; logoUrl: string }] = await axios.get(`${backUrl}/groups`, {
        params: {
          where: { usersId: id },
          orderBy: 'name, DESC',
          limit: maxItems,
          cursor: lastMembersVisible,
        },
      });

      const nextMemberArray: GroupType[] = [];

      for (const group of groupList) {
        nextMemberArray.push({
          name: group.name,
          logoUrl: group.logoUrl || `${process.env.NEXT_PUBLIC_PAGE}/group.svg`,
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
      <div className={styles.container}>
        <Links
          hrefLink="/adding_group"
          classLink={`${styles.container__button} button`}
          aria-label={data?.Aside?.addingGroup}>
          {data?.Aside?.addingGroup}
        </Links>
      </div>
      <h2 className={styles.title}>{data?.Account?.groups?.adminTitle}</h2>
      <Divider className={styles.divider} />
      {adminsArray.length > 0 ? (
        adminsArray.map(({ name: nameGroup, logoUrl }, index) => (
          <Tile key={index} name={nameGroup} link={`/groups/${nameGroup}`} logoUrl={logoUrl} />
        ))
      ) : (
        <p className={styles.noGroups}>{data?.Account?.groups?.noAdmin}</p>
      )}
      {!!lastAdminsVisible && adminsArray.length === maxItems * iAdmins && <MoreButton nextElements={nextAdminList} />}
      <h2 className={styles.title}>{data?.Account?.groups?.modsTitle}</h2>
      <Divider className={styles.divider} />
      {moderatorsArray.length > 0 ? (
        moderatorsArray.map(({ name: nameGroup, logoUrl }, index) => (
          <Tile key={index} name={nameGroup} link={`/groups/${nameGroup}`} logoUrl={logoUrl} />
        ))
      ) : (
        <p className={styles.noGroups}>{data?.Account?.groups?.noMods}</p>
      )}
      {!!lastModeratorsVisible && moderatorsArray.length == maxItems * iModerators && (
        <MoreButton nextElements={nextModeratorsList} />
      )}
      <h2 className={styles.title}>{data?.Account?.groups?.usersTitle}</h2>
      <Divider className={styles.divider} />
      {membersArray.length > 0 ? (
        membersArray.map(({ name: nameGroup, logoUrl }, index) => (
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

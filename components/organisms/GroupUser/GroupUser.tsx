import { useEffect, useState } from 'react';
import axios from 'axios';
import { Divider } from '@chakra-ui/react';

import { useHookSWR } from 'hooks/useHookSWR';

import { backUrl, cloudFrontUrl } from 'utilites/constants';

import { GroupType } from 'types/global.types';

import { MoreButton } from 'components/atoms/MoreButton/MoreButton';
import { Tile } from 'components/molecules/GroupTile/Tile';

import styles from './GroupUser.module.scss';

type GroupUserType = {
  id: string;
};

export const GroupUser = ({ id }: GroupUserType) => {
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
      const admins: GroupType[] = await axios.get(`${backUrl}/groups`, {
        params: { where: { adminId: id }, sortBy: 'name, DESC', limit: maxItems },
      });

      const adminArray: GroupType[] = [];

      for (const admin of admins) {
        adminArray.push({
          name: admin.name,
          logoUrl: `${cloudFrontUrl}/${admin.logoUrl}` || `${process.env.NEXT_PUBLIC_PAGE}/group.svg`,
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
  }, [id]);

  const firstModeratorsList = async () => {
    try {
      const moderators: GroupType[] = await axios.get(`${backUrl}/groups`, {
        params: { where: { moderatorsId: id }, sortBy: 'name, DESC', limit: maxItems },
      });
      const moderatorArray: GroupType[] = [];

      for (const moderator of moderators) {
        moderatorArray.push({
          name: moderator.name,
          logoUrl: moderator.logoUrl || `${process.env.NEXT_PUBLIC_PAGE}/group.svg`,
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
  }, [id]);

  const firstMembersList = async () => {
    try {
      const members: GroupType[] = await axios.get(`${backUrl}/groups`, {
        params: { where: { usersId: id }, sortBy: 'name, DESC', limit: maxItems },
      });

      const memberArray: GroupType[] = [];

      for (const member of members) {
        memberArray.push({
          name: member.name,
          logoUrl: `${cloudFrontUrl}/${member.logoUrl}` || `${process.env.NEXT_PUBLIC_PAGE}/group.svg`,
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
      const admins: GroupType[] = await axios.get(`${backUrl}/groups`, {
        params: { where: { adminId: id }, sortBy: 'name, DESC', limit: maxItems, cursor: lastAdminsVisible },
      });

      const nextAdminArray: GroupType[] = [];

      for (const admin of admins) {
        nextAdminArray.push({
          name: admin.name,
          logoUrl: `${cloudFrontUrl}/${admin.logoUrl}` || `${process.env.NEXT_PUBLIC_PAGE}/group.svg`,
        });
      }

      const nextArray = adminsArray.concat(...nextAdminArray);
      setAdminsArray(nextArray);
      setAdminsLastVisible(nextAdminArray[nextAdminArray.length - 1]);
      setIAdmins(iAdmins++);
    } catch (e) {
      console.error(e);
    }
  };

  const nextModeratorsList = async () => {
    try {
      const moderators: GroupType[] = await axios.get(`${backUrl}/groups`, {
        params: { where: { moderatorsId: id }, sortBy: 'name, DESC', limit: maxItems, cursor: lastModeratorsVisible },
      });

      const nextModeratorArray: GroupType[] = [];

      for (const moderator of moderators) {
        nextModeratorArray.push({
          name: moderator.name,
          logoUrl: moderator.logoUrl || `${process.env.NEXT_PUBLIC_PAGE}/group.svg`,
        });
      }

      const nextArray = moderatorsArray.concat(...nextModeratorArray);

      setModeratorsArray(nextArray);
      setModeratorsLastVisible(nextModeratorArray[nextModeratorArray.length - 1]);
      setIModerators(iModerators++);
    } catch (e) {
      console.error(e);
    }
  };

  const nextMembersList = async () => {
    try {
      const members: GroupType[] = await axios.get(`${backUrl}/groups`, {
        params: { where: { usersId: id }, sortBy: 'name, DESC', limit: maxItems, cursor: lastMembersVisible },
      });

      const nextMemberArray: GroupType[] = [];

      for (const member of members) {
        nextMemberArray.push({
          name: member.name,
          logoUrl: `${cloudFrontUrl}/${member.logoUrl}` || `${process.env.NEXT_PUBLIC_PAGE}/group.svg`,
        });
      }

      const nextArray = membersArray.concat(...nextMemberArray);
      setMembersArray(nextArray);
      setMembersLastVisible(nextMemberArray[nextMemberArray.length - 1]);
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
        adminsArray.map(({ name: nameGroup, logoUrl }, index) => (
          <Tile key={index} name={nameGroup} link={`/groups/${nameGroup}`} logoUrl={logoUrl} />
        ))
      ) : (
        <p className={styles.noGroups}>{data?.Account?.groups?.adminTitle}</p>
      )}
      {!!lastAdminsVisible && adminsArray.length === maxItems * iAdmins && <MoreButton nextElements={nextAdminList} />}
      <h2 className={styles.title}>{data?.groupsUser?.modsTitle}</h2>
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
      <h2 className={styles.title}>{data?.groupsUser?.usersTitle}</h2>
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

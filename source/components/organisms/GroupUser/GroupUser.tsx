import { useEffect, useState } from 'react';
import axios from 'axios';
import { Divider } from '@chakra-ui/react';

import { useHookSWR } from 'hooks/useHookSWR';

<<<<<<< Updated upstream:components/organisms/GroupUser/GroupUser.tsx
import { backUrl, cloudFrontUrl } from 'utilites/constants';
=======

import { backUrl, cloudFrontUrl } from 'source/constants/links';
>>>>>>> Stashed changes:source/components/organisms/GroupUser/GroupUser.tsx

import { GroupType } from 'source/types/global.types';

<<<<<<< Updated upstream:components/organisms/GroupUser/GroupUser.tsx
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';
import { Tile } from 'components/molecules/GroupTile/Tile';
=======
import { MoreButton } from 'source/components/atoms/MoreButton/MoreButton';
import { Tile } from 'source/components/atoms/Tile/Tile';
>>>>>>> Stashed changes:source/components/organisms/GroupUser/GroupUser.tsx

import styles from './GroupUser.module.scss';

type GroupUserType = {
  id: string;
};

type GroupUsersType = {
  name: string;
  logo: string;
};

export const GroupUser = ({ id }: GroupUserType) => {
  const [adminsArray, setAdminsArray] = useState<GroupUsersType[]>([]);
  const [lastAdminsVisible, setAdminsLastVisible] = useState<string>();
  let [iAdmins, setIAdmins] = useState(1);
  const [moderatorsArray, setModeratorsArray] = useState<GroupUsersType[]>([]);
  const [lastModeratorsVisible, setModeratorsLastVisible] = useState<string>();
  let [iModerators, setIModerators] = useState(1);
  const [membersArray, setMembersArray] = useState<GroupUsersType[]>([]);
  const [lastMembersVisible, setMembersLastVisible] = useState<string>();
  let [iMembers, setIMembers] = useState(1);

  const data = useHookSWR();
  const maxItems = 30;

  const firstAdminList = async () => {
    try {
      const admins: { data: GroupType[] } = await axios.get(`${backUrl}/groups/all`, {
        params: { where: { adminId: id }, orderBy: { name: 'desc' }, limit: maxItems },
      });

      const adminArray: GroupUsersType[] = [];

      for (const admin of admins.data) {
        adminArray.push({
          name: admin.name!,
          logo: !!admin.logo ? `https://${cloudFrontUrl}/${admin.logo}` : `${process.env.NEXT_PUBLIC_PAGE}/group.svg`,
        });
      }

      setAdminsArray(adminArray);
      adminArray.length === maxItems && setAdminsLastVisible(adminArray[adminArray.length - 1].name);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    !!id && firstAdminList();
  }, [id]);

  const firstModeratorsList = async () => {
    try {
      const moderators: { data: GroupType[] } = await axios.get(`${backUrl}/groups/all`, {
        params: { where: { moderatorsId: id }, orderBy: { name: 'desc' }, limit: maxItems },
      });
      const moderatorArray: GroupUsersType[] = [];

      for (const moderator of moderators.data) {
        moderatorArray.push({
          name: moderator.name!,
          logo: !!moderator.logo
            ? `https://${cloudFrontUrl}/${moderator.logo}`
            : `${process.env.NEXT_PUBLIC_PAGE}/group.svg`,
        });
      }

      setModeratorsArray(moderatorArray);
      moderatorArray.length === maxItems && setModeratorsLastVisible(moderatorArray[moderatorArray.length - 1].name);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    !!id && firstModeratorsList();
  }, [id]);

  const firstMembersList = async () => {
    try {
      const members: { data: GroupType[] } = await axios.get(`${backUrl}/groups/all`, {
        params: { where: { usersId: id }, orderBy: { name: 'desc' }, limit: maxItems },
      });

      const memberArray: GroupUsersType[] = [];

      for (const member of members.data) {
        memberArray.push({
          name: member.name!,
          logo: !!member.logo ? `https://${cloudFrontUrl}/${member.logo}` : `${process.env.NEXT_PUBLIC_PAGE}/group.svg`,
        });
      }
      setMembersArray(memberArray);
      memberArray.length === maxItems && setMembersLastVisible(memberArray[memberArray.length - 1].name);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    !!id && firstMembersList();
  }, [id]);

  const nextAdminList = async () => {
    try {
      const admins: { data: GroupType[] } = await axios.get(`${backUrl}/groups`, {
        params: { where: { adminId: id }, orderBy: { name: 'desc' }, limit: maxItems, cursor: lastAdminsVisible },
      });

      const nextAdminArray: GroupUsersType[] = [];

      for (const admin of admins.data) {
        nextAdminArray.push({
          name: admin.name!,
          logo: !!admin.logo ? `https://${cloudFrontUrl}/${admin.logo}` : `${process.env.NEXT_PUBLIC_PAGE}/group.svg`,
        });
      }

      const nextArray = adminsArray.concat(...nextAdminArray);
      setAdminsArray(nextArray);
      setAdminsLastVisible(nextAdminArray[nextAdminArray.length - 1].name);
      setIAdmins(iAdmins++);
    } catch (e) {
      console.error(e);
    }
  };

  const nextModeratorsList = async () => {
    try {
      const moderators: { data: GroupType[] } = await axios.get(`${backUrl}/groups`, {
        params: {
          where: { moderatorsId: id },
          orderBy: { name: 'desc' },
          limit: maxItems,
          cursor: lastModeratorsVisible,
        },
      });

      const nextModeratorArray: GroupUsersType[] = [];

      for (const moderator of moderators.data) {
        nextModeratorArray.push({
          name: moderator.name!,
          logo: !!moderator.logo
            ? `https://${cloudFrontUrl}/${moderator.logo}`
            : `${process.env.NEXT_PUBLIC_PAGE}/group.svg`,
        });
      }

      const nextArray = moderatorsArray.concat(...nextModeratorArray);

      setModeratorsArray(nextArray);
      setModeratorsLastVisible(nextModeratorArray[nextModeratorArray.length - 1].name);
      setIModerators(iModerators++);
    } catch (e) {
      console.error(e);
    }
  };

  const nextMembersList = async () => {
    try {
      const members: { data: GroupType[] } = await axios.get(`${backUrl}/groups`, {
        params: { where: { usersId: id }, orderBy: { name: 'desc' }, limit: maxItems, cursor: lastMembersVisible },
      });

      const nextMemberArray: GroupUsersType[] = [];

      for (const member of members.data) {
        nextMemberArray.push({
          name: member.name!,
          logo: !!member.logo ? `https://${cloudFrontUrl}/${member.logo}` : `${process.env.NEXT_PUBLIC_PAGE}/group.svg`,
        });
      }

      const nextArray = membersArray.concat(...nextMemberArray);
      setMembersArray(nextArray);
      setMembersLastVisible(nextMemberArray[nextMemberArray.length - 1].name);
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
        adminsArray.map(({ name, logo }, index) => (
          <Tile key={index} name={name!} link={`/groups/${name!}`} fileUrl={logo} />
        ))
      ) : (
        <p className={styles.noGroups}>{data?.Account?.groups?.adminTitle}</p>
      )}
      {!!lastAdminsVisible && adminsArray.length === maxItems * iAdmins && <MoreButton nextElements={nextAdminList} />}
      <h2 className={styles.title}>{data?.groupsUser?.modsTitle}</h2>
      <Divider className={styles.divider} />
      {moderatorsArray.length > 0 ? (
        moderatorsArray.map(({ name, logo }, index) => (
          <Tile key={index} name={name!} link={`/groups/${name!}`} fileUrl={logo} />
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
        membersArray.map(({ name, logo }, index) => (
          <Tile key={index} name={name!} link={`/groups/${name!}`} fileUrl={logo} />
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

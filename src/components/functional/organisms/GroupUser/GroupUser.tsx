import { useState } from 'react';

import { backUrl } from 'constants/links';
import { createClient } from 'utils/supabase/clientCSR';

import { GroupUsersType } from 'types/global.types';

import { MoreButton } from 'components/ui/atoms/MoreButton/MoreButton';
import { Tile } from 'components/ui/atoms/Tile/Tile';
import { Separator } from 'components/ui/atoms/Separator/Separator';

import styles from './GroupUser.module.scss';

type GroupUserType = {
  id: string;
  firstAdminArray: GroupUsersType[];
  firstModsArray: GroupUsersType[];
  firstMembersArray: GroupUsersType[];
  tGroupsUser: {
    adminTitle: string;
    modsTitle: string;
    usersTitle: string;
    accountAdminTitle: string;
    accountNoMods: string;
    accountNoUsers: string;
  };
};

export const GroupUser = ({ id, firstAdminArray, firstModsArray, firstMembersArray, tGroupsUser }: GroupUserType) => {
  const [adminsArray, setAdminsArray] = useState<GroupUsersType[]>(firstAdminArray);
  const [lastAdminsVisible, setAdminsLastVisible] = useState(firstAdminArray[firstAdminArray.length - 1].name);
  let [iAdmins, setIAdmins] = useState(1);
  const [moderatorsArray, setModeratorsArray] = useState<GroupUsersType[]>(firstModsArray);
  const [lastModeratorsVisible, setModeratorsLastVisible] = useState(firstModsArray[firstModsArray.length - 1].name);
  let [iModerators, setIModerators] = useState(1);
  const [membersArray, setMembersArray] = useState<GroupUsersType[]>(firstMembersArray);
  const [lastMembersVisible, setMembersLastVisible] = useState(firstMembersArray[firstMembersArray.length - 1].name);
  let [iMembers, setIMembers] = useState(1);

  const maxItems = 30;

  const supabase = createClient();

  const nextAdminList = async () => {
    const nextAdminArray: GroupUsersType[] = [];

    const { data, error } = await supabase
      .from('Groups')
      .select('name, logo')
      .eq('adminId', id)
      .order('name', { ascending: true })
      .gt('name', lastAdminsVisible)
      .limit(maxItems);

    try {
      if (!data || data.length === 0 || error) console.error(error);

      for (const admin of data!) {
        nextAdminArray.push({
          name: admin.name!,
          logo: !!admin.logo ? admin.logo : `${backUrl}/group.svg`,
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
    const nextModeratorArray: GroupUsersType[] = [];

    const { data, error } = await supabase
      .from('UsersGroups')
      .select('Groups!name (name, logo)')
      .eq('userId', id)
      .order('name', { ascending: true })
      .gt('name', lastModeratorsVisible)
      .limit(maxItems);

    try {
      if (!data || data.length === 0 || error) console.error(error);

      for (const mod of data!) {
        nextModeratorArray.push({
          name: mod.Groups.name!,
          logo: !!mod.Groups?.logo ? mod.Groups.logo : `${backUrl}/group.svg`,
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
    const nextMemberArray: GroupUsersType[] = [];

    const { data, error } = await supabase
      .from('UsersGroups')
      .select('Groups!name (name, logo)')
      .eq('userId', id)
      .order('name', { ascending: true })
      .gt('name', lastMembersVisible)
      .limit(maxItems);

    try {
      if (!data || data.length === 0 || error) console.error(error);

      for (const mod of data!) {
        nextMemberArray.push({
          name: mod.Groups.name!,
          logo: !!mod.Groups?.logo ? mod.Groups.logo : `${backUrl}/group.svg`,
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
      <h2 className={styles.title}>{tGroupsUser.adminTitle}</h2>
      <Separator />
      {adminsArray.length > 0 ? (
        adminsArray.map(({ name, logo }, index) => (
          <Tile key={index} name={name!} link={`/groups/${name!}`} fileUrl={logo} />
        ))
      ) : (
        <p className={styles.noGroups}>{tGroupsUser.accountAdminTitle}</p>
      )}
      {!!lastAdminsVisible && adminsArray.length === maxItems * iAdmins && (
        <MoreButton nextElementsAction={nextAdminList} />
      )}
      <h2 className={styles.title}>{tGroupsUser.modsTitle}</h2>
      <Separator />
      {moderatorsArray.length > 0 ? (
        moderatorsArray.map(({ name, logo }, index) => (
          <Tile key={index} name={name!} link={`/groups/${name!}`} fileUrl={logo} />
        ))
      ) : (
        <p className={styles.noGroups}>{tGroupsUser.accountNoMods}</p>
      )}
      {!!lastModeratorsVisible && moderatorsArray.length == maxItems * iModerators && (
        <MoreButton nextElementsAction={nextModeratorsList} />
      )}
      <h2 className={styles.title}>{tGroupsUser.usersTitle}</h2>
      <Separator />
      {membersArray.length > 0 ? (
        membersArray.map(({ name, logo }, index) => (
          <Tile key={index} name={name!} link={`/groups/${name!}`} fileUrl={logo} />
        ))
      ) : (
        <p className={styles.noGroups}>{tGroupsUser.accountNoUsers}</p>
      )}
      {!!lastMembersVisible && membersArray.length === maxItems * iMembers && (
        <MoreButton nextElementsAction={nextMembersList} />
      )}
    </div>
  );
};

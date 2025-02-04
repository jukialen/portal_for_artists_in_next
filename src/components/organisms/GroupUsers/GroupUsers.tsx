'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Separator } from '@chakra-ui/react';

import { Database } from 'types/database.types';

import { roles } from 'utils/roles';

import { useI18n, useScopedI18n } from "locales/client";

import { Links } from 'components/atoms/Links/Links';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';
import { Tile } from 'components/atoms/Tile/Tile';

import styles from './GroupUsers.module.scss';

type GroupUsersType = {
  id: string;
  firstAdminList: GroupUserType[];
  firstModsUsersList: { members: GroupUserType[]; moderators: GroupUserType[] };
};

type GroupUserType = {
  name: string;
  logo: string;
  groupId: string;
};

export const GroupUsers = ({ id, firstAdminList, firstModsUsersList }: GroupUsersType) => {
  const maxItems = 30;

  const [adminsArray, setAdminsArray] = useState<GroupUserType[]>(firstAdminList!);
  const [lastAdminsVisible, setAdminsLastVisible] = useState(
    firstAdminList.length === maxItems ? firstAdminList[firstAdminList.length - 1].name : '',
  );
  let [iAdmins, setIAdmins] = useState(1);
  const [moderatorsArray, setModeratorsArray] = useState<GroupUserType[]>(firstModsUsersList.moderators);
  const [lastModeratorsVisible, setModeratorsLastVisible] = useState(
    firstModsUsersList.moderators.length === maxItems
      ? firstModsUsersList.moderators[firstModsUsersList.moderators.length - 1].name
      : '',
  );
  let [iModerators, setIModerators] = useState(1);
  const [membersArray, setMembersArray] = useState<GroupUserType[]>(firstModsUsersList.members);
  const [lastMembersVisible, setMembersLastVisible] = useState(
    firstModsUsersList.members.length === maxItems
      ? firstModsUsersList.members[firstModsUsersList.members.length - 1].name
      : '',
  );
  let [iMembers, setIMembers] = useState(1);

  const tAccount = useScopedI18n('Account.groups');
  const tAside = useScopedI18n('Aside');
  const t = useI18n();
  
  const supabase = createClientComponentClient<Database>();

  const nextAdminList = async () => {
    const nextAdminArray: GroupUserType[] = [];

    try {
      const { data, error } = await supabase
        .from('Groups')
        .select('name, logo, groupId')
        .eq('adminId', id)
        .order('name', { ascending: true })
        .gt('name', lastAdminsVisible)
        .limit(maxItems);

      if (data?.length === 0 || !!error) {
        console.error(error);
        return;
      }

      for (const _group of data!) {
        nextAdminArray.push({
          name: _group.name,
          logo: !!_group.logo ? _group.logo : `${process.env.NEXT_PUBLIC_PAGE}/group.svg`,
          groupId: _group.groupId,
        });
      }

      const nextArray = adminsArray.concat(...nextAdminArray);
      setAdminsArray(nextArray);

      if (nextArray.length === maxItems * iAdmins) {
        setAdminsLastVisible(nextArray[nextArray.length - 1].groupId);
        setIAdmins(iAdmins++);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const nextModeratorsList = async () => {
    const nextModeratorArray: GroupUserType[] = [];

    try {
      const { data, error } = await supabase
        .from('UsersGroups')
        .select('name, Groups (logo), groupId, roleId')
        .eq('userId', id)
        .order('name', { ascending: true })
        .gt('name', lastModeratorsVisible)
        .limit(maxItems);

      if (data?.length === 0 || !!error) {
        console.error(error);
        return;
      }

      for (const d of data) {
        const role = await roles(d.roleId, id);
        if (role == 'MODERATOR') {
          nextModeratorArray.push({
            name: d.name,
            logo: !!d.Groups?.logo ? d.Groups?.logo : `${process.env.NEXT_PUBLIC_PAGE}/group.svg`,
            groupId: d.groupId,
          });
        }
      }

      const nextArray = moderatorsArray.concat(...nextModeratorArray);

      setModeratorsArray(nextArray);
      if (nextArray.length === maxItems * iModerators) {
        setModeratorsLastVisible(nextArray[nextArray.length - 1].groupId);
        setIModerators(iModerators++);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const nextMembersList = async () => {
    const nextMemberArray: GroupUserType[] = [];

    try {
      const { data, error } = await supabase
      .from('UsersGroups')
      .select('name, Groups (logo), groupId, roleId')
      .eq('userId', id)
      .order('name', { ascending: true })
      .gt('name', lastMembersVisible)
      .limit(maxItems);
      
      if (data?.length === 0 || !!error) {
        console.error(error);
        return;
      }
      
      for (const d of data) {
        const role = await roles(d.roleId, id);
        if (role == 'USER') {
          nextMemberArray.push({
            name: d.name,
            logo: !!d.Groups?.logo ? d.Groups?.logo : `${process.env.NEXT_PUBLIC_PAGE}/group.svg`,
            groupId: d.groupId,
          });
        }
      }


      const nextArray = membersArray.concat(...nextMemberArray);
      setMembersArray(nextArray);
      setMembersLastVisible(nextArray[nextArray.length - 1].groupId);
      setIMembers(iMembers++);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={styles.tilesSection}>
      <section className={styles.sectionTitleNewGroup}>
        <h2>{t('Nav.groups')}</h2>
        <Links
          hrefLink="/adding_group"
          classLink={`${styles.sectionTitleNewGroup__button} button`}
          aria-label={tAside('addingGroup')}>
          {tAside('addingGroup')}
        </Links>
      </section>

      <h2 className={styles.title}>{tAccount('adminTitle')}</h2>
      <Separator className={styles.divider} />
      {adminsArray.length > 0 ? (
        adminsArray.map(({ name, logo }, index) => (
          <Tile key={index} name={name} link={`/groups/${name}`} fileUrl={logo} />
        ))
      ) : (
        <p className={styles.noGroups}>{tAccount('noAdmin')}</p>
      )}
      {!!lastAdminsVisible && adminsArray.length === maxItems * iAdmins && <MoreButton nextElements={nextAdminList} />}
      <h2 className={styles.title}>{tAccount('modsTitle')}</h2>
      <Separator className={styles.divider} />
      {moderatorsArray.length > 0 ? (
        moderatorsArray.map(({ name, logo }, index) => (
          <Tile key={index} name={name} link={`/groups/${name}`} fileUrl={logo} />
        ))
      ) : (
        <p className={styles.noGroups}>{tAccount('noMods')}</p>
      )}
      {!!lastModeratorsVisible && moderatorsArray.length == maxItems * iModerators && (
        <MoreButton nextElements={nextModeratorsList} />
      )}
      <h2 className={styles.title}>{tAccount('usersTitle')}</h2>
      <Separator className={styles.divider} />
      {membersArray.length > 0 ? (
        membersArray.map(({ name, logo }, index) => (
          <Tile key={index} name={name} link={`/groups/${name}`} fileUrl={logo} />
        ))
      ) : (
        <p className={styles.noGroups}>{tAccount('noUsers')}</p>
      )}
      {!!lastMembersVisible && membersArray.length === maxItems * iMembers && (
        <MoreButton nextElements={nextMembersList} />
      )}
    </div>
  );
};

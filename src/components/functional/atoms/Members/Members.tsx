'use client';

import { useState } from 'react';
import NextLink from 'next/link';
import { createClient } from 'utils/supabase/clientCSR';

import { MemberType, nameGroupTranslatedType, UserType } from 'types/global.types';

import { sortMembers } from '../../../../helpers/sorting';

import { Avatar } from 'components/ui/atoms/Avatar/Avatar';
import { MoreButton } from 'components/ui/atoms/MoreButton/MoreButton';
import { Separator } from 'components/ui/atoms/Separator/Separator';

import styles from './Members.module.css';
import group from '../../../../../public/group.svg';
import { LuPlus, LuMinus } from 'react-icons/lu';

type MembersType = {
  admin: boolean;
  groupId: string;
  name: string;
  usersGroupsId: string;
  members: MemberType[];
  translated: nameGroupTranslatedType;
  userData: UserType;
};

const supabase = createClient();

export const Members = ({ admin, groupId, name, usersGroupsId, members, translated, userData }: MembersType) => {
  const maxItems = 30;

  members.sort(sortMembers());

  const adminData = members.find((e) => e.role === 'ADMIN');
  const pseudonymAdmin = adminData?.pseudonym || '';
  const profilePhotoAdmin = adminData?.profilePhoto || '';

  const modList = members.filter((e) => e.role === 'MODERATOR');
  const userList = members.filter((e) => e.role === 'USER');

  const [moderatorsArray, setModeratorsArray] = useState<MemberType[]>(modList || []);
  const [lastModeratorsVisible, setModeratorsLastVisible] = useState<MemberType | null>(
    modList.length === maxItems ? modList[modList.length - 1] : null,
  );
  let noMoreMods = false;
  let noMoreUsers = false;

  let [iModerators, setIModerators] = useState(1);
  const [membersArray, setMembersArray] = useState<MemberType[]>(userList);
  const [lastMembersVisible, setMembersLastVisible] = useState<MemberType | null>(
    userList.length === maxItems ? userList[userList.length - 1] : null,
  );
  let [iMembers, setIMembers] = useState(1);

  const nextModeratorsList = async () => {
    const nextModeratorArray: MemberType[] = [];

    const { data } = await supabase
      .from('UsersGroups')
      .select(`Users!userId (pseudonym, profilePhoto), Roles!roleId!inner (role)`)
      .eq('name', name)
      .eq('Roles.role', 'MODERATOR')
      .gt('createdAt', lastModeratorsVisible)
      .order('createdAt', { ascending: false })
      .limit(30);

    try {
      if (!data || data.length === 0) return (noMoreMods = true);

      noMoreMods = false;

      for (const mod of data) {
        nextModeratorArray.push({
          usersGroupsId,
          pseudonym: mod.Users.pseudonym,
          profilePhoto: mod.Users.profilePhoto!,
          role: mod.Roles.role,
        });
      }
      const nextArray = moderatorsArray.concat(...nextModeratorArray).sort(sortMembers());
      setModeratorsArray(nextArray);
      setModeratorsLastVisible(nextModeratorArray[nextModeratorArray.length - 1]);
      setIModerators(iModerators++);
    } catch (e) {
      console.error(e);
    }
  };

  const nextMembersList = async () => {
    const nextMemberArray: MemberType[] = [];

    const { data } = await supabase
      .from('UsersGroups')
      .select(
        `
        Users!userId (pseudonym, profilePhoto),
        Roles!roleId!inner (role)
       `,
      )
      .eq('name', name)
      .eq('Roles.role', 'USER')
      .gt('createdAt', lastMembersVisible)
      .order('createdAt', { ascending: false })
      .limit(30);

    try {
      if (!data || data.length === 0) return (noMoreUsers = true);

      noMoreUsers = false;

      for (const us of data) {
        nextMemberArray.push({
          usersGroupsId,
          pseudonym: us.Users.pseudonym,
          profilePhoto: us.Users.profilePhoto!,
          role: us.Roles.role,
        });
      }

      const nextArray = membersArray.concat(...nextMemberArray).sort(sortMembers());
      setMembersArray(nextArray);
      setMembersLastVisible(nextMemberArray[nextMemberArray.length - 1]);
      setIMembers(iMembers++);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleModerators = async (
    usersGroupsId: string,
    pseudonym: string,
    profilePhoto: string,
    index: number,
    user: boolean,
  ) => {
    try {
      if (user) {
        const { data, error } = await supabase
          .from('UsersGroups')
          .delete()
          .eq('usersGroupsId', usersGroupsId)
          .select('roleId')
          .limit(1)
          .single();

        if (!!data) {
          await supabase.from('Roles').delete().eq('id', data.roleId);
          const newMembersList = membersArray.concat({ usersGroupsId, pseudonym, profilePhoto, role: 'USER' });
          setMembersArray(newMembersList);
          const newModeratorsList = moderatorsArray.splice(index, 1);
          setModeratorsArray(newModeratorsList);
        } else {
          console.error('Moderator addition error: ', error);
        }
      } else {
        const { data, error } = await supabase
          .from('Roles')
          .insert([
            {
              groupId,
              userId: userData?.id!,
              role: 'MODERATOR',
            },
          ])
          .select('id, role')
          .limit(1)
          .single();

        if (!!data) {
          const newMod = { pseudonym, profilePhoto, usersGroupsId, role: data?.role };
          const newMods = moderatorsArray.concat(newMod);
          setModeratorsArray(newMods);
          const delMember = membersArray.splice(index, 1);
          setMembersArray(delMember);
        } else {
          console.error('Role addition error: ', error);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <h2>Members list</h2>
      <p className={styles.roles}>{translated.members?.admin}</p>
      <Separator />
      <div className={styles.usersButton}>
        <Avatar src={profilePhotoAdmin} fallbackName={pseudonymAdmin} alt="administrator profile picture icon" />
        <NextLink href={`/user/${pseudonymAdmin}`} passHref>
          {pseudonymAdmin}
        </NextLink>
      </div>
      <p className={styles.roles}>{translated.members?.moderators}</p>
      <Separator />
      {moderatorsArray.length > 0 ? (
        moderatorsArray.map(({ usersGroupsId, pseudonym, profilePhoto }: MemberType, index) => (
          <div className={styles.usersButton} key={index}>
            <Avatar src={!!profilePhoto ? profilePhoto : group} fallbackName={pseudonym} alt="my profile photo icon" />
            <NextLink href={`/user/${pseudonym}`} passHref>
              {pseudonym}
            </NextLink>
            {admin && (
              <button
                type="submit"
                aria-label={translated.members?.modsAria!}
                onClick={() => toggleModerators(usersGroupsId!, pseudonym, profilePhoto, index, false)}>
                <LuMinus />
              </button>
            )}
          </div>
        ))
      ) : (
        <p>{translated.members?.noMods}</p>
      )}

      {!noMoreMods && !!lastModeratorsVisible && moderatorsArray.length === maxItems * iModerators && (
        <MoreButton nextElementsAction={nextModeratorsList} />
      )}
      <p className={styles.roles}>{translated.members?.anotherMembers}</p>
      <Separator />
      {membersArray.length > 0 ? (
        membersArray.map(({ usersGroupsId, pseudonym, profilePhoto }: MemberType, index) => (
          <div className={styles.usersButton} key={index}>
            <Avatar src={!!profilePhoto ? profilePhoto : group} fallbackName={pseudonym} alt="my profile photo icon" />
            <NextLink href={`/user/${pseudonym}`} passHref>
              {pseudonym}
            </NextLink>
            {admin && (
              <button
                type="submit"
                aria-label={translated.members?.addModAria!}
                onClick={() => toggleModerators(usersGroupsId!, pseudonym, profilePhoto, index, true)}>
                <LuPlus />
              </button>
            )}
          </div>
        ))
      ) : (
        <p>{translated.members?.noMembers}</p>
      )}
      {!noMoreUsers && !!lastMembersVisible && membersArray.length === maxItems * iMembers && (
        <MoreButton nextElementsAction={nextMembersList} />
      )}
    </>
  );
};

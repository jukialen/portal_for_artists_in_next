import { useState } from 'react';
import NextLink from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Separator, IconButton, Link } from '@chakra-ui/react';
import { Avatar } from 'components/ui/avatar';

import { MemberType, nameGroupTranslatedType, UserType } from 'types/global.types';

import { sortMembers } from 'helpers/sorting';

import { MoreButton } from 'components/atoms/MoreButton/MoreButton';

import styles from './Members.module.scss';
import group from 'public/group.svg';
import { LuPlus, LuMinus } from 'react-icons/lu';

type MembersType = {
  admin: boolean;
  groupId: string;
  name: string | string[];
  usersGroupsId: string;
  members: MemberType[];
  translated: nameGroupTranslatedType;
  userData: UserType;
};

const supabase = createClientComponentClient();

export const Members = ({ admin, groupId, name, usersGroupsId, members, translated, userData }: MembersType) => {
  const maxItems = 30;

  members.sort(sortMembers());

  const adminData = members.filter((e) => e.role === 'ADMIN')[0];
  const pseudonymAdmin = adminData.pseudonym;
  const profilePhotoAdmin = adminData.profilePhoto!;

  const modList = members.filter((e) => e.role === 'MODERATOR');

  const [moderatorsArray, setModeratorsArray] = useState<MemberType[]>(modList || []);
  const [lastModeratorsVisible, setModeratorsLastVisible] = useState<MemberType | null>(
    modList.length === maxItems ? modList[modList.length - 1] : null,
  );
  let [iModerators, setIModerators] = useState(1);
  const [membersArray, setMembersArray] = useState<MemberType[]>(members);
  const [lastMembersVisible, setMembersLastVisible] = useState<MemberType | null>(
    members.length === maxItems ? members[members.length - 1] : null,
  );
  let [iMembers, setIMembers] = useState(1);

  const nextModeratorsList = async () => {
    const nextModeratorArray: MemberType[] = [];

    const { data } = await supabase
      .from('Groups')
      .select(
        `
      Users (pseudonym, profilePhoto),
      Roles (role)
     `,
      )
      .eq('name', name)
      .gt('created_at', lastModeratorsVisible)
      .order('created_at', { ascending: false })
      .limit(30);

    try {
      for (const mod of data!) {
        nextModeratorArray.push({
          usersGroupsId,
          pseudonym: mod.Users[0].pseudonym,
          profilePhoto: mod.Users[0].profilePhoto,
          role: mod.Roles[0].role,
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
      .from('Groups')
      .select(
        `
        Users (pseudonym, profilePhoto),
        Roles (role)
       `,
      )
      .eq('name', name)
      .gt('created_at', lastMembersVisible)
      .order('created_at', { ascending: false })
      .limit(30);

    try {
      for (const mod of data!) {
        nextMemberArray.push({
          usersGroupsId,
          pseudonym: mod.Users[0].pseudonym,
          profilePhoto: mod.Users[0].profilePhoto,
          role: mod.Roles[0].role,
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
              userId: userData.id,
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
      <Separator orientation="horizontal" />

      <div className={styles.usersButton}>
        <Avatar name={pseudonymAdmin} src={profilePhotoAdmin} />
        <NextLink href={`/user/${pseudonymAdmin}`} passHref>
          <Link>{pseudonymAdmin}</Link>
        </NextLink>
      </div>
      <p className={styles.roles}>{translated.members?.moderators}</p>
      <Separator orientation="horizontal" />
      {moderatorsArray.length > 0 ? (
        moderatorsArray.map(({ usersGroupsId, pseudonym, profilePhoto }: MemberType, index) => (
          <div className={styles.usersButton} key={index}>
            <Avatar name={pseudonym} src={!!profilePhoto ? profilePhoto : group} />
            <NextLink href={`/user/${pseudonym}`} passHref>
              <Link>{pseudonym}</Link>
            </NextLink>
            {admin && (
              <IconButton
                type="submit"
                aria-label={translated.members?.modsAria!}
                onClick={() => toggleModerators(usersGroupsId!, pseudonym, profilePhoto, index, false)}>
                <LuMinus />
              </IconButton>
            )}
          </div>
        ))
      ) : (
        <p>{translated.members?.noMods}</p>
      )}
      {!!lastModeratorsVisible && moderatorsArray.length === maxItems * iModerators && (
        <MoreButton nextElements={nextModeratorsList} />
      )}
      <p className={styles.roles}>{translated.members?.anotherMembers}</p>
      <Separator orientation="horizontal" />
      {membersArray.length > 0 ? (
        membersArray.map(({ usersGroupsId, pseudonym, profilePhoto }: MemberType, index) => (
          <div className={styles.usersButton} key={index}>
            <Avatar name={pseudonym} src={!!profilePhoto ? profilePhoto : group} />
            <NextLink href={`/user/${pseudonym}`} passHref>
              <Link>{pseudonym}</Link>
            </NextLink>
            {admin && (
              <IconButton
                type="submit"
                aria-label={translated.members?.addModAria!}
                onClick={() => toggleModerators(usersGroupsId!, pseudonym, profilePhoto, index, true)}>
                <LuPlus />
              </IconButton>
            )}
          </div>
        ))
      ) : (
        <p>{translated.members?.noMembers}</p>
      )}
      {!!lastMembersVisible && membersArray.length === maxItems * iMembers && (
        <MoreButton nextElements={nextMembersList} />
      )}
    </>
  );
};

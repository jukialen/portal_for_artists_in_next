import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import axios from 'axios';

import { Avatar, Divider, IconButton, Link } from '@chakra-ui/react';

import { MemberType } from 'types/global.types';

import { useHookSWR } from 'hooks/useHookSWR';

import { MoreButton } from 'components/atoms/MoreButton/MoreButton';
import { backUrl } from 'utilites/constants';

import styles from './Members.module.scss';
import group from 'public/group.svg';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';

type MembersType = {
  admin: boolean;
  name: string | string[];
};

export const Members = ({ admin, name }: MembersType) => {
  const [pseudonymAdmin, setPseudonymAdmin] = useState('');
  const [profilePhotoAdmin, setProfilePhotoAdmin] = useState('');
  const [moderatorsArray, setModeratorsArray] = useState<MemberType[]>([]);
  const [lastModeratorsVisible, setModeratorsLastVisible] = useState<MemberType>();
  let [iModerators, setIModerators] = useState(1);
  const [membersArray, setMembersArray] = useState<MemberType[]>([]);
  const [lastMembersVisible, setMembersLastVisible] = useState<MemberType>();
  let [iMembers, setIMembers] = useState(1);

  const data = useHookSWR();
  const maxItems = 30;

  const downloadAdmin = async () => {
    const admin: MemberType = await axios.get(`${backUrl}/users/members`, {
      params: {
        name,
        role: 'ADMIN',
      },
    });
    setPseudonymAdmin(admin.pseudonym);
    setProfilePhotoAdmin(admin.profilePhoto!);
  };

  useEffect(() => {
    downloadAdmin();
  }, [name]);

  const moderatorsList = async () => {
    try {
      const moderatorArray: MemberType[] = [];

      const moderators: MemberType[] = await axios.get(`${backUrl}/users/members`, {
        params: {
          orderBy: 'pseudonym, DESC',
          limit: maxItems,
          name,
          role: 'MODERATOR',
        },
      });

      for (const mod of moderators) {
        moderatorArray.push({
          usersGroupsId: mod.usersGroupsId,
          pseudonym: mod.pseudonym,
          profilePhoto: mod.profilePhoto!,
        });
      }

      setModeratorsArray(moderatorArray);
      moderatorArray.length === maxItems && setModeratorsLastVisible(moderatorArray[moderatorArray.length - 1]);
    } catch (e) {
      console.error(e);
    }
  };

  const membersList = async () => {
    try {
      const memberArray: MemberType[] = [];

      const users: MemberType[] = await axios.get(`${backUrl}/users/members`, {
        params: {
          orderBy: 'pseudonym, DESC',
          limit: maxItems,
          name,
          role: 'USER',
        },
      });

      for (const user of users) {
        memberArray.push({
          usersGroupsId: user.usersGroupsId,
          pseudonym: user.pseudonym,
          profilePhoto: user.profilePhoto!,
        });
      }

      setMembersArray(memberArray);
      memberArray.length === maxItems && setMembersLastVisible(memberArray[memberArray.length - 1]);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    !!name && membersList();
  }, [name]);

  useEffect(() => {
    !!name && moderatorsList();
  }, [name]);

  const nextModeratorsList = async () => {
    try {
      const nextModeratorArray: MemberType[] = [];

      const moderators: MemberType[] = await axios.get(`${backUrl}/users/members`, {
        params: {
          orderBy: 'pseudonym, DESC',
          limit: maxItems,
          name,
          role: 'MODERATOR',
          cursor: lastModeratorsVisible,
        },
      });

      for (const mod of moderators) {
        nextModeratorArray.push({
          usersGroupsId: mod.usersGroupsId,
          pseudonym: mod.pseudonym,
          profilePhoto: mod.profilePhoto!,
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
      const nextMemberArray: MemberType[] = [];

      const users: MemberType[] = await axios.get(`${backUrl}/users/members`, {
        params: {
          orderBy: 'pseudonym, DESC',
          limit: maxItems,
          name,
          role: 'USER',
        },
      });

      for (const user of users) {
        nextMemberArray.push({
          usersGroupsId: user.usersGroupsId,
          pseudonym: user.pseudonym,
          profilePhoto: user.profilePhoto!,
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

  const toggleModerators = async (
    usersGroupsId: string,
    pseudonym: string,
    profilePhoto: string,
    index: number,
    user: boolean,
  ) => {
    try {
      const dataUser = { usersGroupsId, pseudonym, profilePhoto };

      if (user) {
        await axios.patch(`${backUrl}/users-groups/${name}`, {
          data: { role: 'MODERATOR', usersGroupsId },
        });

        const deletedMem = membersArray.splice(index, 1);
        setMembersArray(deletedMem);
        const newModeratorsList = moderatorsArray.concat(dataUser);
        setModeratorsArray(newModeratorsList);
      } else {
        await axios.patch(`${backUrl}/users-groups/${name}`, {
          data: { role: 'USER', usersGroupsId },
        });

        const deletedMod = moderatorsArray.splice(index, 1);
        setModeratorsArray(deletedMod);
        const newMember = membersArray.concat(dataUser);
        setMembersArray(newMember);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <h2>Members list</h2>
      <p className={styles.roles}>{data?.Members?.admin}</p>
      <Divider orientation="horizontal" />

      <div className={styles.usersButton}>
        <Avatar name={pseudonymAdmin} src={profilePhotoAdmin} />
        <NextLink href={`/user/${pseudonymAdmin}`} passHref>
          <Link>{pseudonymAdmin}</Link>
        </NextLink>
      </div>
      <p className={styles.roles}>{data?.Members?.moderators}</p>
      <Divider orientation="horizontal" />
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
                aria-label={data?.Members?.modsAria}
                icon={<MinusIcon />}
                onClick={() => toggleModerators(usersGroupsId!, pseudonym, profilePhoto, index, false)}
              />
            )}
          </div>
        ))
      ) : (
        <p>{data?.Members?.noMods}</p>
      )}
      {!!lastModeratorsVisible && moderatorsArray.length === maxItems * iModerators && (
        <MoreButton nextElements={nextModeratorsList} />
      )}
      <p className={styles.roles}>{data?.Members?.anotherMembers}</p>
      <Divider orientation="horizontal" />
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
                aria-label={data?.Members?.addModAria}
                icon={<AddIcon />}
                onClick={() => toggleModerators(usersGroupsId!, pseudonym, profilePhoto, index, true)}
              />
            )}
          </div>
        ))
      ) : (
        <p>{data?.Members?.noMembers}</p>
      )}
      {!!lastMembersVisible && membersArray.length === maxItems * iMembers && (
        <MoreButton nextElements={nextMembersList} />
      )}
    </>
  );
};
